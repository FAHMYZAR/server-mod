const BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(
  path,
  { method = "GET", body, query, signal, headers = {} } = {},
) {
  const url = new URL(`${BASE}${path}`, location.origin);
  Object.entries(query || {}).forEach(
    ([key, value]) =>
      value !== undefined && value !== "" && url.searchParams.set(key, value),
  );
  const isForm = body instanceof FormData;
  const response = await fetch(url, {
    method,
    signal,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(isForm ? {} : body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  const type = response.headers.get("content-type") || "";
  const data =
    response.status === 204
      ? null
      : type.includes("json")
        ? await response.json()
        : await response.text();
  if (!response.ok)
    throw new ApiError(
      data?.message || data?.error || `Request failed (${response.status})`,
      response.status,
      data?.errors || {},
    );
  return data;
}
const list = (value) => value?.items ?? value?.files ?? value?.data ?? value ?? [];
export const api = {
  session: () => request("/session"),
  login: (data) => request("/login", { method: "POST", body: data }),
  register: (data) => request("/register", { method: "POST", body: data }),
  logout: () => request("/logout", { method: "POST" }),
  dashboard: () => request("/dashboard"),
  updatePassword: (data) =>
    request("/settings", { method: "PATCH", body: data }),
  updateProfile: (data) =>
    request("/settings", { method: "PATCH", body: data }),
  keys: (query = {}) =>
    request("/keys", { query: { limit: 100, ...query } }).then(list),
  key: (id) => request(`/keys/${encodeURIComponent(id)}`),
  generateKeys: (data) =>
    request("/keys/generate", { method: "POST", body: data }),
  updateKey: (id, data) =>
    request(`/keys/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  resetKey: (id) =>
    request(`/keys/${encodeURIComponent(id)}/reset`, { method: "POST" }),
  deleteKey: (id) =>
    request(`/keys/${encodeURIComponent(id)}`, { method: "DELETE" }),
  users: (query = {}) =>
    request("/users", { query: { limit: 100, ...query } }).then(list),
  user: (id) => request(`/users/${encodeURIComponent(id)}`),
  updateUser: (id, data) =>
    request(`/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: data,
    }),
  referrals: () => request("/referrals").then(list),
  createReferral: (data) =>
    request("/referrals", { method: "POST", body: data }),
  files: () => request("/uploads").then(list),
  upload: (file) => {
    const body = new FormData();
    body.append("file", file);
    return request("/uploads", { method: "POST", body });
  },
  deleteFile: (name) =>
    request(`/uploads/${encodeURIComponent(name)}`, { method: "DELETE" }),
  downloadUrl: (name) => `${BASE}/uploads/${encodeURIComponent(name)}`,
};

export function downloadText(text, filename = "key.txt") {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const anchor = Object.assign(document.createElement("a"), {
    href: url,
    download: filename,
  });
  anchor.click();
  URL.revokeObjectURL(url);
}
