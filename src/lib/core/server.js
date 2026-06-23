

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverMutation = async(path, data, method = 'POST') => {
    const res = await fetch(`${baseUrl}${path}`, {
        method: method,
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data),
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