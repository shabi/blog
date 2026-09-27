import Link from "next/link";
import type { Metadata } from "next";
import { getPosts } from "@/app/get-posts";


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


export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}): Promise<Metadata> {

  const { lang, category } = await params;

  const categoryName =
    categoryNames[
      category as keyof typeof categoryNames
    ]?.[
      lang === "zh" ? "zh" : "en"
    ] ?? category;

  return {
    title: `${categoryName} | GANG's BLOG`,
    description: `GANG's BLOG — ${categoryName}`,
    alternates: {
      canonical: `/${lang}/${category}`,
    },
    openGraph: {
      title: `${categoryName} | GANG's BLOG`,
      description: `GANG's BLOG — ${categoryName}`,
      url: `/${lang}/${category}`,
      type: "website",
    },
  };
}


export default async function Page({
  params,
}: {
  params: Promise<{
    lang: string;
    category: string;
  }>;
}) {


  const {
    lang,
    category,
  } = await params;


  const posts = await getPosts();


  // 分类页：旧 -> 新
  const filteredPosts = [...posts]
    .filter(
      post =>
        post.category === category &&
        post.lang === lang
    )
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    );


  const title =
    categoryNames[
      category as keyof typeof categoryNames
    ]?.[
      lang === "zh" ? "zh" : "en"
    ]
    ?? category;


  return (

    <main
      className="
        mb-10
      "
    >

      <div
        className="
          mb-6
          text-sm
          font-normal
          tracking-wide
          text-neutral-500
          dark:text-neutral-400
        "
      >
        {lang === "zh" && title.length === 2 ? (
          <span className="inline-flex gap-[0.5em]">
            <span>{title[0]}</span>
            <span>{title[1]}</span>
          </span>
        ) : (
          title
        )}
      </div>


      <ul>

        {filteredPosts.map((post, index) => {

          const year =
            post.date.slice(0, 4);

          const previousYear =
            index > 0
              ? filteredPosts[index - 1].date.slice(0, 4)
              : null;

          const showYear =
            year !== previousYear;


          return (

            <li
              key={post.id}
              className="mb-4"
            >

              <Link
                href={`/${post.lang}/${post.category}/${post.id}?from=category`}
                className="
                  flex
                  w-full
                  items-center
                  group/title
                "
              >

                <span
                  className="
                    w-12
                    shrink-0
                    text-xs
                    font-mono
                    text-neutral-500
                    dark:text-neutral-400
                  "
                >
                  {showYear ? year : ""}
                </span>


                <span
                  className="
                    rounded-xl
                    py-0.5
                    px-1.5
                    text-2xl
                    font-medium
                    leading-snug
                    uppercase
                    tracking-wide
                    dark:text-gray-100

                    group-hover/title:bg-neutral-200
                    dark:group-hover/title:bg-neutral-700

                    group-active/title:bg-neutral-300
                    dark:group-active/title:bg-neutral-600

                    transition-all
                  "
                  style={{
                    wordSpacing: "0.10em",
                  }}
                >
                  {post.title}
                </span>

              </Link>

            </li>

          );

        })}

      </ul>


    </main>

  );
}
