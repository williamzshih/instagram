import { getSortedPosts } from "@/actions/post";
import BrowsePage from "@/components/BrowsePage";

export default async function Browse() {
  const initialData = await getSortedPosts("Newest");

  return <BrowsePage initialData={initialData} />;
}
