<script>
  let {
    open = false,
    title = "Are you sure?",
    message = "",
    confirmText = "Confirm",
    danger = false,
    onconfirm = () => {},
    oncancel = () => {},
  } = $props();
</script>

{#if open}
  <div
    class="modal-backdrop"
    role="presentation"
    onclick={(e) => e.target === e.currentTarget && oncancel()}
  >
    <div
      class="modal"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div class="modal-header">
        <h3 id="dialog-title">{title}</h3>
        <button class="btn-close" aria-label="Close" onclick={oncancel}
          >×</button
        >
      </div>
      <div class="modal-body"><p>{message}</p></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick={oncancel}>Cancel</button
        ><button
          class:btn-danger={danger}
          class:btn-primary={!danger}
          class="btn"
          onclick={onconfirm}>{confirmText}</button
        >
      </div>
    </div>
  </div>
{/if}
