<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  import { navigate } from "../lib/router.js";
  import DataTable from "../components/DataTable.svelte";
  import Dialog from "../components/Dialog.svelte";
  let rows = $state([]);
  let masked = $state(true);
  let loading = $state(true);
  let pending = $state(null);
  const columns = $derived([
    { key: "id", label: "#", value: (r) => r.id_keys || r.id },
    { key: "game", label: "Game" },
    {
      key: "user_key",
      label: "User Keys",
      render: (r) =>
        `<span class="${r.status === 1 || r.status === "Active" ? "text-success" : "text-danger"} ${masked ? "key-sensi" : ""}">${r.user_key || "—"}</span>`,
    },
    {
      key: "devices",
      label: "Devices",
      value: (r) =>
        `${Array.isArray(r.devices) ? r.devices.length : (r.devices_count ?? (r.devices ? String(r.devices).split(",").length : 0))}/${r.max_devices}`,
    },
    { key: "duration", label: "Duration", value: (r) => `${r.duration} Days` },
    {
      key: "expired_date",
      label: "Expired",
      value: (r) => r.expired || r.expired_date || "(not started yet)",
    },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      render: (r) =>
        `<div class="actions"><button data-action="reset" data-id="${r.id_keys || r.id}" class="btn btn-outline-warning btn-sm">↻</button><button data-action="edit" data-id="${r.id_keys || r.id}" class="btn btn-outline-dark btn-sm">Edit</button><button data-action="delete" data-id="${r.id_keys || r.id}" class="btn btn-outline-danger btn-sm">Delete</button></div>`,
    },
  ]);
  function load() {
    loading = true;
    api
      .keys()
      .then((v) => (rows = v))
      .catch((e) => notify(e.message, "danger"))
      .finally(() => (loading = false));
  }
  $effect(load);
  function tableClick(e) {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    if (b.dataset.action === "edit") navigate(`/keys/${b.dataset.id}`);
    else pending = { action: b.dataset.action, id: b.dataset.id };
  }
  async function confirm() {
    const p = pending;
    pending = null;
    try {
      if (p.action === "reset") await api.resetKey(p.id);
      else await api.deleteKey(p.id);
      notify(p.action === "reset" ? "Device key reset." : "User key deleted.");
      load();
    } catch (e) {
      notify(e.message, "danger");
    }
  }
</script>

<div class="card shadow-sm">
  <div class="card-header bg-dark text-white split">
    <span>Keys Registered</span>
    <div>
      <button
        class="btn btn-outline-light btn-sm"
        onclick={() => navigate("/keys/generate")}>＋ KEY</button
      >
      <button
        class="btn btn-secondary btn-sm"
        onclick={() => (masked = !masked)}
        >{masked ? "◉ Show" : "◉ Mask"}</button
      >
    </div>
  </div>
  <div
    class="card-body"
    role="button"
    tabindex="0"
    onclick={tableClick}
    onkeydown={(event) =>
      (event.key === "Enter" || event.key === " ") && tableClick(event)}
  >
    {#if loading}<div class="loading">Loading keys…</div>{:else}<DataTable
        {rows}
        {columns}
        key="id"
        empty="Nothing keys to show"
      />{/if}
  </div>
</div>
<Dialog
  open={!!pending}
  title={pending?.action === "delete" ? "Delete key?" : "Reset devices?"}
  message="This action cannot be reverted."
  confirmText={pending?.action === "delete" ? "Delete" : "Reset"}
  danger={pending?.action === "delete"}
  onconfirm={confirm}
  oncancel={() => (pending = null)}
/>
