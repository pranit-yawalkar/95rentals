import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import s3 from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";

// /app/api/admin/bikes/[id]/route.ts
export async function PUT(
  req: NextRequest,
  context: any
){
  try {
    const auth = isAdmin(req as NextRequest);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Bike ID is required" },
        { status: 400 }
      );
    }

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
    const isAvailable = formData.get("isAvailable") as string;

    if (!name || !type || !hourlyRate || !dailyRate) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const extension = image.name.split(".").pop();
      const uniqueFileName = `bikes/${Date.now()}-${name.replace(
        /\s/g,
        "-"
      )}.${extension}`;

      imageUrl = await s3
        .upload({
          Bucket: process.env.NEXT_PUBLIC_BUCKET!,
          Key: uniqueFileName,
          Body: imageBuffer,
          ContentType: image.type,
        })
        .promise();
    }

    const existingBike = await prisma.bike.findUnique({
      where: { bikeId: id },
    });

    if (!existingBike) {
      return NextResponse.json(
        { success: false, message: "Bike not found" },
        { status: 404 }
      );
    }

    // if imageUrl is null, then keep the existing imageUrl
    const bike = await prisma.bike.update({
      where: { bikeId: id },
      data: {
        name,
        type,
        model,
        specs,
        description,
        imageUrl: imageUrl ? imageUrl.Location : existingBike?.imageUrl,
        hourlyRate: Number(hourlyRate),
        dailyRate: Number(dailyRate),
        features: features.includes(",") ? features.split(",") : [features],
        location,
        isAvailable: isAvailable === "true" ? true : false,
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

/** Delete a bike */
export async function DELETE(
  req: NextRequest,
  context: any
) {
  const auth = isAdmin(req as NextRequest);
  if (!auth.success) {
    return NextResponse.json(
      { success: false, message: auth.message },
      { status: 401 }
    );
  }
  const { id } = context.params;

  try {
    await prisma.bike.delete({ where: { bikeId: String(id) } });

    return NextResponse.json(
      { success: true, message: "Bike deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
