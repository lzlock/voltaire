<script>
  import { createEventDispatcher } from "svelte";

  export let disabled = false;
  export let name;
  export let maxYearBound;
  export let minYearBound;
  export let minYear;
  export let maxYear;

  let isActive = false;

  const dispatch = createEventDispatcher();

  const dispatchChange = () => {
    dispatch("change", {
      minYear,
      maxYear,
    });
  };

  $: isActive = minYear !== minYearBound || maxYear !== maxYearBound;
</script>

<nav>
  <details role="list">
    <summary
      aria-haspopup="listbox"
      role="link"
      class={isActive ? "" : "secondary"}>
      {name}
    </summary>
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
          on:change={dispatchChange}
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
          on:change={dispatchChange}
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
