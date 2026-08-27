<script>
  import { link, navigate } from "../lib/router.js";
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  let expanded = $state(false);
  let menu = $state(false);
  const admin = $derived(Number($session.user?.level) === 1 || $session.user?.role === "admin");
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
  <nav class="navbar navbar-expand-md navbar-dark bg-dark shadow-sm align-middle">
    <div class="container nav-inner">
      <a use:link class="navbar-brand" href="/dashboard">▣ Z TEAM</a>
      {#if $session.user}
        <button
          class="navbar-toggler"
          type="button"
          onclick={() => (expanded = !expanded)}
          aria-controls="navbarSupportedContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        ><span class="navbar-toggler-icon"></span></button>
        <div id="navbarSupportedContent" class:show={expanded} class="collapse navbar-collapse">
          <div class="navbar-nav nav-main">
            <a use:link href="/keys">Keys</a>
            <a use:link href="/keys/generate">Generate</a>
          </div>
          <div class="float-right">
            <div class="navbar-nav">
              <div class="nav-item dropdown">
                <button class="nav-link dropdown-toggle nav-user" onclick={() => (menu = !menu)} aria-expanded={menu}>
                  ◉ {$session.user.fullname || $session.user.username}
                </button>
                {#if menu}
                  <div class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
                    <a class="dropdown-item" use:link href="/settings">⚙ Settings</a>
                    <div class="dropdown-divider"></div>
                    {#if admin}
                      <span class="dropdown-item text-muted">Admin</span>
                      <a class="dropdown-item" use:link href="/admin/users">♙ manage Users</a>
                      <a class="dropdown-item" use:link href="/admin/referrals">＋ Create Referral</a>
                      <a class="dropdown-item" use:link href="/admin/files">⇧ Upload file</a>
                      <div class="dropdown-divider"></div>
                    {/if}
                    <button class="dropdown-item text-danger" onclick={logout}>← Logout</button>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </nav>
</header>
