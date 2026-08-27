<script>
  import { link, navigate } from "../lib/router.js";
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { theme } from "../lib/theme.js";

  let expanded = $state(false);
  let menu = $state(false);

  const admin = $derived(
    Number($session.user?.level) === 1 || $session.user?.role === "admin",
  );

  function closeNavigation() {
    expanded = false;
    menu = false;
  }

  function toggleTheme() {
    theme.set($theme === "dark" ? "light" : "dark");
  }

  async function logout() {
    closeNavigation();
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
  <nav class="navbar shadow-sm" aria-label="Main navigation">
    <div class="container nav-inner">
      <a use:link class="navbar-brand" href="/dashboard" onclick={closeNavigation}>
        <span class="nav-logo" aria-hidden="true">FZ</span>
        <span>FAHMYZZX PRO</span>
      </a>

      {#if $session.user}
        <button
          class:active={expanded}
          class="navbar-toggler"
          onclick={() => (expanded = !expanded)}
          aria-expanded={expanded}
          aria-controls="main-menu"
          aria-label={expanded ? "Close navigation" : "Open navigation"}
        >
          <span></span><span></span><span></span>
        </button>

        <div id="main-menu" class:show={expanded} class="navbar-collapse">
          <div class="mobile-user">
            <span class="user-avatar">{$session.user.fullname?.[0] || $session.user.username?.[0] || "U"}</span>
            <span><strong>{$session.user.fullname || $session.user.username}</strong><small>{$session.user.username}</small></span>
          </div>

          <div class="navbar-nav">
            <a use:link href="/dashboard" onclick={closeNavigation}>Dashboard</a>
            <a use:link href="/keys" onclick={closeNavigation}>Keys</a>
            <a use:link href="/keys/generate" onclick={closeNavigation}>Generate</a>
            <a use:link class="mobile-only" href="/settings" onclick={closeNavigation}>Settings</a>
            {#if admin}
              <span class="mobile-nav-label">Administration</span>
              <a use:link class="mobile-only" href="/admin/users" onclick={closeNavigation}>Manage Users</a>
              <a use:link class="mobile-only" href="/admin/referrals" onclick={closeNavigation}>Create Referral</a>
              <a use:link class="mobile-only" href="/admin/files" onclick={closeNavigation}>Files</a>
            {/if}
          </div>

          <div class="nav-actions">
            <button class="theme-toggle" onclick={toggleTheme} aria-label="Toggle color theme" title="Toggle color theme">
              <span>{$theme === "dark" ? "☀" : "☾"}</span><span class="mobile-only">{$theme === "dark" ? "Light mode" : "Dark mode"}</span>
            </button>
            <div class="dropdown desktop-user">
              <button class="nav-user" onclick={() => (menu = !menu)} aria-expanded={menu}>
                <span class="user-avatar">{$session.user.fullname?.[0] || $session.user.username?.[0] || "U"}</span>
                {$session.user.fullname || $session.user.username} ▾
              </button>
              {#if menu}
                <div class="dropdown-menu">
                  <a use:link href="/settings" onclick={closeNavigation}>Settings</a>
                  {#if admin}
                    <div class="dropdown-divider"></div>
                    <span class="dropdown-label">Admin</span>
                    <a use:link href="/admin/users" onclick={closeNavigation}>Manage Users</a>
                    <a use:link href="/admin/referrals" onclick={closeNavigation}>Create Referral</a>
                    <a use:link href="/admin/files" onclick={closeNavigation}>Files</a>
                  {/if}
                  <div class="dropdown-divider"></div>
                  <button class="text-danger" onclick={logout}>Logout</button>
                </div>
              {/if}
            </div>
            <button class="mobile-logout mobile-only" onclick={logout}>Logout</button>
          </div>
        </div>
      {/if}
    </div>
  </nav>
</header>
