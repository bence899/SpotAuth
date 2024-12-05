"use client";
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-green-400 hover:text-green-300 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">Dashboard</h1>
          <p className="text-zinc-400">
            Welcome to your dashboard. Here you can verify track metadata.
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <Link
            href="/verify"
            className="bg-green-500 hover:bg-green-600 text-black px-8 py-3 rounded-lg font-medium"
          >
            Verify Metadata
          </Link>
        </div>
      </div>
    </div>
  );
} 