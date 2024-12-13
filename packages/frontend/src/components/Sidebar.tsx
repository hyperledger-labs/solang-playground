'use client';

import { SidebarView, useAppStore } from "@/app/state";
import FileExplorer from "./FileExplorer";
import Settings from "./Settings";

function Sidebar() {
  const { sidebar } = useAppStore();

  if (sidebar === SidebarView.SETTINGS) {
    return <Settings />;
  }

  return (
    <div className="">
      <FileExplorer />
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
