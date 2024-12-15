import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Button type="submit">Sign in</Button>
        </form>
      )}
    </div>
  );
}
