"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) router.back();
      }}
    >
      <DialogContent className="sm:max-w-[95vw] h-[95vh] pt-6 pb-10 pl-6 pr-10">
        <div className="overflow-y-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
