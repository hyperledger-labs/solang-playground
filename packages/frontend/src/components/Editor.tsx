"use client";

import useEditor from "@/hooks/useEditor";
import MonacoEditor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";

const defaultCode = `
contract flipper {
  bool private value;

  /// Constructor that initializes the \`bool\` value to the given \`init_value\`.
  constructor(bool initvalue) {
    value = initvalue;
  }

  /// A message that can be called on instantiated contracts.
  /// This one flips the value of the stored \`bool\` from \`true\`
  /// to \`false\` and vice versa.
  function flip() public {
    value = !value;
  }

  /// Simply returns the current value of our \`bool\`.
  function get() public view returns (bool) {
    return value;
  }
}
`;

function Editor() {
  const editorRef = useEditor();
  function handleEditorDidMount(editor: editor.IStandaloneCodeEditor) {
    editorRef.current = editor;
  }

  return (
    <MonacoEditor
      onMount={handleEditorDidMount}
      height="calc(100vh - 256px)"
      defaultLanguage="java"
      defaultValue={defaultCode}
      theme="vs-dark"
      className="bg-red-500"
    />
  );
}

export default Editor;
