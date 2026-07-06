<script>
  import RatingStars from "./RatingStars.svelte";

  export let review;
</script>

<article class="review-card">
  <div class="review-top">
    <div>
      <h3>{review.eventTitle}</h3>
      <p>Reviewed by {review.username}</p>
    </div>

    <RatingStars rating={review.rating} />
  </div>

  <p class="review-text">{review.text}</p>
</article>

<style>
  .review-card {
    border: 1px solid #dbe5f3;
    border-radius: 16px;
    padding: 1.25rem;
    background: white;
    box-shadow: 0 4px 12px rgba(15, 44, 92, 0.08);
  }

  .review-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  h3 {
    margin: 0;
    color: #0f2c5c;
  }

  p {
    margin: 0.25rem 0 0;
  }

  .review-top p {
    color: #64748b;
    font-size: 0.9rem;
  }

  .review-text {
    margin-top: 1rem;
    line-height: 1.5;
  }
</style>