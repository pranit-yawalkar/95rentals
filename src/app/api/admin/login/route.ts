import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";  // Assuming you are using Prisma client for DB
import { generateJWT } from "@/lib/auth";  // Assuming you have a function for generating JWT

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    // Check if the user exists and has an admin role
    const admin = await prisma.user.findUnique({
      where: { email },
    });

    if (!admin || admin.role !== "admin" || !admin.password) {
      return NextResponse.json({ error: "Invalid credentials or not an admin" }, { status: 401 });
    }
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT for Admin
    const token = generateJWT(admin.phone, admin.userId, admin.role);

    const res = NextResponse.json({ message: "Login successful" }, { status: 200 });

    // ✅ Set secure cookie
    res.cookies.set("adminToken", `${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return res;
  } catch (error) {
    console.log("Error during login:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
