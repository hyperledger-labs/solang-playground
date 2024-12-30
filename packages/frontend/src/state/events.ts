import { ExpNodeType, FileType, FolderType } from "@/types/explorer";
import set from "lodash/set";
import get from "lodash/get";
import unset from "lodash/unset";
import { Context } from "./context";
import { Monaco } from "@monaco-editor/react";
import { createPath } from "./utils";

export const events = {
  toggleFolder: (context: Context, event: { path: string }) => {
    const folder = get(context, event.path) as FolderType;
    folder.open = !folder.open;
  },
  changeContent: (context: Context, event: { content: string }) => {
    const path = context.currentFile;
    if (path) {
      context.files[path] = event.content;
    }
  },
  setMonaco: (context: Context, event: { monaco: Monaco }) => {
    context.monaco = event.monaco;
  },
  setCurrentPath: (context: Context, event: { path: string }) => {
    context.currentFile = event.path;
  },
  addFile(context: Context, event: { basePath: string; name: string; content: string }) {
    const path = createPath(event.basePath, event.name);
    const file = {
      type: ExpNodeType.FILE,
      name: event.name,
      path: path,
    } satisfies FileType;

    set(context, path, file);
    context.files[path] = event.content;
    context.currentFile = path;
  },
  addFolder(context: Context, event: { basePath: string; name: string }) {
    const folder = get(context, event.basePath) as FolderType;
    folder.items[event.name] = {
      items: {},
      name: event.name,
      open: true,
      path: createPath(event.basePath, event.name),
      type: ExpNodeType.FOLDER,
    } satisfies FolderType;
  },

  deleteFile(context: Context, event: { path: string; basePath: string }) {
    const folder = get(context, event.basePath) as FolderType;
    const file = get(context, event.path) as FileType;

    delete folder.items[file.name];
    delete context.files[event.path];
  },
  deleteFolder(context: Context, event: { path: string }) {
    unset(context, event.path);
  },
  renameFile(context: Context, event: { path: string; name: string; basePath: string }) {
    const newPath = createPath(event.basePath, event.name);
    events.addFile(context, {
      basePath: event.basePath,
      name: event.name,
      content: context.files[event.path],
    });

    if (context.currentFile === event.path) {
      context.currentFile = newPath;
    }

    events.deleteFile(context, { path: event.path, basePath: event.basePath });
  },
  renameFolder(context: Context, event: { path: string; name: string; basePath: string }) {
    const newPath = createPath(event.basePath, event.name);
    const folder = get(context, event.path) as FolderType;
    const newFolder = {
      name: event.name,
      items: folder.items,
      open: folder.open,
      path: newPath,
      type: ExpNodeType.FOLDER,
    } satisfies FolderType;

    set(context, newPath, newFolder);
    events.deleteFolder(context, { path: event.path });
  },
};
