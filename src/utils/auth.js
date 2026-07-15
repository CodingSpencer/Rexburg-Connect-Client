// Use relative path when deployed (Netlify proxy handles /api/* → Render)
// Use absolute URL for local development (localhost:4321 → localhost:5001)
// Note: import.meta.env.DEV is safe during build; window is NOT available at SSR time
function getBackendBaseUrl() {
    if (import.meta.env.DEV) {
        return (import.meta.env.PUBLIC_BACKEND_URL || import.meta.env.BACKEND_URL || "http://localhost:5001").replace(/\/$/, "");
    }
    // Deployed (production build): use relative path so Netlify proxy forwards to Render
    return "";
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
