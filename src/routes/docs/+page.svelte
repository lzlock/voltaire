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
  let fuseDocs;

  const updateFilter = (docs, searchText) => {
    if (!searchText || !fuseDocs) {
      filteredDocs = docs;
      return;
    }

    filteredDocs = fuseDocs.search(searchText).map((result) => result.item);
  };

  const updatePage = (docs, pageIndex) => {
    pageDocs = docs.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    pageMax = Math.floor(docs.length / pageSize);
  };

  const debounceInput = (node) => {
    let timer;

    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        node.dispatchEvent(new Event('change'));
      }, 200);
    };

    node.addEventListener('input', handler);

    return {
      destroy() {
        node.removeEventListener('input', handler);
      }
    };
  };

  $: updateFilter(docs, searchText);
  $: updatePage(filteredDocs, pageIndex);

  onMount(async () => {
    const response = await fetch('/data.json');
    docs = await response.json();
    const options = {
      keys: ['Title', 'Stated date of publication'],
      threshold: 0.3,
    };
    fuseDocs = new fuse(docs, options);
    loading = false;
  });

  export const snapshot = {
    capture: () => ({ pageIndex, searchText }),
    restore: (value) => {
      searchText = value.searchText;
      pageIndex = value.pageIndex;
    }
  };
</script>

<svelte:head>
  <title>Explore - Voltaire Project</title>
</svelte:head>

<main class="container-fluid">
  <input
    type="text"
    value={searchText}
    placeholder="Search..."
    on:change={(event) => {
      pageIndex = 0;
      searchText = event.target.value;
    }}
    use:debounceInput
  />

  <nav>
    <ul> 
      <li><button on:click={() => pageIndex--} disabled={pageIndex === 0} class="outline">Previous</button></li>
      <li><button on:click={() => pageIndex = 0} disabled={pageIndex === 0} class="outline">First</button></li>
    </ul>
    <ul>
      <li>Page {pageIndex + 1} of {pageMax + 1}</li>
    </ul>
    <ul>
      <li><button on:click={() => pageIndex = pageMax} disabled={pageIndex === pageMax} class="outline">Last</button></li>
      <li><button on:click={() => pageIndex++} disabled={pageIndex === pageMax} class="outline">Next</button></li>
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
            <td><a href="/docs/{row['ID']}">{row['Title']}</a></td>
            <td>{row['Stated date of publication']}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>
