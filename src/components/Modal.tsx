"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeSwitch from "@/components/ThemeSwitch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <Dialog
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) router.back();
      }}
      open={isOpen}
    >
      <DialogContent
        className="max-w-[95vw] h-[95vh]"
        onClick={(e) => {
          const link = (e.target as HTMLElement).closest("a");
          if (link) setIsOpen(false);
        }}
      >
        <DialogTitle />
        <ScrollArea className="pr-4">{children}</ScrollArea>
        <ThemeSwitch />
      </DialogContent>
    </Dialog>
  );
}
