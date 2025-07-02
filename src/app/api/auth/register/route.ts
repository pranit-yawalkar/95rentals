import { NextResponse } from "next/server";
import { sendOtp, generateOTP } from "@/lib/sns"; // Assuming you have these helper functions
import { storeOtp, storeProfile } from "@/lib/redis"; // Assuming Redis helpers are available
import { prisma } from "@/lib/prisma"; // Assuming Prisma is configured

export async function POST(req: Request) {
  try {
    const {
      name,
      email,
      phoneNumber,
      gender,
      address
    } = await req.json();

    // Validate phone number
    if (!phoneNumber)
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );

    // Check if account with provided email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phoneNumber },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists with this phone number or email" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const success = await sendOtp(phoneNumber, otp);

    if (success) {
      // Store OTP temporarily in Redis
      await storeOtp(phoneNumber, otp);

      // Cache profile details in Redis (expires in 5 minutes)
      await storeProfile(phoneNumber, {
        name,
        email,
        gender,
        address,
      });

      return NextResponse.json(
        { message: "OTP sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(error, "Error in register API");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
