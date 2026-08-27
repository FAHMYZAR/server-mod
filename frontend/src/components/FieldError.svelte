<script>
  let { errors = {}, name } = $props();
</script>

{#if errors?.[name]}<small class="form-text text-danger"
    >{Array.isArray(errors[name]) ? errors[name][0] : errors[name]}</small
  >{/if}
