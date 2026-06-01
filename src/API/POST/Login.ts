import * as API from "../../lib/API"

type data = {
    email: string;
    password: string;
};

type LoginResponse = {
    token?: string;
    message?: string;
    error?: string;
    [key: string]: unknown;
};

export default async function Login(
    email: string,
    password: string,
    bearerToken?: string
) {
    const payload: data = { email, password };

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (bearerToken) {
        headers.Authorization = `Bearer ${bearerToken}`;
    }

    const res = await fetch(`${API.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    const data: LoginResponse = await res.json();

    if (!res.ok) {
        // Surface the server's error/message for 401, 404, etc.
        const message =
            data?.message || data?.error || getDefaultError(res.status);
        return { error: message };
    }

    return data;
}

function getDefaultError(status: number): string {
    switch (status) {
        case 400:
            return "Invalid request. Please check your input.";
        case 401:
            return "Incorrect email or password.";
        case 404:
            return "Account not found. Please sign up first.";
        case 429:
            return "Too many attempts. Please try again later.";
        default:
            return "Login failed. Please try again.";
    }
}