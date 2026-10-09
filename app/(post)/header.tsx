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
      <span className="inline-flex gap-[0.5em] font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-geist-sans)" }}>
        <span>{categoryName[0]}</span>
        <span>{categoryName[1]}</span>
      </span>
    ) : (
      <span className="font-normal tracking-[0.12em]" style={{ fontFamily: "var(--font-geist-sans)" }}>
        {categoryName}
      </span>
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
          leading-snug
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
          text-sm
          text-neutral-500
          dark:text-neutral-500
        "
      >

        <span
          className="
            rounded-xl
            px-1.5
            py-0.5
          "
        >
          By GANG
        </span>


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


        <Link
          href={`/${post.lang}/${post.category}`}
          className="
            rounded-xl
            px-1.5
            py-0.5
            !!!font-sans
            font-normal
            tracking-[0.12em]
            transition-colors
            hover:bg-neutral-200
            dark:hover:bg-neutral-700
            hover:text-neutral-800
            dark:hover:text-neutral-300
          "
        >
          {categoryContent}
        </Link>


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
          items-center
          justify-center
          gap-2
          whitespace-nowrap
          font-mono
          text-sm
          text-neutral-500
          dark:text-neutral-500
        "
      >

        <span
          className="
            rounded-xl
            px-1.5
            py-0.5
          "
        >
          By GANG
        </span>


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
          {
          showUpdated
            ? `updated ${updatedDate}`
            : publishedDate
        }
        </span>


        <span className="text-neutral-400">
          |
        </span>


        <Link
          href={`/${post.lang}/${post.category}`}
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
          {categoryContent}
        </Link>

      </div>

    </>
  );
}
