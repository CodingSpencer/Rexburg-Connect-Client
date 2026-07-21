<script lang="ts">
  export let rating = 0;
  export let editable = true;
  export let ariaLabel = "";

  $: normalizedRating = Math.min(
    5,
    Math.max(0, Number(rating) || 0)
  );

  $: fillPercentage = (normalizedRating / 5) * 100;

  function chooseRating(selectedRating: number) {
    if (!editable) {
      return;
    }

    rating = selectedRating;
  }
</script>

{#if editable}
  <div
    class="stars editable-stars"
    role="radiogroup"
    aria-label={ariaLabel || "Choose a rating out of 5 stars"}
  >
    {#each [1, 2, 3, 4, 5] as starNumber}
      <button
        type="button"
        class:selected={starNumber <= normalizedRating}
        role="radio"
        aria-checked={starNumber === normalizedRating}
        aria-label={`${starNumber} out of 5 stars`}
        on:click={() => chooseRating(starNumber)}
      >
        ★
      </button>
    {/each}
  </div>
{:else}
  <div
    class="display-rating"
    role="img"
    aria-label={
      ariaLabel ||
      `${normalizedRating.toFixed(1)} out of 5 stars`
    }
  >
    <span class="star-row empty-stars" aria-hidden="true">
      ★★★★★
    </span>

    <span
      class="filled-stars-wrapper"
      style:width={`${fillPercentage}%`}
      aria-hidden="true"
    >
      <span class="star-row filled-stars">
        ★★★★★
      </span>
    </span>
  </div>
{/if}

<style>
  .stars {
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  /* Editable review-form stars */

  .editable-stars button {
    all: unset;
    color: #d0d5dd;
    cursor: pointer;
    font-size: 1.7rem;
    line-height: 1;
  }

  .editable-stars button.selected {
    color: #f4b400;
  }

  .editable-stars button:hover,
  .editable-stars button:focus-visible {
    color: #f4b400;
  }

  .editable-stars button:focus-visible {
    border-radius: 4px;
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
  }

  /* Read-only average stars */

  .display-rating {
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: 8.5rem;
    height: 1.7rem;
    overflow: hidden;
    font-size: 1.7rem;
    line-height: 1;
    white-space: nowrap;
  }

  .star-row {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 8.5rem;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.7rem;
    letter-spacing: 0;
    line-height: 1;
    white-space: nowrap;
  }

  .empty-stars {
    color: #d0d5dd;
  }

  .filled-stars-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    overflow: hidden;
  }

  .filled-stars {
    color: #f4b400;
  }
</style>