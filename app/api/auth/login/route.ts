import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS, backendUrl } from "@/lib/backendApi";

interface TokenResponse {
  access?: string;
  refresh?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const upstreamResponse = await fetch(backendUrl("/api/token/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
    }

    const data = (await upstreamResponse.json()) as TokenResponse;
    if (!data.access || !data.refresh) {
      return NextResponse.json({ error: "Authentication service returned an invalid response." }, { status: 502 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("access_token", data.access, AUTH_COOKIE_OPTIONS);
    response.cookies.set("refresh_token", data.refresh, AUTH_COOKIE_OPTIONS);
    response.cookies.set("auth_user", username, AUTH_COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json({ error: "Unable to sign in right now. Please try again." }, { status: 500 });
  }
}

