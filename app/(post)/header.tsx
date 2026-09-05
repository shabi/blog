import type { Post } from "@/app/get-posts";
import { ViewCounter } from "./components/view-counter";


export function Header({
  post,
}: {
  post: Post;
}) {


  const publishedDate =
    post.date.slice(0, 10);


  const updatedDate =
    post.updatedAt
      ? new Intl.DateTimeFormat(
          "sv-SE",
          {
            timeZone: "Asia/Shanghai",
          }
        ).format(
          new Date(post.updatedAt)
        )
      : null;


  const showUpdated =
    updatedDate &&
    updatedDate !== publishedDate;


  return (

    <>

      <h1
        className="
          text-2xl
          font-bold
          mb-1
          uppercase
          dark:text-gray-100
        "
      >
        {post.title}
      </h1>


      <p
        className="
          font-mono
          flex
          flex-col
          md:flex-row
          md:justify-between
          md:items-center
          gap-1
          text-xs
          text-neutral-500
          dark:text-neutral-500
        "
      >

        <span>

          <span className="hidden md:inline">

            <a
              href="mailto:admin@ohhoba.com"
              className="
                hover:text-neutral-800
                dark:hover:text-neutral-400
              "
            >
              @GANG
            </a>


            <span className="mx-2">
              |
            </span>

          </span>


          {publishedDate}


          {showUpdated && (

            <>

              {" · updated "}

              {updatedDate}

            </>

          )}

        </span>


        <span>

          Views{" "}

          <ViewCounter
            id={post.id}
          />

        </span>


      </p>


    </>

  );

}