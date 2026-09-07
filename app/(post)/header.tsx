"use client";

import type { Post } from "@/app/get-posts";
import { ViewCounter } from "./components/view-counter";
import Link from "next/link";
import { useState } from "react";


export function Header({
  post,
}: {
  post: Post;
}) {

  const [showPublishedDate, setShowPublishedDate] =
    useState(false);


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


  const categoryName =
    post.lang === "zh"
      ? post.category === "essay"
        ? ["随", "笔"]
        : post.category === "story"
        ? ["故", "事"]
        : ["技", "术"]
      : post.category.toUpperCase();


  const categoryContent =
    Array.isArray(categoryName) ? (
      <span className="inline-flex gap-[0.5em]">
        <span>{categoryName[0]}</span>
        <span>{categoryName[1]}</span>
      </span>
    ) : (
      categoryName
    );


  return (
    <>

      <div
        className="
          mb-3
          flex
          items-center
          justify-center
          text-2xl
          font-medium
          uppercase
          dark:text-gray-100
        "
      >
        <h1 className="text-center">
          {post.title}
        </h1>
      </div>


      <div
        className="
          hidden
          md:flex
          items-center
          justify-center
          gap-2
          font-mono
          text-xs
          text-neutral-500
          dark:text-neutral-500
        "
      >

        <Link
          href={`/category/${post.category}?lang=${post.lang}`}
          className="
            relative
            inline-block
            rounded-xl
            px-1.5
            py-0.5
            text-sm
            font-normal
            tracking-[0.12em]
            font-sans
            text-neutral-500
            dark:text-neutral-400
            transition-colors

            after:absolute
            after:left-1.5
            after:right-1.5
            after:bottom-[2px]
            after:h-px
            after:bg-current
            after:content-['']

            hover:after:opacity-0
            hover:bg-neutral-200
            dark:hover:bg-neutral-700
          "
        >
          {categoryContent}
        </Link>


        <span className="text-neutral-400">
          |
        </span>


        <a
          href="mailto:admin@ohhoba.com"
          className="
            rounded-xl
            px-1.5
            py-0.5
            transition-colors
            hover:bg-neutral-200
            dark:hover:bg-neutral-700
            hover:text-neutral-800
            dark:hover:text-neutral-300
          "
        >
          @GANG
        </a>


        <span className="text-neutral-400">
          |
        </span>


        {showUpdated ? (
          <span
            className="
              rounded-xl
              px-1.5
              py-0.5
              cursor-default
            "
            onMouseEnter={() => setShowPublishedDate(true)}
            onMouseLeave={() => setShowPublishedDate(false)}
          >
            {showPublishedDate
              ? publishedDate
              : `updated ${updatedDate}`}
          </span>
        ) : (
          <span
            className="
              rounded-xl
              px-1.5
              py-0.5
            "
          >
            {publishedDate}
          </span>
        )}


        <span className="text-neutral-400">
          |
        </span>


        <span
          className="
            rounded-xl
            px-1.5
            py-0.5
          "
        >
          Views{" "}
          <ViewCounter
            id={post.id}
          />
        </span>

      </div>


      <div
        className="
          flex
          md:hidden
          justify-center
          items-center
          whitespace-nowrap
          font-mono
          text-sm
          text-neutral-500
          dark:text-neutral-500
        "
      >

        <Link
          href={`/category/${post.category}?lang=${post.lang}`}
          className="
            relative
            rounded-none
            px-1
            py-0.5
            text-sm
            font-normal
            tracking-[0.12em]
            font-sans
            text-neutral-500
            dark:text-neutral-400
            transition-colors

            after:absolute
            after:left-0
            after:right-0
            after:bottom-0
            after:h-px
            after:bg-current
            after:content-['']

          "
        >
          {categoryContent}
        </Link>


        {" · updated "}


        {updatedDate ?? publishedDate}


        {" · Views "}


        <ViewCounter
          id={post.id}
        />

      </div>

    </>
  );
}
