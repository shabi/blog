export const dynamic = "force-dynamic";

import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";
import commaNumber from "comma-number";


export async function GET() {

  const posts =
    await getPosts();


  const viewsSum =
    posts.reduce(
      (sum, post) =>
        sum + post.views,
      0
    );


  return new ImageResponse(

    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          display: "flex",
          flexDirection: "column",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              marginBottom: 30,
            }}
          >
            Notes
          </div>


          <div
            style={{
              fontSize: 32,
              color: "#666",
            }}
          >
            Personal notes on design and technology
          </div>


          <div
            style={{
              fontSize: 32,
              color: "#666",
              marginTop: 20,
            }}
          >
            Experiments, ideas and creative explorations
          </div>


          <div
            style={{
              fontSize: 32,
              color: "#666",
              marginTop: 20,
            }}
          >
            A personal archive by OhHoBa
          </div>

        </div>


        <div
          style={{
            display: "flex",
            justifyContent: "center",
            fontSize: 28,
            color: "#666",
          }}
        >
          {posts.length} posts / {commaNumber(viewsSum)} views
        </div>


      </div>

    ),

    {
      width: 1200,
      height: 630,
    }

  );

}