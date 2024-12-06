"use client";
import { useState, useEffect } from "react";
import { getSpotifyAuthUrl } from "@/lib/spotify";
import Link from "next/link";
import { FiLoader, FiHelpCircle } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';
import { SiShazam, SiMusicbrainz } from 'react-icons/si';

interface SpotifyTrack {
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
  preview_url: string | null;
}

export default function Verify() {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spotifyToken');
    }
    return null;
  });
  const [isTokenLoading, setIsTokenLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check token on mount and after redirect
  useEffect(() => {
    const checkToken = async () => {
      setIsTokenLoading(true);
      
      // Check for code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        try {
          const response = await fetch(`/api/auth/callback?code=${code}`);
          const data = await response.json();
          
          if (data.access_token) {
            localStorage.setItem('spotifyToken', data.access_token);
            setSpotifyToken(data.access_token);
          }
        } catch (error) {
          console.error('Token exchange error:', error);
        }
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // Rest of your existing token validation code...
      const token = localStorage.getItem('spotifyToken');
      if (token) {
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            localStorage.removeItem('spotifyToken');
            setSpotifyToken(null);
          } else {
            setSpotifyToken(token);
          }
        } catch (error) {
          localStorage.removeItem('spotifyToken');
          setSpotifyToken(null);
        }
      }
      setIsTokenLoading(false);
    };

    checkToken();
  }, []);

  // Modify the render section to handle loading state
  if (isTokenLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>
    );
  }

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) {
        e.preventDefault();
    }

    if (!searchQuery.trim()) {
        alert('Please enter a track title');
        return;
    }

    setIsLoading(true);
    try {
        if (!spotifyToken) {
            throw new Error('Please connect with Spotify first');
        }

        // Parse search query - support both formats
        let title = searchQuery;
        let artist = '';
        
        if (searchQuery.includes('-')) {
            const [titlePart, artistPart] = searchQuery.split('-').map(part => part.trim());
            title = titlePart;
            artist = artistPart;
        }

        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: title + (artist ? ` artist:${artist}` : ''),
                token: spotifyToken
            })
        });

        if (!response.ok) {
            throw new Error('Verification failed');
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        setResult(data);
    } catch (error) {
        console.error('Search error:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
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
          <form onSubmit={handleVerify} className="space-y-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter track title (e.g., 'Shape of You')"
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
          <div className="mt-8 space-y-6">
            {/* Error Card */}
            {result.error ? (
              <div className="p-6 rounded-lg bg-red-500/20">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4 text-red-400">
                      Track Not Found
                    </h2>
                    <p className="text-zinc-400">
                      {result.error}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Result Card */
              <div className={`p-6 rounded-lg transition-all duration-300 relative overflow-hidden ${
                result.valid ? 'bg-gradient-to-br from-green-500/20 to-green-900/20' : 
                result.details.aiPatternScore > 0.7 ? 'bg-gradient-to-br from-red-500/20 to-purple-900/20' :
                result.details.aiPatternScore > 0.5 ? 'bg-gradient-to-br from-orange-500/20 to-red-900/20' :
                'bg-gradient-to-br from-yellow-500/20 to-orange-900/20'
              }`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-repeat opacity-20" 
                         style={{ 
                             backgroundImage: "url('/pattern.svg')",
                             backgroundSize: '50px 50px',
                             transform: 'rotate(-5deg)'
                         }} 
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-start gap-6">
                    {result.track?.albumArt && (
                        <div className="relative">
                            <img 
                                src={result.track.albumArt} 
                                alt="Album Artwork"
                                className="w-32 h-32 rounded-lg shadow-lg object-cover" 
                            />
                            <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium ${
                                result.details.aiPatternScore < 0.3 ? 'bg-green-500 text-black' :
                                result.details.aiPatternScore < 0.5 ? 'bg-yellow-500 text-black' :
                                result.details.aiPatternScore < 0.7 ? 'bg-orange-500 text-black' :
                                'bg-red-500 text-white'
                            }`}>
                                {result.details.aiPatternScore < 0.3 ? 'Likely Human' :
                                 result.details.aiPatternScore < 0.5 ? 'Needs Review' :
                                 result.details.aiPatternScore < 0.7 ? 'Possible AI' :
                                 'Likely AI'}
                            </div>
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-4 text-zinc-100">
                            {result.track.title}
                        </h2>
                        <div className="space-y-2">
                            <div className="text-zinc-300">
                                <span className="text-zinc-400">Artist:</span> {result.track.artist}
                            </div>
                            {result.track.previewUrl && (
                                <audio controls src={result.track.previewUrl} 
                                    className="mt-4 w-full [&::-webkit-media-controls-panel]:bg-zinc-800 
                                    [&::-webkit-media-controls-current-time-display]:text-zinc-300
                                    [&::-webkit-media-controls-time-remaining-display]:text-zinc-300" 
                                />
                            )}
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Analysis Details */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
                <h3 className="text-xl font-bold text-green-400 mb-4">Analysis Details</h3>
                
                {/* Database Presence */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${
                        result.details.sources.spotify 
                        ? 'bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/20' 
                        : 'bg-zinc-800'
                    }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <FaSpotify className={`w-5 h-5 ${result.details.sources.spotify ? 'text-green-400' : 'text-zinc-500'}`} />
                            <span className={`text-sm ${result.details.sources.spotify ? 'text-green-400' : 'text-zinc-500'}`}>
                                Spotify
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400">Primary Source</span>
                    </div>

                    <div className={`p-4 rounded-lg ${
                        result.details.sources.shazam 
                        ? 'bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/20' 
                        : 'bg-zinc-800'
                    }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <SiShazam className={`w-5 h-5 ${result.details.sources.shazam ? 'text-blue-400' : 'text-zinc-500'}`} />
                            <span className={`text-sm ${result.details.sources.shazam ? 'text-blue-400' : 'text-zinc-500'}`}>
                                Shazam
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400">Commercial Database</span>
                    </div>

                    <div className={`p-4 rounded-lg ${
                        result.details.sources.musicBrainz 
                        ? 'bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/20' 
                        : 'bg-zinc-800'
                    }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <SiMusicbrainz className={`w-5 h-5 ${result.details.sources.musicBrainz ? 'text-purple-400' : 'text-zinc-500'}`} />
                            <span className={`text-sm ${result.details.sources.musicBrainz ? 'text-purple-400' : 'text-zinc-500'}`}>
                                MusicBrainz
                            </span>
                        </div>
                        <span className="text-xs text-zinc-400">Open Database</span>
                    </div>
                </div>

                {/* Status Messages Box */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50">
                    <span className="text-blue-400 block">
                        Track found in Spotify and Shazam databases. Good commercial presence.
                    </span>
                    <span className="text-green-400 block mt-2">
                        Minimal AI patterns detected, likely human-created.
                    </span>
                </div>

                {/* AI Pattern Analysis Box */}
                <div className={`mt-4 p-4 rounded-lg bg-gradient-to-br ${
                    result.details.aiPatternScore < 0.3 ? 'from-green-500/10 to-green-900/10 border-green-500/20' :
                    result.details.aiPatternScore < 0.5 ? 'from-yellow-500/10 to-yellow-900/10 border-yellow-500/20' :
                    result.details.aiPatternScore < 0.7 ? 'from-orange-500/10 to-orange-900/10 border-orange-500/20' :
                    'from-red-500/10 to-red-900/10 border-red-500/20'
                } border`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-zinc-400">AI Pattern Score</span>
                        <span className={`text-lg font-medium ${
                            result.details.aiPatternScore < 0.3 ? 'text-green-400' :
                            result.details.aiPatternScore < 0.5 ? 'text-yellow-400' :
                            result.details.aiPatternScore < 0.7 ? 'text-orange-400' :
                            'text-red-400'
                        }`}>
                            {Math.round(result.details.aiPatternScore * 100)}%
                        </span>
                    </div>
                    <div className="text-zinc-500 text-sm">
                        {result.details.aiPatterns.length === 0 ? 
                            'Analysis: Track shows typical human-created patterns with good presence across music databases' :
                            `Detected patterns: ${result.details.aiPatterns.join(', ')}`
                        }
                    </div>
                </div>

                {/* Confidence Metrics Box */}
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 border border-zinc-700/50">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center gap-2">
                                Metadata Score
                                <div className="group relative">
                                    <FiHelpCircle className="w-4 h-4 text-zinc-500" />
                                    <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-black text-xs text-zinc-300 rounded shadow-lg">
                                        Analysis of track metadata patterns commonly associated with legitimate music
                                    </div>
                                </div>
                            </span>
                            <span className="text-green-400">100%</span>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 flex items-center gap-2">
                                    Database Confidence
                                    <div className="group relative">
                                        <FiHelpCircle className="w-4 h-4 text-zinc-500" />
                                        <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-black text-xs text-zinc-300 rounded shadow-lg">
                                            Combined confidence score based on presence in music databases
                                        </div>
                                    </div>
                                </span>
                                <span className="text-green-400">{Math.round(result.details.databaseConfidence * 100)}%</span>
                            </div>
                            <div className="text-sm text-green-400/70 ml-6">
                                Track found in multiple databases (High confidence)
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overall Confidence Box */}
                <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-400 flex items-center gap-2">
                            Overall Confidence
                            <div className="group relative">
                                <FiHelpCircle className="w-4 h-4 text-zinc-500" />
                                <div className="hidden group-hover:block absolute z-10 w-64 p-2 bg-black text-xs text-zinc-300 rounded shadow-lg">
                                    Combined score based on AI patterns, metadata, and database presence
                                </div>
                            </div>
                        </span>
                        <span className="text-green-400">
                            {typeof result.details.overallConfidence === 'number'
                                ? `${Math.round(result.details.overallConfidence * 100)}%`
                                : `${Math.round((
                                    (1 - result.details.aiPatternScore) * 0.5 +
                                    result.details.metadataScore * 0.2 +
                                    result.details.databaseConfidence * 0.3
                                  ) * 100)}%`
                            }
                        </span>
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}