function getBackendBaseUrl() {
    // In development, use the Astro dev server so the Vite proxy handles /api
    // This keeps everything same-origin so cookies work with sameSite: "lax"
    if (import.meta.env.DEV) {
        return "http://localhost:4321";
    }
    // In production, use the deployed backend
    const configuredUrl = import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "https://rexburg-connect-server.onrender.com";
    return configuredUrl.replace(/\/$/, "");
}

function getAuthBaseUrl() {
    return `${getBackendBaseUrl()}/api/auth`;
}

async function requestAuth(path, options = {}) {
    const response = await fetch(`${getAuthBaseUrl()}${path}`, {
        credentials: "include",
        headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        },
        ...options,
    });

    const payload = await response.text();
    let data = null;

    if (payload) {
        try {
        data = JSON.parse(payload);
        } catch {
        data = payload;
        }
    }

    if (!response.ok) {
        const message = data?.message || "Authentication request failed.";
        throw new Error(message);
    }

    return data;
}

export async function signInWithEmail({ email, password }) {
  return requestAuth("/sign-in/email", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signUpWithEmail({ name, email, password }) {
  return requestAuth("/sign-up/email", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getSession() {
  return requestAuth("/get-session", { method: "GET" });
}

export async function signOut() {
  return requestAuth("/sign-out", { method: "POST" });
}
