import { createAuthClient } from 'better-auth/svelte';

function getBackendBaseUrl() {
    const configuredUrl = import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "https://rexburg-connect-server.onrender.com";
    return configuredUrl.replace(/\/$/, "");
}

export const authClient = createAuthClient({
    baseURL: getBackendBaseUrl(),
});