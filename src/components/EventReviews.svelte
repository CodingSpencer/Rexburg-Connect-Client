<script lang="ts">
    import { onMount } from "svelte";
    import ReviewCard from "./ReviewCard.svelte";
    import {
      getEventReviews,
      type Review,
    } from "../lib/reviews";
  
    export let eventId: string;
  
    let reviews: Review[] = [];
    let reviewCount = 0;
    let averageRating = 0;
  
    let isLoading = true;
    let errorMessage = "";
    let showReviewModal = false;
  
    async function loadReviews() {
      if (!eventId) {
        errorMessage = "This event is missing its database ID.";
        isLoading = false;
        return;
      }
  
      isLoading = true;
      errorMessage = "";
  
      try {
        const data = await getEventReviews(eventId);
  
        reviews = data.reviews;
        reviewCount = data.reviewCount;
        averageRating = data.averageRating;
      } catch (error) {
        errorMessage =
          error instanceof Error
            ? error.message
            : "Unable to load reviews.";
      } finally {
        isLoading = false;
      }
    }
  
    function openReviewModal() {
      errorMessage = "";
      showReviewModal = true;
    }
  
    function closeReviewModal() {
      showReviewModal = false;
    }
  
    async function handleReviewCreated() {
      await loadReviews();
    }
  
    function formatDate(dateValue: string) {
      return new Date(dateValue).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  
    onMount(loadReviews);
  </script>
  
  <section class="event-reviews">
    <div class="reviews-heading">
      <div>
        <p class="eyebrow">Student feedback</p>
        <h2>Reviews</h2>
  
        <p class="rating-summary">
          <span class="summary-stars">
            {"★".repeat(Math.round(averageRating))}
            {"☆".repeat(5 - Math.round(averageRating))}
          </span>
  
          <strong>{averageRating.toFixed(1)}</strong>
  
          <span>
            ({reviewCount}
            {reviewCount === 1 ? " review" : " reviews"})
          </span>
        </p>
      </div>
  
      <button
        type="button"
        class="add-review-button"
        on:click={openReviewModal}
      >
        Leave a Review
      </button>
    </div>
  
    {#if isLoading}
      <p class="status-message">Loading reviews...</p>
    {:else if errorMessage}
      <p class="status-message error-message">
        {errorMessage}
      </p>
    {:else if reviews.length === 0}
      <div class="empty-reviews">
        <h3>No reviews yet</h3>
        <p>Be the first student to review this event!</p>
      </div>
    {:else}
      <div class="review-list">
        {#each reviews as review}
          <article class="review-item">
            <div class="review-top">
              <div>
                <h3>{review.userName}</h3>
                <small>{formatDate(review.createdAt)}</small>
              </div>
  
              <span
                class="review-stars"
                aria-label={`${review.rating} out of 5 stars`}
              >
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>
  
            <p>{review.comment}</p>
          </article>
        {/each}
      </div>
    {/if}
  </section>
  
  {#if showReviewModal}
    <div
      class="modal-overlay"
      role="presentation"
      on:click={closeReviewModal}
    >
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Leave a review"
        on:click|stopPropagation
      >
        <ReviewCard
          {eventId}
          onClose={closeReviewModal}
          onReviewCreated={handleReviewCreated}
        />
      </div>
    </div>
  {/if}
  
  <style>
    .event-reviews {
      margin-top: 2.5rem;
    }
  
    .reviews-heading {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }
  
    .eyebrow {
      margin: 0 0 0.35rem;
      color: #4a90e2;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
  
    h2 {
      margin: 0;
      color: #0f2c5c;
      font-size: 2rem;
    }
  
    .rating-summary {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin: 0.65rem 0 0;
      color: #667085;
    }
  
    .summary-stars,
    .review-stars {
      color: #f4b400;
      letter-spacing: 0.08rem;
    }
  
    .add-review-button {
      border: none;
      border-radius: 12px;
      padding: 0.85rem 1.2rem;
      background: #0f2c5c;
      color: white;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }
  
    .add-review-button:hover {
      background: #173f7a;
    }
  
    .review-list {
      display: grid;
      gap: 1rem;
    }
  
    .review-item {
      padding: 1.25rem;
      border: 1px solid #dbe5f3;
      border-radius: 16px;
      background: white;
    }
  
    .review-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }
  
    .review-top h3 {
      margin: 0 0 0.2rem;
      color: #0f2c5c;
    }
  
    .review-top small {
      color: #667085;
    }
  
    .review-item p {
      margin: 1rem 0 0;
      line-height: 1.6;
    }
  
    .status-message,
    .empty-reviews {
      padding: 1.5rem;
      border: 1px solid #dbe5f3;
      border-radius: 16px;
      background: white;
    }
  
    .empty-reviews h3,
    .empty-reviews p {
      margin-top: 0;
    }
  
    .error-message {
      color: #b42318;
      background: #fef3f2;
    }
  
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(15, 44, 92, 0.55);
    }
  
    .modal-content {
      max-height: 90vh;
      overflow-y: auto;
    }
  
    @media (max-width: 650px) {
      .reviews-heading {
        align-items: stretch;
        flex-direction: column;
      }
  
      .add-review-button {
        width: 100%;
      }
  
      .review-top {
        flex-direction: column;
      }
    }
  </style>