
const auth = btoa(`${process.env.NEXT_PUBLIC_API_USER}:${process.env.NEXT_PUBLIC_API_PASSWORD}`);

export async function apiFetch(path: string, options?: RequestInit) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Basic ${auth}`,
			...(options?.headers || {}),
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`API error: ${res.status} - ${text}`);
	}

	return res.json();
}