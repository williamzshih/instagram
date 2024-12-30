import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Post as PostType } from "@/prisma/client";
import PostsGrid from "@/components/PostsGrid";

export default function BrowsePage({
  posts,
  sortBy,
  setSortBy,
}: {
  posts: PostType[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-3xl font-bold">Browse</div>
      <div className="flex items-center gap-2">
        Sort by:
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{sortBy}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
              <DropdownMenuRadioItem value="Newest">
                Newest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Oldest">
                Oldest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Most popular">
                Most popular
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <PostsGrid posts={posts} />
    </div>
  );
}
