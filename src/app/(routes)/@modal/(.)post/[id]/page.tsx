import Modal from "@/components/Modal";
import Post from "@/components/Post";
import { getUser } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function PostModal(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const user = await getUser();

  if (!user) {
    redirect("/sign-up");
  }

  return (
    <Modal>
      <Post id={params.id} user={user} />
    </Modal>
  );
}
