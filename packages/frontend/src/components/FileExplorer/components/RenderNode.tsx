import { ExplorerNode, ExpNodeType, FileType } from "@/types/explorer";
import Folder from "./Folder";
import File from "./File";

function isFile(node: ExplorerNode): node is FileType {
  return node.type === ExpNodeType.FILE;
}

function RenderNode({ node, basePath }: { node: ExplorerNode; basePath: string }) {
  if (isFile(node)) {
    return <File {...node} basePath={basePath} />;
  }
  return <Folder {...node} basePath={basePath} />;
}

export default RenderNode;
