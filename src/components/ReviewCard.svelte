<script lang="ts">
  import RatingStars from "./RatingStars.svelte";
  // let { review }: { review: Review } = $props();
  let rating = 0;
</script>

<form action="/" id="review">
  <label for="comment">Comment</label>
  <input type="text" id="comment"/>

  <label for="rating">Rating</label>
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
    border-color: #f5b301;
    box-shadow: 0 0 0 3px rgba(245, 179, 1, 0.2);
  }

  #review > button {
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 8px;
    background: #f5b301;
    color: #222;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  #review button:hover {
    background: #d99d00;
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
