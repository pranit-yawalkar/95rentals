import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Fetch all bikes */
export async function GET(req: Request) {
  try {
    // 🔹 Verify the token before proceeding
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
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

/** Add a new bike (Admin Only) */
export async function POST(req: Request) {
  try {
    const { name, type, model, specs, description, imageUrl, hourlyRate, dailyRate, features } =
      await req.json();

    if (!name || !type || !hourlyRate || !dailyRate) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newBike = await prisma.bike.create({
      data: { name, type, model, specs, description, imageUrl, hourlyRate, dailyRate, features },
    });

    return NextResponse.json({ success: true, data: newBike }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
