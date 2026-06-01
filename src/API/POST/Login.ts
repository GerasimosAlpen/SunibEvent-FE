import * as API from "../../lib/API"

type data = {
    email: string;
    password: string;
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

    return await res.json();
}