import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = isAdmin(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }
    const rentals = await prisma.rental.findMany({
      include: {
        user: true,
        bike: true,
        payment: true,
      },
    });
    return NextResponse.json({ success: true, data: rentals });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = isAdmin(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }
    const { userId, bikeId, startTime, endTime, totalAmount } =
      await req.json();
    const bike = await prisma.bike.findUnique({
      where: {
        bikeId: bikeId,
      },
    });
    if (!bike) {
      return NextResponse.json(
        { success: false, message: "Bike not found" },
        { status: 404 }
      );
    }
    const rental = await prisma.rental.create({
      data: {
        userId,
        bikeId,
        startTime,
        endTime,
        totalAmount,
        status: "pending",
      },
    });
    return NextResponse.json({ success: true, data: rental }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
