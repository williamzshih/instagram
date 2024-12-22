import { Asterisk } from "lucide-react";

try {
  throw new TypeError("message", {
    cause: "cause",
  });
} catch (error) {
  console.error(error as unknown as string);
}

