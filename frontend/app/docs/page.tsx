"use client";
import Link from "next/link";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/"
            className="text-green-400 hover:text-green-300 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-green-400 mb-8">SpotAuth-Lite Documentation</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Overview</h2>
            <p className="text-zinc-400 mb-4">
              SpotAuth-Lite is a microservice designed to detect potentially fraudulent or AI-generated music uploads
              by analyzing metadata patterns. It helps protect music catalogs from unauthorized or synthetic content.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">How It Works</h2>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">1. Metadata Verification</h3>
              <p className="text-zinc-400">
                The system compares submitted track metadata against a verified catalog. It looks for:
              </p>
              <ul className="list-disc list-inside text-zinc-400 mt-2 space-y-2">
                <li>Title patterns and naming conventions</li>
                <li>Artist name authenticity</li>
                <li>Standard duration formats</li>
              </ul>
            </div>

            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-6">
              <h3 className="text-xl font-bold text-green-400 mb-2">2. AI Detection Patterns</h3>
              <p className="text-zinc-400 mb-2">Common indicators of AI-generated content:</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Generic or AI-related track titles</li>
                <li>Non-human artist names</li>
                <li>Unusual duration patterns</li>
                <li>Inconsistent metadata formatting</li>
              </ul>
            </div>

            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-bold text-green-400 mb-2">3. Authentication System</h3>
              <p className="text-zinc-400 mb-2">Verified uploaders are authenticated using:</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Unique uploader identifiers</li>
                <li>Secure access keys</li>
                <li>Upload history tracking</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">API Reference</h2>
            <div className="space-y-6">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-2">POST /verify</h3>
                <p className="text-zinc-400 mb-4">Verifies track metadata against the catalog.</p>
                <pre className="bg-black/30 p-4 rounded text-sm text-zinc-300">
{`{
  "title": "Track Title",
  "artist": "Artist Name",
  "duration": "3:45"
}`}
                </pre>
              </div>

              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-2">POST /auth</h3>
                <p className="text-zinc-400 mb-4">Authenticates an uploader.</p>
                <pre className="bg-black/30 p-4 rounded text-sm text-zinc-300">
{`{
  "name": "uploader1",
  "key": "key123"
}`}
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Try It Out</h2>
            <div className="flex gap-4">
              <Link 
                href="/verify" 
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium"
              >
                Test Verification
              </Link>
              <Link 
                href="/auth" 
                className="border border-green-500 text-green-500 hover:bg-green-500/10 px-6 py-3 rounded-full font-medium"
              >
                Try Authentication
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 