mod cli;
mod services;
use crate::cli::Opts;
use actix_files as fs;
use actix_web::Result;
use actix_web::{
    middleware::{self, DefaultHeaders},
    web,
    web::post,
    App, HttpResponse, HttpServer,
};

use crate::services::compile::route_compile;
use clap::Parser;
use std::path::Path;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let opts: Opts = Opts::parse();

    let port = opts.port;
    let host = opts.host.clone();

    if let Some(path) = &opts.frontend_folder {
        if !Path::new(path).is_dir() {
            panic!("{} is not a valid directory.", path);
        }
    }

    async fn health() -> HttpResponse {
        HttpResponse::Ok().finish()
    }

    HttpServer::new(move || {
        let opts: Opts = opts.clone();
        let frontend_folder = opts.frontend_folder.clone();

        let mut app = App::new()
            .service(web::resource("/health").to(health))
            .wrap(middleware::Compress::default())
            .wrap(
                DefaultHeaders::new()
                    .add(("Cross-Origin-Opener-Policy", "same-origin"))
                    .add(("Cross-Origin-Embedder-Policy", "require-corp")),
            )
            .route("/compile", post().to(|body| route_compile(body)));

        match frontend_folder {
            Some(path) => {
                app = app
                    .app_data(web::Data::new(FrontendState {
                        frontend_folder: path.clone(),
                    }))
                    .route("/v{tail:.*}", web::get().to(route_frontend_version))
                    .service(route_frontend("/", path.as_ref()));
            },
            None => {
                println!(
                    "Warning: Starting backend without serving static frontend files due to missing configuration."
                )
            },
        }

        app
    })
    .bind(format!("{}:{}", &host, &port))?
    .run()
    .await?;

    Ok(())
}

pub struct FrontendState {
    pub frontend_folder: String,
}

pub fn route_frontend(at: &str, dir: &str) -> actix_files::Files {
    fs::Files::new(at, dir).index_file("index.html")
}

pub async fn route_frontend_version(data: web::Data<FrontendState>) -> Result<actix_files::NamedFile> {
    Ok(fs::NamedFile::open(
        Path::new(&data.frontend_folder).join("index.html"),
    )?)
}
