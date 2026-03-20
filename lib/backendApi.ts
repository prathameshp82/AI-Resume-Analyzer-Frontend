const DEFAULT_BACKEND_API_URL = "http://127.0.0.1:8000";

export function getBackendApiBaseUrl(): string {
  const rawBaseUrl = process.env.BACKEND_API_URL || DEFAULT_BACKEND_API_URL;
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  if (!/^https?:\/\//.test(baseUrl)) {
    throw new Error("BACKEND_API_URL must include http:// or https://");
  }

  const isLocalhostHttp = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(baseUrl);
  const isInsecureHttp = baseUrl.startsWith("http://");

  if (process.env.NODE_ENV === "production" && isInsecureHttp && !isLocalhostHttp) {
    throw new Error("BACKEND_API_URL must use HTTPS in production");
  }

  return baseUrl;
}

export function backendUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getBackendApiBaseUrl()}${normalizedPath}`;
}

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

