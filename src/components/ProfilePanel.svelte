<script>
    import { authClient } from "../lib/auth-client.js";
    import RatingStars from "./RatingStars.svelte";

    // Use the reactive session store
    const sessionStore = authClient.useSession();

    let isEditing = $state(false);

    let editForm = $state({
        name: "",
        profileName: "",
    });

    // Reviews belonging to the signed-in user (the server filters by the
    // user's id from the auth session).
    let userReviews = $state([]);
    let reviewsLoading = $state(false);
    let reviewsError = $state("");

    function startEditing() {
        editForm.name = $sessionStore.data.user.name || "";
        editForm.profileName = $sessionStore.data.user.profileName || "";
        isEditing = true;
    }

    function cancelEditing() {
        isEditing = false;
    }

    async function saveEdits() {
        try {
            await authClient.updateUser(editForm);
            isEditing = false;
        } catch (err) {
            console.error(err);
        }
    }

    // Resolve the backend base URL the same way the auth client does
    // (relative path in production, localhost:5001 in dev).
    function getBackendBaseUrl() {
        if (import.meta.env.DEV) {
            return (
                import.meta.env.PUBLIC_BACKEND_URL ||
                import.meta.env.BACKEND_URL ||
                "http://localhost:5001"
            ).replace(/\/$/, "");
        }
        return "";
    }

    // Grab the current user's reviews using their id (sent via the auth session cookie).
    async function fetchReviews() {
        reviewsLoading = true;
        reviewsError = "";
        try {
            const res = await fetch(
                `${getBackendBaseUrl()}/api/reviews/me`,
                { credentials: "include" }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to load your reviews.");
            }

            const data = await res.json();
            userReviews = data.reviews ?? [];
        } catch (err) {
            console.error(err);
            reviewsError = err.message || "Failed to load your reviews.";
        } finally {
            reviewsLoading = false;
        }
    }

    // Once we know who the user is, fetch their reviews.
    $effect(() => {
        const user = $sessionStore.data?.user;
        if (user?.id) {
            fetchReviews();
        }
    });

    // Track which review (by id) is currently being edited inline.
    let editingReviewId = $state(null);
    // Draft form used while editing a review.
    let editReviewForm = $state({ rating: 0, comment: "" });
    let reviewActionError = $state("");

    function startEditReview(review) {
        reviewActionError = "";
        editingReviewId = review._id;
        editReviewForm = {
            rating: review.rating,
            comment: review.comment,
        };
    }

    function cancelEditReview() {
        editingReviewId = null;
        editReviewForm = { rating: 0, comment: "" };
    }

    async function saveReviewEdit(reviewId) {
        reviewActionError = "";
        try {
            const res = await fetch(
                `${getBackendBaseUrl()}/api/reviews/${reviewId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rating: editReviewForm.rating,
                        comment: editReviewForm.comment,
                    }),
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to update review.");
            }

            editingReviewId = null;
            editReviewForm = { rating: 0, comment: "" };
            await fetchReviews();
        } catch (err) {
            console.error(err);
            reviewActionError = err.message || "Failed to update review.";
        }
    }

    async function deleteReview(reviewId) {
        reviewActionError = "";
        try {
            const res = await fetch(
                `${getBackendBaseUrl()}/api/reviews/${reviewId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to delete review.");
            }

            await fetchReviews();
        } catch (err) {
            console.error(err);
            reviewActionError = err.message || "Failed to delete review.";
        }
    }
</script>

{#if $sessionStore.isPending}
    <div class="loading-container">
        <p>Loading profile...</p>
    </div>
{:else if $sessionStore.data?.user}
    <section class="profile-card">
        <h2>Account details</h2>
        
        {#if isEditing}
            <!-- Edit Profile Form -->
            <div class="edit-form">
                <label for="profileName">
                    Profile Name
                    <input
                        type="text"
                        id="profileName"
                        bind:value={editForm.profileName}
                        placeholder="Profile Name"
                    />
                </label>

                <label for="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        bind:value={editForm.name}
                        placeholder="Name"
                    />
                </label>

                <div class="actions">
                    <button class="secondary-button" type="button" onclick={cancelEditing}>Cancel</button>
                    <button type="button" onclick={saveEdits}>Save</button>
                </div>
            </div>
        {:else}
            <!-- User Data Display -->
            <div class="profile-info">
                <p><strong>Name:</strong> {$sessionStore.data.user.name || "Not provided"}</p>
                <p><strong>Profile Name:</strong> {$sessionStore.data.user.profileName || "Not provided"}</p>
                <p><strong>Email:</strong> {$sessionStore.data.user.email}</p>
            </div>

            <button type="button" onclick={startEditing}>Edit Profile</button>
        {/if}

        <!-- Reviews Section -->
        <div class="reviews">
            <h3>My Reviews</h3>

            {#if reviewsLoading}
                <p class="reviews-status">Loading your reviews...</p>
            {:else if reviewsError}
                <p class="reviews-status reviews-error">{reviewsError}</p>
            {:else if userReviews.length === 0}
                <p class="reviews-status">You haven't written any reviews yet.</p>
            {:else}
                <ul class="review-list">
                    {#each userReviews as review (review._id)}
                        <li class="review-item">
                            {#if editingReviewId === review._id}
                                <!-- Inline edit form -->
                                <div class="review-edit-form">
                                    {#if review.eventId?.title}
                                        <p class="review-event">
                                            <strong>{review.eventId.title}</strong>
                                        </p>
                                    {/if}
                                    <label>
                                        Rating
                                        <RatingStars bind:rating={editReviewForm.rating} />
                                    </label>
                                    <label>
                                        Comment
                                        <textarea
                                            bind:value={editReviewForm.comment}
                                            rows="3"
                                        ></textarea>
                                    </label>
                                    {#if reviewActionError}
                                        <p class="reviews-error reviews-status">{reviewActionError}</p>
                                    {/if}
                                    <div class="review-actions">
                                        <button
                                            class="secondary-button"
                                            type="button"
                                            onclick={cancelEditReview}
                                        >Cancel</button>
                                        <button
                                            type="button"
                                            onclick={() => saveReviewEdit(review._id)}
                                        >Save</button>
                                    </div>
                                </div>
                            {:else}
                                <!-- Display mode -->
                                <div class="review-content">
                                    {#if review.eventId?.title}
                                        <p class="review-event">
                                            <strong>{review.eventId.title}</strong>
                                        </p>
                                    {/if}
                                    <div class="review-stars-wrapper" aria-label={`Rating: ${review.rating} out of 5`}>
                                        {#each Array(5) as _, i}
                                            <span class="star">{i < review.rating ? "★" : "☆"}</span>
                                        {/each}
                                    </div>
                                    <p class="review-comment">{review.comment}</p>
                                    <div class="review-actions">
                                        <button
                                            class="secondary-button"
                                            type="button"
                                            onclick={() => startEditReview(review)}
                                        >Edit</button>
                                        <button
                                            class="danger-button"
                                            type="button"
                                            onclick={() => deleteReview(review._id)}
                                        >Delete</button>
                                    </div>
                                </div>
                            {/if}
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <div class="danger-zone">
            <button class="secondary-button" type="button" onclick={() => authClient.logout()}>Sign out</button>
            <button class="danger-button" type="button" onclick={() => authClient.revoke()}>Delete account</button>
        </div>
    </section>
{:else}
    <div class="loading-container">
        <p>Please sign in to view your profile.</p>
    </div>
{/if}

<style>
    .profile-card {
        max-width: 420px;
        margin: 2rem auto;
        padding: 1.5rem;
        border: 1px solid #dce7f2;
        border-radius: 12px;
        background: #fff;
        box-shadow: 0 10px 30px rgba(15, 44, 92, 0.08);
    }

    .profile-card h2 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #0f2c5c;
        text-align: center;
    }

    .profile-card button {
        width: 100%;
        margin-top: 0.5rem;
    }

    /* Container for viewing details */
    .profile-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        color: #0f2c5c;
    }

    .profile-info p {
        margin: 0;
        font-size: 0.95rem;
        border-bottom: 1px solid #f0f4f8;
        padding-bottom: 0.5rem;
    }

    .profile-info strong {
        font-weight: 600;
    }

    /* Editing state container */
    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 1.5rem;
    }

    label {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
        font-weight: 600;
        color: #0f2c5c;
    }

    input {
        padding: 0.7rem 0.8rem;
        border: 1px solid #c5d6e8;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s;
    }

    input:focus {
        border-color: #0f2c5c;
    }

    /* Action spacing on Edit buttons */
    .actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .actions button {
        flex: 1;
    }

    /* Reviews Section */
    .reviews {
        margin-top: 2rem;
        border-top: 1px solid #eef3f8;
        padding-top: 1.5rem;
    }

    .reviews h3 {
        margin-top: 0;
        margin-bottom: 1rem;
        color: #0f2c5c;
        font-size: 1.15rem;
        font-weight: 700;
    }

    .reviews-status {
        font-size: 0.9rem;
        color: #5a718c;
        margin: 0.5rem 0;
    }

    .reviews-error {
        color: #b42318;
        font-weight: 600;
    }

    .review-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .review-item {
        border: 1px solid #e1ecf7;
        border-radius: 8px;
        padding: 0.75rem 1rem;
        background-color: #fcfdfe;
    }

    .review-content {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .review-event {
        margin: 0;
        font-size: 0.9rem;
        color: #0f2c5c;
    }

    .review-stars-wrapper {
        display: inline-flex;
    }

    .review-comment {
        margin: 0.25rem 0 0 0;
        font-size: 0.85rem;
        color: #3b516b;
        line-height: 1.4;
    }

    /* Separated utility buttons at the bottom */
    .danger-zone {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 1.5rem;
        padding-top: 1.25rem;
        border-top: 1px solid #eef3f8;
    }

    /* Standard Button Styles */
    button {
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        background: #0f2c5c;
        color: #fff;
        transition: opacity 0.2s;
    }

    button:hover {
        opacity: 0.9;
    }

    .secondary-button {
        background: #5ea8e8;
        color: #fff;
    }

    .danger-button {
        background: #b42318;
        color: #fff;
    }

    .loading-container {
        text-align: center;
        margin: 4rem auto;
        color: #0f2c5c;
        font-weight: 600;
    }
</style>