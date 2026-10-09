import { Posts } from "../../posts";
import { ScrollTop } from "../../scroll-top";
import { Pagination } from "../../pagination";
import { getHomePosts } from "../../get-home-posts";
import { notFound } from "next/navigation";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{
    page: string;
  }>;
}) {
  const {
    page: pageParam,
  } = await params;


  const page = Number(pageParam);


  if (!page || page < 2) {
    notFound();
  }


  const {
    posts,
    totalPages,
    latestPostId,
  } = await getHomePosts(
    page,
    10,
  );


  if (page > totalPages) {
    notFound();
  }


  return (
    <>
      <Posts
        posts={posts}
        latestPostId={latestPostId}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
      />

      <ScrollTop />
    </>
  );
}
