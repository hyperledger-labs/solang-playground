import Client from "@/lib/editor/client";
import { FromServer, IntoServer } from "@/lib/editor/codec";
import Server from "@/lib/server";
import { useEffect, useState } from "react";


// start()
//   .then(() => {
//     console.log("Client started ----------------------------");
//   })
//   .catch((err) => {
//     console.error("Error starting client", err);
//   });

// function useClient() {
//   const [started, setStarted] = useState(false);

//   //   useEffect(() => {
//   //     start().then(() => setStarted(true));
//   //   }, []);

//   return { client, started, init: start };
// }

// export default useClient;
