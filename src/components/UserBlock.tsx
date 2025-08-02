import LinkAvatar from "@/components/LinkAvatar";

type Props = {
  user: {
    username: string;
    name: string;
    avatar: string;
  };
  size: number;
};

export default function UserBlock({ user, size }: Props) {
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
