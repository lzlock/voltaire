<script>
  export let data;
  const doc = data.doc;
</script>

<main class="container-fluid">
  <h1>{doc['Title']}</h1>

  <table>
    {#each Object.keys(doc) as key}
      {#if doc[key] && key !== 'Title'}
        <tr>
          <th role="row">{key}</th>
          <td>{doc[key]}</td>
        </tr>
      {/if}
    {/each}
  </table>
</main>
