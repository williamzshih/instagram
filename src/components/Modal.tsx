"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (link?.href) {
      router.back();
      setTimeout(() => router.push(link.href), 0);
    }
  };

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
        <ScrollArea className="pr-4 sm:max-h-[85vh]" onClick={handleClick}>
          {children}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
