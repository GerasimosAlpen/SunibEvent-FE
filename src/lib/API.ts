export type ApiError = {
	message: string;
	status?: number;
};

export const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL ?? "https://sunib-event-be-deploy.vercel.app/api";

type RequestOptions = Omit<RequestInit, "body"> & {
	body?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers ?? {}),
		},
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
	});

	let data: unknown;
	try {
		data = await res.json();
	} catch {
		data = { message: "Invalid server response" };
	}

	if (!res.ok) {
		const message =
			typeof data === "object" && data && "message" in data
				? String((data as { message?: string }).message)
				: "Request failed";
		throw { message, status: res.status } as ApiError;
	}

	return data as T;
}

export type RegisterPayload = {
	name: string;
	email: string;
	password: string;
};

export type RegisterResponse = {
	id?: string;
	name?: string;
	email?: string;
	token?: string;
	message?: string;
};

export const api = {
	register(payload: RegisterPayload) {
		return request<RegisterResponse>("/auth/register", {
			method: "POST",
			body: payload,
		});
	},
	request,
};
