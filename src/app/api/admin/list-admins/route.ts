import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Fetch all admin users
    const admins = await db.user.findMany({
      where: {
        role: "ADMIN",
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        discord: true,
        whatsapp: true,
        telegram: true,
      },
    });

    return NextResponse.json({ admins }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching admin users" },
      { status: 500 }
    );
  }
}
