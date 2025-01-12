import { Monaco } from "@monaco-editor/react";
import Client from "./client";
import {
  DidChangeTextDocumentNotification,
  DidChangeTextDocumentParams,
  DidOpenTextDocumentNotification,
  DidOpenTextDocumentParams,
} from "vscode-languageserver-protocol";
import { editor } from "monaco-editor-core";
import Language from "./language";
import { monacoToProtocol } from "./utils";

export class EditorService {
  constructor(private client: Client) {}

  public fileOpened(model: editor.ITextModel): void {
    const params: DidOpenTextDocumentParams = {
      textDocument: {
        uri: model.uri.toString(),
        languageId: model.getLanguageId(),
        version: 0,
        text: model.getValue(),
      },
    };

    this.client.notify(DidOpenTextDocumentNotification.type.method, params);
  }

  public fileChanged(model: editor.ITextModel): void {
    const content = model.getValue();

    const params: DidChangeTextDocumentParams = {
      textDocument: {
        uri: model.uri.toString(),
        version: 0,
      },
      contentChanges: [
        {
          range: monacoToProtocol.asRange(model.getFullModelRange()),
          text: content!,
        },
      ],
    };

    this.client.notify(DidChangeTextDocumentNotification.type.method, params);
  }
}
