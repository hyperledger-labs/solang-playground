import { FileType, FolderType } from "@/types/explorer";
import { useSelector } from "@xstate/store/react";
import get from "lodash/get";
import { store } from ".";

export function useExplorer(path: string) {
  const open = useSelector(store, (state) => get(state.context, path).open);
  const name = useSelector(store, (state) => get(state.context, path).name);
  useSelector(store, (state) => {
    const folder = get(state.context, path) as FolderType;
    const keys = Object.keys(folder.items);
    return `${keys.length}:${keys.join(",")}`;
  });
  const state = store.getSnapshot().context;
  const folder = get(state, path) as FolderType;

  return { open, items: folder.items, name };
}

export function useExplorerItem(path: string) {
  return useSelector(store, (state) => get(state.context, path)) as FileType;
}

export function useMonaco() {
  return useSelector(store, (state) => state.context.monaco);
}

export function useCurrentFile() {
  const path = useSelector(store, (state) => state.context.currentFile);
  const file = useSelector(store, (state) => {
    if (!path) {
      return null;
    }

    return get(state.context, path) as FileType;
  });

  return file;
}

export function useFileContent() {
  const path = useSelector(store, (state) => state.context.currentFile);
  return useSelector(store, (state) => {
    if (!path) {
      return "";
    }

    return state.context.files[path];
  });
}
