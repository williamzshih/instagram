"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  return (
    <Button
      className="size-14 rounded-full fixed bottom-24 lg:bottom-4 right-4 bg-background hover:bg-muted transition-colors border shadow-xl/50 shadow-muted-foreground cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      variant="ghost"
    >
      {theme === "light" ? (
        <Moon className="size-8" />
      ) : (
        <Sun className="size-8" />
      )}
    </Button>
  );
}
