export const dynamic = "force-dynamic";

import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";


export async function GET(
  _req: Request,
  props: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  const {
    id,
  } = await props.params;


  const posts =
    await getPosts();


  const post =
    posts.find(
      p => p.id === id
    );


  if (!post) {

    return new Response(
      "Not found",
      {
        status: 404,
      }
    );

  }


  return new ImageResponse(

    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >

        <div
          style={{
            display: "flex",
            fontSize: 36,
          }}
        >
          OhHoBa
        </div>


        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          {post.title}
        </div>


        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#666666",
          }}
        >
          {post.date}
        </div>


      </div>

    ),

    {
      width: 1200,
      height: 630,
    }

  );

}