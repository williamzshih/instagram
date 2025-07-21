import { getUser } from "@/actions/user";
import OtherProfilePage from "@/components/OtherProfilePage";
import { redirect } from "next/navigation";

export default async function User({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const currentUser = await getUser();

  if (!currentUser) {
    redirect("/sign-up");
  }

  return (
    <OtherProfilePage otherUsername={username} currentUserId={currentUser.id} />
  );
}
