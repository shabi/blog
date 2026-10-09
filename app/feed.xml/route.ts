import { getPosts } from "../get-posts";

const siteUrl = "https://blog.ohhoba.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 300;

export async function GET() {
  const posts = await getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) =>
      new Date(b.updatedAt || b.date).getTime() -
      new Date(a.updatedAt || a.date).getTime(),
  );

  const items = sortedPosts
    .map((post) => {
      const link =
        `${siteUrl}/${post.lang}/${post.category}/${post.id}`;

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(post.updatedAt || post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description || "")}</description>
    </item>`;
    })
    .join("\n");

  const lastBuildDate = sortedPosts.length
    ? new Date(
        sortedPosts[0].updatedAt || sortedPosts[0].date,
      ).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GANG's Blog</title>
    <link>${siteUrl}</link>
    <description>A personal archive by GANG.</description>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
