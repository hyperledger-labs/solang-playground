import { MessageType } from "vscode-languageserver-protocol";

export interface LogType {
  id: string;
  type: MessageType;
  message: string;
}

export const MessageTypeName = {
  [MessageType.Error]: "Error",
  [MessageType.Info]: "Info",
  [MessageType.Warning]: "Warning",
  [MessageType.Log]: "Log",
  [MessageType.Debug]: "Debug",
};
