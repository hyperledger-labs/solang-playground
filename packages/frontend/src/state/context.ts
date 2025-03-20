import { ExpNodeType, FolderType } from "@/types/explorer";
import { LogType } from "@/types/log";
import { Monaco } from "@monaco-editor/react";
import { Networks } from "@stellar/stellar-sdk";

export const context = {
  monaco: null as Monaco | null,
  preferences: {
    theme: "vs-dark",
    fontSize: 14,
    autoSave: true,
    autoFormat: true,
  },
  currentFile: "home" as string | null,
  logs: [] as LogType[],
  tabs: new Set<string>(),
  files: {} as Record<string, string>,
  explorer: {
    type: ExpNodeType.FOLDER,
    open: true,
    name: "explorer",
    path: "explorer",
    items: {
      src: {
        type: ExpNodeType.FOLDER,
        open: true,
        name: "src",
        path: "explorer.items.src",
        items: {},
      },
    },
  } satisfies FolderType,
};

export type Context = typeof context;
