"use client";

import Image from "next/image";
import SolangLogo from "@/assets/image/solang-logo.png";
import { Button } from "./ui/button";
import { FaCog } from "react-icons/fa";
import { SidebarView, useAppStore } from "@/app/state";
import { Files, FunctionSquare, LucideFiles, SquareFunction, Star } from "lucide-react";

function SidePanel() {
  const setSidebar = useAppStore((state) => state.setSidebar);
  return (
    <div className="w-[50px] flex flex-col border-r h-full py-3 items-center">
      <div className="">
        <Image className="mx-auto" src={SolangLogo.src} height={40} width={40} alt="Solang Logo" />
      </div>
      <div className="flex-1 flex flex-col gap-2 mt-6">
        <Button onClick={() => setSidebar(SidebarView.FILE_EXPLORER)} variant="outline" size="icon">
          <LucideFiles size={30} />
        </Button>
        <Button onClick={() => setSidebar(SidebarView.CONTRACT)} variant="outline" size="icon">
          <SquareFunction size={30} />
        </Button>
      </div>
      <div className="">
        <Button onClick={() => setSidebar(SidebarView.SETTINGS)} variant="outline" size="icon">
          <FaCog size={30} />
        </Button>
      </div>
    </div>
  );
}

export default SidePanel;
