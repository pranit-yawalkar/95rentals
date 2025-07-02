// /app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = isAdmin(req as NextRequest);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }
    // also add rentals count from rentals table with userId  
    const users = await prisma.user.findMany({
      where: { role: "user" },
      include: {
        rentals: {
          select: {
            rentalId: true,
          }
        },
      },
    });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
