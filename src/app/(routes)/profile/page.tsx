import { getUser } from "@/utils/actions";
import ProfilePage from "@/components/ProfilePage";

export default async function Profile() {
  const user = await getUser();

  if (!user) {
    return <div> User not found</div>;
  }

  return <ProfilePage user={user} />;
}
