import { generateRandomId } from "@/lib/utils";
import { atom, useSetAtom } from "jotai";

export const ConsoleState = atom<{ id: string; message: string }[]>([]);

export function useAddConsole() {
  const setState = useSetAtom(ConsoleState);
  return (message: string) => {
    const id = generateRandomId();
    setState((state) => [...state, { id, message }]);
  };
}
