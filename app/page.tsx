'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ABBREVIATIONS } from '@/lib/abbreviations';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof ABBREVIATIONS>([]);
  const router = useRouter();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('input');
        input?.focus();
      }
      // Escape to close help
      if (e.key === 'Escape') {
        setShowHelp(false);
      }
      // ? to toggle help
      if (e.key === '?') {
        setShowHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim()) {
      const matches = ABBREVIATIONS.filter(abbr => 
        abbr.abbreviation.toLowerCase().includes(query.toLowerCase()) ||
        abbr.meaning.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [query]);

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
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">rx0decoder</h1>
          <p className="text-slate-300 mb-8">
            Translate prescription abbreviations into plain English
          </p>
        </div>

        <form onSubmit={submit} className="w-full max-w-sm mx-auto" role="search">
          <div className="relative">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. po bid prn (Press ⌘K to focus)"
              className="w-full p-3 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Enter prescription abbreviation"
              disabled={isLoading}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              ⌘K
            </kbd>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-2 bg-slate-800 rounded-lg overflow-hidden">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.abbreviation}
                  onClick={() => {
                    setQuery(suggestion.abbreviation);
                    router.push(`/decode/${suggestion.abbreviation}`);
                  }}
                  className="w-full p-3 text-left hover:bg-slate-700 transition-colors"
                >
                  <div className="font-mono">{suggestion.abbreviation}</div>
                  <div className="text-sm text-slate-300">{suggestion.meaning}</div>
                </button>
              ))}
            </div>
          )}

          <button 
            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
            aria-label="Decode abbreviation"
          >
            {isLoading ? 'decoding...' : 'decode'}
          </button>
        </form>

        <div className="flex justify-center space-x-4 text-sm text-emerald-400">
          <Link href="/list" className="hover:underline">
            browse all abbreviations
          </Link>
          <Link href="/references" className="hover:underline">
            view references
          </Link>
          <button 
            onClick={() => setShowHelp(true)}
            className="hover:underline"
          >
            keyboard shortcuts
          </button>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Focus search</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">⌘K</kbd>
              </div>
              <div className="flex justify-between">
                <span>Toggle help</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">?</kbd>
              </div>
              <div className="flex justify-between">
                <span>Close help</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">Esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
