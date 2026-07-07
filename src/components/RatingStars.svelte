<script lang="ts">
  export let rating = 0;
</script>

<div class="stars">
  {#each Array(5) as _, i}
    <button
      type="button"
      on:click={() => (rating = i + 1)}
    >
      {i < rating ? "★" : "☆"}
    </button>
  {/each}
</div>

<style>
  .stars button {
    all: unset;
    background: none;
    border: none;
    font-size: 1.7rem;
    color: gold;
    cursor: pointer;
    padding: 0;
  }
</style>
