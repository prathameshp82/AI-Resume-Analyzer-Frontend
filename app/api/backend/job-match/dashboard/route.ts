import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export async function GET(req: NextRequest) {
  return proxyToBackend(req, { path: "/api/job-match/dashboard/", method: "GET", bodyType: "none" });
}

