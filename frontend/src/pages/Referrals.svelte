<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  import DataTable from "../components/DataTable.svelte";
  let saldo = $state(5);
  let rows = $state([]);
  let created = $state("");
  const columns = [
    { key: "id_reff", label: "#" },
    {
      key: "code",
      label: "Referral hashed",
      value: (r) => String(r.code || "").slice(1, 16),
    },
    { key: "set_saldo", label: "Saldo", value: (r) => `$${r.set_saldo}` },
    { key: "used_by", label: "Used by", value: (r) => r.used_by || "—" },
    { key: "created_by", label: "Create by" },
  ];
  $effect(() =>
    api
      .referrals()
      .then((v) => (rows = v))
      .catch((e) => notify(e.message, "danger")),
  );
  async function submit() {
    try {
      const r = await api.createReferral({ set_saldo: saldo });
      created = r.code || r.referral || r.message;
      rows = await api.referrals();
      notify("Referral created.");
    } catch (e) {
      notify(e.message, "danger");
    }
  }
</script>

<div class="row">
  <div class="col-lg-4">
    <div class="card">
      <div class="card-header bg-dark text-white">Generate Referral</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label
          >Saldo<input
            class="form-control"
            type="number"
            min="0"
            bind:value={saldo}
          /></label
        ><button class="btn btn-outline-dark">Create Code</button
        >{#if created}<div class="alert alert-success mt-3">
            Referral: <strong>{created}</strong>
          </div>{/if}
      </form>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card">
      <div class="card-header bg-dark text-white">History Generate</div>
      <div class="card-body"><DataTable {rows} {columns} key="id_reff" /></div>
    </div>
  </div>
</div>
