'use client';

import { Users, Zap, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        {/* Logo & Tagline */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            TAURUS <span className="text-blue-400">Agency OS</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            The operating system for modern marketing agencies. 
            Double your margins without adding headcount.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <Users className="h-10 w-10 text-blue-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Client Management</h3>
            <p className="text-slate-400 text-sm">Manage subscriptions, plans, and billing in one place</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <Zap className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">AI Agents</h3>
            <p className="text-slate-400 text-sm">Automated SEO, social content, and audits</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <Shield className="h-10 w-10 text-green-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">PQC Security</h3>
            <p className="text-slate-400 text-sm">Post-quantum cryptographic audit trails</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 text-center">
            <TrendingUp className="h-10 w-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Scale Faster</h3>
            <p className="text-slate-400 text-sm">95% margins vs traditional 50%</p>
          </div>
        </div>

        {/* Sign In / Sign Up Buttons */}
        <div className="max-w-md mx-auto">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-600 rounded-2xl p-8 text-center space-y-4">
            <Link
              href="/sign-in"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Sign In to Your Agency
            </Link>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">or</span>
              </div>
            </div>
            
            <Link
              href="/sign-up"
              className="block w-full bg-transparent border border-slate-500 hover:border-slate-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Create New Agency Account
            </Link>
          </div>
          <p className="text-center text-slate-500 text-sm mt-4">
            Powered by Gemini 1.5 Pro • Nemotron-3 • Heiro Audit
          </p>
        </div>
      </div>
    </div>
  );
}