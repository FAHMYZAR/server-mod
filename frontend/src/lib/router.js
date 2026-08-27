import { writable } from "svelte/store";

const normalize = (path) =>
  path === "/" ? "/login" : path.replace(/\/$/, "") || "/login";
export const route = writable(normalize(location.pathname));

export function navigate(path, { replace = false } = {}) {
  const next = normalize(path);
  history[replace ? "replaceState" : "pushState"]({}, "", next);
  route.set(next);
  scrollTo({ top: 0, behavior: "smooth" });
}

export function link(node) {
  const click = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      node.target === "_blank"
    )
      return;
    const url = new URL(node.href);
    if (url.origin !== location.origin) return;
    event.preventDefault();
    navigate(url.pathname + url.search);
  };
  node.addEventListener("click", click);
  return { destroy: () => node.removeEventListener("click", click) };
}

addEventListener("popstate", () => route.set(normalize(location.pathname)));
