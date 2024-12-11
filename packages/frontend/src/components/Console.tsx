import { ConsoleState } from "@/app/state";
import { useAtomValue } from "jotai";

function Console() {
  const state = useAtomValue(ConsoleState);

  return (
    <div className="mt-6 border-t border-black pt-3">
      <label htmlFor="channel-console" className="mb-2 block text-xl font-semibold">
        Console
      </label>
      <textarea
        className="block w-full bg-transparent border border-white/10 rounded text-sm text-white/60 font-medium p-4"
        autoComplete="off"
        spellCheck={false}
        wrap="off"
        readOnly
        rows={3}
        value={state.join("\n")}
      ></textarea>
    </div>
  );
}

export default Console;
