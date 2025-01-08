import UserAvatar from "@/components/UserAvatar";

export default function GradientAvatar({
  user,
  size,
}: {
  user: {
    username: string;
    avatar: string;
  };
  size: number;
}) {
  return (
    <div className="p-1 rounded-full bg-gradient-to-tr from-ig-orange to-ig-red">
      <div className="p-1 rounded-full bg-background">
        <UserAvatar user={user} size={size} />
      </div>
    </div>
  );
}
