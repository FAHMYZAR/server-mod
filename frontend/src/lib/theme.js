import { writable } from "svelte/store";

const stored = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
export const theme = writable(stored === "light" || stored === "dark" ? stored : "system");

export function applyTheme(value) {
  const dark = value === "dark" || (value === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#111827" : "#212529");
  if (value === "system") localStorage.removeItem("theme");
  else localStorage.setItem("theme", value);
}
