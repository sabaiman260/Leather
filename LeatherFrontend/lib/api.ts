// Default to the backend server port (index.js uses PORT 4000 in your setup)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options, // ✅ move FIRST
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  let body: any = null
  try {
    body = await res.json()
  } catch {}

  if (!res.ok) {
    throw new Error(
      body?.message ||
        body?.error ||
        (res.status === 401
          ? 'Unauthorized'
          : res.status === 403
          ? 'Forbidden'
          : 'Something went wrong')
    )
  }

  return body
}
export type BackendProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discount?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  specs?: string[];
  category?: { _id: string; name?: string; type?: string } | string;
  imageUrls?: string[];
  // `images` may contain raw keys or URLs depending on the endpoint — include for admin UI
  images?: string[];
};
