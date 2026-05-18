import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist. Return to Atlas AI's homepage or explore our features.",
};

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl font-bold text-white">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-lg mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
          >
            Return Home
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/features"
              className="px-6 py-3 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 rounded-lg font-semibold transition-all duration-200"
            >
              Explore Features
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-indigo-400 rounded-lg font-semibold transition-all duration-200"
            >
              Contact Support
            </Link>
          </div>
        </div>
        
        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Popular Pages</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Start Free Trial
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                View Pricing
              </Link>
            </li>
            <li>
              <Link href="/features" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                See All Features
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Get in Touch
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}