<script>
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { navigate, link } from "../lib/router.js";
  import FieldError from "../components/FieldError.svelte";
  let username = $state("");
  let password = $state("");
  let stay_log = $state(false);
  let showPassword = $state(false);
  let errors = $state({});
  let busy = $state(false);
  async function submit() {
    busy = true;
    errors = {};
    try {
      const result = await api.login({
        username,
        password,
        stay_log: stay_log ? "yes" : "",
      });
      session.set({ loading: false, user: result.user || result });
      navigate("/dashboard");
    } catch (e) {
      errors = e.details;
      notify(e.message, "danger");
    } finally {
      busy = false;
    }
  }
</script>

<main class="auth-page">
  <section class="auth-card" aria-labelledby="login-title">
    <div class="auth-brand">
      <div class="brand-mark" aria-hidden="true">FZ</div>
      <p class="eyebrow">Secure key management</p>
      <h1 id="login-title">Welcome back</h1>
      <p class="auth-subtitle">Sign in to manage your keys, devices, and account.</p>
    </div>
    <form
      class="auth-form"
      onsubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label for="username">Username</label>
      <input id="username" class="form-control" bind:value={username} minlength="4" maxlength="25" required autocomplete="username" placeholder="Enter your username" />
      <FieldError {errors} name="username" />

      <label for="password">Password</label>
      <div class="password-field">
        <input id="password" type={showPassword ? "text" : "password"} class="form-control" bind:value={password} minlength="6" maxlength="45" required autocomplete="current-password" placeholder="Enter your password" />
        <button type="button" class="password-toggle" onclick={() => (showPassword = !showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button>
      </div>
      <FieldError {errors} name="password" />

      <label class="form-check remember"><input type="checkbox" bind:checked={stay_log} /> Stay signed in</label>
      <button class="btn auth-submit" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button>
    </form>
    <p class="after-card">New here? <a use:link href="/register">Create an account</a></p>
  </section>
</main>
