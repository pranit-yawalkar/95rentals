import { NextResponse } from "next/server";
import { sendOtp, generateOTP } from "@/lib/sns"; // Assuming you have these helper functions
import { storeOtp } from "@/lib/redis";

export async function POST(req: Request) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber)
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );

    // Generate OTP
    const otp = generateOTP();
    const success = await sendOtp(phoneNumber, otp);

    if (success) {
      // Store OTP temporarily in Redis for validation
      await storeOtp(phoneNumber, otp);

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
    console.log(error, "Error in login API");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
