import { auth } from "@/auth";
import SignUpForm from "@/components/SignUpForm";
import { redirect } from "next/navigation";

export default async function SignUp() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return <SignUpForm session={session} />;
}
