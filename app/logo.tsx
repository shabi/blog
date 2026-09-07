"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

type LogoProps = {
  categoriesOpen: boolean;
  onToggleCategories: () => void;
};

export function Logo({
  categoriesOpen,
  onToggleCategories,
}: LogoProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const logoClass =
    "hover:bg-neutral-200 dark:hover:bg-neutral-700 active:bg-neutral-300 dark:active:bg-neutral-600 p-2 rounded-2xl -ml-2 transition-[background-color]";

  function refreshHome() {
    window.location.reload();
  }

  return (
    <span className="flex items-baseline whitespace-nowrap text-2xl font-bold md:items-center md:text-2xl">
      {isHome ? (
        <button
          onClick={refreshHome}
          className={logoClass}
        >
          GANG
        </button>
      ) : (
        <Link
          href="/"
          className={logoClass}
        >
          GANG
        </Link>
      )}

      <button
        type="button"
        aria-label={categoriesOpen ? "Hide categories" : "Show categories"}
        aria-expanded={categoriesOpen}
        onClick={onToggleCategories}
        className="ml-1 hidden h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 md:inline-flex"
      >
        {categoriesOpen ? (
          <ChevronUp
            size={16}
            className="
              md:h-5
              md:w-5
            "
            strokeWidth={2}
          />
        ) : (
          <ChevronDown
            size={16}
            className="
              md:h-5
              md:w-5
            "
            strokeWidth={2}
          />
        )}
      </button>
    </span>
  );
}
