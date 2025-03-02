import jwt from "jsonwebtoken";

export const generateJWT = (phoneNumber: string) => {
  return jwt.sign({ phoneNumber }, process.env.NEXT_PUBLIC_JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!);
  } catch (error) {
    return null;
  }
};
