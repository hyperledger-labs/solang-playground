import { useParentContext } from "../provider/ParentContext";
import IconButton from "@/components/IconButton";
import { PencilIcon, TrashIcon } from "lucide-react";
import { store } from "@/state";

function FileActions() {
  const { setEditing, path, basePath } = useParentContext();
  return (
    <div className="flex gap-1.5 items-center group-hover:opacity-70 opacity-0">
      <IconButton onClick={() => setEditing(true)} className="active:opacity-50 duration-150">
        <PencilIcon className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton onClick={() => store.send({ type: "deleteFile", path, basePath })}>
        <TrashIcon className="h-[15px] w-[15px]" />
      </IconButton>
    </div>
  );
}

export default FileActions;
