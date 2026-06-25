<script>
  import RatingStars from "./RatingStars.svelte";

  export let event;
</script>

<div class="card">

  <img src={event.image} alt={event.title}>

  <h2>{event.title}</h2>

  <p>{event.description}</p>

  <p><strong>Location:</strong> {event.location}</p>

  <p><strong>Date:</strong> {event.date}</p>

  <RatingStars rating={event.averageRating}/>

  <button>
      View Reviews
  </button>

</div>

<style>
.card{
  border:1px solid #ddd;
  border-radius:12px;
  overflow:hidden;
  padding:1rem;
  max-width:450px;
}

img{
  width:100%;
}

button{
  margin-top:1rem;
}
</style>