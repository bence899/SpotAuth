"use client";
import { useState, useEffect } from "react";
import { getSpotifyAuthUrl } from "@/lib/spotify";

// Example of known legitimate tracks from our catalog
const LEGITIMATE_EXAMPLES = [
  {
    title: "Song A",
    artist: "Artist 1",
    duration: "3:45",
    description: "A verified track from our catalog with consistent metadata patterns."
  },
  {
    title: "Song B",
    artist: "Artist 2",
    duration: "4:20",
    description: "Another verified track showing typical commercial release patterns."
  }
];

// Examples of suspicious AI-generated tracks
const SUSPICIOUS_EXAMPLES = [
  {
    title: "AI Generated Beat 1",
    artist: "AIComposer",
    duration: "2:30",
    description: "Shows patterns typical of AI generation: generic title, non-human artist name."
  },
  {
    title: "Deep Learning Mix",
    artist: "Neural Network Sounds",
    duration: "1:45",
    description: "Suspicious metadata: AI-related naming, unusual duration pattern."
  }
];

export default function Verify() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<null | { 
    valid: boolean; 
    message?: string;
    details?: string;
    track?: {
      title?: string;
      artist?: string;
      duration?: string;
      previewUrl?: string;
      spotifyId?: string;
    };
  }>(null);

  useEffect(() => {
    // Check for Spotify token in URL hash
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotifyToken) {
      alert('Please login with Spotify first');
      return;
    }

    const response = await fetch("http://localhost:4000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${spotifyToken}`
      },
      body: JSON.stringify({ title, artist, duration }),
    });

    const data = await response.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">AI Music Detection System</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Connect with Spotify to verify tracks against our AI detection system.
          </p>
        </div>

        {/* Authentication Status */}
        <div className="text-center">
          {!spotifyToken ? (
            <button
              onClick={() => window.location.href = getSpotifyAuthUrl()}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-3 rounded-full font-medium"
            >
              Connect with Spotify
            </button>
          ) : (
            <div className="text-green-400 font-medium">✓ Connected to Spotify</div>
          )}
        </div>

        {/* Examples Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-green-400">Verified Tracks</h2>
            {LEGITIMATE_EXAMPLES.map((example, i) => (
              <div key={i} className="p-4 bg-zinc-900 rounded-lg border border-green-500/20">
                <h3 className="font-medium text-green-400">{example.title}</h3>
                <p className="text-sm text-zinc-400">Artist: {example.artist}</p>
                <p className="text-sm text-zinc-400">Duration: {example.duration}</p>
                <p className="text-xs text-zinc-500 mt-2">{example.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-red-400">Suspicious Patterns</h2>
            {SUSPICIOUS_EXAMPLES.map((example, i) => (
              <div key={i} className="p-4 bg-zinc-900 rounded-lg border border-red-500/20">
                <h3 className="font-medium text-red-400">{example.title}</h3>
                <p className="text-sm text-zinc-400">Artist: {example.artist}</p>
                <p className="text-sm text-zinc-400">Duration: {example.duration}</p>
                <p className="text-xs text-zinc-500 mt-2">{example.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-lg space-y-4">
          <h2 className="text-xl font-bold text-green-400 mb-4">Verify Track Metadata</h2>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Track Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
              placeholder="e.g., Deep Learning Mix"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Artist Name</label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
              placeholder="e.g., Artist Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Duration</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 text-zinc-200 border border-zinc-700"
              placeholder="Format: 3:45"
              pattern="[0-9]+:[0-5][0-9]"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={!spotifyToken}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-black py-3 rounded-lg font-medium"
          >
            Verify Track
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className={`p-6 rounded-lg ${result.valid ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-xl font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                  {result.message}
                </h3>
                <p className="text-zinc-400 mt-2">{result.details}</p>
                
                {result.track && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-zinc-400">
                      <span className="font-medium">Title:</span> {result.track.title}
                    </p>
                    <p className="text-sm text-zinc-400">
                      <span className="font-medium">Artist:</span> {result.track.artist}
                    </p>
                    <p className="text-sm text-zinc-400">
                      <span className="font-medium">Duration:</span> {result.track.duration}
                    </p>
                    {result.track.previewUrl && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-zinc-400 mb-2">Preview:</h4>
                        <audio 
                          controls 
                          src={result.track.previewUrl}
                          className="w-full max-w-md"
                        >
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {result.track?.spotifyId && (
                <a
                  href={`https://open.spotify.com/track/${result.track.spotifyId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1DB954] hover:text-[#1ed760] text-sm"
                >
                  View on Spotify
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}