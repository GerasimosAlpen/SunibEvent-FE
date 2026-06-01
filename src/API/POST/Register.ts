import * as API from "../../lib/API"

type data = {
    name: string;
    email: string;
    password: string;
};

export async function register(name: string,email: string, password: string) {
    const payload: data = { name, email, password };

    const res = await fetch(`${API.API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    return await res.json();
}