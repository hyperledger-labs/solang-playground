import { ConsoleState } from "@/app/state";
import { useAtomValue } from "jotai";

function Console() {
  const state = useAtomValue(ConsoleState);

  return (
    <div className="border-t px-4 border-black h-44 flex flex-col pt-2" style={{ fontFamily: "var(--font-geist-mono)" }}>
      <h3 className="mb-2 block text-xl font-semibold">Console</h3>
      <div className="block w-full bg-transparent border border-white/10 flex-1 rounded text-sm text-white/60 font-medium p-4 overflow-auto">
        {state.map((item) => (
          <span key={item.id} className="mb-2 block">
            {item.message}
          </span>
        ))}
      </div>
    </div>
  );
}

export default Console;
