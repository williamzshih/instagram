"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          router.back();
        }
      }}
    >
      <DialogContent
        className="max-w-[95vw] h-[95vh]"
        onClick={(e) => {
          const link = (e.target as HTMLElement).closest("a");
          if (!link) {
            return;
          }
          setIsOpen(false);
        }}
      >
        <ScrollArea className="pr-4">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
