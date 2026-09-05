export const revalidate = 300;

import { ImageResponse } from "next/og";
import { getPosts } from "@/app/get-posts";
import { readFileSync } from "fs";
import { join } from "path";


const fontsDir = join(process.cwd(), "fonts");


const geistSans = readFileSync(
  join(fontsDir, "geist-regular.ttf")
);


const geistSansMedium = readFileSync(
  join(fontsDir, "geist-medium.ttf")
);



const categoryNames = {
  tech: "Tech",
  essays: "Essays",
  stories: "Stories",
};



export async function GET() {

  const posts = await getPosts();


  return new ImageResponse(

    (
      <div
        tw="flex p-10 h-full w-full bg-white flex-col"
        style={font("Geist")}
      >

        <header tw="flex text-[36px] w-full">

          <div style={font("Geist Medium")}>
            GANG
          </div>


          <div tw="grow" />


          <div tw="text-[24px]">
            blog.ohhoba.com
          </div>

        </header>



        <main tw="flex mt-10 flex-col w-full">

          {posts.map((post) => (

            <div
              key={post.id}
              tw="flex py-3 text-[28px] w-full items-center"
            >

              <div tw="flex text-gray-500 w-32 text-[24px]">
                {
                  categoryNames[post.category]
                  || post.category
                }
              </div>


              <div tw="flex grow">
                {post.title}
              </div>


            </div>

          ))}

        </main>


      </div>
    ),

    {
      width: 1200,
      height: 630,

      fonts: [

        {
          name: "Geist",
          data: geistSans,
          weight: 400,
        },

        {
          name: "Geist Medium",
          data: geistSansMedium,
          weight: 500,
        },

      ],
    }

  );

}



// lil helper for more succinct styles
function font(fontFamily: string) {
  return { fontFamily };
}
