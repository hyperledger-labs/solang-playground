use clap::Parser;

/// Command line options for the backend
#[derive(Parser, Clone)]
pub struct Opts {
    #[arg(
        short = 'p',
        long = "port",
        default_value = "8080",
        env = "PORT",
        help = "Port to listen on"
    )]
    pub port: u16,

    #[arg(long = "host", default_value = "localhost", env = "HOST", help = "Host to listen on")]
    pub host: String,

    #[arg(long = "frontend_folder", help = "Path to the frontend folder")]
    pub frontend_folder: Option<String>,
}
