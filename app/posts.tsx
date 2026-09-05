import Link from "next/link";
import type { Post } from "./get-posts";


const categoryNames = {

  tech: {
    zh: "技术",
    en: "TECH",
  },

  essays: {
    zh: "随笔",
    en: "ESSAY",
  },

  stories: {
    zh: "故事",
    en: "STORY",
  },

};


export function Posts({
  posts,
}: {
  posts: Post[];
}) {

  return (

    <main
      className="
        mb-10
      "
    >

      <List posts={posts} />

    </main>

  );

}


function List({
  posts,
}: {
  posts: Post[];
}) {

  return (

    <ul>

      {posts.map((post, i: number) => {


        const category =
          categoryNames[
            post.category as keyof typeof categoryNames
          ]?.[
            post.lang === "zh"
              ? "zh"
              : "en"
          ]
          ?? "ESSAY";


        const previousCategory =
          posts[i - 1]
            ? categoryNames[
                posts[i - 1].category as keyof typeof categoryNames
              ]?.[
                posts[i - 1].lang === "zh"
                  ? "zh"
                  : "en"
              ]
              ?? posts[i - 1].category
            : null;


        const firstOfCategory =
          previousCategory !== category;


        return (

          <li
            key={post.id}
          >

            <span
              className="
                flex
                py-3
              "
            >

              <span
                className={`
                  flex
                  grow
                  items-center
                  ${!firstOfCategory ? "ml-16" : ""}
                `}
              >


                {firstOfCategory && (

                  <span
                    className="
                      w-16
                      shrink-0
                      text-sm
                      tracking-wide
                      text-neutral-500
                      dark:text-neutral-400
                    "
                  >

                    <Link
                      href={`/category/${post.category}?lang=${post.lang}`}
                      className="group/category"
                    >

                      <span
                        className="
                          inline-flex
                          w-16

                          group-hover/category:bg-neutral-200
                          dark:group-hover/category:bg-neutral-700

                          group-active/category:bg-neutral-300
                          dark:group-active/category:bg-neutral-600

                          transition-all
                          rounded-xl
                          py-0.5
                          px-1.5
                        "
                      >

                        {category}

                      </span>

                    </Link>

                  </span>

                )}


                <span
                  className={`
                    grow
                    text-lg
                    leading-snug
                    ${post.lang === "zh" ? "font-semibold" : "font-medium"}
                    dark:text-gray-100
                  `}
                >

                  <Link
  href={`/${post.id}?from=home`}
  className="
    group/title
    block
    w-full
  "
>

                    <span
                      className="
                        group-hover/title:bg-neutral-200
                        dark:group-hover/title:bg-neutral-700

                        group-active/title:bg-neutral-300
                        dark:group-active/title:bg-neutral-600

                        transition-all
                        rounded-xl
                        py-0.5
                        px-1.5
                        uppercase
                        tracking-wide
                      "
                      style={{
                        wordSpacing: "0.10em",
                      }}
                    >

                      {post.title}

                    </span>

                  </Link>

                </span>


              </span>

            </span>

          </li>

        );

      })}

    </ul>

  );

}
