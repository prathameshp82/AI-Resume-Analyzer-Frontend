"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./auth";

export function useProtectedRoute() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    void (async () => {
      const authed = await isAuthenticated();
      if (!authed) {
        router.replace("/login");
        return;
      }
      setChecked(true);
    })();
  }, [router]);

  return checked;
}
