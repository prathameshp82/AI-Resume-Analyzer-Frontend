interface SessionResponse {
  authenticated: boolean;
  username: string | null;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function loginUser(username: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password.");
  }
}

export async function registerUser(username: string, email: string, password: string): Promise<void> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    throw new Error("Unable to register with the provided details.");
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  window.location.href = "/login";
}

export async function getSession(): Promise<SessionResponse> {
  const res = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
  const data = (await safeJson(res)) as SessionResponse | null;

  if (!res.ok || !data) {
    return { authenticated: false, username: null };
  }

  return {
    authenticated: !!data.authenticated,
    username: data.username || null,
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.authenticated;
}

export async function getUsername(): Promise<string | null> {
  const session = await getSession();
  return session.username;
}
