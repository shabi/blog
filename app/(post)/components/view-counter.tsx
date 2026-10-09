
"use client";

import { useEffect, useState } from "react";


export function ViewCounter({
  id,
}: {
  id: string;
}) {

  const [views, setViews] =
    useState<number | null>(null);


  useEffect(() => {

    const key =
      `viewed:${id}`;


    const viewed =
      sessionStorage.getItem(key);


    const url =
      viewed
        ? `/api/view?id=${id}`
        : `/api/view?id=${id}&incr=1`;


    fetch(url)
      .then(res => res.json())
      .then(data => {

        setViews(
          Number(data.views ?? 0)
        );


        if (!viewed) {

          sessionStorage.setItem(
            key,
            "1"
          );

        }

      })
      .catch(() => {

        setViews(null);

      });


  }, [id]);


  return (
    <span>
      {views ?? "..."}
    </span>
  );

}
