import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";


export function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {

  if (totalPages <= 1) {
    return null;
  }


  return (
    <nav
      className="
        mt-12
        flex
        items-center
        justify-center
        gap-2
        text-base
        text-neutral-500
        dark:text-neutral-400
      "
    >

      <Link
        href={
          currentPage > 1
            ? currentPage === 2
              ? "/"
              : `/page/${currentPage - 1}`
            : "#"
        }
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          transition-colors

          ${
            currentPage > 1
              ? "hover:bg-neutral-200 dark:hover:bg-neutral-700"
              : "pointer-events-none opacity-30"
          }
        `}
      >
        <ChevronLeft
          size={20}
          strokeWidth={2}
        />
      </Link>


      {Array.from(
        { length: totalPages },
        (_, i) => i + 1
      ).map((page) => (
        <Link
          key={page}
          href={
            page === 1
              ? "/"
              : `/page/${page}`
          }
          className={`
            flex
            h-10
            min-w-[40px]
            px-3
            items-center
            justify-center
            rounded-xl
            transition-colors

            ${
              page === currentPage
                ? "bg-neutral-200 dark:bg-neutral-700"
                : "hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }
          `}
        >
          <span className="px-1">
            {page}
          </span>
        </Link>
      ))}


      <Link
        href={
          currentPage < totalPages
            ? `/page/${currentPage + 1}`
            : "#"
        }
        className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          transition-colors

          ${
            currentPage < totalPages
              ? "hover:bg-neutral-200 dark:hover:bg-neutral-700"
              : "pointer-events-none opacity-30"
          }
        `}
      >
        <ChevronRight
          size={20}
          strokeWidth={2}
        />
      </Link>

    </nav>
  );
}
