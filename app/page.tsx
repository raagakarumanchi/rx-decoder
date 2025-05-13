'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ABBREVIATIONS } from '@/lib/abbreviations';
import { getSearchHistory, addToHistory, clearHistory, type SearchHistory } from '@/lib/history';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof ABBREVIATIONS>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load history
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowHistory(false);
      }
      // ? to toggle help
      if (e.key === '?') {
        setShowHelp(prev => !prev);
      }
      // Ctrl/Cmd + H to toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        setShowHistory(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex > -1) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        setQuery(selected.abbreviation);
        router.push(`/decode/${selected.abbreviation}`);
      }
    };

    const input = inputRef.current;
    input?.addEventListener('keydown', handleKeyDown);
    return () => input?.removeEventListener('keydown', handleKeyDown);
  }, [suggestions, selectedIndex, router]);

  // Update suggestions as user types
  useEffect(() => {
    if (query.trim()) {
      const matches = ABBREVIATIONS.filter(abbr => 
        abbr.abbreviation.toLowerCase().includes(query.toLowerCase()) ||
        abbr.meaning.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSuggestions(matches);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const trimmedQuery = query.trim().toLowerCase();
      addToHistory(trimmedQuery);
      setHistory(getSearchHistory());
      await router.push(`/decode/${encodeURIComponent(trimmedQuery)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
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
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. po bid prn (Press ⌘K to focus)"
              className="w-full p-3 rounded-lg bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Enter prescription abbreviation"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <kbd className="text-xs text-slate-400">⌘K</kbd>
              <button
                type="button"
                onClick={() => setShowHistory(prev => !prev)}
                className="text-slate-400 hover:text-slate-300"
                aria-label="View search history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div className="mt-2 bg-slate-800 rounded-lg overflow-hidden">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.abbreviation}
                  onClick={() => {
                    setQuery(suggestion.abbreviation);
                    router.push(`/decode/${suggestion.abbreviation}`);
                  }}
                  className={`w-full p-3 text-left hover:bg-slate-700 transition-colors ${
                    index === selectedIndex ? 'bg-slate-700' : ''
                  }`}
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
                <span>Toggle history</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">⌘H</kbd>
              </div>
              <div className="flex justify-between">
                <span>Close modals</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">Esc</kbd>
              </div>
              <div className="flex justify-between">
                <span>Navigate suggestions</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded">↑↓</kbd>
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

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Search History</h2>
              <button
                onClick={clearHistory}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Clear history
              </button>
            </div>
            {history.length > 0 ? (
              <div className="space-y-2">
                {history.map((item) => (
                  <button
                    key={item.timestamp}
                    onClick={() => {
                      setQuery(item.query);
                      setShowHistory(false);
                      router.push(`/decode/${item.query}`);
                    }}
                    className="w-full p-3 text-left hover:bg-slate-700 rounded transition-colors"
                  >
                    <div className="font-mono">{item.query}</div>
                    <div className="text-sm text-slate-400">
                      {formatTimestamp(item.timestamp)}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">
                No search history yet
              </p>
            )}
            <button
              onClick={() => setShowHistory(false)}
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
