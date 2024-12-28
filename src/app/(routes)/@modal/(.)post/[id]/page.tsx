import Modal from "@/components/Modal";
import Post from "@/app/(routes)/post/[id]/page";
import { getUser } from "@/utils/actions";

export default async function PostModal({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Modal>
      <Post params={params} user={user} />
    </Modal>
  );
}
