import Link from "next/link";
import type { Post } from "./get-posts";


const categoryNames = {

  tech: {
    zh: "技术",
    en: "TECH",
  },

  essay: {
    zh: "随笔",
    en: "ESSAY",
  },

  story: {
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
        pt-4
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
                py-4
              "
            >

              <span
                className={`
                  flex
                  grow
                  items-center
                  
                `}
              >



                <span
                  className={`
                    flex
                    grow
                    w-full
                    items-end
                    text-2xl
                    leading-snug
                    font-medium
                    dark:text-gray-100
                  `}
                >
                  <Link
                    href={`/${post.id}?from=home`}
                    className="
                      flex
                      w-full
                      items-baseline
                      group/title
                    "
                  >
                    <span
                      className={`
                        inline-flex
                        items-baseline
                        gap-3
                        origin-center
                        ${post.id === posts[0]?.id
                          ? "animate-[latestHint_3s_ease-in-out_1.5s_1]"
                          : ""}
                      `}
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

                      {post.id === posts[0]?.id && (
                        <span
                          className="
                            shrink-0
                            font-mono
                            text-[12px]
                            tracking-wide
                            text-neutral-500
                            dark:text-neutral-400
                          "
                        >
                          {(() => {
                            const date = new Date(post.updatedAt);
                            return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}.${date.getFullYear()}`;
                          })()}
                        </span>
                      )}
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
