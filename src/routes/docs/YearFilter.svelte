<script>
  export let disabled = false;
  export let name;
  export let maxYearBound;
  export let minYearBound;
  export let minYear;
  export let maxYear;
</script>

<nav>
  <details role="list">
    <summary aria-haspopup="listbox" role="link" class="secondary">{name}</summary>
    <ul role="listbox">
      <li>
        <label for="filter-min-year">
        Min Year: {minYear}
        </label>
      </li>
      <li> 
        <input
          type="range"
          id="filter-min-year"
          class="year-slider"
          bind:value={minYear}
          min={minYearBound}
          max={maxYearBound}
          disabled={disabled}
        />
      </li>
      <li>
        <label for="filter-max-year">
        Max Year: {maxYear}
        </label>
      </li>
      <li> 
        <input
          type="range"
          id="filter-max-year"
          class="year-slider"
          bind:value={maxYear}
          min={minYearBound}
          max={maxYearBound}
          disabled={disabled}
        />
      </li>
    </ul>
  </details>
</nav>

<style> 
  .year-slider {
    width: 500px;
  }

  @media (max-width: 800px) {
    .year-slider {
      width: 300px;
    }
  }
</style>
