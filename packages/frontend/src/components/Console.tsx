'use client';

import { ConsoleState } from "@/app/state";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

function Console() {
  const state = useAtomValue(ConsoleState);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [state]);

  return (
    <div
      ref={containerRef}
      className="text-sm text-card-foreground/70 font-medium overflow-auto bg-card h-[195px] p-3 border-t"
      style={{maxWidth: "calc(100vw - 350px)"}}
    >
      {state.map((item) => (
        <span key={item.id} className="mb-2 block">
          <pre>{item.message}</pre>
        </span>
      ))}
    </div>
  );
}

export default Console;
