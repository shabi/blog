"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export function Logo() {

  const pathname = usePathname();

  const isHome = pathname === "/";


  const logoClass =
    "hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 p-2 rounded-2xl -ml-2 transition-[background-color]";


  function refreshHome() {
    window.location.reload();
  }


  const logoText = (
    <>
      {/* 手机 */}
      <span className="md:hidden">
        GANG
      </span>

      {/* 电脑 */}
      <span className="hidden md:inline">
        GANG's BLOG
      </span>
    </>
  );


  return (

    <span className="text-base md:text-2xl whitespace-nowrap font-bold">

      {isHome ? (

        <button
          onClick={refreshHome}
          className={logoClass}
        >
          {logoText}
        </button>

      ) : (

        <Link
          href="/"
          className={logoClass}
        >
          {logoText}
        </Link>

      )}

    </span>

  );

}
