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
    files: {} as Record<string, File>,
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
    addFile: (context, event: { path: string; name: string; model: editor.ITextModel }) => {
      set(context, event.path + ".items." + event.name, {
        type: ExpNodeType.FILE,
        content: event.model.getValue(),
        name: event.name,
        path: event.path + ".items." + event.name,
        model: event.model,
      } satisfies FileType);
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
