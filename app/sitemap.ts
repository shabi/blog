import { MetadataRoute } from "next";
import { getPosts } from "./get-posts";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const posts = await getPosts();

  const baseUrl =
    "https://blog.ohhoba.com";


  const latestPostDate =
    posts.length > 0
      ? new Date(
          Math.max(
            ...posts.map(
              post =>
                new Date(post.updatedAt).getTime()
            )
          )
        )
      : undefined;


  const staticUrls = [
    {
      url: baseUrl,
      ...(latestPostDate
        ? { lastModified: latestPostDate }
        : {}),
    },
    {
      url: `${baseUrl}/about`,
    },
  ];


  const categories = [
    ["zh", "essay"],
    ["zh", "story"],
    ["zh", "tech"],
    ["en", "essay"],
    ["en", "story"],
    ["en", "tech"],
  ];


  const categoryUrls =
    categories.map(
      ([lang, category]) => {

        const categoryPosts =
          posts.filter(
            post =>
              post.lang === lang &&
              post.category === category
          );


        const latestCategoryPost =
          categoryPosts.length > 0
            ? new Date(
                Math.max(
                  ...categoryPosts.map(
                    post =>
                      new Date(
                        post.updatedAt
                      ).getTime()
                  )
                )
              )
            : undefined;


        return {
          url:
            `${baseUrl}/${lang}/${category}`,

          ...(latestCategoryPost
            ? {
                lastModified:
                  latestCategoryPost,
              }
            : {}),
        };

      }
    );


  const postUrls =
    posts.map(post => ({
      url:
        `${baseUrl}/${post.lang}/${post.category}/${post.id}`,

      lastModified:
        new Date(post.updatedAt),
    }));


  return [
    ...staticUrls,
    ...categoryUrls,
    ...postUrls,
  ];

}
