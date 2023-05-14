<script>
  import { onMount } from 'svelte';
  import fuse from 'fuse.js';

  let docs = [];
  let pageIndex = 0;
  const pageSize = 20;
  let pageMax = 0;
  let pageDocs = [];
  let searchText = '';
  let filteredDocs = [];
  let loading = true;

  const updateFilter = (docs, searchText) => {
    if (!searchText) {
      filteredDocs = docs;
      return;
    }

    const options = {
      keys: ['Title', 'Stated date of publication'],
      threshold: 0.3,
    };
    const fuseDocs = new fuse(docs, options);
    filteredDocs = fuseDocs.search(searchText).map((result) => result.item);
    pageIndex = 0;
  };

  const updatePage = (docs, pageIndex) => {
    pageDocs = docs.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    pageMax = Math.floor(docs.length / pageSize);
  };

  $: updateFilter(docs, searchText);
  $: updatePage(filteredDocs, pageIndex);

  onMount(async () => {
    const response = await fetch('/data.json');
    docs = await response.json();
    loading = false;
  });

  export const snapshot = {
    capture: () => ({ pageIndex, searchText }),
    restore: (value) => {
      pageIndex = value.pageIndex;
      searchText = value.searchText;
    }
  };
</script>

<input type="text" bind:value={searchText} placeholder="Search..." />

<nav>
  <ul> 
    <li><button on:click={() => pageIndex--} disabled={pageIndex === 0} class="secondary">Previous</button></li>
    <li><button on:click={() => pageIndex = 0} disabled={pageIndex === 0} class="secondary">First</button></li>
  </ul>
  <ul>
    <li>Page {pageIndex + 1} of {pageMax + 1}</li>
  </ul>
  <ul>
    <li><button on:click={() => pageIndex = pageMax} disabled={pageIndex === pageMax} class="secondary">Last</button></li>
    <li><button on:click={() => pageIndex++} disabled={pageIndex === pageMax} class="secondary">Next</button></li>
  </ul>
</nav>

{#if loading}
  <progress></progress>
{:else if filteredDocs.length === 0}
  <p>No results found.</p>
{:else}
  <table role="grid">
    <thead>
      <tr>
        <th>Title</th>
        <th>Year</th>
      </tr>
    </thead>
    <tbody>
      {#each pageDocs as row}
        <tr>
          <td><a href="/doc/{row['ID']}">{row['Title']}</a></td>
          <td>{row['Stated date of publication']}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}


