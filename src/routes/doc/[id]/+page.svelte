<script>
  export let data;
  const doc = data.doc;
</script>

<h1>{doc['Title']}</h1>

<table>
  {#each Object.keys(doc) as key}
    {#if doc[key] && key !== 'Title'}
      <tr>
        <td>{key}</td>
        <td>{doc[key]}</td>
      </tr>
    {/if}
  {/each}
</table>
