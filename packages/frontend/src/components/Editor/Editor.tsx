"use client";

import MonacoEditor from "@monaco-editor/react";
import Spinner from "../Spinner";
import { useTheme } from "next-themes";
import { init, mountService } from "@/lib/editor";
import { useFileContent } from "@/state/hooks";
import { store } from "@/state";
import { useSelector } from "@xstate/store/react";

function Editor() {
  const { resolvedTheme } = useTheme();
  const theme = { dark: "vs-dark", light: "vs-light" }[resolvedTheme!] || resolvedTheme;
  const code = useFileContent();
  const { fontSize } = useSelector(store, (state) => state.context.preferences);

  return (
    <div className="">
      <MonacoEditor
        value={code}
        beforeMount={init}
        onMount={mountService}
        height="calc(100vh - 230px)"
        defaultLanguage="solidity"
        theme={theme}
        loading={<Spinner />}
        onChange={(value) => store.send({ type: "changeContent", content: value || "" })}
        options={{ fontSize }}
      />
    </div>
  );
}

export default Editor;
