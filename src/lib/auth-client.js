import { createAuthClient } from 'better-auth/svelte';

// Use relative path when deployed (Netlify proxy handles /api/* → Render)
// Use absolute URL for local development (localhost:4321 → localhost:5001)
const isLocal = import.meta.env.DEV || window.location.hostname === "localhost";

function getBackendBaseUrl() {
    if (isLocal) {
        return import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "http://localhost:5001";
    }
    // Deployed: use relative path so Netlify proxy forwards to Render
    return "";
}

export const authClient = createAuthClient({
    baseURL: getBackendBaseUrl(),
});
