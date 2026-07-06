<script>
    export let rating = 0;
  
    $: roundedRating = Math.round(rating);
    $: stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
  </script>
  
  <span class="stars">{stars}</span>
  
  <style>
    .stars {
      color: #facc15;
      font-size: 1.2rem;
    }
  </style>