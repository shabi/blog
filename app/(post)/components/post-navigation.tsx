import Link from "next/link";
import { getPosts } from "../../get-posts";


export async function PostNavigation({
  id,
  from,
}: {
  id: string;
  from?: string;
}) {


  const posts = await getPosts();


  const currentPost =
    posts.find(
      post => post.id === id
    );


  if (!currentPost) {
    return null;
  }


  let list = posts;


  // 分类进入：按照分类时间轴（旧 -> 新）
  if (from === "category") {

    list = [...posts]
      .filter(
        post =>
          post.category === currentPost.category &&
          post.lang === currentPost.lang
      )
      .reverse();

  }


  const index =
    list.findIndex(
      post => post.id === id
    );


  const previous =
    list[index - 1];


  const next =
    list[index + 1];


  return (

    <nav
      className="
        flex
        justify-between
        mt-24
        mb-10
        text-xl
        font-medium
        tracking-wide
        text-neutral-500
        dark:text-neutral-400
      "
    >


      <div>

        {previous && (

          <Link
            href={`/${previous.id}?from=${from ?? "category"}`}
            className="
              inline-flex
              items-center
              rounded-xl
              px-2
              py-0.5
              transition-all

              hover:bg-neutral-200
              dark:hover:bg-neutral-700

              active:bg-neutral-300
              dark:active:bg-neutral-600
            "
          >

            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >

              <span aria-hidden="true">
                ‹
              </span>

              Previous

            </span>

          </Link>

        )}

      </div>


      <div>

        {next && (

          <Link
            href={`/${next.id}?from=${from ?? "category"}`}
            className="
              inline-flex
              items-center
              rounded-xl
              px-2
              py-0.5
              transition-all

              hover:bg-neutral-200
              dark:hover:bg-neutral-700

              active:bg-neutral-300
              dark:active:bg-neutral-600
            "
          >

            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >

              Next

              <span aria-hidden="true">
                ›
              </span>

            </span>

          </Link>

        )}

      </div>


    </nav>

  );

}
