import Redis from "ioredis";

const redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL!);

export const storeOtp = async (phoneNumber: string, otp: string) => {
  await redis.setex(`otp:${phoneNumber}`, parseInt(process.env.OTP_EXPIRY || "300"), otp);
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
  try {
    const storedOtp = await redis.get(`otp:${phoneNumber}`);
    return storedOtp === otp;
  } catch (error) {
    console.log("Error verifying OTP:", error);
  }
};

export default redis;
