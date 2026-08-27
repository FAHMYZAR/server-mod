<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  import { navigate } from "../lib/router.js";
  let { id } = $props();
  let user = $state(null);
  $effect(() =>
    api
      .user(id)
      .then((v) => (user = v.user || v.data || v))
      .catch((e) => notify(e.message, "danger")),
  );
  async function submit() {
    try {
      await api.updateUser(id, user);
      notify("Account successfully updated.");
      navigate("/admin/users");
    } catch (e) {
      notify(e.message, "danger");
    }
  }
</script>

{#if user}<div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header bg-dark text-white">
          Edit Account · {user.username}
        </div>
        <form
          class="card-body"
          onsubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div class="row">
            {#each [["username", "Username", "text"], ["fullname", "Fullname", "text"], ["saldo", "Saldo", "number"], ["uplink", "Uplink", "text"]] as f}<label
                class="col-md-6"
                >{f[1]}<input
                  class="form-control"
                  type={f[2]}
                  bind:value={user[f[0]]}
                /></label
              >{/each}<label class="col-md-6"
              >Roles<select class="form-select" bind:value={user.level}
                ><option value={1}>Admin</option><option value={2}
                  >Reseller</option
                ></select
              ></label
            ><label class="col-md-6"
              >Status<select class="form-select" bind:value={user.status}
                ><option value={1}>Active</option><option value={0}
                  >Banned/Block</option
                ></select
              ></label
            >
          </div>
          <button class="btn btn-outline-dark"
            >Update Account Information</button
          >
        </form>
      </div>
    </div>
  </div>{/if}
