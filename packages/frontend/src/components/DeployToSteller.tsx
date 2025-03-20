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
import { toast, useSonner } from "sonner";
import { Keypair, Networks } from "@stellar/stellar-sdk";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function DeployToSteller() {
  const [contract, setContract] = useState<null | Buffer>(null);
  const [open, setOpen] = useState(false);
  const toastId = useId();
  const [network, setNetowrk] = useState(Networks.TESTNET);

  async function handleDeploy() {
    if (!contract) {
      return;
    }

    const keypair = Keypair.random();

    setOpen(false);
    toast.loading("Deploying contract...", { id: toastId });
    await deployStellerContract(contract, keypair, network);
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
            <DialogTitle>Upload your wasm contract to steller</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Select onValueChange={(val) => setNetowrk(val as any)} value={network}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select Network" />
              </SelectTrigger>
              <SelectContent>
                {[
                  {
                    label: "Testnet",
                    value: Networks.TESTNET,
                  },
                  {
                    label: "Mainnet",
                    value: Networks.PUBLIC,
                  },
                  {
                    label: "Futurenet",
                    value: Networks.FUTURENET,
                  },
                ].map((network) => (
                  <SelectItem value={network.value}>{network.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Enter your contract name" type="file" onChange={handleContractUpload} />
          </div>
          <DialogFooter className="mt-3">
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
