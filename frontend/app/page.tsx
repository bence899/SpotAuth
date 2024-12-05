import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center space-y-8">
          <h1 className="text-5xl font-bold text-green-400">SpotAuth-Lite</h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            A lightweight service that validates music metadata and protects your catalog from fraudulent uploads.
          </p>
          
          <div className="flex gap-4 mt-8">
            <Link 
              href="/dashboard" 
              className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full font-medium"
            >
              Try Demo
            </Link>
            <Link 
              href="/docs" 
              className="border border-green-500 text-green-500 hover:bg-green-500/10 px-6 py-3 rounded-full font-medium"
            >
              Documentation
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-bold text-green-400 mb-2">Metadata Verification</h3>
            <p className="text-zinc-400">Compare track metadata with our predefined catalog to ensure authenticity.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-bold text-green-400 mb-2">Secure Authentication</h3>
            <p className="text-zinc-400">Robust uploader verification system to prevent unauthorized access.</p>
          </div>
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-bold text-green-400 mb-2">Detailed Logging</h3>
            <p className="text-zinc-400">Track and review all invalid metadata attempts.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
