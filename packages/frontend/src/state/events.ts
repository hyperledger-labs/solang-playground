import { ExpNodeType, FileType, FolderType } from "@/types/explorer";
import set from "lodash/set";
import get from "lodash/get";
import unset from "lodash/unset";
import { Context } from "./context";
import { Monaco } from "@monaco-editor/react";
import { createPath } from "./utils";
import { MessageType } from "vscode-languageserver-protocol";
import { nanoid } from "nanoid";

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
    events.addTab(context, { path: event.path });
  },
  removeNestedTabs: (context: Context, event: { path: string }) => {
    const path = event.path;
    const tabs = context.tabs;
    for (const tab of tabs) {
      if (tab.startsWith(path)) {
        tabs.delete(tab);
      }
    }
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
    events.addTab(context, { path });
  },
  addFiles(context: Context, event: { basePath: string; files: { name: string; content: string }[] }) {
    for (const file of event.files) {
      events.addFile(context, { basePath: event.basePath, name: file.name, content: file.content });
    }
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

    events.removeTab(context, { path: event.path });
    delete folder.items[file.name];
    delete context.files[event.path];
  },
  deleteFolder(context: Context, event: { path: string }) {
    unset(context, event.path);
    events.removeNestedTabs(context, event);
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
  removeTab(context: Context, event: { path: string }) {
    context.tabs.delete(event.path);

    if (event.path === context.currentFile) {
      context.currentFile = Array.from(context.tabs).pop() || null;
    }
  },
  addTab(context: Context, event: { path: string }) {
    context.tabs.add(event.path);
  },
  addLog(context: Context, event: { logType: MessageType; message: string }) {
    context.logs.push({
      id: nanoid(),
      type: event.logType,
      message: event.message,
    });
  },
};
