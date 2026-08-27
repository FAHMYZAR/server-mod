# FAHMYZZX PRO frontend

Svelte 5 + Vite single-page migration of the legacy CodeIgniter UI. It is intentionally isolated from `OLDSOURCE/` and uses a cookie-authenticated JSON API configured with `VITE_API_BASE_URL` (default `/api`).

## Routes

Public: `/login`, `/register`.
Authenticated: `/dashboard`, `/keys`, `/keys/generate`, `/keys/:id`, `/settings`.
Admin: `/admin/users`, `/admin/users/:id`, `/admin/referrals`, `/admin/files`.

The expected API resources are documented by the methods in `src/lib/api.js`; adapt the backend adapter to the existing server without coupling the frontend to PHP. No install, build, or test commands were run.
