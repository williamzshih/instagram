import { auth, signIn, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="">
      test
      {session ? (
        <form
          action={async () => {
            "use server"
            await signOut();
          }}
        >
          <button
            className="border px-4 py-2 text-white bg-ig-red rounded-lg"
            type="submit">Logout
          </button>
        </form>
      ) : (
        <form
          action={async () => {
            "use server"
            await signIn("google")
          }}
        >
          <button
            className="border px-4 py-2 text-white bg-ig-red rounded-lg"
            type="submit">Signin with Google
          </button>
        </form>
      )}
    </div>
  );
}
