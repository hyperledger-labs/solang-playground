import IconButton from "@/components/IconButton";
import { useParentContext } from "../provider/ParentContext";
import { FileIcon, FolderIcon, PencilIcon, TrashIcon } from "lucide-react";
import { store } from "@/state";

function FolderActions() {
  const { path, editing, setEditing } = useParentContext();

  function handleAddFile() {
    store.send({ basePath: path, content: "", name: "", type: "addFile" });
  }

  return (
    <div
      className="flex gap-1.5 items-center opacity-0 group-hover:opacity-70 duration-150"
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton onClick={() => store.send({ type: "addFolder", basePath: path, name: "" })}>
        <FolderIcon className="h-[15px] w-[15px]" />
      </IconButton>
      <IconButton onClick={handleAddFile}>
        <FileIcon className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton onClick={() => setEditing(true)} className="active:opacity-50 duration-150">
        <PencilIcon className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton onClick={() => store.send({ type: "deleteFolder", path })}>
        <TrashIcon className="h-[15px] w-[15px]" />
      </IconButton>
    </div>
  );
}

export default FolderActions;
