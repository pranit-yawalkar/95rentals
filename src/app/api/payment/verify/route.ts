import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    // Validate required parameters
    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ success: false, message: "Invalid payment data" }, { status: 400 });
    }

    // Generate Razorpay signature for verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.NEXT_PUBLIC_RZP_SECRET!) // Use a secure backend environment variable
      .update(orderId + "|" + paymentId) // ✅ Correct concatenation
      .digest("hex");

    if (generated_signature !== signature) {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }

    // Find the payment record in the database
    const payment = await prisma.payment.findFirst({
      where: { transactionId: orderId },
      select: { rentalId: true },
    });

    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
    }

    // Update Payment Status
    await prisma.payment.update({
      where: { rentalId: payment.rentalId },
      data: { status: "Completed", transactionId: orderId },
    });

    // Update Rental Status
    await prisma.rental.update({
      where: { rentalId: payment.rentalId },
      data: { status: "Confirmed" },
    });

    return NextResponse.json({ success: true, message: "Payment verified & ride confirmed" }, { status: 200 });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
