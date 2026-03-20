import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backendApi";

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
      return NextResponse.json(
        { error: "Unable to register with the provided details." },
        { status: upstreamResponse.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json({ error: "Unable to create account right now. Please try again." }, { status: 500 });
  }
}

