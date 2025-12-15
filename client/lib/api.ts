// client/lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiPost(path: string, body: Record<string, unknown>) {
  const res = await fetch(BASE_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include", // ⭐⭐⭐ REQUIRED ⭐⭐⭐
  });

  if (!res.ok) throw new Error("POST failed");
  return res.json();
}

export async function apiGet(path: string) {
  const res = await fetch(BASE_URL + path, {
    method: "GET",
    credentials: "include", // ⭐ REQUIRED
    cache: "no-store",
  });

  if (!res.ok) throw new Error("GET failed");
  return res.json();
}
