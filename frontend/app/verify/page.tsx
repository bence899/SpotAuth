import { useState } from "react";

export default function Verify() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [duration, setDuration] = useState("");

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
    if (data.valid) {
      alert("Track metadata is valid!");
    } else {
      alert("Track metadata not found");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-green-400">Verify Track Metadata</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200"
        />
        <input
          type="text"
          placeholder="Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200"
        />
        <input
          type="text"
          placeholder="Duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200"
        />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black py-2 rounded">
          Verify
        </button>
      </form>
    </div>
  );
} 