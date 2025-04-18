"use client";

import { store } from "@/state";
import { useSelector } from "@xstate/store/react";
import React from "react";
import Hide from "./Hide";
import InvokeFunction from "./InvokeFunction";

function ContractExplorer() {
  const idl = useSelector(store, (state) => state.context.contract?.methods) || [];

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

        <Hide open={idl.length === 0}>
          <div className="text-center">
            <p>No Function or IDL Specified</p>
          </div>
        </Hide>
      </div>
    </div>
  );
}

export default ContractExplorer;
