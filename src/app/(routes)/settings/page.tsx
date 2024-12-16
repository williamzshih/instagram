import { auth } from "@/auth";
import Settings from "./settings";

export default async function SettingsPage() {
  const session = await auth();
  return <Settings session={session} />;
}
