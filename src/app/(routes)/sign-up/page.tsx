import { auth, signOut } from "@/auth";
import SignUpForm from "@/components/SignUpForm";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function SignUp() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col justify-center items-center h-[95vh] gap-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Sign up to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm session={session} />
        </CardContent>
      </Card>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/sign-in" });
        }}
      >
        <Button type="submit" variant="outline">
          <ChevronLeft />
          Back
        </Button>
      </form>
    </div>
  );
}
