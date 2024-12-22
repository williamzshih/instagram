"use server";

import {
  PrismaClient,
  Like as LikeType,
  Follow as FollowType,
  Bookmark as BookmarkType,
  Prisma,
} from "@prisma/client";
import { auth, signIn, signOut } from "@/auth";

const prisma = new PrismaClient();

export async function signInAction() {
  await signIn("google");
}

export async function signOutAction() {
  await signOut();
}

export async function getSession() {
  try {
    return await auth();
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error("Error fetching session", { cause: error });
  }
}

async function getEmail() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated", { cause: session });
  }
  return session.user.email;
}

export async function upsertUser(
  avatar: string,
  username: string,
  name: string,
  bio: string
) {
  try {
    const email = await getEmail();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        avatar,
        username,
        name,
        bio,
      },
      create: {
        email,
        avatar,
        username,
        name,
        bio,
      },
    });

    return {
      user,
      updateOrInsert: existingUser ? "update" : "insert",
    };
  } catch (error) {
    console.error("Error upserting user:", error);
    throw new Error("Error upserting user", { cause: error });
  }
}

export async function getUser() {
  try {
    const email = await getEmail();
    return await prisma.user.findUnique({
      where: { email },
      include: {
        posts: true,
        following: {
          include: {
            whoTheyreFollowing: {
              include: {
                posts: true,
              },
            },
          },
        },
        bookmarks: {
          include: {
            post: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user", { cause: error });
  }
}

export async function getUserByUsername(username: string) {
  try {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        posts: true,
        followers: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw new Error("Error fetching user by username", { cause: error });
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found", { cause: email });
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Error fetching user by email", { cause: error });
  }
}

export async function searchUsers(q: string) {
  try {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: q, mode: "insensitive" } },
          { name: { contains: q, mode: "insensitive" } },
        ],
      },
    });
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Error searching users", { cause: error });
  }
}

export async function createPost(image: string, caption: string) {
  try {
    const email = await getEmail();
    return (
      await prisma.post.create({
        data: { email, image, caption },
      })
    ).id;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Error creating post", { cause: error });
  }
}

export async function getPost(id: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        bookmarks: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found", { cause: id });
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw new Error("Error fetching post", { cause: error });
  }
}

export async function getPosts(sortBy: string) {
  try {
    let orderBy: Prisma.PostOrderByWithRelationInput;

    switch (sortBy) {
      case "Newest":
        orderBy = { createdAt: "desc" };
        break;
      case "Oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "Most Popular":
        orderBy = {
          likes: {
            _count: "desc",
          },
        };
        break;
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    return await prisma.post.findMany({
      orderBy,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts", { cause: error });
  }
}

export async function searchPosts(q: string) {
  try {
    return await prisma.post.findMany({
      where: { caption: { contains: q, mode: "insensitive" } },
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Error searching posts", { cause: error });
  }
}

export async function createComment(postId: string, comment: string) {
  try {
    const email = await getEmail();
    await prisma.comment.create({
      data: { email, postId, comment },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error("Error creating comment", { cause: error });
  }
}

export async function toggleLike(like: LikeType | undefined, postId: string) {
  try {
    if (like) {
      await prisma.like.delete({
        where: { id: like.id },
      });
    } else {
      const email = await getEmail();
      await prisma.like.create({
        data: { email, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Error toggling like", { cause: error });
  }
}

export async function toggleBookmark(
  bookmark: BookmarkType | undefined,
  postId: string
) {
  try {
    if (bookmark) {
      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      });
    } else {
      const email = await getEmail();
      await prisma.bookmark.create({
        data: { email, postId },
      });
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw new Error("Error toggling bookmark", { cause: error });
  }
}

export async function toggleFollow(
  follow: FollowType | undefined,
  username: string
) {
  try {
    if (follow) {
      await prisma.follow.delete({
        where: { id: follow.id },
      });
    } else {
      const email = await getEmail();
      return await prisma.follow.create({
        data: { userEmail: email, whoTheyreFollowingUsername: username },
      });
    }
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw new Error("Error toggling follow", { cause: error });
  }
}
