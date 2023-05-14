<script>
  import '@picocss/pico';
</script>

<div id="root">
  <header class="container-fluid">
    <nav>
      <ul>
        <li><strong><a href="/">Voltaire Project</a></strong></li>
      </ul>
      <ul>
        <li><a href="/docs">Explore</a></li>
      </ul>
    </nav>
  </header>

  <slot />
</div>

<style>
  :global(:root) {
    --font-size: 1rem !important;
  }

  :global(#root > header, #root > main, #root > footer) {
    padding-top: var(--spacing);
    padding-bottom: var(--spacing);
    /* --block-spacing-vertical: calc(var(--spacing)) !important; */
  } 
</style>
