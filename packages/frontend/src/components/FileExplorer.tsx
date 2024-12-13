import { FileText } from "lucide-react";

function FileExplorer() {
  return (
    <div className="">
      <h2 className="text-base uppercase">File Explorer</h2>
      <div className="mt-10 text-xs">
        <div className="w-full flex items-center gap-1 bg-foreground/10 py-1 px-2 rounded">
          <FileText size={12} />
          <span>main.sol</span>
        </div>
      </div>
    </div>
  );
}

export default FileExplorer;
