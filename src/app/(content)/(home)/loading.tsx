import { House } from "lucide-react";
import localFont from "next/font/local";
import PostPageLoading from "@/components/PostPageLoading";
import { Separator } from "@/components/ui/separator";

const googleSans = localFont({
  src: "../../fonts/GoogleSansCodeVF.ttf",
});

export default function HomeLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 lg:ml-6">
        <House className="size-8" />
        <p className={`text-2xl font-semibold ${googleSans.className}`}>Home</p>
      </div>
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="flex flex-col gap-8" key={i}>
            <PostPageLoading home />
            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
