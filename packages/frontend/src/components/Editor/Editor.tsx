"use client";

import MonacoEditor from "@monaco-editor/react";
import Spinner from "../Spinner";
import { useTheme } from "next-themes";
import { init, mountService } from "@/lib/editor";
import { useCurrentFile } from "@/state/hooks";

function Editor() {
  const file = useCurrentFile();
  const { resolvedTheme } = useTheme();
  const theme = { dark: "vs-dark", light: "vs-light" }[resolvedTheme!] || resolvedTheme;
  console.log({ file });
  return (
    <div className="">
      <MonacoEditor
        value={file?.model.getValue()}
        beforeMount={init}
        onMount={mountService}
        height="calc(100vh - 230px)"
        defaultLanguage="solidity"
        theme={theme}
        loading={<Spinner />}
      />
    </div>
  );
}

export default Editor;
