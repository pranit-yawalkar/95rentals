import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/** Fetch a bike by ID */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ bikeId: string }> }
) {
  const auth = verifyToken(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }

  const { bikeId } = await params;

  try {
    const bike = await prisma.bike.findUnique({
      where: { bikeId: String(bikeId) },
    });

    if (!bike)
      return NextResponse.json(
        { success: false, message: "Bike not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: bike }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
