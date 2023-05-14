<script>
  import '@picocss/pico';
</script>

<header class="container-fluid">
  <h1><a href="/">Voltaire Project</a></h1>
</header>
<main class="container-fluid">
  <slot />
</main>

<style>
  main, header {
    --block-spacing-vertical: calc(var(--spacing));
  }
  
  h1 {
    margin: 0;
  }
</style>
