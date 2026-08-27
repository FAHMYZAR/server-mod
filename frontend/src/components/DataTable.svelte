<script>
  let {
    rows = [],
    columns = [],
    key = "id",
    pageSize = 10,
    searchable = true,
    empty = "Nothing to show",
  } = $props();
  let search = $state("");
  let sortKey = $state("");
  let direction = $state(-1);
  let page = $state(1);
  $effect(() => {
    if (!sortKey && columns.length > 0) sortKey = columns[0].key;
  });
  const filtered = $derived(
    rows.filter(
      (row) =>
        !search ||
        columns.some((column) =>
          String(column.value ? column.value(row) : (row[column.key] ?? ""))
            .toLowerCase()
            .includes(search.toLowerCase()),
        ),
    ),
  );
  const sorted = $derived(
    [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? "",
        bv = b[sortKey] ?? "";
      return (
        String(av).localeCompare(String(bv), undefined, { numeric: true }) *
        direction
      );
    }),
  );
  const pages = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
  const visible = $derived(
    sorted.slice(
      (Math.min(page, pages) - 1) * pageSize,
      Math.min(page, pages) * pageSize,
    ),
  );
  function sort(column) {
    if (!column.sortable && column.sortable !== undefined) return;
    if (sortKey === column.key) direction *= -1;
    else {
      sortKey = column.key;
      direction = 1;
    }
  }
</script>

{#if searchable}<div class="table-tools">
    <label
      >Search: <input
        class="form-control form-control-sm"
        bind:value={search}
        oninput={() => (page = 1)}
      /></label
    ><span>{filtered.length} record{filtered.length === 1 ? "" : "s"}</span>
  </div>{/if}
<div class="table-responsive">
  <table class="table table-bordered table-hover text-center">
    <thead
      ><tr
        >{#each columns as column}<th
            ><button class="sort-button" onclick={() => sort(column)}
              >{column.label}
              {sortKey === column.key
                ? direction > 0
                  ? "↑"
                  : "↓"
                : ""}</button
            ></th
          >{/each}</tr
      ></thead
    ><tbody>
      {#each visible as row (row[key])}<tr
          >{#each columns as column}<td
              >{@html column.render
                ? column.render(row)
                : String(
                    column.value ? column.value(row) : (row[column.key] ?? "—"),
                  )}</td
            >{/each}</tr
        >{:else}<tr><td colspan={columns.length}>{empty}</td></tr>{/each}
    </tbody>
  </table>
</div>
{#if pages > 1}<nav class="pagination">
    <button
      class="btn btn-sm btn-outline-dark"
      disabled={page <= 1}
      onclick={() => page--}>Previous</button
    ><span>Page {Math.min(page, pages)} of {pages}</span><button
      class="btn btn-sm btn-outline-dark"
      disabled={page >= pages}
      onclick={() => page++}>Next</button
    >
  </nav>{/if}
