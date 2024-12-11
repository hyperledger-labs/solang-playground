"use client";

import useEditor from "@/hooks/useEditor";
import { downloadBlob } from "@/lib/utils";
import { FaBook, FaGithub, FaNetworkWired, FaRocket } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAddConsole } from "@/app/state";

function Header() {
  const editor = useEditor();
  const addConsole = useAddConsole();

  async function handleCompile() {
    const code = editor.current?.getValue();

    if (!code) {
      return addConsole("Error: No Source Code Found");
    }

    addConsole("Info: Compiling contract...");

    const opts: RequestInit = {
      method: "POST",
      mode: "cors",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: code,
      }),
    };

    const { result, success, message } = await fetch("/compile", opts).then(async (res) => {
      console.log(res);
      const result = await res.json().catch(() => null);

      if (!result) {
        return {
          success: false,
          message: res.statusText,
          result: null,
        };
      }

      return {
        success: res.ok,
        message: res.statusText,
        result: result,
      };
    });

    if (success) {
      if (result.type === "SUCCESS") {
        const wasm = result.payload.wasm;
        downloadBlob(wasm);
        addConsole("Info: Contract compiled successfully!");
      } else {
        const message = result.payload.payload.compile_stderr;
        addConsole(`Error: ${message}`);
      }
    } else {
      addConsole(`Error: ${message}`);
    }
  }

  // return null;

  return (
    <div className="flex justify-between h-20 items-center">
      <div className="flex gap-3">
        <div className="w-[160px] mx-4">
          <img
            id="logo"
            src="https://raw.githubusercontent.com/hyperledger/solang/main/docs/hl_solang_horizontal-color.svg"
            alt="Solang Logo"
          />
        </div>
        <div className="flex gap-8 items-center">
          <Button variant="ghost" onClick={handleCompile} className="flex items-center gap-2 text-base font-medium">
            <FaRocket className="!size-[18px]" />
            <span>Compile for Polkadot Target</span>
          </Button>
          <Link href="https://ui.use.ink/" target="_blank">
            <Button variant="ghost" className="flex items-center gap-2 text-base font-medium">
              <FaNetworkWired className="!size-[18px]" />
              <span>Deploy/Interact with Compiled Contracts on Chain</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-6 mr-4">
        <a href="https://solang.readthedocs.io/" target="_blank">
          <Button className="flex items-center gap-2 text-base font-medium" variant="ghost">
            <FaBook className="!size-[18px]" />
            <span>Solang Docs</span>
          </Button>
        </a>

        <a href="https://github.com/hyperledger-labs/solang-playground" target="_blank">
          <Button className="flex items-center gap-2 text-base font-medium" variant="ghost">
            <FaGithub className="!size-[18px]" />
            <span>GitHub Repo</span>
          </Button>
        </a>
      </div>
    </div>
  );
}

export default Header;
