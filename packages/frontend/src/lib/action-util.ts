export interface ActionErrorType {
  type: "ACTION_ERROR";
  message: string;
}

export function ActionError(message: string): ActionErrorType {
  return {
    type: "ACTION_ERROR",
    message,
  };
}

export type Action<T> = (data: any) => Promise<T | ActionErrorType>;

export function isActionError(value: any): value is ActionErrorType {
  return value?.type === "ACTION_ERROR";
}

export async function withError<T>(action: Promise<T>, message?: string): Promise<Exclude<T, ActionErrorType>> {
  const result = (await action) as any;

  if (isActionError(result)) {
    throw new Error(result.message || message);
  }

  return result;
}
