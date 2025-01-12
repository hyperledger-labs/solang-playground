import * as jsrpc from "json-rpc-2.0";
import * as proto from "vscode-languageserver-protocol";

import { Codec, FromServer, IntoServer } from "./codec";
import { store } from "@/state";

// const consoleChannel = document.getElementById("channel-console") as HTMLTextAreaElement;

export default class Client extends jsrpc.JSONRPCServerAndClient {
  afterInitializedHooks: (() => Promise<void>)[] = [];
  #fromServer: FromServer;
  diagnostic: proto.PublishDiagnosticsParams = {
    uri: "",
    diagnostics: [],
  };

  constructor(fromServer: FromServer, intoServer: IntoServer) {
    super(
      new jsrpc.JSONRPCServer(),
      new jsrpc.JSONRPCClient(async (json: jsrpc.JSONRPCRequest) => {
        const encoded = Codec.encode(json);
        intoServer.enqueue(encoded);
        console.log({ json });
        if (null != json.id) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const response = await fromServer.responses.get(json.id)!;
          console.log({ response });
          this.client.receive(response as jsrpc.JSONRPCResponse);
        }
      }),
    );
    this.#fromServer = fromServer;
  }

  async start(): Promise<void> {
    // process "window/logMessage": client <- server
    this.addMethod(proto.LogMessageNotification.type.method, (params) => {
      const { type, message } = params as { type: proto.MessageType; message: string };
      store.send({ type: "addLog", message: message, logType: type });
    });

    // request "initialize": client <-> server
    await (this.request(proto.InitializeRequest.type.method, {
      processId: null,
      clientInfo: {
        name: "demo-language-client",
      },
      capabilities: {},
      rootUri: null,
    } as proto.InitializeParams) as Promise<jsrpc.JSONRPCResponse>);

    // notify "initialized": client --> server
    this.notify(proto.InitializedNotification.type.method, {});

    await Promise.all(this.afterInitializedHooks.map((f: () => Promise<void>) => f()));
    await Promise.all([this.processNotifications(), this.processRequests()]);
  }

  async processNotifications(): Promise<void> {
    console.log("processNotifications called");
    for await (const notification of this.#fromServer.notifications) {
      console.log("notification: ", notification);
      if (notification.method == "textDocument/publishDiagnostics") {
        // delete the old diagnostics

        this.diagnostic.diagnostics = [];

        this.diagnostic = notification.params as proto.PublishDiagnosticsParams;

        console.log("diagnostics: ", this.diagnostic);
      }

      await this.receiveAndSend(notification);
    }
  }

  async processRequests(): Promise<void> {
    for await (const request of this.#fromServer.requests) {
      console.log(request);
      await this.receiveAndSend(request);
    }
  }

  printToConsole(type: proto.MessageType, message: string): void {
    console.log({ type, message });
    // if (consoleChannel) {
    //   switch (type) {
    //     case proto.MessageType.Error: {
    //       consoleChannel.value += "   ERROR: ";
    //       break;
    //     }
    //     case proto.MessageType.Warning: {
    //       consoleChannel.value += "   WARNING: ";
    //       break;
    //     }
    //     case proto.MessageType.Info: {
    //       consoleChannel.value += "   INFO: ";
    //       break;
    //     }
    //     case proto.MessageType.Log: {
    //       consoleChannel.value += "   LOG: ";
    //       break;
    //     }
    //   }
    //   consoleChannel.value += message;
    //   consoleChannel.value += "\n";
    // } else {
    //   console.error("consoleChannel is not defined");
    // }
  }

  pushAfterInitializeHook(...hooks: (() => Promise<void>)[]): void {
    this.afterInitializedHooks.push(...hooks);
  }
}
