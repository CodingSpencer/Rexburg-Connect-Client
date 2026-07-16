<script lang="ts">
    import { onMount } from "svelte";
    import RatingStars from "./RatingStars.svelte";
    import { getEventReviews } from "../lib/reviews";
  
    export let eventId = "";
    export let fallbackRating = 0;
    export let showReviewCount = false;
  
    let averageRating = fallbackRating;
    let reviewCount = 0;
    let isLoading = false;
  
    async function loadAverageRating() {
      if (!eventId) {
        return;
      }
  
      isLoading = true;
  
      try {
        const data = await getEventReviews(eventId);
  
        averageRating = data.averageRating;
        reviewCount = data.reviewCount;
      } catch (error) {
        console.error("Unable to load event rating:", error);
  
        // Keep showing the fallback rating when the request fails.
        averageRating = fallbackRating;
      } finally {
        isLoading = false;
      }
    }
  
    onMount(loadAverageRating);
  </script>
  
  <div class="event-average-rating">
    <RatingStars
      rating={averageRating}
      editable={false}
      ariaLabel={`${averageRating.toFixed(1)} out of 5 stars`}
    />
  
    <span class="rating-number">
      {isLoading ? "Loading..." : `${averageRating.toFixed(1)}/5`}
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