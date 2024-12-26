import { editor } from "monaco-editor-core";

export enum ExpNodeType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

export type ExplorerNode = FileType | FolderType;

export interface FileType {
  type: ExpNodeType.FILE;
  path: string;
  name: string;
  content: string;
  model: editor.ITextModel;
}

export interface FolderType {
  type: ExpNodeType.FOLDER;
  path: string;
  name: string;
  open: boolean;
  items: Record<string, ExplorerNode>;
}
