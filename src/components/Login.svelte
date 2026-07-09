<script>
  import { onMount } from "svelte";
  import { authClient } from "../lib/auth-client.js";
  import { getSession, signInWithEmail, signOut } from "../utils/auth.js";
  import { ValueListNode } from "kysely";
  import { on } from "svelte/events";

  let email = $state("");
  let password = $state("");
  let profile_name = $state("");
  let name = $state("");
  let loading = $state(false);
  let error = $state("");
  let visible = $state(false);

  // This is a Nano Store under the hood, so it keeps its classic '$' auto-subscription
  const sessionStore = authClient.useSession();

  async function handleSubmit(event) {
    event.preventDefault();
    loading = true;
    error = "";

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    loading = false;

    if (authError) {
      error = authError.message || "Login failed.";
    } else if (data) {
      window.location.assign("/profile");
    }
  }

  async function handleSignOut() {
    loading = true;
    const { error: authError } = await authClient.signOut();
    loading = false;

    if (authError) {
      error = authError.message || "Unable to sign out.";
    }
  }
</script>

<div class="auth-card">
  <!-- Use $sessionStore.data to check if a user is logged in -->
  <h2>{$sessionStore.data?.user ? "Welcome back" : "Login"}</h2>

  {#if $sessionStore.data?.user}
    <p>
      Signed in as {$sessionStore.data.user.name ||
        $sessionStore.data.user.email}
    </p>
    <button type="button" class="secondary-button" on:click={handleSignOut}>
      {loading ? "Signing out..." : "Sign out"}
    </button>
  {:else}
    <form on:submit={handleSubmit} class="login-form">
      <label for="name" class="sign-up" class:visible
        >First and Last Name
        <input type="text" bind:value={name} id="name" />
      </label>
      <label for="profile_name"
        >Profile Name
        <input type="text" bind:value={profile_name} />
      </label>
      <label for="email" class="sign-up" class:visible
        >Email
        <input bind:value={email} type="email" id="email" required />
      </label>
      <label for="password"
        >Password
        <input bind:value={password} type="password" id="password" required />
      </label>

      {#if error}
        <p class="error">{error}</p>
      {/if}

      <div class="login-buttons">
        {#if !visible}
          <button
            type="button"
            id="new-account"
            on:click={() => (visible = true)}>Create new account</button
          >
        {:else}
          <button
            type="button"
            id="new-account"
            on:click={() => (visible = false)}>Use Existing Account</button
          >
        {/if}
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .login-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;

    button {
      width: 200px;
    }
  }

  .sign-up {
    display: none;
  }

  .visible {
    display: flex;
  }

  .auth-card {
    max-width: 420px;
    margin: 2rem auto;
    padding: 1.5rem;
    border: 1px solid #dce7f2;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 10px 30px rgba(15, 44, 92, 0.08);

    h2 {
      justify-self: center;
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
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
  }

  button {
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    background: #0f2c5c;
    color: #fff;
  }

  .secondary-button {
    background: #5ea8e8;
  }

  .error {
    color: #b42318;
    margin: 0;
  }
</style>
