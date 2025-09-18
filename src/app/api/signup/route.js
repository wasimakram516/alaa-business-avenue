import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import KioskConfig from "@/models/KioskConfig";

export async function POST(req) {
  await dbConnect();
  const { signupLink } = await req.json();

  let config = await KioskConfig.findOne();
  if (!config) config = new KioskConfig();

  config.signupLink = signupLink;
  await config.save();

  return NextResponse.json({ success: true, config });
}
