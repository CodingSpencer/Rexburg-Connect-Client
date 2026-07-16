<script lang="ts">
  import RatingStars from "./RatingStars.svelte";
  import { createEventReview } from "../lib/reviews";

  export let eventId: string;
  export let onClose: (() => void) | undefined = undefined;
  export let onReviewCreated: (() => void) | undefined = undefined;

  let rating = 0;
  let comment = "";
  let isSubmitting = false;
  let errorMessage = "";
  let successMessage = "";

  async function handleSubmit() {
    errorMessage = "";
    successMessage = "";

    if (!eventId) {
      errorMessage = "This event is missing its database ID.";
      return;
    }

    if (rating < 1 || rating > 5) {
      errorMessage = "Please choose a star rating.";
      return;
    }

    const cleanedComment = comment.trim();

    if (cleanedComment.length < 2) {
      errorMessage = "Please enter a review comment.";
      return;
    }

    isSubmitting = true;

    try {
      await createEventReview(eventId, {
        rating,
        comment: cleanedComment,
      });

      rating = 0;
      comment = "";
      successMessage = "Your review was posted!";

      await onReviewCreated?.();

      setTimeout(() => {
        onClose?.();
      }, 700);
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to post your review.";
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="review-card">
  <div class="review-header">
    <h2>Leave a Review</h2>

    {#if onClose}
      <button
        type="button"
        class="close-button"
        aria-label="Close review form"
        on:click={onClose}
      >
        ×
      </button>
    {/if}
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label>Your rating</label>
      <RatingStars bind:rating />
    </div>

    <div class="form-group">
      <label for="review-comment">Your review</label>

      <textarea
        id="review-comment"
        bind:value={comment}
        maxlength="1000"
        rows="5"
        placeholder="What did you think of this event?"
        required
      ></textarea>
    </div>

    {#if errorMessage}
      <p class="message error-message">
        {errorMessage}
      </p>
    {/if}

    {#if successMessage}
      <p class="message success-message">
        {successMessage}
      </p>
    {/if}

    <button
      type="submit"
      class="submit-button"
      disabled={isSubmitting}
    >
      {isSubmitting ? "Posting..." : "Post Review"}
    </button>
  </form>
</div>

<style>
  .review-card {
    width: min(520px, 92vw);
    padding: 1.5rem;
    border-radius: 18px;
    background: white;
    box-shadow: 0 18px 50px rgba(15, 44, 92, 0.2);
  }

  .review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .review-header h2 {
    margin: 0;
    color: #0f2c5c;
  }

  .close-button {
    border: none;
    background: transparent;
    color: #667085;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
  }

  form {
    display: grid;
    gap: 1.25rem;
  }

  .form-group {
    display: grid;
    gap: 0.5rem;
  }

  label {
    font-weight: 700;
    color: #0f2c5c;
  }

  textarea {
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
    padding: 0.9rem;
    border: 1px solid #c8d6e8;
    border-radius: 12px;
    font: inherit;
  }

  textarea:focus {
    outline: 2px solid #4a90e2;
    border-color: transparent;
  }

  .submit-button {
    border: none;
    border-radius: 12px;
    padding: 0.85rem 1.25rem;
    background: #0f2c5c;
    color: white;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }

  .submit-button:hover:not(:disabled) {
    background: #173f7a;
  }

  .submit-button:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  .message {
    margin: 0;
    padding: 0.75rem;
    border-radius: 10px;
  }

  .error-message {
    color: #b42318;
    background: #fef3f2;
  }

  .success-message {
    color: #067647;
    background: #ecfdf3;
  }
</style>