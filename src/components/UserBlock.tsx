import LinkAvatar, { type LinkAvatarProps } from "@/components/LinkAvatar";

type UserBlockProps = LinkAvatarProps & {
  user: {
    username: string;
    name: string;
  };
};

export default function UserBlock({ user, size }: UserBlockProps) {
  return (
    <div className="flex items-center gap-4">
      <LinkAvatar user={user} size={size} />
      <div className="flex flex-col">
        <p>{user.name}</p>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </div>
    </div>
  );
}
