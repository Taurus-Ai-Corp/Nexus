"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-400 text-lg mb-8">
          We apologize for the inconvenience. An unexpected error has occurred. 
          Please try again or contact our support team if the problem persists.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="block w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
          >
            Try Again
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
        
        {/* Error Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-800 rounded-lg text-left">
            <summary className="cursor-pointer font-semibold text-sm text-gray-400 mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs text-red-400 overflow-auto">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}