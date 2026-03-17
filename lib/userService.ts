/**
 * userService.ts
 * Frontend service functions that call the restaurant backend's /api/users endpoints.
 */
import { apiFetch } from "./api";

export interface BackendUser {
  _id: string;
  username: string;
  email: string;
  firebaseUid: string;
  role: "admin" | "owner";
  photoURL: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  firebaseUid?: string;
  photoURL?: string;
}

interface UpsertPayload {
  username?: string;
  email: string;
  firebaseUid?: string;
  photoURL?: string;
}

/**
 * POST /api/users/register
 * Creates a brand-new user in MongoDB.
 * Throws if the user already exists (HTTP 400).
 */
export async function registerUserInDB(
  payload: RegisterPayload
): Promise<{ message: string; user: BackendUser }> {
  return apiFetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/users/upsert
 * Creates the user if new, or links the Firebase UID if missing.
 * Safe to call on every Google / social sign-in.
 */
export async function upsertUserInDB(
  payload: UpsertPayload
): Promise<{ message: string; user: BackendUser }> {
  return apiFetch("/api/users/upsert", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * GET /api/users/:email/exists
 * Quick check before attempting to create a user.
 */
export async function checkUserExists(
  email: string
): Promise<{ exists: boolean }> {
  return apiFetch(`/api/users/${encodeURIComponent(email)}/exists`);
}

/**
 * GET /api/users/:email
 * Fetches full user profile. Requires a Firebase token.
 */
export async function getUserByEmail(
  email: string,
  token: string
): Promise<BackendUser> {
  return apiFetch(`/api/users/${encodeURIComponent(email)}`, { token });
}
