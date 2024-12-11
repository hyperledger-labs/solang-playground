"use client";

import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="mx-4 mt-4 min-h-screen flex flex-col">
      <Header />

      <div className="mt-6 border-t border-black pt-2">
        <Editor />
        <Console />
      </div>
    </div>
  );
}
