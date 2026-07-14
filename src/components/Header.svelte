<script>
  import { authClient } from "../lib/auth-client.js";

  // Subscribe to the reactive session store
  const sessionStore = authClient.useSession();
  
  let loading = $state(false);

  async function handleSignOut() {
    loading = true;
    await authClient.signOut();
    loading = false;
    // The UI will update automatically because sessionStore is reactive
  }
</script>

<header class="site-header">
  <a href="/" class="logo-link">
    <img src="/images/logo.png" alt="Rexburg Connect Logo" class="logo" />
  </a>

  <nav class="nav-links">
    <a href="/">HOME</a>
    <!-- <a href="/event">EVENTS</a> -->

    <!-- Use $sessionStore.data to access the session information -->
    {#if $sessionStore.data?.user}
      <a href="/profile">PROFILE</a>
      <button type="button" class="nav-button" on:click={handleSignOut} disabled={loading}>
        {loading ? "LOGGING OUT..." : "LOG OUT"}
      </button>
    {:else}
      <a href="/login">LOGIN</a>
    {/if}
  </nav>
</header>

<style>
  * {
    box-sizing: border-box;
  }

  .site-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 2.5rem;
    background: #fff;
    border-bottom: 3px solid #0f2c5c;
    box-shadow: 0 4px 14px rgba(15, 44, 92, 0.08);
  }

  .logo-link {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .logo {
    width: 90px;
    height: auto;
    display: block;
  }

  .nav-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(1rem, 3vw, 2rem);
    flex-wrap: wrap;
  }

  .nav-links a,
  .nav-button {
    color: #0f2c5c;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.4px;
    position: relative;
    padding: 0.35rem 0;
    transition: color 0.25s ease;
    background: none;
    border: none;
    cursor: pointer;
  }

  .nav-links a::after,
  .nav-button::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4px;
    width: 0%;
    height: 3px;
    background: #5ea8e8;
    border-radius: 999px;
    transform: translateX(-50%);
    transition: width 0.25s ease;
  }

  .nav-links a:hover,
  .nav-button:hover {
    color: #5ea8e8;
  }

  .nav-links a:hover::after,
  .nav-button:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    .site-header {
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .logo {
      width: 75px;
    }

    .nav-links {
      width: 100%;
      justify-content: center;
      gap: 1.25rem;
    }

    .nav-links a,
    .nav-button {
      font-size: 0.95rem;
    }
  }
</style>