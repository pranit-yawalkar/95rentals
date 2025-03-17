import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: "Invalid payment data" }, { status: 400 });
    }

    // Validate Razorpay Signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 400 });
    }

    // Find the payment record
    const payment = await prisma.payment.findFirst({
      where: { transactionId: razorpay_order_id },
      select: { rentalId: true },
    });

    if (!payment) {
      return NextResponse.json({ success: false, message: "Payment record not found" }, { status: 404 });
    }

    // Update Payment Status
    await prisma.payment.update({
      where: { rentalId: payment.rentalId },
      data: { status: "Completed", transactionId: razorpay_payment_id },
    });

    // Update Rental Status
    await prisma.rental.update({
      where: { rentalId: payment.rentalId },
      data: { status: "Confirmed" },
    });

    return NextResponse.json({ success: true, message: "Payment verified & ride confirmed" }, { status: 200 });

  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
