<script lang="ts">
  import { onMount } from "svelte";
  import RatingStars from "./RatingStars.svelte";
  import { getEventReviews } from "../lib/reviews";

  export let eventId = "";
  export let fallbackRating = 0;
  export let showReviewCount = false;

  let averageRating = Number(fallbackRating) || 0;
  let reviewCount = 0;
  let isLoading = false;

  function normalizeRating(value: unknown): number {
    const numericRating = Number(value);

    if (!Number.isFinite(numericRating)) {
      return 0;
    }

    return Math.min(5, Math.max(0, numericRating));
  }

  async function loadAverageRating() {
    if (!eventId) {
      averageRating = normalizeRating(fallbackRating);
      return;
    }

    isLoading = true;

    try {
      const data = await getEventReviews(eventId);

      averageRating = normalizeRating(data.averageRating);
      reviewCount = Number(data.reviewCount) || 0;
    } catch (error) {
      console.error(
        "Unable to load event rating:",
        error
      );

      averageRating = normalizeRating(fallbackRating);
      reviewCount = 0;
    } finally {
      isLoading = false;
    }
  }

  onMount(loadAverageRating);
</script>

<div class="event-average-rating">
  {#key averageRating}
    <RatingStars
      rating={averageRating}
      editable={false}
      ariaLabel={`${averageRating.toFixed(1)} out of 5 stars`}
    />
  {/key}

  <span class="rating-number">
    {isLoading
      ? "Loading..."
      : `${averageRating.toFixed(1)}/5`}
  </span>

  {#if showReviewCount && !isLoading}
    <span class="review-count">
      ({reviewCount}
      {reviewCount === 1 ? " review" : " reviews"})
    </span>
  {/if}
</div>

<style>
  .event-average-rating {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .rating-number {
    color: #475569;
    font-size: 0.95rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .review-count {
    color: #667085;
    font-size: 0.9rem;
    white-space: nowrap;
  }
</style>