<script>
  import { link, navigate } from "../lib/router.js";
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  let expanded = $state(false);
  let menu = $state(false);
  const admin = $derived(
    Number($session.user?.level) === 1 || $session.user?.role === "admin",
  );
  async function logout() {
    try {
      await api.logout();
    } finally {
      session.set({ loading: false, user: null });
      notify("Logout successfully.");
      navigate("/login");
    }
  }
</script>

<header>
  <nav class="navbar navbar-dark bg-dark shadow-sm">
    <div class="container nav-inner">
      <a
        use:link
        class="navbar-brand"
        href={$session.user ? "/dashboard" : "/login"}>▣ FAHMYZZX PRO</a
      >
      <button
        class="navbar-toggler"
        onclick={() => (expanded = !expanded)}
        aria-label="Toggle navigation">☰</button
      >
      {#if $session.user}<div class:show={expanded} class="navbar-collapse">
          <div class="navbar-nav">
            <a use:link href="/keys">Keys</a><a use:link href="/keys/generate"
              >Generate</a
            >
          </div>
          <div class="dropdown">
            <button class="nav-user" onclick={() => (menu = !menu)}
              >◉ {$session.user.fullname || $session.user.username} ▾</button
            >
            {#if menu}<div class="dropdown-menu">
                <a use:link href="/settings">⚙ Settings</a>
                {#if admin}<div class="dropdown-divider"></div>
                  <span class="dropdown-label">Admin</span><a
                    use:link
                    href="/admin/users">♙ Manage Users</a
                  ><a use:link href="/admin/referrals">＋ Create Referral</a><a
                    use:link
                    href="/admin/files">⇧ Files</a
                  >{/if}
                <div class="dropdown-divider"></div>
                <button class="text-danger" onclick={logout}>← Logout</button>
              </div>{/if}
          </div>
        </div>{/if}
    </div>
  </nav>
</header>
