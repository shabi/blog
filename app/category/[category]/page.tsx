import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts } from "@/app/get-posts";


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


export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    category: string;
  }>;

  searchParams: Promise<{
    lang?: string;
  }>;
}) {


  const { category } = await params;

  const { lang } = await searchParams;


  const posts = await getPosts();


  // 分类页：旧 -> 新
  const filteredPosts = [...posts]
    .filter(
      post =>
        post.category === category &&
        (!lang || post.lang === lang)
    )
    .reverse();


  if (filteredPosts.length === 0) {
    notFound();
  }


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
          tracking-wide
          text-neutral-500
          dark:text-neutral-400
        "
      >
        {title}
      </div>


      <ul>

        {filteredPosts.map(post => (

          <li
            key={post.id}
            className="mb-4"
          >

            <Link
              href={`/${post.id}?from=category`}
              className="
                text-lg
                font-semibold

                hover:bg-neutral-200
                dark:hover:bg-neutral-700

                active:bg-neutral-300
                dark:active:bg-neutral-600

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

            </Link>

          </li>

        ))}

      </ul>


    </main>

  );
}
