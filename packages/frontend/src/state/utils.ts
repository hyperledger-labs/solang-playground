import { MessageType } from "vscode-languageserver-protocol";
import { store } from ".";

export function createPath(basePath: string, name: string) {
  return basePath + ".items" + `['${name}']`;
}

export const logger = {
  error(message: string) {
    store.send({ type: "addLog", logType: MessageType.Error, message });
  },
  info(message: string) {
    store.send({ type: "addLog", logType: MessageType.Info, message });
  },
  warning(message: string) {
    store.send({ type: "addLog", logType: MessageType.Warning, message });
  },
  log(message: string) {
    store.send({ type: "addLog", logType: MessageType.Log, message });
  },
};
