import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    path: "/api/resume/optimize/",
    method: "POST",
    bodyType: "json",
  });
}
