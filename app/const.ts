export const baseURL = "https://blog.yn2011.com";
export const siteName = "yn2011's blog";
export const ogpURL = (text: string) =>
  `/api/ogp?title=${encodeURIComponent(text)}`;
