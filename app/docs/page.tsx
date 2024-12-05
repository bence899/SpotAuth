"use client";
import Link from "next/link";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="mb-8">
          <Link 
            href="/"
            className="text-green-400 hover:text-green-300 flex items-center gap-2"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-green-400 mb-8">SpotAuth-Lite: AI Music Detection</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">What is SpotAuth-Lite?</h2>
            <p className="text-zinc-400 mb-4">
              SpotAuth-Lite helps you verify if a music track might be AI-generated. Simply connect with your Spotify account
              and search for any track - we'll analyze its metadata to detect potential AI-generated content.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">How to Use</h2>
            <div className="space-y-6">
              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-2">1. Connect with Spotify</h3>
                <p className="text-zinc-400">
                  Click the "Connect with Spotify" button on the verify page. This lets us search and analyze tracks.
                  Don't worry - we only read track information, we can't modify your account.
                </p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-2">2. Search for a Track</h3>
                <p className="text-zinc-400">
                  Enter a track name and artist (e.g., "Shape of You - Ed Sheeran") in the search box.
                  We'll find the track on Spotify and analyze it.
                </p>
              </div>

              <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-2">3. Get Results</h3>
                <p className="text-zinc-400">
                  We'll show you if the track shows signs of being AI-generated. You'll see:
                </p>
                <ul className="list-disc list-inside text-zinc-400 mt-2 space-y-1">
                  <li>Track verification status</li>
                  <li>Track details from Spotify</li>
                  <li>A preview player (if available)</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-green-400 mb-4">What We Check For</h2>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <p className="text-zinc-400 mb-4">Our AI detection looks for common patterns in:</p>
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>Track titles containing AI-related terms</li>
                <li>Artist names that suggest computer generation</li>
                <li>Unusual metadata patterns typical of AI content</li>
              </ul>
              <div className="mt-4 p-4 bg-zinc-800 rounded">
                <p className="text-sm text-zinc-400">
                  <strong className="text-green-400">Note:</strong> This is a demonstration tool and shouldn't be used as the sole method for verifying track authenticity.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-green-400 mb-4">Privacy & Security</h2>
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <ul className="list-disc list-inside text-zinc-400 space-y-2">
                <li>We only request read access to Spotify's public track data</li>
                <li>Your Spotify account and playlists remain private</li>
                <li>We don't store any personal information</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 