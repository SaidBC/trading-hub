import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// DELETE endpoint to delete a trading post (admin only or post owner)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You must be logged in to delete a post" },
        { status: 401 }
      );
    }

    const postId = params.id;
    
    // Find the post
    const post = await db.tradingPost.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json(
        { message: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user is admin or the post owner
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = post.author.id === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { message: "You do not have permission to delete this post" },
        { status: 403 }
      );
    }

    // Delete the post
    await db.tradingPost.delete({
      where: {
        id: postId,
      },
    });

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
}
