"use client";

import Link from "next/link";

type SearchResultLinkProps = {
  href: string;
  storageKey: string;
  paragraph: string;
  children: React.ReactNode;
  className?: string;
};

export function SearchResultLink({
  href,
  storageKey,
  paragraph,
  children,
  className,
}: SearchResultLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        sessionStorage.setItem(storageKey, paragraph);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
