<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  import { navigate, link } from "../lib/router.js";
  import FieldError from "../components/FieldError.svelte";
  let form = $state({
    username: "",
    password: "",
    password2: "",
    referral: "",
  });
  let errors = $state({});
  let busy = $state(false);
  async function submit() {
    errors = {};
    if (form.password !== form.password2) {
      errors.password2 = "Passwords do not match.";
      return;
    }
    busy = true;
    try {
      await api.register(form);
      notify("Register successfully!");
      navigate("/login");
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
      <div class="card-header h5 p-3">Register</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {#each [["username", "Username", "text", "Your username"], ["password", "Password", "password", "Your password"], ["password2", "Confirm Password", "password", "Confirm password"], ["referral", "Referral Code", "text", "Referral code"]] as item}<label
            >{item[1]}<input
              type={item[2]}
              class="form-control mt-2"
              bind:value={form[item[0]]}
              minlength={item[0] === "username" ? 4 : 6}
              maxlength="25"
              required
              placeholder={item[3]}
            /></label
          ><FieldError {errors} name={item[0]} />{/each}
        <button class="btn btn-outline-secondary" disabled={busy}
          >→ {busy ? "Registering…" : "Register"}</button
        >
      </form>
    </div>
    <p class="after-card">
      Already have an account? <a use:link href="/login">Login here</a>
    </p>
  </div>
</div>
