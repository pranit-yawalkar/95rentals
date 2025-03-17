import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { rentalId: string } }) {
  try {
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }

    const { rentalId } = await params;
    console.log("rentalId", rentalId);
    const userId = auth.user?.userId;
    const role = auth.user?.role;

    // Fetch rental
    const rental = await prisma.rental.findUnique({
      where: { rentalId },
    });

    if (!rental) {
      return NextResponse.json({ success: false, message: "Ride not found" }, { status: 404 });
    }

    // 🔹 Allow only the owner or admin to access rental
    if (rental.userId !== userId && role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, rental }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
