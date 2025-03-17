import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { rentalId: string } }) {
    try {
      const auth = verifyToken(req);
      if (!auth.success) {
        return NextResponse.json({ success: false, message: auth.message }, { status: 401 });
      }
  
      const { rentalId } = params;
      const { userId, role } = auth.user || {};
  
      // Find the rental
      const rental = await prisma.rental.findUnique({ where: { rentalId } });
  
      if (!rental) {
        return NextResponse.json({ success: false, message: "Rental not found" }, { status: 404 });
      }
  
      // 🔹 Only admin or owner can complete the rental
      if (rental.userId !== userId && role !== "admin") {
        return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
      }
  
      if (rental.status !== "Confirmed") {
        return NextResponse.json({ success: false, message: "Only confirmed rentals can be completed" }, { status: 400 });
      }
  
      // Mark rental as "Completed"
      await prisma.rental.update({
        where: { rentalId },
        data: { status: "Completed" },
      });
  
      // Make bike available again
      await prisma.bike.update({
        where: { bikeId: rental.bikeId },
        data: { isAvailable: true },
      });
  
      return NextResponse.json({ success: true, message: "Rental completed" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
    }
  }
  