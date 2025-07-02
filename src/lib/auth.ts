import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const generateJWT = (
  phoneNumber: string,
  userId: string,
  role?: string
) => {
  return jwt.sign(
    { phoneNumber, userId, role },
    process.env.NEXT_PUBLIC_JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { success: false, message: "Unauthorized: No token provided" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET!) as {
      phoneNumber: string;
      userId: string;
      role: string;
    };

    return { success: true, user: decoded };
  } catch (error) {
    return { success: false, message: "Unauthorized: Invalid token" };
  }
};

export function isAdmin(req: NextRequest) {
  try {
    const token = req.cookies.get("adminToken")?.value;
    if (!token) {
      return { success: false, message: "Unauthorized: No token provided" };
    }
    const decoded = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET!
    ) as unknown as {
      phoneNumber: string;
      userId: string;
      role: string;
    };

    if (!decoded) {
      return { success: false, message: "Unauthorized: No token provided" };
    }
    console.log(decoded, "decoded");
    if (decoded.role !== "admin") {
      console.log("inside admin");
      return { success: false, message: "Forbidden: User is not an admin" };
    }
    return { success: true, user: decoded };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Unauthorized: Invalid token" };
  }
}
