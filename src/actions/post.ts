"use server";

import { prisma } from "@/db";
import { Prisma } from "@prisma/client";
import { getEmail } from "@/actions/actions";

export async function getPost(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        likes: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
            id: true,
          },
        },
        bookmarks: {
          select: {
            user: {
              select: {
                id: true,
              },
            },
            id: true,
          },
        },
        id: true,
        image: true,
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            name: true,
          },
        },
        caption: true,
        createdAt: true,
        comments: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                name: true,
              },
            },
            id: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });
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
      case "Most popular":
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
      select: {
        id: true,
        image: true,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Error fetching posts", { cause: error });
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

export async function searchPosts(q: string) {
  try {
    return await prisma.post.findMany({
      where: {
        caption: {
          contains: q,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        image: true,
        caption: true,
        createdAt: true,
        user: {
          select: {
            username: true,
            avatar: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Error searching posts", { cause: error });
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Error deleting post", { cause: error });
  }
}
