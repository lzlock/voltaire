<script>
  import { onMount } from 'svelte';
  import fuse from 'fuse.js';
  import YearFilter from './YearFilter.svelte';
  import { writable, readable } from 'svelte/store';

  let minYearBound = -700;
  let maxYearBound = 1800;

  let searchText = '';
  let minYear = minYearBound;
  let maxYear = maxYearBound;

  let docs = [];
  let pageIndex = 0;
  const pageSize = 20;
  let pageMax = 0;
  let pageDocs = [];
  let filteredDocs = [];
  let loading = true;
  let fuseDocs;

  const updateFilter = (docs, searchText, minYear, maxYear) => {
    // Filter by search term
    let afterSearch = docs;

    if (!!fuseDocs && searchText.length > 0) {
      afterSearch = fuseDocs.search(searchText).map((result) => result.item);
    }

    // Filter by year
    let afterYear = afterSearch.filter((doc) => {
      const year = parseInt(doc['Original date of publication']);
      return year >= minYear && year <= maxYear;
    }); 

    filteredDocs = afterYear;
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

  $: updateFilter(docs, searchText, minYear, maxYear);
  $: updatePage(filteredDocs, pageIndex);

  onMount(async () => {
    const response = await fetch('/data.json');
    docs = await response.json();

    let keys = [];

    if (docs.length > 0) {
      keys = [...Object.keys(docs[0])];
    }

    const options = {
      keys,
      threshold: 0.3,
    };
    fuseDocs = new fuse(docs, options);
    loading = false;
  });

  export const snapshot = {
    capture: () => ({ pageIndex, searchText, minYear, maxYear }),
    restore: (value) => {
      searchText = value.searchText;
      pageIndex = value.pageIndex;
      minYear = value.minYear;
      maxYear = value.maxYear;
    }
  };
</script>

<svelte:head>
  <title>Explore - Voltaire Project</title>
</svelte:head>

<main class="container-fluid">
  <input
    type="search"
    value={searchText}
    placeholder="Search..."
    on:change={(event) => {
      pageIndex = 0;
      searchText = event.target.value;
    }}
    use:debounceInput
  />

  <nav>
    <YearFilter
      name="Year of publication"
      minYearBound={minYearBound}
      maxYearBound={maxYearBound}
      bind:minYear={minYear}
      bind:maxYear={maxYear}
      on:change={() => {
        pageIndex = 0;
      }}
      disabled={loading}
    />
  </nav>

  <nav>
    <ul> 
      <li><button on:click={() => pageIndex--} disabled={pageIndex === 0} class="outline">Previous</button></li>
      <li><button on:click={() => pageIndex = 0} disabled={pageIndex === 0} class="outline">First</button></li>
    </ul>
    <ul>
      <li class="page-of">Page {pageIndex + 1} of {pageMax + 1}</li>
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
    <figure>
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
              <td>{row['Original date of publication']}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </figure>
  {/if}
</main>

<style>
  .page-of {
    font-size: 1.2em;
  }

  .search-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
