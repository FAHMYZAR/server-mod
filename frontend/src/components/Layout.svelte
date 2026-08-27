<script>
  import Header from "./Header.svelte";
  let { children } = $props();
</script>

<Header />
<main class="container page">{@render children()}</main>
<footer><div class="container">Z TEAM · License Management</div></footer>
