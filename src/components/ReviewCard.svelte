<script lang="ts">
  import RatingStars from "./RatingStars.svelte";
  // let { review }: { review: Review } = $props();
  let rating = 0;
</script>

<form action="/" id="review">
  <label for="comment">Comment</label>
  <input type="text" id="comment"/>

  <label>Rating</label>
  <RatingStars bind:rating />

  <button>Post Review</button>
</form>

<style>
  #review {
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    padding: 1.5rem;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  #review label {
    font-weight: 600;
    color: #333;
  }

  #review input,
  #review textarea {
    padding: 0.7rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
  }

  #review input:focus,
  #review textarea:focus {
    outline: none;
    border-color: #4a90e2;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  }

  #review > button {
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 12px;
    background: #0f2c5c;
    color: white;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  #review > button:hover {
    background: #4a90e2;
    transform: translateY(-1px);
  }
</style>


<!-- <article class="review-card">
    <div class="review-header">
    <h3>Username: </h3>
    <RatingStars />
  </div>
  <p>Placeholder for comments</p> -->
<!-- </article> -->
<!-- <h3>{review.username}</h3> -->
<!-- <RatingStars rating={review.rating} /> -->
<!-- <p>{review.text}</p> -->
<!-- {review.image && <img src={review.image} alt="Review image" />} -->
