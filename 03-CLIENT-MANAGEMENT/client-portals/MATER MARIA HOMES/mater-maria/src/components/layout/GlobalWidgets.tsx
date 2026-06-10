"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const FloatingWhatsApp = dynamic(() => import("@/components/invest/FloatingWhatsApp").then(m => m.FloatingWhatsApp), { ssr: false });
const SocialProofToast = dynamic(() => import("@/components/ui/social-proof-toast").then(m => m.SocialProofToast), { ssr: false });
const StickyBottomBar = dynamic(() => import("@/components/layout/StickyBottomBar").then(m => m.StickyBottomBar), { ssr: false });
const ExitIntentModal = dynamic(() => import("@/components/ui/exit-intent-modal").then(m => m.ExitIntentModal), { ssr: false });

export function GlobalWidgets() {
  const pathname = usePathname();

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
