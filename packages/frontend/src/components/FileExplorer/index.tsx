import { FolderType } from "@/types/explorer";
import RenderNode from "./components/RenderNode";

function FileExplorer({ root }: { root: FolderType }) {
  return (
    <div className=" ">
      <h2 className="text-base uppercase px-3">File Explorer</h2>
      <div className="mt-10 relative z-10 px-3 overflow-x-clip">
        <RenderNode node={root} basePath="" />
      </div>
    </div>
  );
}

export default FileExplorer;
