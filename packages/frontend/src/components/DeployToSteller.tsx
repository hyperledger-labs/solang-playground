"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaPlay } from "react-icons/fa";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ChangeEvent, useId, useState } from "react";
import deployStellerContract from "@/lib/deploy-steller";
import Hide from "./Hide";
import { LoaderIcon } from "lucide-react";
import { toast, useSonner } from "sonner";
import useFreighter from "@/hooks/useFreighter";
import { getAddress, isAllowed, isConnected, setAllowed } from "@stellar/freighter-api";

function DeployToSteller() {
  const [contract, setContract] = useState<null | Buffer>(null);
  const [open, setOpen] = useState(false);
  const toastId = useId();

  async function handleDeploy() {
    const connected = await isConnected();
    if (!contract || !connected.isConnected) {
      return;
    }

    const allowed = await isAllowed();

    if (!allowed.isAllowed) {
      await setAllowed();
    }

    const address = await getAddress();

    console.log({ address });

    setOpen(false);
    toast.loading("Deploying contract...", { id: toastId });
    await deployStellerContract(contract, address.address);
    toast.success("Contract deployed successfully", { id: toastId });
  }

  async function handleContractUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target?.files?.[0];

    if (!file) {
      return;
    }

    const buffer = await file.arrayBuffer();
    const contract = Buffer.from(buffer);
    setContract(contract);
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
        <DialogTrigger asChild>
          <button className="px-3 flex items-center justify-center h-full gap-2 active:opacity-50 duration-150">
            <span>Deploy To Steller</span>
            <FaPlay className="text-[#32bab3]" size={12} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload your wasm contract for steller</DialogTitle>
            <DialogDescription>
              <Input placeholder="Enter your contract name" type="file" onChange={handleContractUpload} />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button>Cancel</Button>
            </DialogTrigger>
            <Button disabled={!contract} onClick={handleDeploy} className="flex gap-2">
              Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeployToSteller;
