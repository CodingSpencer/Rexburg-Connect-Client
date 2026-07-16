<script>
  import EventAverageRating from "./EventAverageRating.svelte";

  export let event;
</script>

<article class="event-card">
  <img
    src={event.image}
    alt={event.title}
    class="event-image"
  />

  <div class="event-info">
    <div class="event-header">
      <h3>{event.title}</h3>

      <EventAverageRating
        eventId={event.mongoId}
        fallbackRating={event.averageRating}
      />
    </div>

    <p class="event-description">
      {event.description}
    </p>

    <div class="event-details">
      <span>📅 {event.date}</span>
      <span>📍 {event.location}</span>
    </div>

    <a
      href={`/event/${event.id}`}
      class="event-button"
    >
      View Event
    </a>
  </div>
</article>

<style>
  .event-card {
    display: flex;
    gap: 1.25rem;
    border: 1px solid #dbe5f3;
    border-radius: 18px;
    padding: 1rem;
    background: white;
    box-shadow: 0 4px 12px rgba(15, 44, 92, 0.08);
    margin-bottom: 2rem;
  }

  .event-image {
    width: 180px;
    height: 130px;
    object-fit: cover;
    border-radius: 14px;
    flex-shrink: 0;
  }

  .event-info {
    flex: 1;
  }

  .event-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

  h3 {
    margin: 0;
    color: #0f2c5c;
    font-size: 1.35rem;
  }

  .event-description {
    color: #334155;
    line-height: 1.5;
    margin: 0.75rem 0;
  }

  .event-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    color: #475569;
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .event-button {
    display: inline-block;
    background: #0f2c5c;
    color: white;
    padding: 0.55rem 1rem;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
  }

  .event-button:hover {
    background: #4a90e2;
  }

  @media (max-width: 700px) {
    .event-card {
      flex-direction: column;
    }

    .event-image {
      width: 100%;
      height: 200px;
    }

    .event-header {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>