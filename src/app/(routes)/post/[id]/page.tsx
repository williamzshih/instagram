import { getUser } from "@/actions/user";
import Post from "@/components/Post";

export default async function PostPage({ params }: { params: { id: string } }) {
  try {
    const user = await getUser();

    if (!user) {
      return <div>User not found</div>;
    }

    return <Post id={params.id} user={user} isModalOrPage />;
  } catch (error) {
    return (
      <div>{error instanceof Error ? error.message : "An error occurred"}</div>
    );
  }
}
