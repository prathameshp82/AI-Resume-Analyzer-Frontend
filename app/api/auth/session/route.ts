import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const username = req.cookies.get("auth_user")?.value || null;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false, username: null }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, username }, { status: 200 });
}

