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

  const regular = await fetch(
    new URL("../../../public/fonts/NotoSansJP-Regular.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  const bold = await fetch(
    new URL("../../../public/fonts/NotoSansJP-SemiBold.ttf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(<OGP title={title} siteName={siteName} />, {
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
}
