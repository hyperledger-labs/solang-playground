"use client";

import { store } from "@/state";
import { useSelector } from "@xstate/store/react";
import React from "react";
import HomeTab from "./HomeTab";
import Editor from "./Editor";
import initState from "@/state/inistate";

initState();

function Router() {
  const current = useSelector(store, (state) => state.context.currentFile);

  if (current === "home") {
    return <HomeTab />;
  }

  return <Editor />;
}

export default Router;
