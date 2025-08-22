type Props = {
  user: {
    bio: string;
    email?: null | string;
    id?: string;
    image?: null | string;
    name?: null | string;
    username: string;
  };
};

export default function ProfileInfo({ user }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xl font-semibold">{user.name}</p>
      {user.bio && <p className="max-w-md text-center">{user.bio}</p>}
    </div>
  );
}
