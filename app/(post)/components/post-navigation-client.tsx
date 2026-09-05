"use client";

import { useSearchParams } from "next/navigation";
import { PostNavigationWrapper } from "./post-navigation-wrapper";


export function PostNavigationClient({
  id,
}: {
  id: string;
}) {

  const searchParams =
    useSearchParams();


  const from =
    searchParams.get("from")
    ?? "home";


  return (
    <PostNavigationWrapper
      id={id}
      from={from}
    />
  );

}