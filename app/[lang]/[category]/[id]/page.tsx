import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { compileMDX } from "next-mdx-remote/rsc";

import { Header } from "../../../(post)/header";
import { PostNavigation } from "../../../(post)/components/post-navigation";
import { mdxComponents } from "../../../(post)/components/mdx-components";
import { getPosts } from "../../../get-posts";


export const dynamic = "force-dynamic";


async function getPostFiles(
  dir = "posts"
): Promise<string[]> {

  const files: string[] = [];

  const entries =
    await fs.readdir(
      dir,
      {
        withFileTypes: true,
      }
    );


  for (const entry of entries) {

    const fullPath =
      path.join(
        dir,
        entry.name
      );


    if (entry.isDirectory()) {

      files.push(
        ...await getPostFiles(fullPath)
      );

    } else if (
      entry.isFile() &&
      entry.name.endsWith(".mdx")
    ) {

      files.push(fullPath);

    }

  }


  return files;
}



export async function generateStaticParams() {

  const files =
    await getPostFiles();


  return files.map(filePath => {

    const relative =
      path.relative(
        "posts",
        filePath
      );


    const parts =
      relative.split(path.sep);


    return {
      lang: parts[0],
      category: parts[1],
      id: parts[2].replace(
        /\.mdx$/,
        ""
      ),
    };

  });

}



async function getPostSource(
  lang: string,
  category: string,
  id: string
) {

  const filePath =
    path.join(
      "posts",
      lang,
      category,
      `${id}.mdx`
    );


  try {

    return await fs.readFile(
      filePath,
      "utf8"
    );

  } catch {

    return null;

  }

}



export async function generateMetadata({
  params,
}: {
  params: Promise<{
    lang: string;
    category: string;
    id: string;
  }>;
}): Promise<Metadata> {

  const {
    lang,
    category,
    id,
  } = await params;


  const posts =
    await getPosts();


  const post =
    posts.find(
      post =>
        post.id === id &&
        post.lang === lang &&
        post.category === category
    );


  if (!post) {
    return {};
  }


  const url =
    `https://blog.ohhoba.com/${lang}/${category}/${id}`;


  return {

    title:
      `${post.title} | GANG's BLOG`,

    description:
      post.description,

    alternates: {
      canonical: url,
    },

    openGraph: {

      title:
        post.title,

      description:
        post.description,

      type:
        "article",

      url,

      siteName:
        "GANG's BLOG",

      publishedTime:
        post.date,

      modifiedTime:
        post.updatedAt,

      images: [
        {
          url:
            post.image,
        },
      ],

    },

  };

}



export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    lang: string;
    category: string;
    id: string;
  }>;

  searchParams: Promise<{
    from?: string;
  }>;
}) {

  const {
    lang,
    category,
    id,
  } = await params;


  const { from } =
    await searchParams;


  const posts =
    await getPosts();


  const post =
    posts.find(
      post =>
        post.id === id &&
        post.lang === lang &&
        post.category === category
    );


  if (!post) {

    notFound();

  }


  const source =
    await getPostSource(
      lang,
      category,
      id
    );


  if (!source) {

    notFound();

  }


  const {
    content,
  } =
    await compileMDX({

      source,

      components:
        mdxComponents,

      options: {

        parseFrontmatter:
          true,

      },

    });


  return (

    <>

      <Header
        post={post}
      />

      {content}

      <PostNavigation
        id={post.id}
        from={from ?? "home"}
      />

    </>

  );

}
