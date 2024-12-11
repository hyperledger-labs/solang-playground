"use client";

import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="border-t border-black">
        <Editor />
        <Console />
      </div>
    </div>
  );
}
