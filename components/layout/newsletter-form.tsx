"use client";

import { ArrowUpRight } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-sm items-center gap-2 border-b border-mist-400/40 pb-3 lg:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        required
        placeholder="Your email address"
        className="w-full bg-transparent text-sm text-mist-100 placeholder:text-mist-400 focus:outline-none"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-400/50 text-gold-300 transition-transform duration-300 hover:scale-105 hover:border-gold-300"
      >
        <ArrowUpRight size={16} />
      </button>
    </form>
  );
}
