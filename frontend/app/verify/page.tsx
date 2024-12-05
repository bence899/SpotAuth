"use client";
import { useState, useEffect } from "react";
import { getSpotifyAuthUrl } from "@/lib/spotify";

export default function Verify() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any>(null);

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

    try {
      const response = await fetch("http://localhost:3001/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${spotifyToken}`
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({ valid: false, message: 'Error searching track' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
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
              placeholder="Search for a track (e.g., 'Shape of You - Ed Sheeran')"
              className="w-full p-3 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
            />
            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-medium"
            >
              Verify Track
            </button>
          </form>
        )}

        {result && (
          <div className={`p-6 rounded-lg ${result.valid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            <h3 className={`text-xl font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </h3>
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