use crate::services::sandbox::Sandbox;
use actix_web::{rt::task::spawn_blocking, web::Json, HttpResponse, Responder};

use super::sandbox;
use sandbox::CompilationRequest;

pub async fn route_compile(req: Json<CompilationRequest>) -> impl Responder {
    let compile_result = spawn_blocking(move || {
        let sandbox = Sandbox::new()?;
        sandbox.compile(&CompilationRequest {
            source: req.source.clone(),
        })
    })
    .await
    .expect("Contract compilation panicked");

    match compile_result {
        Ok(result) => {
            let compile_result = serde_json::to_string(&result).unwrap();
            HttpResponse::Ok().body(compile_result)
        },
        Err(err) => {
            eprintln!("{:?}", err);
            HttpResponse::InternalServerError().finish()
        },
    }
}
