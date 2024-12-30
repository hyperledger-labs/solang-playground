import { createStoreWithProducer } from "@xstate/store";
import { createBrowserInspector } from "@statelyai/inspect";
import { produce } from "immer";
import { context } from "./context";
import { events } from "./events";

export const store = createStoreWithProducer(produce, {
  context,
  on: events,
});

const sub = store.inspect((inspectionEvent) => {
  console.log(inspectionEvent);
});
