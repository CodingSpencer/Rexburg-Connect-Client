<script>
    import { authClient } from "../lib/auth-client.js";

    // Use the reactive session store
    const sessionStore = authClient.useSession();
</script>

<!-- $sessionStore.isPending replaces your manual loading state -->
{#if $sessionStore.isPending}
    <p>Loading profile...</p>
{:else if $sessionStore.data?.user}
    <section class="profile-card">
        <h2>Account details</h2>
        <!-- Access user data directly from the store -->
        <p><strong>Name:</strong> {$sessionStore.data.user.name || "Not provided"}</p>
        <p><strong>Email:</strong> {$sessionStore.data.user.email}</p>
    </section>
{:else}
    <p>Please sign in to view your profile.</p>
{/if}

<style>
    .profile-card {
        max-width: 480px;
        margin-top: 1rem;
        padding: 1.25rem;
        border: 1px solid #dce7f2;
        border-radius: 12px;
        background: #fff;
    }
</style>