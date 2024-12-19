import Modal from "@/components/Modal";
import Post from "@/app/(routes)/post/[id]/page";

export default function PostModal({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <Post params={{ id: params.id }} />
    </Modal>
  );
}
