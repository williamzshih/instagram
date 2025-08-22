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
      className="bg-background hover:bg-muted shadow-muted-foreground fixed right-4 bottom-24 size-14 cursor-pointer rounded-full border shadow-xl/50 transition-colors lg:bottom-4"
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
