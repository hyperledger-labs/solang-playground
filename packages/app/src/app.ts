import debounce from "debounce";
import * as monaco from "monaco-editor-core";
import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from "monaco-languageclient";
import * as proto from "vscode-languageserver-protocol";

import Client from "./client";
import { FromServer, IntoServer } from "./codec";
import Language from "./language";
import Server from "./server";

class Environment implements monaco.Environment {
  getWorkerUrl(moduleId: string, label: string) {
    if (label === "editorWorkerService") {
      return "./editor.worker.bundle.js";
    }
    throw new Error(`getWorkerUrl: unexpected ${JSON.stringify({ moduleId, label })}`);
  }
}

//export const monacoToProtocol = new MonacoToProtocolConverter(monaco);
export const protocolToMonaco = new ProtocolToMonacoConverter(monaco);
const monacoToProtocol = new MonacoToProtocolConverter(monaco);

export default class App {
  readonly #window: Window & monaco.Window & typeof globalThis = self;

  readonly #intoServer: IntoServer = new IntoServer();
  readonly #fromServer: FromServer = FromServer.create();

  initializeMonaco(): void {
    this.#window.MonacoEnvironment = new Environment();
  }

  createModel(client: Client): monaco.editor.ITextModel {
    const language = Language.initialize(client);

    const value = `
    // SPDX-License-Identifier: MIT
    pragma solidity >=0.6.12 <0.9.0;
    
    contract HelloWorld {
      /**
       * @dev Prints Hello World string
       */
      function print() public pure returns (string memory) {
        return "Hello World!";
      }
    }
    
`.replace(/^\s*\n/gm, "");
    const id = language.id;
    const uri = monaco.Uri.parse("inmemory://demo.js");

    const model = monaco.editor.createModel(value, id, uri);

    model.onDidChangeContent(
      debounce(() => {
        const text = model.getValue();
        client.notify(proto.DidChangeTextDocumentNotification.type.method, {
          textDocument: {
            version: 0,
            uri: model.uri.toString(),
          },
          contentChanges: [
            {
              range: monacoToProtocol.asRange(model.getFullModelRange()),
              text,
            },
          ],
        } as proto.DidChangeTextDocumentParams);

        // Wait for a bit before publishing diagnostics
        setTimeout(() => {
          let diagnostic = client.diagnostic;

          let markers = protocolToMonaco.asDiagnostics(diagnostic.diagnostics);

          monaco.editor.setModelMarkers(model, "solidity", markers);
        }, 500); // Adjust delay as needed
      }, 200),
    );





    // eslint-disable-next-line @typescript-eslint/require-await
    client.pushAfterInitializeHook(async () => {
      client.notify(proto.DidOpenTextDocumentNotification.type.method, {
        textDocument: {
          uri: model.uri.toString(),
          languageId: language.id,
          version: 0,
          text: model.getValue(),
        },
      } as proto.DidOpenTextDocumentParams);
    });

    return model;
  }

  createEditor(client: Client): void {
    const container = document.getElementById("editor")!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    this.initializeMonaco();
    const model = this.createModel(client);
    monaco.editor.create(container, {
      model,
      automaticLayout: true,
    });
  }

  async run(): Promise<void> {
    const client = new Client(this.#fromServer, this.#intoServer);
    const server = await Server.initialize(this.#intoServer, this.#fromServer);
    this.createEditor(client);
    await Promise.all([server.start(), client.start()]);
  }
}
