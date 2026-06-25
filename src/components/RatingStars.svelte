<script>
    export let rating = 0;

    const stars = (num) => {
        return "★".repeat(Math.round(num)) +
               "☆".repeat(5 - Math.round(num));
    };
</script>

<span class="stars">
    {stars(rating)}
</span>

<style>
.stars{
    color:gold;
    font-size:1.2rem;
}
</style>