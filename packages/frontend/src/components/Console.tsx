import { ConsoleState } from "@/app/state";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";

function Console() {
  const state = useAtomValue(ConsoleState);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const element = containerRef.current;
      if (element) {
        element.scrollTo({
          top: element.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 500);

    return () => clearTimeout(id);
  }, [state]);

  return (
    <div
      className="border-t px-4 border-black h-60 flex flex-col pt-2"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <h3 className="mb-2 block text-xl font-semibold">Console</h3>
      <div
        ref={containerRef}
        className="block w-full bg-transparent border border-white/10 flex-1 rounded text-sm text-white/60 font-medium p-4 overflow-auto"
      >
        {state.map((item) => (
          <span key={item.id} className="mb-2 block">
            <pre>{item.message}</pre>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Console;
