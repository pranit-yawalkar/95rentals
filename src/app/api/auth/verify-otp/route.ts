import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/redis";
import { generateJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp } = await req.json();
    if (!phoneNumber || !otp)
      return NextResponse.json(
        { error: "Phone number and OTP required" },
        { status: 400 }
      );
    console.log("before verify otp");
    const isValid = await verifyOtp(phoneNumber, otp);
    if (!isValid)
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    console.log("after verify otp");
    // Check if user exists in database
    let user = await prisma.user.findUnique({ where: { phone: phoneNumber } });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: { phone: phoneNumber, name: "", gender: "" },
      });
    }

    // Generate JWT Token
    const token = generateJWT(phoneNumber);
    return NextResponse.json(
      { message: "OTP verified", token },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
