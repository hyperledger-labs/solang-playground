"use server";

import { invokeContract } from "@/lib/invoke-contract";

export async function callContract({ contractId, method, args }: { method: string; contractId: string; args: any[] }) {
  const result = await invokeContract({ contractId, method, args });
  return result;
}
