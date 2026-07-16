<script lang="ts">
  export let rating = 0;
  export let editable = true;
  export let ariaLabel = "";

  function chooseRating(selectedRating: number) {
    if (!editable) {
      return;
    }

    rating = selectedRating;
  }

  function getFillPercentage(starNumber: number): number {
    const amountFilled = rating - (starNumber - 1);

    if (amountFilled >= 1) {
      return 100;
    }

    if (amountFilled <= 0) {
      return 0;
    }

    return Math.round(amountFilled * 100);
  }
</script>

<div
  class:editable
  class="stars"
  role={editable ? "radiogroup" : "img"}
  aria-label={ariaLabel || `${rating.toFixed(1)} out of 5 stars`}
>
  {#each [1, 2, 3, 4, 5] as starNumber}
    {#if editable}
      <button
        type="button"
        class:selected={starNumber <= rating}
        role="radio"
        aria-checked={starNumber === rating}
        aria-label={`${starNumber} out of 5 stars`}
        on:click={() => chooseRating(starNumber)}
      >
        {starNumber <= rating ? "★" : "☆"}
      </button>
    {:else}
      <span class="display-star" aria-hidden="true">
        <span class="empty-star">★</span>

        <span
          class="filled-star"
          style={`width: ${getFillPercentage(starNumber)}%`}
        >
          ★
        </span>
      </span>
    {/if}
  {/each}
</div>

<style>
  .stars {
    display: inline-flex;
    align-items: center;
    line-height: 1;
  }

  button {
    all: unset;
    color: #d0d5dd;
    cursor: pointer;
    font-size: 1.7rem;
    line-height: 1;
    padding: 0;
  }

  button.selected {
    color: #f4b400;
  }

  button:hover,
  button:focus-visible {
    color: #f4b400;
  }

  button:focus-visible {
    border-radius: 4px;
    outline: 2px solid #4a90e2;
    outline-offset: 2px;
  }

  .display-star {
    position: relative;
    display: inline-block;
    font-size: 1.7rem;
    line-height: 1;
  }

  .empty-star {
    color: #d0d5dd;
  }

  .filled-star {
    position: absolute;
    inset: 0 auto 0 0;
    display: block;
    overflow: hidden;
    color: #f4b400;
    white-space: nowrap;
  }
</style>