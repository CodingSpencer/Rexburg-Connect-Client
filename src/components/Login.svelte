<h2>Login</h2>

<form onsubmit={loginHandler} class="login-form">
  <label>
    Email:
    <input type="text">
    <!-- <input type="email" bind:value={email} required /> -->
  </label>
  <label>
    Password:
    <input type="text">
    <!-- <input type="password" bind:value={password} required /> -->
  </label>
  <button type="submit">Login</button>
</form>