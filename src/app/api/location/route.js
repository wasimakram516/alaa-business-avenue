import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import KioskConfig from "@/models/KioskConfig";

export async function POST(req) {
  await dbConnect();
  const { location } = await req.json();

  let config = await KioskConfig.findOne();
  if (!config) config = new KioskConfig();

  config.location = location;
  await config.save();

  return NextResponse.json({ success: true, config });
}
