<script>
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { navigate, link } from "../lib/router.js";
  import FieldError from "../components/FieldError.svelte";
  let username = $state("");
  let password = $state("");
  let stay_log = $state(false);
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

<div class="row justify-content-center auth-page">
  <div class="col-lg-4">
    <div class="card shadow-sm">
      <div class="card-header h5 p-3">Login</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label
          >Username<input
            class="form-control mt-2"
            bind:value={username}
            minlength="4"
            maxlength="25"
            required
            placeholder="Your username"
          /></label
        ><FieldError {errors} name="username" />
        <label
          >Password<input
            type="password"
            class="form-control mt-2"
            bind:value={password}
            minlength="6"
            maxlength="45"
            required
            placeholder="Your password"
          /></label
        ><FieldError {errors} name="password" />
        <label class="form-check"
          ><input type="checkbox" bind:checked={stay_log} /> Stay login?</label
        ><button class="btn btn-outline-secondary" disabled={busy}
          >→ {busy ? "Logging in…" : "Log in"}</button
        >
      </form>
    </div>
    <p class="after-card">
      Don't have an account yet? <a use:link href="/register">Register here</a>
    </p>
  </div>
</div>
