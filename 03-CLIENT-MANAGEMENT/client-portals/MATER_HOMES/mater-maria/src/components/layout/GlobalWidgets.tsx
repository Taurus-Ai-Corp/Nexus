"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/invest/FloatingWhatsApp";
import { SocialProofToast } from "@/components/ui/social-proof-toast";
import { StickyBottomBar } from "@/components/layout/StickyBottomBar";
import { ExitIntentModal } from "@/components/ui/exit-intent-modal";

export function GlobalWidgets() {
  const pathname = usePathname();

  // Don't show on admin pages
  if (pathname?.startsWith("/invest/admin")) return null;

  return (
    <>
      <FloatingWhatsApp />
      <SocialProofToast />
      <StickyBottomBar />
      <ExitIntentModal />
    </>
  );
}
