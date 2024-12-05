import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-4xl font-bold text-green-400">Dashboard</h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            Welcome to your dashboard. Here you can verify track metadata and manage your uploads.
          </p>
          
          <div className="flex gap-4 mt-8">
            <Link 
              href="/verify" 
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium"
            >
              Verify Metadata
            </Link>
            <Link 
              href="/auth" 
              className="border border-green-500 text-green-500 hover:bg-green-500/10 px-6 py-3 rounded-full font-medium"
            >
              Manage Uploads
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 