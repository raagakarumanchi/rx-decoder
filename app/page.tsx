'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ABBREVIATIONS } from '@/lib/abbreviations';
import { search, getSuggestions, SearchResult } from '@/lib/search';
import SearchResults from '@/components/SearchResults';
import SearchStats from '@/components/SearchStats';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const input = document.querySelector('input');
        input?.focus();
      } else if (e.key === 'Escape') {
        setShowHelp(false);
        setShowSuggestions(false);
      } else if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      setIsLoading(true);
      const searchResults = search(query);
      setResults(searchResults);
      setSuggestions(getSuggestions(query));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/decode/${query.trim()}`);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setQuery(result.abbreviation);
    setShowSuggestions(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Prescription Abbreviation Decoder
        </h1>

        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter prescription abbreviation (⌘K to focus)"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              Press ? for help
            </div>
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Suggestions</h3>
                <SearchResults
                  results={suggestions}
                  query={query}
                  onSelect={handleSelect}
                  maxResults={5}
                />
              </div>
            </div>
          )}
        </form>

        {isLoading ? (
          <div className="mt-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Results</h2>
            <SearchResults
              results={results}
              query={query}
              showScore
              showMatchType
            />
          </div>
        ) : query.trim() ? (
          <div className="mt-8 text-center text-gray-500">
            No results found for "{query}"
          </div>
        ) : null}

        <SearchStats />

        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Keyboard Shortcuts</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">⌘K or Ctrl+K</span>
                  <span className="text-gray-900">Focus search input</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">?</span>
                  <span className="text-gray-900">Toggle help modal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Esc</span>
                  <span className="text-gray-900">Close modal or suggestions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">↑/↓</span>
                  <span className="text-gray-900">Navigate suggestions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Enter</span>
                  <span className="text-gray-900">Select suggestion</span>
                </div>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
