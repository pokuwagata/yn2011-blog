import { ImageResponse } from "@vercel/og";
import { siteName } from "@/app/const";
import { OGP } from "@/components/OGP";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.has("title")) {
    throw new Error("title is not found");
  }
  const title = searchParams.get("title")?.slice(0, 100) ?? "";

  return new ImageResponse(<OGP title={title} siteName={siteName} />, {
    width: 1200,
    height: 630,
  });
}
