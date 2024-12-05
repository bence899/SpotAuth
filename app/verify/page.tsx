"use client";
import { useState, useEffect } from "react";
import { getSpotifyAuthUrl } from "@/lib/spotify";
import Link from "next/link";
import { FiLoader } from 'react-icons/fi';

export default function Verify() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split('&')
      .reduce((initial: any, item) => {
        const parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    if (hash.access_token) {
      setSpotifyToken(hash.access_token);
      window.location.hash = '';
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotifyToken) {
      alert('Please connect with Spotify first');
      return;
    }

    const [title, artist] = searchQuery.split('-').map(s => s.trim());
    
    if (!title || !artist) {
      alert('Please enter the track in format: "Title - Artist"');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${spotifyToken}`
        },
        body: JSON.stringify({ title, artist }),
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ valid: false, message: 'Error searching track' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/dashboard"
            className="text-green-400 hover:text-green-300 flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
          <Link 
            href="/"
            className="text-green-400 hover:text-green-300 flex items-center gap-2"
          >
            Home
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">Track Verification</h1>
          <p className="text-zinc-400">
            Connect with Spotify and search for a track to verify if it's AI-generated.
          </p>
        </div>

        {!spotifyToken ? (
          <button
            onClick={() => window.location.href = getSpotifyAuthUrl()}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white py-3 rounded-lg font-medium"
          >
            Connect with Spotify
          </button>
        ) : (
          <form onSubmit={handleSearch} className="space-y-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter track as: Title - Artist (e.g., 'Shape of You - Ed Sheeran')"
              className="w-full p-3 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
              disabled={isLoading}
            />
            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-medium relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <FiLoader className="animate-spin" />
                  <span>Verifying Track...</span>
                </div>
              ) : (
                'Verify Track'
              )}
            </button>
          </form>
        )}

        {isLoading && (
          <div className="mt-8 text-center text-zinc-400 space-y-4">
            <FiLoader className="animate-spin inline-block w-8 h-8" />
            <p>Analyzing track metadata and checking databases...</p>
          </div>
        )}

        {result && !isLoading && (
          <div className={`mt-8 p-6 rounded-lg transition-all duration-300 ${
            result.valid ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <h2 className={`text-xl font-bold mb-2 ${
              result.valid ? 'text-green-400' : 'text-red-400'
            }`}>
              {result.message}
            </h2>
            {result.track && (
              <div className="mt-4 text-zinc-400">
                <p>Title: {result.track.title}</p>
                <p>Artist: {result.track.artist}</p>
                {result.track.previewUrl && (
                  <audio controls src={result.track.previewUrl} className="mt-4 w-full" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}