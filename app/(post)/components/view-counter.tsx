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


  fetch(`/api/view?id=${id}&incr=1`)
    .then(res => res.json())
    .then(data => {

      setViews(
        Number(data.views ?? 0)
      );

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