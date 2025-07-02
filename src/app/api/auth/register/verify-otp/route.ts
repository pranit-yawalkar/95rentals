import { NextResponse } from "next/server";
import { verifyOtp, getProfile } from "@/lib/redis"; // Redis helper to fetch cached data
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

    // Retrieve cached profile details
    const cachedProfile = await getProfile(phoneNumber);

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    // If user doesn't exist, create a new one
    if (!user && cachedProfile) {
      user = await prisma.user.create({
        data: { phone: phoneNumber, ...cachedProfile },
      });
    }

    // Generate JWT Token
    const token = generateJWT(phoneNumber, user?.userId || "", "user");

    return NextResponse.json(
      { message: "OTP verified", token },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error verifying OTP in register:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
