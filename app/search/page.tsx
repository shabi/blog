import Link from "next/link";
import { SearchResultLink } from "./search-result-link";
import fs from "fs";
import path from "path";

type SearchSnippet = {
  text: string;
  paragraph: string;
  occurrenceInParagraph: number;
  occurrenceInDocument: number;
};

type SearchResult = {
  id: string;
  title: string;
  snippets: SearchSnippet[];
};

function stripMarkdown(text: string) {
  return text
    .replace(/^---[\s\S]*?---\s*/m, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\r?\n+/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function getTitle(content: string) {
  const match = content.match(
    /^---\s*([\s\S]*?)\s*---/
  );

  if (!match) return "";

  const titleMatch = match[1].match(
    /^title:\s*["']?(.+?)["']?\s*$/m
  );

  return titleMatch?.[1] ?? "";
}

function splitParagraphs(content: string) {
  return content
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.replace(/\s+/g, " ").trim()
    )
    .filter(Boolean);
}

function getSnippets(
  paragraphs: string[],
  query: string,
) {
  const snippets: SearchSnippet[] = [];
  const lowerQuery = query.toLowerCase();
  let occurrenceInDocument = 0;

  for (const paragraph of paragraphs) {
    const lowerParagraph =
      paragraph.toLowerCase();

    const isChinese =
      /[\u4e00-\u9fff]/.test(query);

    const limit = isChinese ? 40 : 80;

    let from = 0;
    let occurrenceInParagraph = 0;

    const usedWindows: {
      start: number;
      end: number;
    }[] = [];

    while (true) {
      const matchIndex =
        lowerParagraph.indexOf(
          lowerQuery,
          from,
        );

      if (matchIndex === -1) {
        break;
      }

      let start =
        matchIndex -
        Math.floor(
          (limit - query.length) / 2,
        );

      start = Math.max(0, start);

      let end = start + limit;

      if (end > paragraph.length) {
        end = paragraph.length;
        start = Math.max(
          0,
          end - limit,
        );
      }

      const alreadyCovered =
        usedWindows.some(
          (window) =>
            matchIndex >= window.start &&
            matchIndex + query.length <=
              window.end,
        );

      if (!alreadyCovered) {
        snippets.push({
          text: paragraph.slice(
            start,
            end,
          ),
          paragraph,
          occurrenceInParagraph,
          occurrenceInDocument,
        });

        usedWindows.push({
          start,
          end,
        });
      }

      occurrenceInParagraph++;
      occurrenceInDocument++;

      from =
        matchIndex + query.length;
    }
  }

  return snippets;
}

function getResults(
  query: string,
): SearchResult[] {
  const postsDir =
    path.join(
      process.cwd(),
      "posts",
    );

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const files =
    fs
      .readdirSync(postsDir)
      .filter((file) =>
        file.endsWith(".mdx")
      );

  const results: SearchResult[] = [];

  for (const file of files) {
    const raw =
      fs.readFileSync(
        path.join(postsDir, file),
        "utf8",
      );

    const title =
      getTitle(raw) ||
      file.replace(
        /\.mdx$/,
        "",
      );

    const content =
      stripMarkdown(raw);

    const paragraphs =
      splitParagraphs(content);

    const snippets =
      getSnippets(
        paragraphs,
        query,
      );

    if (snippets.length === 0) {
      continue;
    }

    results.push({
      id: file.replace(
        /\.mdx$/,
        "",
      ),
      title,
      snippets,
    });
  }

  return results;
}

function Highlight({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const value =
    query.trim();

  if (!value) {
    return <>{text}</>;
  }

  const escaped =
    value.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );

  return (
    <>
      {text
        .split(
          new RegExp(
            `(${escaped})`,
            "gi",
          ),
        )
        .map(
          (part, index) =>
            part.toLowerCase() ===
            value.toLowerCase() ? (
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
              <span key={index}>
                {part}
              </span>
            ),
        )}
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const params =
    await searchParams;

  const query =
    params.q?.trim() ?? "";

  const results =
    query
      ? getResults(query)
      : [];

  return (
    <main className="pb-24 pt-4">
      <div
        className="
          mb-8
          text-sm
          text-neutral-500
          dark:text-neutral-400
        "
      >
        Search: {query}
      </div>

      <div className="space-y-10">
        {results.map((result) => (
          <section key={result.id}>
            <Link
              href={`/${result.id}?from=search`}
              className="
                mb-4
                inline-block
                rounded-xl
                px-2
                py-1
                text-2xl
                font-medium
                text-neutral-800
                transition-colors
                hover:bg-neutral-200
                dark:text-neutral-100
                dark:hover:bg-neutral-700
              "
            >
              {result.title}
            </Link>

            <div className="space-y-1">
              {result.snippets.map(
                (snippet, index) => {
                  const storageKey =
                    `search-context:${result.id}:${query}:${snippet.occurrenceInDocument}`;

                  return (
                    <SearchResultLink
                      key={`${result.id}-${snippet.occurrenceInParagraph}-${index}`}
                      href={`/${result.id}?from=search&search=${encodeURIComponent(
                        query,
                      )}&match=${snippet.occurrenceInDocument}`}
                      storageKey={storageKey}
                      paragraph={snippet.paragraph}
                      className="
                        block
                        rounded-xl
                        px-3
                        py-2
                        text-base
                        leading-relaxed
                        text-neutral-700
                        transition-colors
                        hover:bg-neutral-200
                        dark:text-neutral-300
                        dark:hover:bg-neutral-700
                      "
                    >
                      <span className="mr-2 text-xs text-neutral-400 dark:text-neutral-500">
                        {index + 1}.
                      </span>

                      <Highlight
                        text={snippet.text}
                        query={query}
                      />
                    </SearchResultLink>
                  );
                },
              )}
            </div>
          </section>
        ))}
      </div>

      {results.length === 0 &&
        query && (
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            No results
          </div>
        )}
    </main>
  );
}
