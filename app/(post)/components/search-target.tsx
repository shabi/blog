"use client";

import { useEffect } from "react";

function clearHighlight() {
  const marks =
    document.querySelectorAll(
      "[data-search-highlight]",
    );

  marks.forEach((mark) => {
    const parent = mark.parentNode;

    if (!parent) return;

    while (mark.firstChild) {
      parent.insertBefore(
        mark.firstChild,
        mark,
      );
    }

    parent.removeChild(mark);
    parent.normalize();
  });
}

function findAndHighlight(
  element: HTMLElement,
  query: string,
  occurrenceTarget: number,
) {
  const walker =
    document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
    );

  const lowerQuery =
    query.toLowerCase();

  let occurrence = 0;

  while (walker.nextNode()) {
    const node =
      walker.currentNode as Text;

    const parent =
      node.parentElement;

    if (
      parent?.closest(
        "script, style, code, pre",
      )
    ) {
      continue;
    }

    const text =
      node.textContent ?? "";

    const lowerText =
      text.toLowerCase();

    let from = 0;

    while (true) {
      const index =
        lowerText.indexOf(
          lowerQuery,
          from,
        );

      if (index === -1) {
        break;
      }

      if (
        occurrence ===
        occurrenceTarget
      ) {
        const range =
          document.createRange();

        range.setStart(
          node,
          index,
        );

        range.setEnd(
          node,
          index + query.length,
        );

        const mark =
          document.createElement(
            "mark",
          );

        mark.setAttribute(
          "data-search-highlight",
          "true",
        );

        mark.style.backgroundColor =
          "rgb(229 229 229)";

        mark.style.color =
          "inherit";

        mark.style.borderRadius =
          "0.25rem";

        mark.style.paddingLeft =
          "0.125rem";

        mark.style.paddingRight =
          "0.125rem";

        range.surroundContents(
          mark,
        );

        requestAnimationFrame(() => {
          mark.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });

        return true;
      }

      occurrence++;

      from =
        index + query.length;
    }
  }

  return false;
}

export function SearchTarget() {
  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    const query =
      params.get("search")?.trim() ?? "";

    const matchParam =
      params.get("match");

    if (
      !query ||
      matchParam === null
    ) {
      return;
    }

    const occurrence =
      Number(matchParam);

    if (
      Number.isNaN(occurrence) ||
      occurrence < 0
    ) {
      return;
    }

    const content =
      document.querySelector(
        "[data-post-content]",
      ) as HTMLElement | null;

    if (!content) {
      return;
    }

    findAndHighlight(
      content,
      query,
      occurrence,
    );

    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target as Node | null;

      const mark =
        document.querySelector(
          "[data-search-highlight]",
        );

      if (
        mark &&
        target &&
        !mark.contains(target)
      ) {
        clearHighlight();
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  return null;
}
