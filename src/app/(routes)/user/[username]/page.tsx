import { getUser } from "@/actions/user";
import OtherProfilePage from "@/components/OtherProfilePage";

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  try {
    const currentUser = await getUser();

    if (!currentUser) {
      return <div>Current user not found</div>;
    }

    return (
      <OtherProfilePage otherUsername={params.username} currentUserId={currentUser.id} />
    );
  } catch (error) {
    return (
      <div>{error instanceof Error ? error.message : "An error occurred"}</div>
    );
  }
}
