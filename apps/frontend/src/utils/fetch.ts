const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

type FetchOptions = Omit<RequestInit, "body"> & { body?: any };

export async function apiFetch(path: string, options: FetchOptions = {}) {
    const url = `${BASE_URL}${path}`;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    const fetchOptions: RequestInit = {
        ...options,
        headers,
    };

    if (options.body && typeof options.body !== "string") {
        fetchOptions.body = JSON.stringify(options.body);
    }

    const res = await fetch(url, fetchOptions);

    const contentType = res.headers.get("content-type") || "";
    let data;
    if (contentType.includes("application/json")) {
        data = await res.json();
    } else {
        data = await res.text();
    }

    if (!res.ok) {
        return { error: { status: res.status, message: data } };
    }

    return { data, headers: res.headers };
}
