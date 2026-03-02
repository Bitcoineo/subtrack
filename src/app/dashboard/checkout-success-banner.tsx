"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function CheckoutSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") !== "success") return;

    setVisible(true);
    router.replace("/dashboard", { scroll: false });

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams, router]);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 cursor-pointer transition-opacity"
    >
      <p className="text-sm font-medium text-green-800">
        Welcome to your new plan! Your subscription is now active.
      </p>
      <span className="text-xs text-green-600 ml-4 shrink-0">Dismiss</span>
    </div>
  );
}
