import { generateFeed } from "@/lib/rss";

export async function GET() {
  const xml = await generateFeed();
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": `text/xml` },
  });
}
