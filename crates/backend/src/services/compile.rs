use serde::{Deserialize, Serialize};

use actix_web::{rt::task::spawn_blocking, web::Json, HttpResponse, Responder};
use typescript_type_def::TypeDef;

use crate::services::sandbox::Sandbox;

/// Request to compile a contract
#[derive(Deserialize, Serialize, TypeDef, Debug, Clone)]
pub struct CompilationRequest {
    /// The source code of the contract
    pub source: String,
}

/// Response from compiling a contract
#[derive(Deserialize, Serialize, TypeDef, PartialEq, Debug, Clone, Eq)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum CompilationResult {
    Success {
        /// The compiled contract
        wasm: Vec<u8>,
        stdout: String,
        stderr: String,
    },
    Error {
        stdout: String,
        stderr: String,
    },
}

/// Compile a contract
///
/// This function is called when a POST request is made to `/compile`
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
