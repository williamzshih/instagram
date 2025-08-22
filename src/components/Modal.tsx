"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent className="sm:max-w-[95%]" showCloseButton={false}>
        <VisuallyHidden asChild>
          <DialogTitle>Post</DialogTitle>
        </VisuallyHidden>
        <ScrollArea className="pr-4 sm:max-h-[85vh]">{children}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
