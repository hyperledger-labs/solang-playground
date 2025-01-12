import { cn } from "@/lib/utils";

function IconButton({ children, onClick, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    onClick?.(e);
  }
  return (
    <button {...props} className={cn("active:opacity-50 duration-150", className)} onClick={handleClick}>
      {children}
    </button>
  );
}

export default IconButton;
