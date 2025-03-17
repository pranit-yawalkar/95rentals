import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startTime = searchParams.get("startTime");
    const endTime = searchParams.get("endTime");

    if (!startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "startTime and endTime are required" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Get all bikes
    const allBikes = await prisma.bike.findMany();

    // Get all bikes that are booked in the given date range
    const bookedBikeIds = await prisma.rental.findMany({
      where: {
        status: { in: ["Pending", "Confirmed"] }, // Ignore completed/canceled rides
        OR: [
          { startTime: { lte: end }, endTime: { gte: start } }, // Overlapping condition
        ],
      },
      select: { bikeId: true },
    });

    const bookedIdsSet = new Set(bookedBikeIds.map((rental) => rental.bikeId));

    // Filter only available bikes
    const availableBikes = allBikes.filter((bike) => !bookedIdsSet.has(bike.bikeId));

    return NextResponse.json({ success: true, bikes: availableBikes }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error", error },
      { status: 500 }
    );
  }
}
