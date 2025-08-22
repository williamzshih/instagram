import { User } from "next-auth";

type Props = {
  user: Pick<User, "bio" | "name">;
};

export default function ProfileInfo({ user }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xl font-semibold">{user.name}</p>
      <p className="max-w-md text-center">{user.bio}</p>
    </div>
  );
}
