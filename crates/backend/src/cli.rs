use clap::Parser;

#[derive(Parser, Clone)]
pub struct Opts {
    #[arg(short = 'p', long = "port", default_value = "8080", env = "PORT")]
    pub port: u16,

    #[arg(long = "host", default_value = "localhost", env = "HOST")]
    pub host: String,

    #[arg(short = 'f', long = "frontend_folder")]
    pub frontend_folder: Option<String>,
}
