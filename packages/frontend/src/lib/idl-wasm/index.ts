import { logger } from "@/state/utils";
import init, { generate_json_spec } from "./soroban_spec_json";

export default async function generateIdl(contract: Uint8Array) {
  try {
    await init();
    const idl = generate_json_spec(contract);
    const parsedIdl = JSON.parse(idl);
    logger.info("IDL generated successfully");
    return parsedIdl;
  } catch (error: any) {
    logger.error("Error generating IDL: " + error?.message);
    return [];
  }
}
