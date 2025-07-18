import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { rental: true },
  });
  return NextResponse.json(payments);
}
