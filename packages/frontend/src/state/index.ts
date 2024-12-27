import { ExpNodeType, FileType, FolderType } from "@/types/explorer";
import { createStoreWithProducer } from "@xstate/store";
import { editor } from "monaco-editor-core";
import set from "lodash/set";
import { produce } from "immer";
import { Monaco } from "@monaco-editor/react";

interface File {
  name: string;
  path: string;
  model: editor.ITextModel;
}

export const store = createStoreWithProducer(produce, {
  context: {
    monaco: null as Monaco | null,
    currentFile: null as string | null,
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
  },
  on: {
    toggleFolder: (context, event: { path: string; value: boolean }) => {
      const state = set(context, event.path + ".open", event.value);
      console.log({ updated: state });
    },
    addFile: (context, event: { basePath: string; name: string; content: string }) => {
      const path = event.basePath + ".items." + event.name;
      set(context, path, {
        type: ExpNodeType.FILE,
        name: event.name,
        path: path,
      } satisfies FileType);

      context.files[path] = event.content;
    },
    changeContent: (context, event: { content: string }) => {
      const path = context.currentFile;
      if (path) {
        context.files[path] = event.content;
      }
    },
    setMonaco: (context, event: { monaco: Monaco }) => {
      context.monaco = event.monaco;
    },
    setCurrentPath: (context, event: { path: string }) => {
      context.currentFile = event.path;
    },
  },
});

// Path: explorer.items.components.items
