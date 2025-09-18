import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import KioskConfig from "@/models/KioskConfig";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

// Allowed MIME types
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "application/pdf",
];

export async function POST(req) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images, videos, and PDFs allowed." },
        { status: 400 }
      );
    }

    // Enforce size limit (25MB)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 25MB)" },
        { status: 400 }
      );
    }

    // Convert File -> Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, file.type);

    // Store in DB
    let config = await KioskConfig.findOne();
    if (!config) config = new KioskConfig();

    const newMedia = {
      type: file.type.startsWith("image")
        ? "image"
        : file.type.startsWith("video")
        ? "video"
        : "pdf",
      fileUrl: result.secure_url,
      fileName: file.name,
      public_id: result.public_id,
    };

    config.media.push(newMedia);
    await config.save();

    return NextResponse.json(
      {
        success: true,
        fileUrl: result.secure_url,
        public_id: result.public_id,
        config,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
