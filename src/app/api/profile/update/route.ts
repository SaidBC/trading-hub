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

    const { name, bio } = await req.json();

    // Update user profile
    const updatedUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name,
        bio,
      },
    });

    // Remove sensitive data
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(
      { message: "Profile updated successfully", user: userWithoutPassword },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "An error occurred while updating profile" },
      { status: 500 }
    );
  }
}
