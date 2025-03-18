import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma"; // Prisma instance
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 🔹 Verify the token before proceeding
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    const { bikeId, startTime, endTime, totalAmount } =
      await req.json();

    const userId = auth.user?.userId;
    console.log("userId", userId);
    if (!userId || !bikeId || !startTime || !endTime || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if the bike is available
    const bike = await prisma.bike.findUnique({ where: { bikeId } });
    console.log("bike", bike);
    if (!bike || !bike.isAvailable) {
      return NextResponse.json(
        { success: false, message: "Bike is not available" },
        { status: 400 }
      );
    }

    // Create rental booking
    const rental = await prisma.rental.create({
      data: {
        userId,
        bikeId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        totalAmount,
        status: "Pending",
      },
    });

    // Mark bike as unavailable
    await prisma.bike.update({
      where: { bikeId },
      data: { isAvailable: false },
    });

    return NextResponse.json({ success: true, rental }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // 🔹 Verify the token before proceeding
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
    }
    const userId = auth.user?.userId;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    const rentals = await prisma.rental.findMany({ where: { userId } });
    return NextResponse.json({ success: true, data: rentals }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
