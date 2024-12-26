import { FileType } from "@/types/explorer";
import { useSelector } from "@xstate/store/react";
import get from "lodash/get";
import { store } from ".";

export function useExplorer(path: string) {
  const open = useSelector(store, (state) => get(state.context, path + ".open"));
  const name = useSelector(store, (state) => get(state.context, path + ".name"));
  const keys = useSelector(store, (state) => Object.keys(get(state.context, path + ".items")).join(","));
  const state = store.getSnapshot().context;
  const items = get(state, path + ".items");

  return { open, items, name };
}

export function useMonaco() {
  return useSelector(store, (state) => state.context.monaco);
}

export function useCurrentFile() {
  const path = useSelector(store, (state) => state.context.currentFile);
  console.log({ currentPath: path });
  const file = useSelector(store, (state) => {
    if (!path) {
      return null;
    }

    return get(state.context, path) as FileType;
  });

  return file;
}
