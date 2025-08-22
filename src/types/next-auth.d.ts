import { DefaultUser } from "next-auth";
import { getUser } from "@/actions/user";

type FullUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

declare module "next-auth" {
  interface User extends DefaultUser, FullUser {
    id: FullUser["id"];
    image: FullUser["image"];
    name: FullUser["name"];
  }
}
