"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

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
      <DialogContent className="w-[95vw] max-w-[95vw] h-[95vh] max-h-[95vh]">
        {children}
      </DialogContent>
    </Dialog>
  );
}
