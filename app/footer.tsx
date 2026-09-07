"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { A } from "./(post)/components/a";
import { ExternalLink } from "lucide-react";

const VISITOR_SESSION_KEY = "site-visitor-counted";

export function Footer() {
  const pathname = usePathname();
  const [visits, setVisits] = useState<{
    total: number;
    today: number;
  } | null>(null);

  const isChinese = pathname.startsWith("/zh");
  const isHome =
    pathname === "/" || pathname === "/zh";

  useEffect(() => {
    if (!isHome) return;

    const counted =
      sessionStorage.getItem(
        VISITOR_SESSION_KEY,
      );

    const fetchVisits = async (
      increment: boolean,
    ) => {
      try {
        const url = increment
          ? "/api/visits?incr=1"
          : "/api/visits";

        const res = await fetch(url);
        const data = await res.json();

        setVisits({
          total: Number(data.visits ?? 0),
          today: Number(data.today ?? 0),
        });
      } catch {
        setVisits(null);
      }
    };

    if (counted === "1") {
      fetchVisits(false);
      return;
    }

    sessionStorage.setItem(
      VISITOR_SESSION_KEY,
      "1",
    );

    fetchVisits(true);
  }, [isHome]);

  return (
    <footer
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        bg-[#fcfcfc]/80
        dark:bg-[#1C1C1C]/80
        backdrop-blur
        px-6
        pt-3
        pb-6
        text-xs
        font-mono
        text-gray-500
        dark:text-gray-400
      "
    >
      <div className="mx-auto flex max-w-[800px] items-center justify-between px-4">
        {isHome ? (
          <div className="flex items-center">
            <span>
              Visitors:{" "}
              {visits === null ? "..." : visits.total}
            </span>

            <span className="ml-4">
              Today:{" "}
              {visits === null ? "..." : visits.today}
            </span>
          </div>
        ) : (
          <div />
        )}

        <div>
          <A
            target="_blank"
            href="https://ohhoba.com"
            className="!border-b-0"
          >
            <span className="md:hidden inline-flex items-center gap-1">
              OhHoBa
              <ExternalLink
                size={14}
                strokeWidth={2}
              />
            </span>

            <span className="hidden md:inline">
              Source
            </span>
          </A>
        </div>
      </div>
    </footer>
  );
}
