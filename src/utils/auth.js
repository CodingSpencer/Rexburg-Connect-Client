const DEFAULT_AUTH_BASE_URL = "http://localhost:3001/api/auth";

function getAuthBaseUrl() {
    return import.meta.env.PUBLIC_AUTH_API_URL || DEFAULT_AUTH_BASE_URL;
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
