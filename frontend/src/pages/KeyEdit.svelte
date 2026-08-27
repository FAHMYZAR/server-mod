<script>
  import { api } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { navigate } from "../lib/router.js";
  let { id } = $props();
  let key = $state(null);
  let original = "";
  let loading = $state(true);
  const admin = $derived(
    Number($session.user?.level) === 1 || $session.user?.role === "admin",
  );
  const dirty = $derived(key && JSON.stringify(key) !== original);
  $effect(() => {
    api
      .key(id)
      .then((v) => {
        key = v.key || v.data || v;
        key.devices = Array.isArray(key.devices)
          ? key.devices.join("\n")
          : (key.devices || "").replaceAll(",", "\n");
        key.expired_date = key.expired_date
          ? String(key.expired_date).replace(" ", "T").slice(0, 16)
          : "";
        original = JSON.stringify(key);
      })
      .catch((e) => {
        notify(e.message, "danger");
        navigate("/keys");
      })
      .finally(() => (loading = false));
  });
  async function submit() {
    try {
      const payload = admin
        ? {
            ...key,
            devices: String(key.devices || "")
              .split(/\r?\n/)
              .filter(Boolean),
          }
        : { status: key.status };
      await api.updateKey(id, payload);
      original = JSON.stringify(key);
      notify("User key successfully updated!");
    } catch (e) {
      notify(e.message, "danger");
    }
  }
</script>

{#if loading}<div class="loading">Loading key…</div>{:else if key}<div
    class="row justify-content-center"
  >
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header bg-dark text-white split">
          <span>Key Information</span><button
            class="btn btn-sm btn-outline-light"
            onclick={() => navigate("/keys")}>All Keys</button
          >
        </div>
        <form
          class="card-body"
          onsubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div class="row">
            {#if admin}<label class="col-md-6"
                >Games<input
                  class="form-control"
                  bind:value={key.game}
                /></label
              ><label class="col-md-6"
                >User Key<input
                  class="form-control"
                  bind:value={key.user_key}
                /></label
              ><label class="col-md-6"
                >Duration <small>(days)</small><input
                  type="number"
                  min="1"
                  class="form-control"
                  bind:value={key.duration}
                /></label
              ><label class="col-md-6"
                >Max Devices<input
                  type="number"
                  min="1"
                  class="form-control"
                  bind:value={key.max_devices}
                /></label
              >{/if}
            <label class="col-md-6"
              >Status<select class="form-select" bind:value={key.status}
                ><option value={0}>Banned/Block</option><option value={1}
                  >Active</option
                ></select
              ></label
            ><label class="col-md-6"
              >Registrator<input
                class="form-control"
                bind:value={key.registrator}
                disabled={!admin}
              /></label
            ><label class="col-md-12"
              >Expired {key.expired_date ? "" : "(Not started yet)"}<input
                type="datetime-local"
                class="form-control"
                bind:value={key.expired_date}
                disabled={!admin}
              /></label
            ><label class="col-md-12"
              >Devices <span class="badge bg-dark text-white"
                >{String(key.devices || "")
                  .split(/\r?\n/)
                  .filter(Boolean).length}/{key.max_devices}</span
              ><textarea
                class="form-control"
                rows="4"
                bind:value={key.devices}
                disabled={!admin}></textarea></label
            >
          </div>
          <button class="btn btn-outline-dark" disabled={!dirty}
            >Update User Key</button
          >
        </form>
      </div>
    </div>
  </div>{/if}
