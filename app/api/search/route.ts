import { NextResponse } from "next/server";
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
    .replace(/\r?\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function getTitle(content: string) {
  const match = content.match(/^---\s*([\s\S]*?)\s*---/);

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

function createSnippet(
  paragraph: string,
  query: string,
  matchIndex: number,
) {
  const isChinese =
    /[\u4e00-\u9fff]/.test(query);

  const limit = isChinese ? 40 : 80;

  if (paragraph.length <= limit) {
    return paragraph;
  }

  let start =
    matchIndex -
    Math.floor(
      (limit - query.length) / 2
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

  let result =
    paragraph.slice(start, end);

  if (start > 0) {
    result = "…" + result;
  }

  if (end < paragraph.length) {
    result += "…";
  }

  return result;
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

    let from = 0;
    let occurrenceInParagraph = 0;
    const usedRanges: {
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

      const isChinese =
        /[\u4e00-\u9fff]/.test(query);

      const limit = isChinese ? 40 : 80;

      let windowStart =
        matchIndex -
        Math.floor(
          (limit - query.length) / 2
        );

      windowStart = Math.max(
        0,
        windowStart,
      );

      let windowEnd =
        windowStart + limit;

      if (
        windowEnd >
        paragraph.length
      ) {
        windowEnd =
          paragraph.length;

        windowStart = Math.max(
          0,
          windowEnd - limit,
        );
      }

      const duplicated =
        usedRanges.some(
          (range) =>
            matchIndex >= range.start &&
            matchIndex + query.length <=
              range.end
        );

      if (!duplicated) {
        snippets.push({
          text: createSnippet(
            paragraph,
            query,
            matchIndex,
          ),
          paragraph,
          occurrenceInParagraph,
          occurrenceInDocument,
        });

        usedRanges.push({
          start: windowStart,
          end: windowEnd,
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

export async function GET(
  request: Request,
) {
  const { searchParams } =
    new URL(request.url);

  const query =
    searchParams.get("q")?.trim() ?? "";

  const chineseCount =
    (query.match(/[\u4e00-\u9fff]/g) ?? [])
      .length;

  const englishCount =
    (query.match(/[A-Za-z]/g) ?? [])
      .length;

  if (
    chineseCount < 1 &&
    englishCount < 2
  ) {
    return NextResponse.json([]);
  }

  const postsDir =
    path.join(
      process.cwd(),
      "posts",
    );

  if (!fs.existsSync(postsDir)) {
    return NextResponse.json([]);
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
      file.replace(/\.mdx$/, "");

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

  return NextResponse.json(results);
}
