import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";  // Assuming you are using Prisma client for DB

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // Check if the email already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash the password before saving it (only for admins)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,  // Only for admin, not for regular users
        name,
        role: "admin", // Set role as admin
        phone: "",
        address: "",
        gender: "",
      },
    });

    return NextResponse.json({ message: "Admin registered successfully" }, { status: 201 });
  } catch (error) {
    console.log("Error registering admin:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
