"use client";

import useEditor from "@/hooks/useEditor";
import { downloadBlob } from "@/lib/utils";
import { FaBook, FaGithub, FaNetworkWired, FaRocket } from "react-icons/fa";

function Header() {
  const editor = useEditor();

  async function handleCompile() {
    const code = editor.current?.getValue();

    if (!code) {
      return console.log("No Source Code Found");
    }

    const opts: RequestInit = {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: code,
      }),
    };

    const result = await fetch("/compile", opts).then((res) => res.json());
    console.log("Compilation result: ", result);

    if (result.type === "SUCCESS") {
      const wasm = result.payload.wasm;
      downloadBlob(wasm);
    } else {
      const message = result.payload.payload.compile_stderr;
      console.info(message);
    }
  }

  return (
    <div className="flex justify-between">
      <div className="flex gap-3">
        <div className="w-[160px] mx-4">
          <img
            id="logo"
            src="https://raw.githubusercontent.com/hyperledger/solang/main/docs/hl_solang_horizontal-color.svg"
            alt="Solang Logo"
          />
        </div>
        <div className="flex gap-8 items-center">
          <button onClick={handleCompile} className="flex items-center gap-2">
            <FaRocket />
            <span>Compile for Polkadot Target</span>
          </button>
          <button className="flex items-center gap-2">
            <FaNetworkWired />
            <span>Deploy/Interact with Compiled Contracts on Chain</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3 mr-4">
        <button className="flex items-center gap-2" id="docs">
          <i className="fas fa-book"></i>
          <FaBook />
          <span>Solang Docs</span>
        </button>
        <button className="flex items-center gap-2">
          <FaGithub />
          <span>GitHub Repo</span>
        </button>
      </div>
    </div>
  );
}

export default Header;
