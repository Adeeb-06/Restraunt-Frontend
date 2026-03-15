export const setAuthCookie = () => {
  const isSecure = location.protocol === "https:";
  document.cookie = `firebase-auth=true; path=/; max-age=86400; SameSite=Lax${isSecure ? "; Secure" : ""}`;
};

/**
 * Sets the auth cookie then does a HARD navigation (not client-side push).
 * This forces the browser to send the cookie in the next request,
 * so Edge middleware sees it immediately.
 */
export const setAuthCookieAndRedirect = (path: string) => {
  setAuthCookie();
  window.location.href = path;
};
