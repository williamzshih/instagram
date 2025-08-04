import LinkAvatar from "@/components/LinkAvatar";

type Props = {
  noLink?: boolean;
  profile: {
    avatar: string;
    name: string;
    username: string;
  };
  size: number;
};

export default function UserBlock({ profile, size }: Props) {
  return (
    <div className="flex items-center gap-4">
      <LinkAvatar noLink profile={profile} size={size} />
      <div className="flex flex-col">
        <p>{profile.name}</p>
        <p className="text-sm text-muted-foreground">@{profile.username}</p>
      </div>
    </div>
  );
}
