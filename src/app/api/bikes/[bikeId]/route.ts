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

/** Update bike details */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ bikeId: string }> }
) {
  const auth = verifyToken(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  const { bikeId } = await params;
  const {
    name,
    type,
    description,
    imageUrl,
    hourlyRate,
    dailyRate,
    isAvailable,
  } = await req.json();

  try {
    const updatedBike = await prisma.bike.update({
      where: { bikeId: String(bikeId) },
      data: {
        name,
        type,
        description,
        imageUrl,
        hourlyRate,
        dailyRate,
        isAvailable,
      },
    });

    return NextResponse.json(
      { success: true, data: updatedBike },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

/** Delete a bike */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ bikeId: string }> }
) {
  const auth = verifyToken(req);
  if (!auth.success) {
    return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
  }
  const { bikeId } = await params;

  try {
    await prisma.bike.delete({ where: { bikeId: String(bikeId) } });

    return NextResponse.json(
      { success: true, message: "Bike deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

/** Route Handler */
// export default function handler(req: Request, res: Response) {
//   if (req.method === "GET") return GET(req, res);
//   if (req.method === "PUT") return PUT(req, res);
//   if (req.method === "DELETE") return DELETE(req, res);
//   return res
//     .status(405)
//     .json({ success: false, message: "Method Not Allowed" });
// }
