"use client";

import { SidebarView, useAppStore } from "@/app/state";
import FileExplorer, { ExpNodeType } from "./FileExplorer";
import Settings from "./Settings";

function Sidebar() {
  const { sidebar } = useAppStore();

  if (sidebar === SidebarView.SETTINGS) {
    return <Settings />;
  }

  return (
    <div className="">
      <FileExplorer
        root={{
          type: ExpNodeType.FOLDER,
          name: "src",
          path: "/",
          items: [
            { type: ExpNodeType.FILE, name: "index.tsx", path: "/src/index.tsx", content: "" },
            {
              type: ExpNodeType.FOLDER,
              name: "components",
              path: "/src/components",
              items: [
                { type: ExpNodeType.FILE, name: "Sidebar.tsx", path: "/src/components/Sidebar.tsx", content: "" },
                { type: ExpNodeType.FILE, name: "Settings.tsx", path: "/src/components/Settings.tsx", content: "" },
              ],
            },
          ],
        }}
      />
    </div>
  );
}

function SidebarLayout() {
  return (
    <div className="w-[300px] border-r bg-card h-full px-3 pt-2">
      <Sidebar />
    </div>
  );
}

export default SidebarLayout;
