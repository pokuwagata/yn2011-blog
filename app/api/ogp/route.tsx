import { siteName } from "@/app/const";
import { OGP } from "@/components/OGP";
import satori from "satori";
import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.has("title")) {
    throw new Error("title is not found");
  }
  const title = searchParams.get("title")?.slice(0, 100) ?? "";

  const fontPath = path.join(process.cwd(), "public", "fonts");
  const regular = fs.readFileSync(fontPath + "/NotoSansJP-Regular.ttf");

  const bold = fs.readFileSync(fontPath + "/NotoSansJP-SemiBold.ttf");

  const svg = await satori(<OGP title={title} siteName={siteName} />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Roboto",
        data: regular,
        weight: 400,
        style: "normal",
      },
      {
        name: "Roboto",
        data: bold,
        weight: 600,
        style: "normal",
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
}
