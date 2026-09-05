"use client";

import dynamic from "next/dynamic";

const AboutScene = dynamic(
  () => import("./about-scene"),
  {
    ssr: false,
  },
);

export default function AboutSceneWrapper() {
  return <AboutScene />;
}
