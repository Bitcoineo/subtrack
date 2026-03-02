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
      className="mb-6 flex items-center justify-between rounded-xl bg-green-50 px-5 py-3.5 cursor-pointer transition-opacity duration-150"
    >
      <p className="text-sm font-medium text-[#00B85E]">
        Welcome to your new plan! Your subscription is now active.
      </p>
      <span className="text-xs text-green-400 ml-4 shrink-0">Dismiss</span>
    </div>
  );
}
