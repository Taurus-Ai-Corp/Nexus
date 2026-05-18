"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-gradient-to-b from-gray-900 via-gray-950 to-black text-white min-h-screen antialiased">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md mx-auto text-center">
            {/* Error Illustration */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Application Error</h1>
            <p className="text-gray-400 text-lg mb-8">
              A critical error has occurred. Please reload the page or contact our support team 
              if the problem continues.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={reset}
                className="block w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
              >
                Reload Application
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 rounded-lg font-semibold transition-all duration-200"
                >
                  Go Home
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 rounded-lg font-semibold transition-all duration-200"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}