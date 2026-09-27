"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function NotFoundRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}
