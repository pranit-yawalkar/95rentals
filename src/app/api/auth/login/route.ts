import { NextResponse } from "next/server";
import { sendOtp, generateOTP } from "@/lib/sns";
import { storeOtp } from "@/lib/redis";

export async function POST(req: Request) {
  const { phoneNumber } = await req.json();
  if (!phoneNumber)
    return NextResponse.json(
      { error: "Phone number required" },
      { status: 400 }
    );

  const otp = generateOTP();
  const success = await sendOtp(phoneNumber, otp);

  if (success) {
    await storeOtp(phoneNumber, otp);
    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
