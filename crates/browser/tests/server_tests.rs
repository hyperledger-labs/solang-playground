use solang::languageserver::{Files, GlobalCache, SolangServer};
use std::collections::HashMap;
use std::str::FromStr;
use tokio::sync::Mutex;
use tower_lsp::LspService;
use tower_test::mock::Spawn;

use solang::Target;

#[cfg(test)]
mod tests {
    use super::*;

    const REQUEST: &str = r#"{"jsonrpc":"2.0","method":"initialize","params":{"capabilities": {}},"id":1}"#;
    const HOVER: &str = r#"{"jsonrpc":"2.0","method":"textDocument/hover","params":{"textDocument":{"uri":"file:///tmp/hello.sol"},"position":{"line":0,"character":0}},"id":2}"#;
    const RESPONSE: &str = r#"{"jsonrpc":"2.0","result":{"capabilities":{}},"id":1}"#;

    const INITIALIZE_REQUEST: &'static str = r#"{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"processId":null,"clientInfo":{"name":"demo-language-client"},"capabilities":{},"rootUri":null}}"#;
    const INITIALIZE_EXPECTED_RESPONSE: &'static str = r#"{"jsonrpc":"2.0","result":{"capabilities":{"completionProvider":{"resolveProvider":false,"triggerCharacters":["."]},"declarationProvider":true,"definitionProvider":true,"documentFormattingProvider":true,"executeCommandProvider":{"commands":[]},"hoverProvider":true,"implementationProvider":true,"referencesProvider":true,"renameProvider":true,"signatureHelpProvider":{},"textDocumentSync":2,"typeDefinitionProvider":true,"workspace":{"workspaceFolders":{"changeNotifications":true,"supported":true}},"workspaceSymbolProvider":true}},"id":1}"#;

    fn mock_request(request: &str) -> Vec<u8> {
        format!("Content-Length: {}\r\n\r\n{}", REQUEST.len(), REQUEST,).into_bytes()
    }

    fn mock_response(request: &str) -> Vec<u8> {
        format!("Content-Length: {}\r\n\r\n{}", RESPONSE.len(), RESPONSE).into_bytes()
    }

    fn create_mock_service() -> Spawn<LspService<SolangServer>> {
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

        tower_test::mock::Spawn::new(service)
    }

    #[tokio::test]
    pub async fn mock_test() {
        let mut mock_service = create_mock_service();

        let sesa_req = tower_lsp::jsonrpc::Request::from_str(INITIALIZE_REQUEST).unwrap();

        let call_res = mock_service.call(sesa_req).await.unwrap();

        println!("{:?}", call_res.unwrap());

        //let call_res_2 = mock_service.call(tower_lsp::jsonrpc::Request::from_str( mock_hover).unwrap()).await.unwrap();

        //println!("{:?}", call_res_2.unwrap());
    }
}
