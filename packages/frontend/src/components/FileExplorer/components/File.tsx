import { store } from "@/state";
import { FileType } from "@/types/explorer";
import { FileIcon } from "lucide-react";
import Hide from "@/components/Hide";
import { useSelector } from "@xstate/store/react";
import { cn, onEnter } from "@/lib/utils";
import FileActions from "./FileActions";
import { useState } from "react";
import { ParentContext } from "../provider/ParentContext";
import { useExplorer, useExplorerItem } from "@/state/hooks";

function File({ path, basePath }: FileType & { basePath: string }) {
  const selected = useSelector(store, (state) => state.context.currentFile);
  const { name } = useExplorerItem(path);
  const [editing, setEditing] = useState(name === "");
  const [newName, setNewName] = useState(name);

  function setCurrentPath(e: React.MouseEvent) {
    store.send({ type: "setCurrentPath", path });
  }

  function handleFileEdit() {
    store.send({ type: "renameFile", path, basePath, name: newName });
    setEditing(false);
  }

  return (
    <ParentContext.Provider value={{ path,basePath, name, editing, setEditing, confirmEdit: handleFileEdit }}>
      <div className="text-sm my-1">
        <div
          onClick={setCurrentPath}
          className={cn(
            "flex items-center w-full gap-2 rounded pr-2 explorer-bg-hover justify-between group cursor-pointer select-none",
            selected === path && "active",
          )}
        >
          <div className="flex gap-1 items-center flex-1">
            <FileIcon className="h-4 w-4 " />
            <Hide open={editing} fallback={<span>{name}</span>}>
              <input
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                className="w-full rounded flex-1 outline-none ring-1 ring-primary/40 px-1"
                value={newName}
                onBlur={handleFileEdit}
                placeholder="name..."
                onKeyUp={onEnter(handleFileEdit)}
              />
            </Hide>
          </div>

          <Hide open={!editing}>
            <FileActions />
          </Hide>
        </div>
      </div>
    </ParentContext.Provider>
  );
}

export default File;
