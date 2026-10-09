import { Posts } from "./posts";
import { getHomePosts } from "./get-home-posts";
import { Pagination } from "./pagination";
import { ScrollTop } from "./scroll-top";

export const revalidate = 300;

export default async function Home() {
  const {
    posts,
    totalPages,
    latestPostId,
  } = await getHomePosts(
    1,
    10,
  );

  return (
    <>
      <Posts
        posts={posts}
        latestPostId={latestPostId}
      />

      <Pagination
        currentPage={1}
        totalPages={totalPages}
      />

      <ScrollTop />
    </>
  );
}
