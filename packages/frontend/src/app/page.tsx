import Console from "@/components/Console";
import Editor from "@/components/Editor";
import Header from "@/components/Header";
import SidePanel from "@/components/SidePanel";
import Footer from "@/components/Footer";
import FileExplorer from "@/components/FileExplorer";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div className="h-screen">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex">
          <SidePanel />
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <div className="flex-1">
              <Editor />
            </div>
            <Console />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
