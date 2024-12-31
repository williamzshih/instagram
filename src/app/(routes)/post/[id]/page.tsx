import { getUser } from "@/actions/user";
import Post from "@/components/Post";
import { redirect } from "next/navigation";

export default async function PostPage({ params }: { params: { id: string } }) {
  const user = await getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return <Post id={params.id} user={user} />;
}
