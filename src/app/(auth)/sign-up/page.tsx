import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import SignUpForm from "@/components/SignUpForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SignUp() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Sign up to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm session={session} />
        </CardContent>
      </Card>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button className="p-6 pl-2" variant="outline">
          <ChevronLeft />
          Back
        </Button>
      </form>
    </div>
  );
}
