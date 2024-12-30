import Modal from "@/components/Modal";
import Post from "@/app/(routes)/post/[id]/page";
import { getUser } from "@/actions/user";

export default async function PostModal({
  params,
}: {
  params: { id: string };
}) {
  try {
    const user = await getUser();

    if (!user) {
      return <div>User not found</div>;
    }

    return (
      <Modal>
        <Post params={params} user={user} />
      </Modal>
    );
  } catch (error) {
    return (
      <div>{error instanceof Error ? error.message : "An error occurred"}</div>
    );
  }
}
