import { API_BASE_URL } from "../../lib/API";

/**
 * Redirect the user to the backend's Google OAuth flow.
 * The backend handles the consent screen and callback;
 * after success it typically redirects back to the frontend
 * with a token (query-param or cookie).
 */
export function redirectToGoogleAuth() {
	window.location.href = `${API_BASE_URL}/auth/google`;
}

/**
 * Exchange a Google OAuth callback code/token for a session.
 * Call this from the OAuth callback page if your backend
 * returns a code instead of auto-redirecting with a cookie.
 */
export async function exchangeGoogleCode(code: string) {
	const res = await fetch(`${API_BASE_URL}/auth/google/callback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code }),
	});

	return await res.json();
}
