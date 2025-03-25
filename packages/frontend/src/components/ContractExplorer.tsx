"use client";

import { store } from "@/state";
import { useSelector } from "@xstate/store/react";
import React, { useState } from "react";
import Hide from "./Hide";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ChevronsLeftRightEllipsis, Cross, XIcon } from "lucide-react";
import { FaCross } from "react-icons/fa";
import InvokeFunction from "./InvokeFunction";

function ContractExplorer() {
  const idl = useSelector(store, (state) => state.context.contract?.methods) || [];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/json") {
      setSelectedFile(file);
    }
  };

  const processIdlFile = async () => {
    if (!selectedFile) return;

    try {
      const text = await selectedFile.text();
      const idlData = JSON.parse(text);
      console.log(idlData);
      store.send({ type: "setContractIdl", idl: idlData });
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to parse IDL file:", error);
    }
  };

  return (
    <div className=" ">
      <div className="">
        <h2 className="text-base uppercase px-3">Contract Explorer</h2>
      </div>
      <div className="mt-10 relative z-10 px-3 overflow-x-clip">
        <div className="flex flex-col gap-2">
          {idl.map((item) => (
            <InvokeFunction key={item.name} method={item} />
          ))}
        </div>

        <Hide
          open={idl.length === 0}
          fallback={
            <Button
              variant="outline"
              className="mx-auto flex mt-8"
              size="icon"
              onClick={() => store.send({ type: "setContractIdl", idl: [] })}
            >
              <XIcon />
            </Button>
          }
        >
          <div className="text-center">
            <p>No Function or IDL Specified</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-4 w-full">Upload IDL</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Contract IDL</DialogTitle>
                  <DialogDescription>Upload a JSON IDL file to explore contract functions</DialogDescription>
                </DialogHeader>
                <Input type="file" accept=".json" onChange={handleFileUpload} />
                <DialogFooter>
                  <Button onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button disabled={!selectedFile} onClick={processIdlFile}>
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Hide>
      </div>
    </div>
  );
}

export default ContractExplorer;
