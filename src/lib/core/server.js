import { getAuthToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

async function authHeader() {
  const token = await getAuthToken();
  return token ? { authorization: `Bearer ${token}` } : {};
}

export const serverMutation = async (path, data, method = "POST") => {
  const hasBody = method !== "DELETE" && method !== "GET";
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
      ...(await authHeader()),
    },
    body: hasBody ? JSON.stringify(data) : undefined,
  });
  return res.json();
};

export const serverQuery = async (path, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    cache: "no-store",
  });
  return res.json();
};
