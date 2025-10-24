import { getPosts } from "@/utils";

export const baseUrl = "https://ui-lab-nu.vercel.app";

export default async function sitemap() {
  const posts = getPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const routes = ["", "/components"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...posts];
}
