import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatIndex(n: number) {
  return n.toString().padStart(2, "0");
}
