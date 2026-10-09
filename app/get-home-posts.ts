import { getPosts, type Post } from "./get-posts";


export async function getHomePosts(
  page = 1,
  limit = 10,
) {
  const allPosts = (await getPosts()).sort((a, b) => {
    if (a.id === "welcome" && b.id !== "welcome") return 1;
    if (b.id === "welcome" && a.id !== "welcome") return -1;

    const updatedDiff =
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime();

    if (updatedDiff !== 0) return updatedDiff;

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const totalPages = Math.ceil(
    allPosts.length / limit
  );

  const start =
    (page - 1) * limit;

  const posts = allPosts.slice(
    start,
    start + limit,
  );


  return {
    posts,
    totalPages,
    currentPage: page,
    latestPostId: allPosts[0]?.id ?? null,
  };
}
