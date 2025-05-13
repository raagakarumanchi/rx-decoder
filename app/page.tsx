'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/decode/${encodeURIComponent(query.trim().toLowerCase())}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">rx0decoder</h1>

      <form onSubmit={submit} className="w-full max-w-sm flex">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="e.g. po bid prn"
          className="flex-grow p-3 rounded-l bg-slate-800 focus:outline-none"
        />
        <button className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded-r">decode</button>
      </form>

      <div className="mt-8 space-y-2 text-sm text-emerald-400">
        <a href="/list" className="hover:underline">
          browse all abbreviations
        </a>
        <br />
        <a href="/references" className="hover:underline">
          view references
        </a>
      </div>
    </main>
  );
}
