import { getUser } from "@/utils/actions";
import UserPage from "@/components/UserPage";

export default async function User({
  params,
}: {
  params: { username: string };
}) {
  const currentUser = await getUser();

  if (!currentUser) {
    return <div>Current user not found</div>;
  }

  return <UserPage otherUsername={params.username} currentUser={currentUser} />;
}
