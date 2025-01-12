"use client";

import { store } from "@/state";
import { MessageTypeName } from "@/types/log";
import { useSelector } from "@xstate/store/react";
import { useEffect, useRef } from "react";

function Console() {
  const logs = useSelector(store, (state) => state.context.logs);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  return (
    <div
      ref={containerRef}
      className="text-sm text-card-foreground/70 font-medium overflow-auto bg-card h-[195px] p-3 border-t"
      style={{ maxWidth: "calc(100vw - 350px)" }}
    >
      {logs.map((item) => (
        <span key={item.id} className="block mb-2">
          <pre>
            {MessageTypeName[item.type]}: {item.message}
          </pre>
        </span>
      ))}
    </div>
  );
}

export default Console;
