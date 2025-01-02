import { getUser } from "@/actions/user";
import Post from "@/components/Post";
import { redirect } from "next/navigation";

export default async function PostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return <Post id={params.id} user={user} />;
}
