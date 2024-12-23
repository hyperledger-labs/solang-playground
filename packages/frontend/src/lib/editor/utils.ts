import { MonacoToProtocolConverter, ProtocolToMonacoConverter } from "monaco-languageclient";
import * as monaco from "monaco-editor";

export const protocolToMonaco = new ProtocolToMonacoConverter(monaco);
export const monacoToProtocol = new MonacoToProtocolConverter(monaco);
