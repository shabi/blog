import { MetadataRoute } from "next";
import { getPosts } from "./get-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const baseUrl = "https://blog.ohhoba.com";

  const staticPages = [
    "",
    "/about",
    "/zh",
    "/zh/about",
  ];

  const staticUrls = staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const postUrls = posts.flatMap((post) => [
    {
      url: `${baseUrl}/${new Date(post.date).getFullYear()}/${post.id}`,
      lastModified: new Date(post.date),
    },
    {
      url: `${baseUrl}/zh/${new Date(post.date).getFullYear()}/${post.id}`,
      lastModified: new Date(post.date),
    },
  ]);

  return [
    ...staticUrls,
    ...postUrls,
  ];
}
