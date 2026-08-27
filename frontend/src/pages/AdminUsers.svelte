<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  import DataTable from "../components/DataTable.svelte";
  import { navigate } from "../lib/router.js";
  let rows = $state([]);
  let loading = $state(true);
  const columns = [
    { key: "id", label: "#", value: (r) => r.id_users || r.id },
    { key: "username", label: "Username" },
    { key: "fullname", label: "Fullname", value: (r) => r.fullname || "~" },
    {
      key: "level",
      label: "Level",
      value: (r) =>
        r.level_name ||
        r.role ||
        (Number(r.level) === 1 ? "Admin" : "Reseller"),
    },
    {
      key: "saldo",
      label: "Saldo",
      value: (r) =>
        Number(r.level) === 1 ? "—" : `$${r.saldo ?? r.balance ?? 0}`,
    },
    {
      key: "status",
      label: "Status",
      value: (r) => (Number(r.status) === 1 ? "Active" : "Banned"),
    },
    { key: "uplink", label: "Uplink" },
    {
      key: "actions",
      label: "Action",
      sortable: false,
      render: (r) =>
        `<button class="btn btn-dark btn-sm" data-edit="${r.id_users || r.id}">EDIT</button>`,
    },
  ];
  $effect(() => {
    api
      .users()
      .then((v) => (rows = v))
      .catch((e) => notify(e.message, "danger"))
      .finally(() => (loading = false));
  });
  function click(e) {
    const b = e.target.closest("[data-edit]");
    if (b) navigate(`/admin/users/${b.dataset.edit}`);
  }
</script>

<div class="alert alert-primary">
  <strong>INFO</strong> · Search by username, fullname, saldo or uplink.
</div>
<div class="card shadow-sm">
  <div class="card-header bg-dark text-white">Manage Users</div>
  <div
    class="card-body"
    role="button"
    tabindex="0"
    onclick={click}
    onkeydown={(event) =>
      (event.key === "Enter" || event.key === " ") && click(event)}
  >
    {#if loading}<div class="loading">Loading users…</div>{:else}<DataTable
        {rows}
        {columns}
        key="id"
      />{/if}
  </div>
</div>
