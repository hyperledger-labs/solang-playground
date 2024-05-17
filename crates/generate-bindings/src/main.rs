use backend::{CompilationRequest, CompilationResult};
use clap::Parser;
use std::{fs::File, path::Path};
use typescript_type_def::write_definition_file;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
pub struct Cli {
    #[arg(short, long)]
    pub target: Option<String>,
}

fn main() -> std::io::Result<()> {
    let opts: Cli = Cli::parse();
    let target = opts.target.unwrap();
    std::fs::create_dir_all(&target)?;

    let target = format!("{:}/index.d.ts", target);

    println!("{}", target);

    type Api = (CompilationResult, CompilationRequest);

    let path = Path::new(&target);

    let buffer = File::create(path)?;

    write_definition_file::<_, Api>(buffer, Default::default()).unwrap();

    Ok(())
}
