import { EditorContext } from "@/context/EditorProvider";
import { useContext } from "react";

function useEditor() {
  return useContext(EditorContext);
}

export default useEditor;
