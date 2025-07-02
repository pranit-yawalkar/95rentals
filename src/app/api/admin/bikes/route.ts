import { prisma } from "@/lib/prisma";
import s3 from "@/lib/s3";
import { NextResponse } from "next/server";
import buffer from "buffer";

export async function GET() {
  try {
    const bikes = await prisma.bike.findMany();
    return NextResponse.json({ success: true, data: bikes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // receive form data
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const model = formData.get("model") as string;
    const specs = formData.get("specs") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as File;
    const hourlyRate = formData.get("hourlyRate") as string;
    const dailyRate = formData.get("dailyRate") as string;
    const features = formData.get("features") as string;
    const location = formData.get("location") as string;

    if (!name || !type || !hourlyRate || !dailyRate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!image) {
      return NextResponse.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const extension = image.name.split(".").pop();
    const uniqueFileName = `bikes/${Date.now()}-${name.replace(
      /\s/g,
      "-"
    )}.${extension}`;

    const imageUrl = await s3
      .upload({
        Bucket: process.env.NEXT_PUBLIC_BUCKET!,
        Key: uniqueFileName,
        Body: imageBuffer,
        ContentType: image.type,
      })
      .promise();

    const bike = await prisma.bike.create({
      data: {
        name,
        type,
        model,
        specs,
        description,
        imageUrl: imageUrl.Location,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        features: features.includes(",") ? features.split(",") : [features],
        location,
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, data: bike }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
