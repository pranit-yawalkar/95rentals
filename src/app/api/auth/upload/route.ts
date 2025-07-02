import { NextRequest, NextResponse } from "next/server";
import s3 from "@/lib/s3";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Disable body parsing (since we'll handle it manually)
export const config = {
  api: {
    bodyParser: false,
  },
};

const convertAndUpload = async (file: Blob, fileName: string) => {
  // Convert Blob to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to S3
  const upload = await s3
    .upload({
      Bucket: process.env.NEXT_PUBLIC_USER_UPLOAD_BUCKET!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
    .promise();

  return upload;
};

export async function POST(req: NextRequest) {
  try {
    const auth = verifyToken(req);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: 401 }
      );
    }

    const userId = auth.user?.userId;

    // Extract file from FormData
    const formData = await req.formData();
    const license = formData.get("license") as Blob;
    const idProof = formData.get("idProof") as Blob;

    if (!license || !idProof) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const licenseFileName = `uploads/${userId}/license-${Date.now()}.png`;
    const idProofFileName = `uploads/${userId}/idProof-${Date.now()}.png`;

    const licenseUpload = await convertAndUpload(license, licenseFileName);
    const idProofUpload = await convertAndUpload(idProof, idProofFileName);

    const user = await prisma.user.update({
      where: { userId },
      data: {
        licenseDocument: licenseUpload.Location,
        idProof: idProofUpload.Location,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Documents uploaded successfully",
        user
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
