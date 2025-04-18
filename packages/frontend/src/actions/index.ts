"use server";

import { ActionError } from "@/lib/action-util";
import { invokeContract } from "@/lib/invoke-contract";

export async function callContract({
  contractId,
  method,
  args,
}: {
  method: string;
  contractId: string;
  args: { type: string; value: string; subType: string }[];
}) {
  try {
    const result = await invokeContract({ contractId, method, args });
    return result;
  } catch (error: any) {
    return ActionError(error?.message || "Error invoking contract");
  }
}
