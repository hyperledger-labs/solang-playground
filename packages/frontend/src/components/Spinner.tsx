import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

const shared = [
  "absolute",
  "w-full",
  "h-full",
  "rounded-full",
  "border-t-transparent",
  "border-l-transparent",
  "border-r-transparent",
  "border-b-current",
].join(" ");

interface Props {
  className?: string;
  thickness?: number;
}

function Spinner({ className, thickness = 2 }: Props) {
  return (
    <div
      className={twMerge(
        "relative inline-flex flex-col gap-2 items-center justify-center w-8 aspect-square",
        className,
      )}
    >
      <i className={cn(shared, "animate-spinner-ease-spin border-solid")} style={{ borderWidth: thickness }} />
      <i
        className={cn(shared, "animate-spinner-linear-spin border-dotted opacity-75")}
        style={{ borderWidth: thickness }}
      />
    </div>
  );
}

export default Spinner;
