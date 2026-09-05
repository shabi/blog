"use client";

import { useEffect, useState } from "react";


export function ViewCounter({
  id,
}: {
  id: string;
}) {

  const [views, setViews] =
    useState(0);


  useEffect(() => {


  fetch(`/api/view?id=${id}&incr=1`)
    .then(res => res.json())
    .then(data => {

      setViews(
        Number(data.views ?? 0)
      );

    })
    .catch(() => {

      setViews(0);

    });

}, [id]);


  return (
    <span>
      {views}
    </span>
  );

}