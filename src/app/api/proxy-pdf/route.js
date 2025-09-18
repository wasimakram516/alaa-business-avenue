import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "Next.js PDF Proxy" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch PDF: ${response.statusText}` },
        { status: response.status }
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=86400, immutable",
        "Content-Disposition": "inline",
      },
    });
  } catch (err) {
    console.error("Proxy fetch failed:", err);
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 500 });
  }
}
