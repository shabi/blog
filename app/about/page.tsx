"use client";

import Image from "next/image";
import { useState } from "react";

export default function AboutPage() {
  const [zoomed, setZoomed] = useState(false);

  return (
    <main className="relative min-h-[88dvh] md:min-h-[900px] w-full overflow-x-clip">
      <div
        className={`absolute left-1/2 top-[60px] md:top-[2px] -translate-x-1/2 transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.7,.2,1)] ${
          zoomed ? "scale-[2.2] md:scale-[1.8] translate-y-[10vh] md:translate-y-[calc(14vh+30px)]" : "scale-[1.1]"
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
        className={`absolute left-1/2 top-[400px] md:top-[670px] -translate-x-1/2 text-center transition-all duration-1000 ease-out ${
          zoomed
            ? "translate-y-0 opacity-100 delay-[1200ms]"
            : "translate-y-5 opacity-0 delay-0"
        }`}
      >
        <p className="text-[20px] font-normal leading-[1.55] tracking-[0.2em] text-gray-400 dark:text-gray-100">
          <span className="whitespace-nowrap dark:hidden">
            {"「  CALL ME GANG.  」"}
          </span>

          <span className="hidden whitespace-nowrap dark:inline-block">
            {"「  I'LL GO ON.  」"}
          </span>
        </p>
      </div>
    </main>
  );
}
