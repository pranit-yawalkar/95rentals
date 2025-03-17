import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { rentalId, amount } = await req.json();

    if (!rentalId || !amount) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    // Create a Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paisa (INR)
      currency: "INR",
      receipt: rentalId,
      payment_capture: true,
    });

    // Store payment details in DB
    const payment = await prisma.payment.create({
      data: {
        rentalId,
        amount,
        status: "Pending",
        transactionId: order.id
      },
    });

    return NextResponse.json({ success: true, order, payment }, { status: 201 });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json({ success: false, message: "Server error", error }, { status: 500 });
  }
}
