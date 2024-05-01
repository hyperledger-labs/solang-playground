use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::{
    ffi::OsStr,
    fmt::Debug,
    fs::{self, File},
    io::{prelude::*, BufReader, ErrorKind},
    os::unix::prelude::PermissionsExt,
    path::{Path, PathBuf},
    time::Duration,
};
use tempfile::TempDir;
use tokio::process::Command;
use typescript_type_def::TypeDef;

use crate::docker_command;

const DOCKER_PROCESS_TIMEOUT_SOFT: Duration = Duration::from_secs(20);
const DOCKER_PROCESS_TIMEOUT_HARD: Duration = Duration::from_secs(60);
const DOCKER_IMAGE_BASE_NAME: &str = "ghcr.io/hyperledger/solang";
const DOCKER_WORKDIR: &str = "/builds/contract/";
const DOCKER_OUTPUT: &str = "/playground-result";

#[macro_export]
macro_rules! docker_command {
    ($($arg:expr),* $(,)?) => ({
        let mut cmd = Command::new("docker");
        $( cmd.arg($arg); )*
        cmd
    });
}

pub fn build_compile_command(input_file: &Path, output_dir: &Path) -> Command {
    let mut cmd = docker_command!(
        "run",
        "--detach",
        "--rm",
        "-it",
        "--cap-drop=ALL",
        "--cap-add=DAC_OVERRIDE",
        "--security-opt=no-new-privileges",
        "--workdir",
        DOCKER_WORKDIR,
        "--net=none",
        "--memory=1024m",
        "--memory-swap=1200m",
        "--env",
        format!("PLAYGROUND_TIMEOUT={}", DOCKER_PROCESS_TIMEOUT_SOFT.as_secs()),
        // The entry point of solang is /usr/bin/solang so we need to override it with /bin/sh
        "--entrypoint=/bin/sh",
    );

    if cfg!(feature = "fork-bomb-prevention") {
        cmd.args(["--pids-limit", "512"]);
    }
    cmd.kill_on_drop(true);

    let file_name = "input.sol";
    let mut mount_input_file = input_file.as_os_str().to_os_string();
    mount_input_file.push(":");
    mount_input_file.push(DOCKER_WORKDIR);
    mount_input_file.push(file_name);
    cmd.arg("--volume").arg(&mount_input_file);

    let mut mount_output_dir = output_dir.as_os_str().to_os_string();
    mount_output_dir.push(":");
    mount_output_dir.push(DOCKER_OUTPUT);
    cmd.arg("--volume").arg(&mount_output_dir);

    cmd.arg(format!("{}:latest", DOCKER_IMAGE_BASE_NAME));

    let remove_command = format!("rm -rf {}*.wasm {}*.contract", DOCKER_OUTPUT, DOCKER_OUTPUT);
    let compile_command = format!(
        "solang compile --target polkadot -o /playground-result {} 2>&1",
        file_name
    );
    let sh_command = format!("{} && {}", remove_command, compile_command);
    cmd.arg("-c").arg(sh_command);

    cmd
}

pub struct Sandbox {
    #[allow(dead_code)]
    scratch: TempDir,
    input_file: PathBuf,
    output_dir: PathBuf,
}

#[derive(Deserialize, Serialize, TypeDef, Debug, Clone)]
pub struct CompilationRequest {
    pub source: String,
}

#[derive(Deserialize, Serialize, TypeDef, PartialEq, Debug, Clone, Eq)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum CompilationResult {
    Success {
        wasm: Vec<u8>,
        stdout: String,
        stderr: String,
    },
    Error {
        stdout: String,
        stderr: String,
    },
}

impl Sandbox {
    pub fn new() -> Result<Self> {
        let scratch = TempDir::with_prefix("solang_playground").context("failed to create scratch directory")?;
        let input_file = scratch.path().join("input.rs");
        let output_dir = scratch.path().join("output");
        fs::create_dir(&output_dir).context("failed to create output directory")?;

        fs::set_permissions(&output_dir, wide_open_permissions()).context("failed to set output permissions")?;

        Ok(Sandbox {
            scratch,
            input_file,
            output_dir,
        })
    }

    pub fn compile(&self, req: &CompilationRequest) -> Result<CompilationResult> {
        self.write_source_code(&req.source)?;

        let command = build_compile_command(&self.input_file, &self.output_dir);
        println!("Executing command: \n{:#?}", command);

        let output = run_command_with_timeout(command)?;
        let file = fs::read_dir(&self.output_dir)
            .context("failed to read output directory")?
            .flatten()
            .map(|entry| entry.path())
            .find(|path| path.extension() == Some(OsStr::new("contract")));

        let stdout = vec_to_str(output.stdout)?;
        let stderr = vec_to_str(output.stderr)?;

        let compile_response = match file {
            Some(file) => match read(&file) {
                Ok(Some(wasm)) => CompilationResult::Success { wasm, stderr, stdout },
                Ok(None) => CompilationResult::Error { stderr, stdout },
                Err(_) => CompilationResult::Error { stderr, stdout },
            },
            None => CompilationResult::Error { stderr, stdout },
        };

        Ok(compile_response)
    }

    fn write_source_code(&self, code: &str) -> Result<()> {
        fs::write(&self.input_file, code).context("failed to write source code")?;
        fs::set_permissions(&self.input_file, wide_open_permissions()).context("failed to set source permissions")?;
        println!("Wrote {} bytes of source to {}", code.len(), self.input_file.display());
        Ok(())
    }
}

fn read(path: &Path) -> Result<Option<Vec<u8>>> {
    let f = match File::open(path) {
        Ok(f) => f,
        Err(ref e) if e.kind() == ErrorKind::NotFound => return Ok(None),
        e => e.context("failed to open file")?,
    };
    let mut f = BufReader::new(f);
    let metadata = fs::metadata(path).expect("failed to read metadata");

    let mut buffer = vec![0; metadata.len() as usize];
    f.read_exact(&mut buffer).expect("buffer overflow");
    Ok(Some(buffer))
}

#[tokio::main]
async fn run_command_with_timeout(mut command: Command) -> Result<std::process::Output> {
    use std::os::unix::process::ExitStatusExt;

    let timeout = DOCKER_PROCESS_TIMEOUT_HARD;
    println!("executing command!");
    let output = command.output().await.context("failed to start compiler")?;
    println!("Done! {:?}", output);
    let stdout = String::from_utf8_lossy(&output.stdout);

    let id = stdout.lines().next().context("missing compiler ID")?.trim();
    let stderr = &output.stderr;

    let mut command = docker_command!("wait", id);

    let timed_out = match tokio::time::timeout(timeout, command.output()).await {
        Ok(Ok(o)) => {
            let o = String::from_utf8_lossy(&o.stdout);
            let code = o.lines().next().unwrap_or("").trim().parse().unwrap_or(i32::MAX);
            Ok(ExitStatusExt::from_raw(code))
        },
        Ok(e) => return e.context("failed to wait for compiler"), // Failed to run
        Err(e) => Err(e),                                         // Timed out
    };

    let mut command = docker_command!("logs", id);
    let mut output = command.output().await.context("failed to get output from compiler")?;

    let mut command = docker_command!(
        "rm", // Kills container if still running
        "--force", id
    );
    command.stdout(std::process::Stdio::null());
    command.status().await.context("failed to remove compiler")?;

    let code = timed_out.context("compiler timed out")?;

    output.status = code;
    output.stderr = stderr.to_owned();

    Ok(output)
}

fn wide_open_permissions() -> std::fs::Permissions {
    PermissionsExt::from_mode(0o777)
}

fn vec_to_str(v: Vec<u8>) -> Result<String> {
    String::from_utf8(v).context("failed to convert vec to string")
}
