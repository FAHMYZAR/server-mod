<script>
  import { api, downloadText } from "../lib/api.js";
  import { session, notify } from "../lib/session.js";
  import { money } from "../lib/format.js";
  const prices = { 1: 0.3, 3: 0.5, 7: 2, 14: 4, 30: 7, 60: 14 };
  const counts = [1, 5, 10, 25, 50, 100];
  let form = $state({ game: "PUGB", max_devices: 1, duration: 1, count: 1 });
  let generated = $state([]);
  let busy = $state(false);
  const estimate = $derived(
    (prices[form.duration] || 0) *
      Number(form.max_devices) *
      Number(form.count),
  );
  async function submit() {
    busy = true;
    try {
      const result = await api.generateKeys(form);
      generated = result.keys || result.data || [];
      if (!Array.isArray(generated)) generated = [generated];
      const refreshed = await api.session();
      if (refreshed.user) session.update((s) => ({ ...s, user: refreshed.user }));
      notify("Successfully generated.");
      downloadText(
        generated.map((k) => k.user_key || k.key || k).join("\n") + "\n",
      );
    } catch (e) {
      notify(e.message, e.status === 422 ? "warning" : "danger");
    } finally {
      busy = false;
    }
  }
</script>

<div class="row justify-content-center">
  <div class="col-lg-6">
    {#if generated.length}<div class="alert alert-success">
        <strong>Generated keys</strong>
        <div class="generated-keys">
          {#each generated as key}<code>{key.user_key || key.key || key}</code
            >{/each}
        </div>
        <small
          >Cost: {money(estimate)} · Balance: {money(
            $session.user?.saldo ?? $session.user?.balance,
          )}</small
        ><button
          class="btn btn-sm btn-outline-dark"
          onclick={() =>
            downloadText(
              generated.map((k) => k.user_key || k.key || k).join("\n") + "\n",
            )}>Download key.txt</button
        >
      </div>{/if}
    <div class="card">
      <div class="card-header bg-dark text-white">Create License</div>
      <form
        class="card-body"
        onsubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div class="row">
          <label class="col-lg-6"
            >Games<select class="form-select" bind:value={form.game}
              ><option value="PUGB">PUBG MOBILE</option></select
            ></label
          ><label class="col-lg-6"
            >Max Devices<input
              class="form-control"
              type="number"
              min="1"
              bind:value={form.max_devices}
            /></label
          >
        </div>
        <label
          >Duration<select class="form-select" bind:value={form.duration}
            >{#each Object.entries(prices) as [days, price]}<option
                value={Number(days)}
                >{days} Day{days === "1" ? "" : "s"} — {money(
                  price,
                )}/Device</option
              >{/each}</select
          ></label
        ><label
          >Bulk Keys<select class="form-select" bind:value={form.count}
            >{#each counts as count}<option value={count}>{count} Keys</option
              >{/each}</select
          ></label
        ><label
          >Estimation<input
            class="form-control"
            readonly
            value={money(estimate)}
          /></label
        ><button class="btn btn-outline-dark" disabled={busy || estimate <= 0}
          >{busy ? "Generating…" : "Generate & Download"}</button
        >
      </form>
    </div>
  </div>
</div>
