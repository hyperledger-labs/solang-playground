"use client";

import { createContext, MutableRefObject, ReactNode, useRef } from "react";
import { editor } from "monaco-editor";

export const EditorContext = createContext<MutableRefObject<editor.IStandaloneCodeEditor | null>>(null as never);

function EditorProvider({ children }: { children: ReactNode }) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  return <EditorContext.Provider value={editorRef}>{children}</EditorContext.Provider>;
}

export default EditorProvider;
