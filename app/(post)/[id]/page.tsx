import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";

import { Header } from "../header";
import { PostNavigation } from "../components/post-navigation";
import { mdxComponents } from "../components/mdx-components";
import { getPosts } from "../../get-posts";


export const dynamic = "force-dynamic";



export async function generateStaticParams() {

  const files =
    await fs.readdir(
      "posts"
    );


  return files
    .filter(
      file =>
        file.endsWith(".mdx")
    )
    .map(
      file => ({
        id: file.replace(
          /\.mdx$/,
          ""
        ),
      })
    );

}



async function getPostSource(
  id: string
) {

  const filePath =
    path.join(
      "posts",
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
    id: string;
  }>;
}) {


  const { id } =
    await params;


  const source =
    await getPostSource(id);



  if (!source) {

    return {};

  }



  const { data } =
    matter(source);



  return {

    title:
      `${data.title} | GANG's BLOG`,


    description:
      data.description ?? "",


    openGraph: {

      title:
        data.title,


      description:
        data.description ?? "",


      type:
        "article",


      url:
        `https://blog.ohhoba.com/${id}`,


      siteName:
        "GANG's BLOG",


      images: [
        {
          url:
            data.image ??
            "/opengraph-image",
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
    id: string;
  }>;

  searchParams: Promise<{
    from?: string;
  }>;
}) {


  const { id } =
    await params;


  const { from } =
    await searchParams;



  const posts =
    await getPosts();



  const post =
    posts.find(
      post =>
        post.id === id
    );



  if (!post) {

    notFound();

  }



  const source =
    await getPostSource(id);



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