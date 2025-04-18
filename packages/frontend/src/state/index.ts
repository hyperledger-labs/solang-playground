import { createStoreWithProducer } from "@xstate/store";
import { createBrowserInspector } from "@statelyai/inspect";
import { produce, enableMapSet } from "immer";
import { context } from "./context";
import { events } from "./events";

enableMapSet();

export const store = createStoreWithProducer(produce, {
  context,
  on: events,
});

const sub = store.inspect((inspectionEvent) => {
  console.log(inspectionEvent);
});
