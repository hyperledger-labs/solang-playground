use std::{fs::File, path::Path};

use clap::Parser;

use typescript_type_def::write_definition_file;

use backend::{CompilationRequest, CompilationResult};

#[derive(Parser, Debug)]
#[command(version)]
pub struct Cli {
    #[arg(short, long)]
    /// The target directory to write the TypeScript definition file to
    pub target: String,
}

fn main() -> std::io::Result<()> {
    let opts: Cli = Cli::parse();

    std::fs::create_dir_all(&opts.target)?;
    let target = format!("{:}/index.d.ts", opts.target);
    println!("{}", target);

    type Api = (CompilationResult, CompilationRequest);

    let path = Path::new(&target);
    let buffer = File::create(path)?;
    write_definition_file::<_, Api>(buffer, Default::default())
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, format!("{:?}", e)))?;

    Ok(())
}
