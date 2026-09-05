import postsData from "./posts.generated.json";
import redis from "./redis";
import commaNumber from "comma-number";


export type Post = {

  id: string;

  date: string;

  updatedAt: string;

  title: string;

  description: string;

  image: string;

  tags: string[];

  lang: string;

  category: string;

  views: number;

  viewsFormatted: string;

};



type Views = {

  [key: string]: string;

};



export const getPosts = async (
  lang?: string
): Promise<Post[]> => {


  let allViews: Views = {};



  if (redis) {

    try {

      allViews =
        (await redis.hgetall("views")) ?? {};

    } catch {

      allViews = {};

    }

  }



  const posts = postsData.posts

    .filter(
      post =>
        !lang ||
        post.lang === lang
    )

    .map((post): Post => {


      const views =
        Number(
          allViews[post.id] ?? 0
        );



      return {

        id: post.id,

        date: post.date,

        title: post.title,

        description: post.description,

        image: post.image,

        tags: post.tags,

        lang: post.lang,

        category: post.category,


        updatedAt:
          "updatedAt" in post && post.updatedAt
            ? post.updatedAt
            : post.date,


        views,


        viewsFormatted:
          commaNumber(views),

      };

    });



  return posts;

};
