import { cn } from "@/lib/utils";
import { ComponentProps, createContext, useContext, useState } from "react";
import Hide from "./Hide";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

const AccordionContext = createContext({
  open: false,
  // setOpen: ((open: boolean) => {}) as React.Dispatch<React.SetStateAction<boolean>>,
});

export function AccordionTrigger({ className, children, ...props }: ComponentProps<"button">) {
  // const { open } = useContext(AccordionContext);
  return (
    <button
      className={cn("w-full text-left bg-foreground/5 px-2 flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<"div">) {
  const { open } = useContext(AccordionContext);

  if (!open) {
    return null;
  }

  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function Accordion({ className, open, children, ...props }: ComponentProps<"div"> & { open: boolean }) {
  // const [open, setOpen] = useState(false);
  return (
    <AccordionContext.Provider value={{ open }}>
      <div className={cn("", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}
