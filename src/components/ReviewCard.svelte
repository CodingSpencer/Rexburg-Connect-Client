<script>
  import RatingStars from "./RatingStars.astro";
  const { review } = Astro.props;

</script>

<article class="review-card">
  <div class="review-header">
    <h3>{review.username}</h3>
    <RatingStars rating={review.rating} />
  </div>

  <p>{review.text}</p>

  <!-- {review.image && <img src={review.image} alt="Review image" />} -->
</article>