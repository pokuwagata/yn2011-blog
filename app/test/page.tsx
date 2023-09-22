import { siteName } from "../const";
import { OGP } from "@/components/OGP";

export default function Page({ params }: any) {
  const title =
    "React Server Components で SSR する場合の Hydration について調べてみた";
  return <OGP title={title} siteName={siteName} />;
}
