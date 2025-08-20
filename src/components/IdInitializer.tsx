"use client";

import { useEffect } from "react";
import { useIdStore } from "@/store/idStore";

export default function IdInitializer({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const setId = useIdStore((state) => state.setId);

  useEffect(() => {
    if (id && id !== useIdStore.getState().id) setId(id);
  }, [id, setId]);

  return children;
}
