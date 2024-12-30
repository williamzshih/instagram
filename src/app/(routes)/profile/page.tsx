import { getUserProfile } from "@/actions/user";
import CurrentProfilePage from "@/components/CurrentProfilePage";

export default async function Profile() {
  try {
    const user = await getUserProfile();

    if (!user) {
      return <div> User not found</div>;
    }

    return <CurrentProfilePage user={user} />;
  } catch (error) {
    return (
      <div>{error instanceof Error ? error.message : "An error occurred"}</div>
    );
  }
}
