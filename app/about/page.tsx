"use client";

import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <main className="relative min-h-[900px] w-full overflow-x-hidden">
      <div
        className={`absolute left-1/2 top-16 -translate-x-1/2 transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
          zoomed ? "scale-[2] translate-y-[10vh]" : "scale-100"
        }`}
      >
        <picture>
          <source
            media="(prefers-color-scheme: dark)"
            srcSet="/images/about-head-dark.png"
          />

          <Image
            src="/images/about-head.png"
            alt=""
            width={1105}
            height={1423}
            priority
            className="block h-auto w-[360px]"
          />

          <button
            type="button"
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
            onClick={() => setZoomed((value) => !value)}
            className="
              absolute
              left-1/2
              top-[53%]
              h-[370px]
              w-[300px]
              -translate-x-1/2
              -translate-y-1/2
              cursor-pointer
              rounded-[48%]
              bg-transparent
              outline-none
              focus:outline-none
              focus-visible:outline-none
            "
          />
        </picture>
      </div>

      <div
        className={`absolute left-1/2 top-[430px] sm:top-[690px] -translate-x-1/2 text-center transition-all duration-700 ${
          zoomed
            ? "translate-y-0 opacity-100"
            : "translate-y-5 opacity-0"
        }`}
      >
        <p className="whitespace-nowrap text-[20px] font-normal tracking-[0.2em] text-gray-400 dark:text-gray-100">
          <span className="dark:hidden">
            「CALL ME GANG.」
          </span>

          <span className="hidden dark:inline">
            「MY NAME IS GANG，
            <br />
            FOR I AM MANY ...」
          </span>
        </p>
      </div>
    </main>
  );
}
