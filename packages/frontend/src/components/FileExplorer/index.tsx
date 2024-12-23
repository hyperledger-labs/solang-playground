import { Accordion, AccordionContent, AccordionTrigger } from "@/components/Accordion";
import { FileIcon, FolderIcon } from "lucide-react";

export enum ExpNodeType {
  FILE = "FILE",
  FOLDER = "FOLDER",
}

type Node = FileType | FolderType;

interface FileType {
  type: ExpNodeType.FILE;
  path: string;
  name: string;
  content: string;
}

interface FolderType {
  type: ExpNodeType.FOLDER;
  path: string;
  name: string;
  items: Array<FolderType | FileType>;
}

function isFile(node: Node): node is FileType {
  return node.type === ExpNodeType.FILE;
}

function File({ name }: FileType) {
  return (
    <div className="text-sm my-1">
      <button className="flex items-center gap-0.5 w-full rounded px-2 active:opacity-50">
        <FileIcon className="h-4 w-4 " />
        <span>{name}</span>
      </button>
    </div>
  );
}

function Folder({ name, items, path }: FolderType) {
  return (
    <Accordion>
      <AccordionTrigger className="accordion-trigger flex rounded">
        <FolderIcon className="h-4 w-4 mr-2" />
        <span className="flex-1">{name}</span>
      </AccordionTrigger>
      <AccordionContent className="accordion-content">
        <div className="">
          {items.map((item, index) => (
            <ExplorerNode key={index} node={item} />
          ))}
        </div>
      </AccordionContent>
    </Accordion>
  );
}

function ExplorerNode({ node }: { node: Node }) {
  if (isFile(node)) {
    return <File {...node} />;
  }
  return <Folder {...node} />;
}

function FileExplorer({ root }: { root: FolderType }) {
  return (
    <div className="">
      <h2 className="text-base uppercase">File Explorer</h2>
      <div className="mt-10">
        <ExplorerNode node={root} />
      </div>
    </div>
  );
}

export default FileExplorer;
