import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { rentalId: string } }) {
    try {
      const auth = verifyToken(req);
      if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
      }
  
      const { rentalId } = await params;
      const { userId, role } = auth.user || {};
  
      // Find the rental
      const rental = await prisma.rental.findUnique({ where: { rentalId } });
  
      if (!rental) {
        return NextResponse.json({ success: false, message: "Rental not found" }, { status: 404 });
      }
  
      // 🔹 Only owner or admin can cancel the rental
      if (rental.userId !== userId && role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
  
      if (rental.status !== "Pending") {
        return NextResponse.json({ success: false, message: "Cannot cancel this rental" }, { status: 400 });
      }
  
      // Update rental status to "Cancelled"
      await prisma.rental.update({
        where: { rentalId },
        data: { status: "Cancelled" },
      });
  
      // Make bike available again
      await prisma.bike.update({
        where: { bikeId: rental.bikeId },
        data: { isAvailable: true },
      });
  
      return NextResponse.json({ success: true, message: "Rental cancelled" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  }
  