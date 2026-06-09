"use client";

import Link from "next/link";

export default function StickyCTA() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm sm:hidden z-50">
      <Link 
        href="/signup"
        className="block w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-center font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        Start Free Trial
      </Link>
    </div>
  );
}