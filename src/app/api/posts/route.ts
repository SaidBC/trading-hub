import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET endpoint to fetch all trading posts
export async function GET() {
  try {
    // Fetch trading posts from the correct table
    const posts = await db.tradingPost.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new trading post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "You must be logged in to create a post" },
        { status: 401 }
      );
    }

    // Get user to check for social media
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        discord: true,
        whatsapp: true,
        telegram: true,
      },
    });

    // Check if user has at least one social media method
    if (!user?.discord && !user?.whatsapp && !user?.telegram) {
      return NextResponse.json(
        {
          message:
            "You need to set up at least one social media contact method in your profile before posting",
          error: "NO_SOCIAL_MEDIA",
        },
        { status: 400 }
      );
    }

    const { hasPieces, needsPieces, type } = await req.json();

    // Validate required fields
    if (!hasPieces || !needsPieces) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the post
    const post = await db.tradingPost.create({
      data: {
        hasPieces,
        needsPieces,
        type: type || "TRADING",
        authorId: session.user.id,
      },
    });
    
    console.log("Post created successfully:", post);

    return NextResponse.json(
      { message: "Post created successfully", post },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
}
