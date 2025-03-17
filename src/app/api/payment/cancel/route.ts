import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { rentalId } = await req.json();

    if (!rentalId) {
      return NextResponse.json({ success: false, message: "Rental ID is required" }, { status: 400 });
    }

    // Find the payment record
    const payment = await prisma.payment.findUnique({
      where: { rentalId },
    });

    if (!payment || payment.status !== "Completed") {
      return NextResponse.json({ success: false, message: "Payment not eligible for refund" }, { status: 400 });
    }

    // Refund the payment
    const refund = await razorpay.payments.refund(payment.transactionId!, {
        amount: payment.amount * 100, // Amount in paisa (INR)
        speed: "optimum",
    });

    // Update payment status
    await prisma.payment.update({
      where: { rentalId },
      data: { status: "Refunded" },
    });

    // Update ride status
    await prisma.rental.update({
      where: { rentalId },
      data: { status: "Cancelled" },
    });

    return NextResponse.json({ success: true, refund }, { status: 200 });
  } catch (error) {
    console.error("Refund error:", error);
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
