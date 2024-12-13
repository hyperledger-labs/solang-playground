"use client";

import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { AlertTriangle, File, FileText } from "lucide-react";
import Image from "next/image";
import SolangLogo from "@/assets/image/solang-logo.png";
import { FaFile, FaTimes } from "react-icons/fa";

function Footer() {
  return (
    <div className="h-[26px] bg-[#35576e] text-[10.5px] text-white flex items-center">
      <div className="flex gap-1 bg-[#c97539] items-center px-2 h-full">
        <AlertTriangle size={13} />
        <span className="mt-0.5">Scam Alert</span>
      </div>
      <div className="flex-1 text-center ">
        <span>
          Did you know? To prototype on a uniswap v4 hooks, you can create a Multi Sig Swap Hook workspace. Template
          created by the cookbook team.
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-full">
        {/* Content */}
        <div className="flex-1 flex">
          <div className="w-[50px] border-r h-full">
            <div className="mt-3">
              <Image className="mx-auto" src={SolangLogo.src} height={40} width={40} alt="Solang Logo" />
            </div>
          </div>
          <div className="w-[300px] border-r bg-card h-full px-3 pt-2">
            <h2 className="text-base text-white uppercase">File Explorer</h2>
            <div className="mt-10 text-xs">
              <div className="w-full flex items-center gap-1 bg-foreground/10 py-1 px-2 rounded">
                <FileText size={12} />
                <span>index.sol</span>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {/* Header & Tab Section */}
            <div className="bg-card h-[35px] text-sm border-b">
              <div className="bg-[#2a2c3f] px-2 py-1 w-max h-full flex items-center gap-2">
                <span>main.sol</span>
                <FaTimes size={12} />
              </div>
            </div>

            {/* Editor Section */}
            <div className="flex-1">
              <Editor />
            </div>

            {/* Console Section */}
            <div className="bg-card h-[195px] p-3 border-t">
              Error: something went wrong
              <Console />
            </div>
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
