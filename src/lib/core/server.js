

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverMutation = async(path, data, method = 'POST') => {
    const hasBody = method !== 'DELETE' && method !== 'GET';
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: hasBody ? {
            'Content-Type' : 'application/json',
        } : undefined,
        body: hasBody ? JSON.stringify(data) : undefined,
    });
    return res.json();
}

export const serverQuery = async(path, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        cache: 'no-store',
    });
    return res.json();
}