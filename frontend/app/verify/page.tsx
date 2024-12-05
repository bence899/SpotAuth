"use client";
import { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");
  const [result, setResult] = useState<null | { 
    valid: boolean; 
    message?: string;
    details?: string;
  }>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, artist, duration }),
    });

    const data = await response.json();
    setResult({
      valid: data.valid,
      message: data.valid ? "Track Verified ✓" : "Potential AI-Generated Content Detected ⚠️",
      details: data.valid 
        ? "This track matches our verified catalog metadata patterns."
        : "This track shows patterns common in AI-generated content. Please review manually."
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-4">AI Music Detection System</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            This system helps detect potentially AI-generated music by analyzing metadata patterns.
            Compare suspicious tracks against our verified catalog to identify possible AI-generated content.
          </p>
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
              placeholder="e.g., AIComposer"
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
            />
          </div>
          <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black py-3 rounded-lg font-medium">
            Analyze Metadata
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div className={`p-6 rounded-lg ${result.valid ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
            <h3 className={`text-xl font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
              {result.message}
            </h3>
            <p className="text-zinc-400 mt-2">{result.details}</p>
          </div>
        )}
      </div>
    </div>
  );
}