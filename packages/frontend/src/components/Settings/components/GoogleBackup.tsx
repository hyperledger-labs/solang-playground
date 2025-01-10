import Hide from "@/components/Hide";
import { Button } from "@/components/ui/button";
import createGoogleBackup from "@/lib/googlebackup";
import { store } from "@/state";
import { logger } from "@/state/utils";
import { LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

function GoogleBackup() {
  const { status, data: session } = useSession();

  async function handleCreateBackup() {
    if (status === "unauthenticated") {
      return signIn();
    }

    if (!(session as any).accessToken) {
      return;
    }

    const state = store.getSnapshot();

    await createGoogleBackup(state.context.explorer, (session as any).accessToken, state.context.files);

    logger.info("Google Drive Backup Complete");
  }

  return (
    <div className="">
      <h3 className="text-base text-primary flex justify-between items-center">
        <span>Google Backup</span>
        <Hide open={status === "authenticated"}>
          <button onClick={signOut as any} className="active:opacity-50">
            <LogOut size={20} />
          </button>
        </Hide>
      </h3>
      <div className="mt-3">
        <Button className="w-full" size="sm" onClick={handleCreateBackup}>
          {status === "authenticated" ? "Create Backup" : "Sign In with Google"}
        </Button>
      </div>
    </div>
  );
}

export default GoogleBackup;
