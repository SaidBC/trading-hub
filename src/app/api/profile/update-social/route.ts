import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { discord, whatsapp, telegram } = await req.json();

    // Update user social media profiles
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        discord,
        whatsapp,
        telegram,
      },
    });

    // Remove sensitive data
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      { message: "Social media profiles updated successfully", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("Social media update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating social media profiles" },
      { status: 500 }
    );
  }
}
