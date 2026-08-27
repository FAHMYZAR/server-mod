<script>
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import FieldError from "../components/FieldError.svelte";
  let passwords = $state({ current: "", password: "", password2: "" });
  let fullname = $state($session.user?.fullname || "");
  let errors = $state({});
  let busy = $state("");
  async function passwordSubmit() {
    errors = {};
    if (passwords.password !== passwords.password2) {
      errors.password2 = "Passwords do not match.";
      return;
    }
    busy = "password";
    try {
      await api.updatePassword(passwords);
      passwords = { current: "", password: "", password2: "" };
      notify("Password successfully changed.");
    } catch (e) {
      errors = e.details;
      notify(e.message, "danger");
    } finally {
      busy = "";
    }
  }
  async function profileSubmit() {
    busy = "profile";
    try {
      const result = await api.updateProfile({ fullname });
      session.update((s) => ({
        ...s,
        user: { ...s.user, ...(result.user || result), fullname },
      }));
      notify("Account details successfully changed.");
    } catch (e) {
      errors = e.details;
      notify(e.message, "danger");
    } finally {
      busy = "";
    }
  }
</script>

<div class="row">
  <div class="col-lg-6">
    <div class="card mb-3">
      <div class="card-header bg-primary text-white">Change Password</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          passwordSubmit();
        }}
      >
        {#each [["current", "Current Password"], ["password", "New Password"], ["password2", "Confirm Password"]] as f}<label
            >{f[1]}<input
              type="password"
              class="form-control mt-2"
              bind:value={passwords[f[0]]}
              minlength="6"
              required
            /></label
          ><FieldError {errors} name={f[0]} />{/each}<button
          class="btn btn-outline-primary"
          disabled={busy}>Change Password</button
        >
      </form>
    </div>
  </div>
  <div class="col-lg-6">
    <div class="card mb-3">
      <div class="card-header bg-dark text-white">Account Information</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          profileSubmit();
        }}
      >
        <label
          >Full Name<input
            class="form-control mt-2"
            bind:value={fullname}
            minlength="4"
            maxlength="155"
            required
          /></label
        ><FieldError {errors} name="fullname" /><button
          class="btn btn-dark"
          disabled={busy}>Update Account</button
        >
      </form>
    </div>
  </div>
</div>
