import LinkImage from "@/components/LinkImage";

type Props = {
  noLink?: boolean;
  size: number;
  user: {
    image?: null | string;
    name?: null | string;
    username: string;
  };
};

export default function UserBlock({ noLink, size, user }: Props) {
  return (
    <div className="flex items-center gap-4">
      <LinkImage noLink={noLink} size={size} user={user} />
      <div className="flex flex-col">
        {user.name || ""}
        <p className="text-muted-foreground text-sm">@{user.username}</p>
      </div>
    </div>
  );
}
