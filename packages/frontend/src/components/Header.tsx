"use client";

import { downloadBlob } from "@/lib/utils";
import { FaPlay, FaTimes } from "react-icons/fa";
import { useAddConsole } from "@/app/state";
import { useFileContent } from "@/state/hooks";

function Header() {
  const addConsole = useAddConsole();
  const code = useFileContent();

  async function handleCompile() {

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
        const message = result.payload.compile_stderr;
        addConsole(`Error: ${message}`);
      }
    } else {
      addConsole(`Error: ${message}`);
    }
  }

  return (
    <div className="bg-card h-[35px] text-sm border-b flex">
      <div className="border-r">
        <button className="px-3 h-full" onClick={handleCompile}>
          <FaPlay className="text-[#32ba89]" size={12} />
        </button>
      </div>
      <div className="bg-foreground/10 px-2 py-1 w-max h-full flex items-center gap-2">
        <span>main.sol</span>
        <FaTimes size={12} />
      </div>
    </div>
  );
}

export default Header;
