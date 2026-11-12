"use client";

import { create } from "zustand";
import type { Cart } from "@/commerce/types";

type UIState = {
  cartOpen: boolean;
  menuOpen: boolean;
  cart: Cart | null;
  setCartOpen: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
  setCart: (c: Cart | null) => void;
};

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  menuOpen: false,
  cart: null,
  setCartOpen: (cartOpen) => set({ cartOpen, menuOpen: false }),
  setMenuOpen: (menuOpen) => set({ menuOpen, cartOpen: false }),
  setCart: (cart) => set({ cart }),
}));
