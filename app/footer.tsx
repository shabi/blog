"use client";

import { usePathname } from "next/navigation";
import { A } from "./(post)/components/a";

export function Footer() {
  const pathname = usePathname();

  const isChinese = pathname.startsWith("/zh");

  return (
    <footer className="p-6 pt-3 pb-6 flex text-xs text-center mt-3 dark:text-gray-400 text-gray-500 font-mono">
      <div className="grow" />

      <div>
        <A
          target="_blank"
          href="https://github.com/rauchg/blog"
        >
          {isChinese ? "源码" : "Source"}
        </A>
      </div>
    </footer>
  );
}
