import { Checkbox } from "@/components/ui/checkbox";
import { useTheme } from "next-themes";
import { useId } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function ThemeItem({ value, title }: { value: string; title: string }) {
  const { setTheme } = useTheme();
  const id = useId();

  return (
    <div className="flex items-center space-x-2" onClick={() => setTheme(value)}>
      <RadioGroupItem value={value} id={id} />
      <Label className="text-xs" htmlFor={id}>
        {title}
      </Label>
    </div>
  );
}

function ThemeSwitcher() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="">
      <h3 className="text-base text-primary">Theme</h3>
      <RadioGroup className="mt-3" value={resolvedTheme}>
        {[
          { value: "light", title: "Light Mode" },
          { value: "dark", title: "Dark Mode" },
        ].map((theme) => (
          <ThemeItem key={theme.value} {...theme} />
        ))}
      </RadioGroup>
    </div>
  );
}

export default ThemeSwitcher;
