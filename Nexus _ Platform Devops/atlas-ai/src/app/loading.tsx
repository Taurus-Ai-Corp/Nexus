import Link from "next/link";

export default function LoadingPage() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        {/* Loading Animation */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Loading Atlas AI</h1>
        <p className="text-gray-400 text-lg mb-8">
          Please wait while we prepare your marketing automation platform...
        </p>
        
        {/* Progress Indicators */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Initializing AI agents</span>
            <span>✓</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Loading templates</span>
            <span>✓</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Preparing dashboard</span>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
          </div>
        </div>
        
        <div className="mt-12">
          <Link
            href="/"
            className="text-indigo-400 hover:text-indigo-300 transition-colors text-sm"
          >
            Having trouble? Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}