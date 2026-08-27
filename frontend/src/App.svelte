<script>
  import { onMount } from "svelte";
  import { route, navigate } from "./lib/router.js";
  import { api } from "./lib/api.js";
  import { session } from "./lib/session.js";
  import Layout from "./components/Layout.svelte";
  import AlertStack from "./components/AlertStack.svelte";
  import Login from "./pages/Login.svelte";
  import Register from "./pages/Register.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Settings from "./pages/Settings.svelte";
  import Keys from "./pages/Keys.svelte";
  import Generate from "./pages/Generate.svelte";
  import KeyEdit from "./pages/KeyEdit.svelte";
  import AdminUsers from "./pages/AdminUsers.svelte";
  import AdminUserEdit from "./pages/AdminUserEdit.svelte";
  import Referrals from "./pages/Referrals.svelte";
  import Files from "./pages/Files.svelte";
  import NotFound from "./pages/NotFound.svelte";
  let ready = $state(false);
  const aliases = {
    "/": "/login",
    "/admin/manage-users": "/admin/users",
    "/admin/create-referral": "/admin/referrals",
    "/admin/upload_form": "/admin/files",
    "/admin/list_files": "/admin/files",
  };
  let current = $derived(aliases[$route] || $route.replace(/^\/admin\/user\//, "/admin/users/"));
  const publicRoutes = ["/login", "/register"];
  onMount(async () => {
    let user = null;

    try {
      const result = await api.session();
      user = result.user || result;
    } catch {
      user = null;
    }

    session.set({ loading: false, user });

    if (!user && !publicRoutes.includes($route)) {
      navigate("/login", { replace: true });
    } else if (user && publicRoutes.includes($route)) {
      navigate("/dashboard", { replace: true });
    }

    ready = true;
  });
  $effect(() => {
    if (!ready) return;

    if (!$session.user && !publicRoutes.includes(current)) {
      navigate("/login", { replace: true });
    } else if ($session.user && publicRoutes.includes(current)) {
      navigate("/dashboard", { replace: true });
    } else if (current.startsWith("/admin/") && Number($session.user?.level) !== 1) {
      navigate("/dashboard", { replace: true });
    }
  });
  function page() {
    if (current === "/login") return Login;
    if (current === "/register") return Register;
    if (current === "/dashboard") return Dashboard;
    if (current === "/settings") return Settings;
    if (current === "/keys") return Keys;
    if (current === "/keys/generate") return Generate;
    if (current.startsWith("/keys/")) return KeyEdit;
    if (current === "/admin/users") return AdminUsers;
    if (current.startsWith("/admin/users/")) return AdminUserEdit;
    if (current === "/admin/referrals") return Referrals;
    if (current === "/admin/files") return Files;
    return NotFound;
  }
  const Component = $derived(page());
  const pageProps = $derived(
    current.startsWith("/keys/")
      ? { id: current.split("/")[2] }
      : current.startsWith("/admin/users/")
        ? { id: current.split("/")[3] }
        : {},
  );
  const isPublic = $derived(publicRoutes.includes(current));
  const canRenderRoute = $derived(isPublic || Boolean($session.user));
</script>

<AlertStack />
{#if !ready}
  <div class="loading full-screen">Loading…</div>
{:else if !canRenderRoute}
  <Login />
{:else if isPublic}
  <Component {...pageProps} />
{:else}
  <Layout><Component {...pageProps} /></Layout>
{/if}
