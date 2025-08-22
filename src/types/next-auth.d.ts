import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    bio: string;
    bookmarks: {
      createdAt: Date;
      id: string;
      image: string;
    }[];
    createdAt: Date;
    followers: {
      createdAt: Date;
      id: string;
      image: null | string;
      name: null | string;
      username: string;
    }[];
    following: {
      createdAt: Date;
      id: string;
      image: null | string;
      name: null | string;
      username: string;
    }[];
    id: string;
    likes: {
      createdAt: Date;
      id: string;
      image: string;
    }[];
    posts: {
      createdAt: Date;
      id: string;
      image: string;
    }[];
    username: string;
  }
}
