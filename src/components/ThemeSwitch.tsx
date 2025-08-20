"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-16 md:bottom-4 right-4 bg-background rounded-full shadow-xl border z-50">
      <Button
        className="rounded-full"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        size="icon"
        variant="ghost"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
    </div>
  );
}
