import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backendApi";

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = typeof body?.username === "string" ? body.username.trim() : "";
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required." }, { status: 400 });
    }

    const upstreamResponse = await fetch(backendUrl("/api/users/register/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const data = await safeJson(upstreamResponse);
      const backendError =
        (data && typeof data === "object" && "error" in data && typeof data.error === "string" && data.error) ||
        (data && typeof data === "object" && "detail" in data && typeof data.detail === "string" && data.detail) ||
        null;

      // Bubble up useful validation/conflict errors to users.
      if (upstreamResponse.status >= 400 && upstreamResponse.status < 500) {
        return NextResponse.json(
          { error: backendError || "Unable to register with the provided details." },
          { status: upstreamResponse.status }
        );
      }

      console.error("Register upstream error:", upstreamResponse.status, data);
      return NextResponse.json(
        { error: "Unable to register with the provided details." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json({ error: "Unable to create account right now. Please try again." }, { status: 500 });
  }
}

