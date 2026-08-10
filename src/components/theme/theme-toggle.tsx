import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated, useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="min-h-9 min-w-9 text-muted-foreground hover:text-foreground"
    >
      {hydrated && theme === "dark" ? (
        <Sun className="h-[1.1rem] w-[1.1rem]" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem]" />
      )}
    </Button>
  );
}
