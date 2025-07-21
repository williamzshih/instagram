import { BeatLoader } from "react-spinners";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return;

  return <BeatLoader color={theme === "dark" ? "#ffffff" : "#000000"} />;
}
