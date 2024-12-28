import { signIn } from "@/auth";
import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="max-w-md mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Google account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
            className="flex justify-center items-center"
          >
            <SignInButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
