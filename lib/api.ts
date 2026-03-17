/**
 * Centralized API client for the restaurant backend.
 * All requests automatically attach the Firebase Bearer token when available.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  token?: string; // Firebase ID token (optional)
};

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { token, headers = {}, ...rest } = options;

  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
    credentials: "include",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      (errorBody as { message?: string }).message ||
      `API error: ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  // 204 No Content — return empty object
  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  imageUrl: string;
  items?: string[];
}

export async function fetchCategories(token?: string): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories", { token });
}

export async function createCategory(data: Partial<Category>, token?: string): Promise<Category> {
  return apiFetch<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function updateCategory(id: string, data: Partial<Category>, token?: string): Promise<Category> {
  return apiFetch<Category>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteCategory(id: string, token?: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
}

// ─── Items API ─────────────────────────────────────────────────────────────

export interface Item {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | Category; // Depends on if it's populated
  image: string;
  showInMenu: boolean;
}

export async function fetchItems(categoryId?: string, token?: string): Promise<Item[]> {
  const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : "";
  return apiFetch<Item[]>(`/api/items${query}`, { token });
}

export async function createItem(data: Partial<Item>, token?: string): Promise<Item> {
  return apiFetch<Item>("/api/items/create", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  });
}

export async function updateItem(id: string, data: Partial<Item>, token?: string): Promise<Item> {
  return apiFetch<Item>(`/api/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    token,
  });
}

export async function deleteItem(id: string, token?: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/api/items/${id}`, {
    method: "DELETE",
    token,
  });
}
