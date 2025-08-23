import { LoaderCircle } from "lucide-react";

export default function ContentLayoutLoading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoaderCircle className="animate-spin" size={48} />
    </div>
  );
}
