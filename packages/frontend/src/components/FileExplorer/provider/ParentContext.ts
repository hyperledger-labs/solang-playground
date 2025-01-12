import { createContext, useContext } from "react";

export const ParentContext = createContext({
  path: "",
  basePath: "",
  name: "",
  editing: false,
  setEditing: ((editing: boolean) => {}) as React.Dispatch<React.SetStateAction<boolean>>,
  confirmEdit: () => {},
});

export function useParentContext() {
  return useContext(ParentContext);
}
