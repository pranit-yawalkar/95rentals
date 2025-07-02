import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/redis"; // Assuming you have OTP verification logic
import { prisma } from "@/lib/prisma"; // Assuming Prisma is configured
import { generateJWT } from "@/lib/auth"; // Assuming you have JWT helper

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP required" },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = await verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Check if user exists in the database
    const user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
    }

    // Generate JWT Token
    const token = generateJWT(phoneNumber, user?.userId || "", "user");

    return NextResponse.json(
      { message: "OTP verified", token },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying OTP in login:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
