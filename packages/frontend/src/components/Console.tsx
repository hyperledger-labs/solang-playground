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
      className="block w-full bg-transparent flex-1 rounded text-sm text-white/60 font-medium overflow-auto"
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
