import { createAuthClient } from 'better-auth/svelte';

// Use relative path when deployed (Netlify proxy handles /api/* → Render)
// Use absolute URL for local development (localhost:4321 → localhost:5001)
// Note: import.meta.env.DEV is safe during build; window is NOT available at SSR time
function getBackendBaseUrl() {
    if (import.meta.env.DEV) {
        return import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "http://localhost:5001";
    }
    // Deployed (production build): use relative path so Netlify proxy forwards to Render
    return "";
}

export const authClient = createAuthClient({
    baseURL: getBackendBaseUrl(),
});
