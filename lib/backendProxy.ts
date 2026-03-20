import { NextRequest, NextResponse } from "next/server";
import { backendUrl } from "@/lib/backendApi";

type BodyType = "json" | "formData" | "none";

interface ProxyOptions {
  path: string;
  method: "GET" | "POST";
  bodyType?: BodyType;
}

export async function proxyToBackend(req: NextRequest, options: ProxyOptions) {
  const accessToken = req.cookies.get("access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${accessToken}`,
    };
    let body: BodyInit | undefined;

    if (options.bodyType === "json") {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(await req.json());
    } else if (options.bodyType === "formData") {
      body = await req.formData();
    }

    const upstreamResponse = await fetch(backendUrl(options.path), {
      method: options.method,
      headers,
      body,
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      if (upstreamResponse.status === 401) {
        return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 });
      }
      if (upstreamResponse.status === 400) {
        return NextResponse.json({ error: "Request could not be processed." }, { status: 400 });
      }
      return NextResponse.json({ error: "Unable to process request right now." }, { status: upstreamResponse.status });
    }

    const contentType = upstreamResponse.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Unexpected response from upstream service." }, { status: 502 });
    }

    const responseBody = await upstreamResponse.json();

    return NextResponse.json(responseBody, { status: upstreamResponse.status });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return NextResponse.json({ error: "Unable to process request right now." }, { status: 502 });
  }
}

