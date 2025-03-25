"use client";

import { useState } from "react";
import { store } from "@/state";
import { useSelector } from "@xstate/store/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import { FunctionSpec } from "@/types/idl";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronsLeftRightEllipsis } from "lucide-react";
import { invokeContract } from "@/lib/invoke-contract";
import { logger } from "@/state/utils";
import { callContract } from "@/actions";
import { networkRpc } from "@/lib/web3";
import { Server } from "@stellar/stellar-sdk/rpc";
import { Networks } from "@stellar/stellar-sdk";

function InvokeFunction({ method }: { method: FunctionSpec }) {
  const [isOpen, setIsOpen] = useState(false);
  const [args, setArgs] = useState<Record<string, string>>({});
  const contractAddress = useSelector(store, (state) => state.context.contract?.address);

  const handleInputChange = (name: string, value: string) => {
    setArgs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInvoke = async () => {
    try {
      const server = new Server(networkRpc[Networks.TESTNET]);
      const argsArray = Object.values(args);
      const data = {
        contractId: contractAddress || "CBT42OCEG6ECN74FRMI4CBXOAZWXCQNJE2UC3RNNB3VNFIUHULJCP242",
        method: method.name,
        args: argsArray,
      };

      logger.info("Invoking Contract function...");
      logger.info(JSON.stringify(data, null, 2));

      const result = await callContract(data);

      let response;

      while (true) {
        response = await server.getTransaction(result.hash);
        if (response.status !== "NOT_FOUND") {
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (response.status === "SUCCESS") {
        logger.info("Transaction successful.");
        logger.info(`TxId: ${result.hash}`);
        toast.success(`Function invoked successfully`);
        return response;
      } else {
        logger.error("Transaction failed.");
        logger.info(`TxId: ${result.hash}`);
        throw new Error("Transaction failed");
      }
      console.log(result);
    } catch (error: any) {
      console.error("Error invoking function:", error);
      toast.error(`Error invoking function: ${error.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" key={method.name} className="w-full text-left justify-start items-center">
          <span>{method.name}</span>
          <ChevronsLeftRightEllipsis className="ml-auto" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invoke {method.name}</DialogTitle>
          <DialogDescription>{method.doc || "Enter arguments to invoke this function"}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {method.inputs?.map((arg, index) => (
            <div key={index} className="flex flex-col gap-2">
              <Label htmlFor={arg.name} className="">
                <span>{arg.name}</span>{" "}
                <span className="text-xs text-muted-foreground bg-black/10 p-1 rounded">({arg.value.type})</span>
              </Label>
              <Input
                id={arg.name}
                value={args[arg.name] || ""}
                onChange={(e) => handleInputChange(arg.name, e.target.value)}
                className="col-span-3"
                placeholder={`Enter '${arg.name}' value`}
              />
            </div>
          ))}

          {method.inputs?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">This function takes no arguments</p>
          )}
        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button onClick={handleInvoke}>Invoke</Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default InvokeFunction;
