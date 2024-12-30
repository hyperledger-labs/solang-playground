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

function Folder({ path, basePath }: { path: string; basePath: string }) {
  const { items, open, name } = useExplorer(path);
  const keys = Object.keys(items);
  const [editing, setEditing] = useState(name === "");
  const [newName, setNewName] = useState(name);

  function handleToggle() {
    store.send({ type: "toggleFolder", path });
  }

  function confirmFolderEdit() {
    store.send({ type: "renameFolder", path, basePath, name: newName });
    setEditing(false);
    console.log({ path, basePath, name: newName });
  }

  return (
    <Accordion open={open} className="pl-1 border-l">
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
