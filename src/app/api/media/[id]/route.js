import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import KioskConfig from "@/models/KioskConfig";
import { deleteFromCloudinary } from "@/lib/uploadToCloudinary";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const config = await KioskConfig.findOne();
    if (!config) return NextResponse.json({ success: false, error: "Config not found" }, { status: 404 });

    const mediaItem = config.media.id(id);
    if (!mediaItem) return NextResponse.json({ success: false, error: "Media not found" }, { status: 404 });

    // 🔑 delete from Cloudinary using saved public_id
    await deleteFromCloudinary(mediaItem.public_id, mediaItem.type);

    // Remove from DB
    mediaItem.deleteOne();
    await config.save();

    return NextResponse.json({ success: true, config }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
