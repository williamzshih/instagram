"use client";

import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 bg-background rounded-full shadow-xl border z-50">
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
