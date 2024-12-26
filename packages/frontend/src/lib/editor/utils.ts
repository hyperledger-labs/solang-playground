import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from "./converter";
import * as monaco from "monaco-editor";

export const protocolToMonaco = new ProtocolToMonacoConverter(monaco);
export const monacoToProtocol = new MonacoToProtocolConverter(monaco);
