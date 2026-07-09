"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-left hover:text-red-600"
    >
      Abmelden
    </button>
  );
}
