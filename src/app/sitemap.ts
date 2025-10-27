import { getComponentNames } from "@/utils";

export const baseUrl = "https://ui-lab-nu.vercel.app";

export default async function sitemap() {
  const posts = getComponentNames().map((name) => ({
    url: `${baseUrl}/components/${name}`,
  }));

  const routes = ["", "/components"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
