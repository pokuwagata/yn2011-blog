import { ImageResponse } from "@vercel/og";
import { siteName } from "@/app/const";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (!searchParams.has("title")) {
    throw new Error("title is not found");
  }
  const title = searchParams.get("title")?.slice(0, 100);

  return new ImageResponse(
    (
      <div tw="bg-white p-8 w-full h-full flex flex-col justify-between">
        <h1 tw="text-9xl">{title}</h1>
        <p tw="text-3xl">{siteName}</p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
