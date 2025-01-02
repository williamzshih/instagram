import { getUser } from "@/actions/user";
import OtherProfilePage from "@/components/OtherProfilePage";
import { redirect } from "next/navigation";

export default async function User(
  props: {
    params: Promise<{ username: string }>;
  }
) {
  const params = await props.params;
  const currentUser = await getUser();

  if (!currentUser) {
    redirect("/sign-up");
  }

  return (
    <OtherProfilePage
      otherUsername={params.username}
      currentUserId={currentUser.id}
    />
  );
}
