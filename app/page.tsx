'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      await router.push(`/decode/${encodeURIComponent(query.trim().toLowerCase())}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">rx0decoder</h1>

      <form onSubmit={submit} className="w-full max-w-sm flex" role="search">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. po bid prn"
          className="flex-grow p-3 rounded-l bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Enter prescription abbreviation"
          disabled={isLoading}
        />
        <button 
          className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label="Decode abbreviation"
        >
          {isLoading ? 'decoding...' : 'decode'}
        </button>
      </form>

      <div className="mt-8 space-y-2 text-sm text-emerald-400">
        <Link href="/list" className="hover:underline">
          browse all abbreviations
        </Link>
        <br />
        <Link href="/references" className="hover:underline">
          view references
        </Link>
      </div>
    </main>
  );
}
