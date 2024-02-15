


use tower_lsp::LspService;
use solang::languageserver::{SolangServer, Files, GlobalCache};
use std::collections::HashMap;
use tokio::sync::Mutex;
use std::str::FromStr;

use solang::Target;

#[cfg(test)]
mod tests {

    use futures::io::Cursor;

    use super::*;

    const REQUEST: &str = r#"{"jsonrpc":"2.0","method":"initialize","params":{"capabilities": {}},"id":1}"#;
    const HOVER: &str = r#"{"jsonrpc":"2.0","method":"textDocument/hover","params":{"textDocument":{"uri":"file:///tmp/hello.sol"},"position":{"line":0,"character":0}},"id":2}"#;
    const RESPONSE: &str = r#"{"jsonrpc":"2.0","result":{"capabilities":{}},"id":1}"#;

    const mock_input: &'static str = r#"
    {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {
            "processId": null,
            "rootUri": null,
            "capabilities": {
                "textDocument": {
                    "publishDiagnostics": {
                        "relatedInformation": true
                    }
                }
            }
        }
    }
    "#;
    
    
    const mock_hover: &'static str = r#"
    {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "textDocument/hover",
        "params": {
            "textDocument": {
                "uri": "file:///home/username/project/file.sol"
            },
            "position": {
                "line": 0,
                "character": 0
            }
        }
    }
    "#;

    fn mock_request() -> Vec<u8> {
        format!("Content-Length: {}\r\n\r\n{}", REQUEST.len(), REQUEST, ).into_bytes()
    }



    fn mock_request_plus_hover() -> Vec<u8> {
        format!("Content-Length: {}\r\n\r\n{}                                                                        Content-Length: {}\r\n\r\n{}", REQUEST.len(), REQUEST, HOVER.len(), HOVER).into_bytes()
    }

    fn mock_response() -> Vec<u8> {
        format!("Content-Length: {}\r\n\r\n{}", RESPONSE.len(), RESPONSE).into_bytes()
    }

    fn mock_stdio() -> (Cursor<Vec<u8>>, Vec<u8>) {
        (Cursor::new(mock_request_plus_hover()), Vec::new())
    }



# [ tokio::test ]
pub async fn mock_test () {
    let importpaths = Vec::new();
    let importmaps = Vec::new();

    let (service, messages) = LspService::new(|client| SolangServer {
        client,
        target: Target::Solana,
        importpaths,
        importmaps,
        files: Mutex::new(Files {
            caches: HashMap::new(),
            text_buffers: HashMap::new(),
        }),
        global_cache: Mutex::new(GlobalCache {
            definitions: HashMap::new(),
            types: HashMap::new(),
            implementations: HashMap::new(),
            declarations: HashMap::new(),
            properties: HashMap::new(),
        }),
    });

   let mut sesa  = tower_test::mock::Spawn::new(service);

  
    let sesa_req = tower_lsp::jsonrpc::Request::from_str( mock_input).unwrap();


   let call_res = sesa.call(sesa_req).await.unwrap();

   println!("{:?}", call_res.unwrap());

   let call_res_2 = sesa.call(tower_lsp::jsonrpc::Request::from_str( mock_hover).unwrap()).await.unwrap();

   println!("{:?}", call_res_2.unwrap());



}
    
}
