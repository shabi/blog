"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  ExternalLink,
  UserRoundPen,
  Search,
  X,
  Menu,
} from "lucide-react";

const categories = [
  { label: "ESSAY", href: "/category/essay?lang=en", chinese: false },
  { label: "STORY", href: "/category/story?lang=en", chinese: false },
  { label: "TECH", href: "/category/tech?lang=en", chinese: false },
  { label: "随笔", href: "/category/essay?lang=zh", chinese: true },
  { label: "故事", href: "/category/story?lang=zh", chinese: true },
  { label: "技术", href: "/category/tech?lang=zh", chinese: true },
];

type SearchResult = {
  id: string;
  title: string;
  snippets: string[];
};

function hasValidSearchQuery(value: string) {
  const query = value.trim();

  const chineseCount =
    (query.match(/[\u4e00-\u9fff]/g) ?? []).length;

  const englishCount =
    (query.match(/[A-Za-z]/g) ?? []).length;

  return chineseCount >= 1 || englishCount >= 2;
}

function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) {
    return <>{text}</>;
  }

  const escapedQuery = query.trim().replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const parts = text.split(
    new RegExp(`(${escapedQuery})`, "gi")
  );

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <mark
            key={index}
            className="
              rounded
              bg-neutral-200
              px-0.5
              text-neutral-900
              dark:bg-neutral-700
              dark:text-neutral-100
            "
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export function Header() {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) return;

    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  async function runSearch() {
    const value = query.trim();

    if (!hasValidSearchQuery(value)) {
      setResults([]);
      setSearched(true);
      return;
    }

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(value)}`
      );

      if (!response.ok) {
        setResults([]);
        setSearched(true);
        return;
      }

      const data = await response.json();

      const searchResults = Array.isArray(data) ? data : [];

      if (searchResults.length > 0) {
        router.push(
          `/search?q=${encodeURIComponent(value)}`
        );
        return;
      }

      setResults([]);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    }
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    runSearch();
  }

  function openSearch() {
    setSearchOpen(true);
    setCategoriesOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-50
        -mx-6
        px-6
        bg-[#fcfcfc]/80
        dark:bg-[#1C1C1C]/80
        backdrop-blur
        overflow-x-clip
      "
    >
      <div className="flex items-center py-4">
        <Logo
          categoriesOpen={categoriesOpen}
          onToggleCategories={() => {
            setCategoriesOpen((value) => !value);
            setSearchOpen(false);
          }}
        />

        <nav
          className="
            relative
            grow
            flex
            items-center
            justify-end
            md:justify-end
            pl-0
            text-sm
            md:pl-0
            md:text-base
          "
        >
          <Link
            href="/about"
            className={`group p-1.5 md:p-2 ${
              searchOpen ? "invisible" : ""
            }`}
          >
            <span className="inline-flex items-center rounded-xl px-1.5 py-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
              <span>ABOUT</span>
              <UserRoundPen
                size={18}
                strokeWidth={2}
                className="ml-1 inline-block"
              />
            </span>
          </Link>

          <a
            href="mailto:admin@ohhoba.com"
            className={`group inline-flex items-center whitespace-nowrap p-1.5 md:p-2 ${
              searchOpen ? "invisible" : ""
            }`}
          >
            <span className="inline-flex items-center gap-1 rounded-xl px-1.5 py-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
              <span>CONTACT</span>
              <Mail
                size={18}
                strokeWidth={2}
                className="inline-block"
              />
            </span>
          </a>

          <a
            href="https://ohhoba.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`group hidden items-center whitespace-nowrap p-1 md:inline-flex md:p-2 ${
              searchOpen ? "invisible" : ""
            }`}
          >
            <span className="inline-flex items-center gap-1 rounded-xl px-1.5 py-0.5 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
              <span>OhHoBa</span>
              <ExternalLink
                size={16}
                strokeWidth={2}
                className="hidden md:inline-block"
              />
            </span>
          </a>

          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search"}
            onClick={searchOpen ? closeSearch : openSearch}
            className="
              relative
              z-30
              ml-0
              md:ml-1
              hidden
              h-8
              w-8
              md:inline-flex
              shrink-0
              items-center
              justify-center
              rounded-xl
              transition-colors
              hover:bg-neutral-200
              dark:hover:bg-neutral-700
            "
          >
            {searchOpen ? (
              <X size={16} strokeWidth={2} />
            ) : (
              <Search size={16} strokeWidth={2} />
            )}
          </button>

          <button
            type="button"
            aria-label={categoriesOpen ? "Hide categories" : "Show categories"}
            aria-expanded={categoriesOpen}
            onClick={() => {
              setCategoriesOpen((value) => !value);
              setSearchOpen(false);
            }}
            className="
              ml-1
              inline-flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl

              transition-colors
              hover:bg-neutral-200

              dark:hover:bg-neutral-700
              md:hidden
            "
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          <div
            className={`
              absolute
              right-0
              top-1/2
              z-20
              hidden
              md:block
              -translate-y-1/2
              transition-all
              duration-300
              ease-out
              ${
                searchOpen
                  ? "w-[min(420px,calc(100vw-120px))] opacity-100"
                  : "pointer-events-none w-0 opacity-0"
              }
            `}
          >
            <div
              className="
                flex
                h-8
                items-center
                overflow-hidden
                rounded-xl
                bg-[#fcfcfc]/95
                dark:bg-[#1C1C1C]/95
                backdrop-blur
              "
            >
              <Search
                size={16}
                strokeWidth={2}
                className="ml-2 shrink-0 text-neutral-400"
              />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearched(false);
                  setResults([]);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search"
                className="
                  h-full
                  min-w-0
                  flex-1
                  bg-transparent
                  px-2
                  text-sm
                  outline-none
                  placeholder:text-neutral-400
                "
              />
            </div>

            {searched && (
              <div
                className="
                  fixed
                  left-0
                  right-0
                  top-[3.2rem]
                  mx-auto
                  w-full
                  max-w-[800px]
                  rounded-xl
                  bg-[#fcfcfc]/95
                  py-1
                  shadow-sm
                  dark:bg-[#1C1C1C]/95
                  backdrop-blur
                "
              >
                {!hasValidSearchQuery(query) ? (
                  <div className="px-3 py-3 text-base text-neutral-500 dark:text-neutral-400">
                    At least 2 characters
                  </div>
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <Link
                      key={result.id}
                      href={`/${result.id}?from=search`}
                      onClick={closeSearch}
                      className="
                        block
                        px-3
                        py-3
                        transition-colors
                        hover:bg-neutral-200
                        dark:hover:bg-neutral-700
                      "
                    >
                      <div className="text-sm font-medium">
                        <Highlight
                          text={result.title}
                          query={query}
                        />
                      </div>

                      {result.snippets.length > 0 && (
                        <div className="mt-2 space-y-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
                          {result.snippets.map(
                            (snippet, index) => (
                              <p key={index}>
                                <Highlight
                                  text={snippet}
                                  query={query}
                                />
                              </p>
                            )
                          )}
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="px-3 py-3 text-base text-neutral-500 dark:text-neutral-400">
                    No results
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          categoriesOpen
            ? "max-h-24 pb-3 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="
            mx-auto
            grid
            w-full
            max-w-[360px]
            grid-cols-3
            place-items-center
            gap-y-3
            text-center
            text-xs
            tracking-[0.12em]
            text-neutral-500
            dark:text-neutral-400
            md:flex
            md:w-auto
            md:max-w-xl
            md:justify-center
            md:gap-6
            md:text-sm
          "
          aria-label="Categories"
        >
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              onClick={() => setCategoriesOpen(false)}
              className="
                relative
                inline-flex
                w-[59px]
                justify-center
                rounded-xl
                px-2
                py-1
                text-sm
                font-normal
                tracking-[0.12em]
                text-neutral-500
                dark:text-neutral-400
                bg-neutral-100
                dark:bg-neutral-800
                transition-colors
                md:bg-transparent
                md:dark:bg-transparent
                hover:bg-neutral-200
                dark:hover:bg-neutral-700
              "
            >
              {category.chinese ? (
                <span className="inline-flex gap-[0.5em]">
                  <span>{category.label[0]}</span>
                  <span>{category.label[1]}</span>
                </span>
              ) : (
                category.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
