import { NextResponse } from "next/server";
import { AUTH_COOKIE_OPTIONS } from "@/lib/backendApi";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("access_token", "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set("refresh_token", "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set("auth_user", "", { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}

