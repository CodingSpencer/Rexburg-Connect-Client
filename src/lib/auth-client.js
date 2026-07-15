import { createAuthClient } from 'better-auth/svelte';

function getAuthBaseUrl() {
    // In development, use the Astro dev server URL so the Vite proxy handles /api requests
    // making everything same-origin and cookies work with sameSite: "lax"
    if (import.meta.env.DEV) {
        return "http://localhost:4321";
    }
    // In production, use the deployed backend
    const configuredUrl = import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "https://rexburg-connect-server.onrender.com";
    return configuredUrl.replace(/\/$/, "");
}

export const authClient = createAuthClient({
    baseURL: getAuthBaseUrl(),
});