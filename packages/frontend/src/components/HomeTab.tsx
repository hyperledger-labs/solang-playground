"use client";

import { cn } from "@/lib/utils";
import { store } from "@/state";
import { useSelector } from "@xstate/store/react";
import React from "react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { Button } from "./ui/button";

function Item({ title, href, className }: { title: string; href: string; className?: string }) {
  return (
    <Button asChild>
      <a target="_blank" className={cn("rounded p-6 block flex-1 text-center min-h-12", className)} href={href}>
        {title}
      </a>
    </Button>
  );
}

function HomeTab() {
  const current = useSelector(store, (state) => state.context.currentFile);

  if (current !== "home") {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-background z-50 p-4">
      <div className="flex gap-10">
        <div className="">
          <h1 className="text-4xl">Solang </h1>
          <h5 className="text-sm text-muted-foreground font-medium">IDE for Solang Development</h5>
        </div>

        <div className="flex gap-2 mt-4">
          <FaDiscord />
          <FaGithub />
          <FaTwitter />
        </div>
      </div>

      <div className="mt-10 max-w-xl flex flex-col gap-2 ">
        <Item className="" title="Interact with Compiled Contract on Chain" href="https://ui.use.ink/" />
        <div className="flex gap-2">
          <Item title="Solang Docs" className="" href="https://solang.readthedocs.io/en/" />
          <Item title="Github Repo" className="" href="https://github.com/hyperledger-labs/solang-playground" />
        </div>
      </div>
    </div>
  );
}

export default HomeTab;
