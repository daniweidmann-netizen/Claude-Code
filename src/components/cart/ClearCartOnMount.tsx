"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClearCartOnMount() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/cart", { method: "DELETE" }).finally(() => router.refresh());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
