"use server";

import { prisma } from "@/db";
import { Prisma } from "@prisma/client";
import { getEmail } from "@/actions/actions";

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
      console.error("Post not found:", id);
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
      include: {
        user: true,
      },
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("Error searching posts", { cause: error });
  }
}
