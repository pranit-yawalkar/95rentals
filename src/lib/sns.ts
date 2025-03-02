import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
});

const sns = new AWS.SNS();

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (phoneNumber: string, otp: string) => {
  try {
    const params = {
      Message: `Your verification code for 95Rentals is: ${otp}`,
      PhoneNumber: phoneNumber,
    };
    await sns.publish(params).promise();
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};
