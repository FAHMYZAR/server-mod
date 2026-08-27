import { writable } from "svelte/store";

export const session = writable({ loading: true, user: null });
export const notices = writable([]);

let noticeId = 0;
export function notify(message, type = "success", timeout = 5000) {
  const id = ++noticeId;
  notices.update((items) => [...items, { id, message, type }]);
  if (timeout) setTimeout(() => dismiss(id), timeout);
  return id;
}
export function dismiss(id) {
  notices.update((items) => items.filter((item) => item.id !== id));
}
