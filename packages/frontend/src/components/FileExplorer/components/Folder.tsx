import { Accordion, AccordionContent, AccordionTrigger } from "@/components/Accordion";
import { store } from "@/state";
import { useExplorer } from "@/state/hooks";
import { FolderIcon, FolderOpen } from "lucide-react";
import Hide from "@/components/Hide";
import { cn, onEnter } from "@/lib/utils";
import FolderActions from "./FolderActions";
import { useState } from "react";
import { ParentContext } from "../provider/ParentContext";
import RenderNode from "./RenderNode";
import { logger } from "@/state/utils";

function Folder({ path, basePath }: { path: string; basePath: string }) {
  const { items, open, name } = useExplorer(path);
  const keys = Object.keys(items);
  const [editing, setEditing] = useState(name === "");
  const [newName, setNewName] = useState(name);
  const [dropping, setDropping] = useState(false);

  function handleToggle() {
    store.send({ type: "toggleFolder", path });
  }

  function confirmFolderEdit() {
    store.send({ type: "renameFolder", path, basePath, name: newName });
    setEditing(false);
  }

  async function handleFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();

    const fileArray = Array.from(e.dataTransfer.files);
    const readFiles = fileArray.map(async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          resolve({ name: file.name, content: e.target?.result });
        };

        reader.onerror = (e) => {
          reject(`Error reading file ${file.name}`);
        };

        // Read as text (adjust if needed for images or binary files)
        reader.readAsText(file);
      });
    });

    const files = (await Promise.all(readFiles).catch(() => {
      logger.error("Error reading files");
      return [];
    })) as any;

    if (files) {
      store.send({ type: "addFiles", basePath: path, files });
    }

    setDropping(false);
  }

  return (
    <Accordion
      open={open}
      className={cn("pl-1 border-l explorer-bg-drag", dropping && "active")}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setDropping(true);
      }}
      onDragLeave={() => setDropping(false)}
      onDrop={handleFileDrop}
    >
      <AccordionTrigger
        onClick={handleToggle}
        className={cn(
          "accordion-trigger flex rounded duration-150 explorer-bg-hover items-center group select-none cursor-pointer",
        )}
      >
        <Hide open={open} fallback={<FolderIcon className="h-4 w-4 mr-2" />}>
          <FolderOpen className="h-4 w-4 mr-2" />
        </Hide>
        <div className="flex-1">
          <Hide open={editing} fallback={<span>{name}</span>}>
            <input
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className="w-full rounded flex-1 outline-none ring-1 ring-primary/40 px-1"
              value={newName}
              onBlur={confirmFolderEdit}
              placeholder="name..."
              onKeyUp={onEnter(confirmFolderEdit)}
            />
          </Hide>
        </div>

        <Hide open={!editing}>
          <ParentContext.Provider value={{ path, basePath: path, name, editing, setEditing, confirmEdit: () => {} }}>
            <FolderActions />
          </ParentContext.Provider>
        </Hide>
      </AccordionTrigger>
      <AccordionContent className="accordion-content">
        <div className="">
          {keys.map((key, index) => (
            <RenderNode key={index} node={items[key]} basePath={path} />
          ))}
        </div>
      </AccordionContent>
    </Accordion>
  );
}

export default Folder;
