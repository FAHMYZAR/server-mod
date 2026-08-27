<script>
  import { notices, dismiss } from "../lib/session.js";
</script>

<div class="alert-stack" aria-live="polite">
  {#each $notices as notice (notice.id)}
    <div class="alert alert-{notice.type}" role="alert">
      <span>{notice.message}</span><button
        class="btn-close"
        aria-label="Dismiss"
        onclick={() => dismiss(notice.id)}>×</button
      >
    </div>
  {/each}
</div>
