import { isAdmin, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Fetch all bikes */
export async function GET(req: Request) {
  try {
    // 🔹 Verify the token before proceeding
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }
    const bikes = await prisma.bike.findMany({ where: { isAvailable: true } });
    return NextResponse.json({ success: true, data: bikes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
