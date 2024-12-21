import Modal from "@/components/Modal";
import PostPage from "@/app/(routes)/post/[id]/page";

export default function PostModalPage({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <PostPage params={params} />
    </Modal>
  );
}
