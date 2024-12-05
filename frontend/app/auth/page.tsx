import { useState } from "react";

export default function Auth() {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, key }),
    });

    const data = await response.json();
    if (data.success) {
      alert("Authentication successful!");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-green-400">Uploader Login</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200"
        />
        <input
          type="password"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800 text-zinc-200"
        />
        <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-black py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
} 