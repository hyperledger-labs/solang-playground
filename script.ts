import Server from "./packages/frontend/src/lib/server";
import { FromServer, IntoServer } from "./packages/frontend/src/lib/editor/client";

async function main() {
  const intoServer = new IntoServer();
  const fromServer = FromServer.create();
  const server = await Server.initialize(intoServer, fromServer);
  console.log("Server", server);
}

main();
