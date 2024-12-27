import { Accordion, AccordionContent, AccordionTrigger } from "@/components/Accordion";
import { store } from "@/state";
import { useExplorer, useMonaco } from "@/state/hooks";
import { ExpNodeType, FileType, FolderType, ExplorerNode } from "@/types/explorer";
import { FileIcon, FolderIcon, FolderOpen, PlusIcon } from "lucide-react";
import Hide from "../Hide";

function isFile(node: ExplorerNode): node is FileType {
  return node.type === ExpNodeType.FILE;
}

function File({ name, path }: FileType) {
  function handleClick() {
    console.log("clicked", { path });
    store.send({ type: "setCurrentPath", path });
  }

  return (
    <div className="text-sm my-1">
      <button onClick={handleClick} className="flex items-center gap-0.5 w-full rounded px-2 active:opacity-50">
        <FileIcon className="h-4 w-4 " />
        <span>{name}</span>
      </button>
    </div>
  );
}

function Folder({ path }: { path: string }) {
  const { items, open, name } = useExplorer(path);
  const keys = Object.keys(items);
  const monaco = useMonaco();

  function handleToggle() {
    store.send({ type: "toggleFolder", path, value: !open });
  }

  function addFile(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    // if (monaco) {
    //   const name = "new-file" + keys.length;
    //   const model = monaco.editor.createModel("", "solidity", monaco.Uri.parse("file:///src/" + name));
    //   store.send({ type: "addFile", path, name: "new-file" + keys.length, model });
    // }
  }

  return (
    <Accordion open={open} className="pl-1 border-l">
      <AccordionTrigger onClick={handleToggle} className="accordion-trigger flex rounded">
        <Hide open={open} fallback={<FolderIcon className="h-4 w-4 mr-2" />}>
          <FolderOpen className="h-4 w-4 mr-2" />
        </Hide>
        <span className="flex-1">{name}</span>
        <span className="pr-2" onClick={addFile}>
          <PlusIcon className="h-4 w-4" />
        </span>
      </AccordionTrigger>
      <AccordionContent className="accordion-content">
        <div className="">
          {keys.map((key, index) => (
            <RenderNode key={index} node={items[key]} />
          ))}
        </div>
      </AccordionContent>
    </Accordion>
  );
}

function RenderNode({ node }: { node: ExplorerNode }) {
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
        <RenderNode node={root} />
      </div>
    </div>
  );
}

export default FileExplorer;
