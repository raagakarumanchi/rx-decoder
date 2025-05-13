import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchResult } from '@/lib/search';
import { trackSearch } from '@/lib/analytics';

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onSelect?: (result: SearchResult) => void;
  showScore?: boolean;
  showMatchType?: boolean;
  maxResults?: number;
}

export default function SearchResults({
  results,
  query,
  onSelect,
  showScore = false,
  showMatchType = false,
  maxResults = 10,
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!results.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setIsNavigating(true);
          setSelectedIndex((prev) => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setIsNavigating(true);
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < results.length) {
            const result = results[selectedIndex];
            handleSelect(result);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    trackSearch(
      query,
      true,
      result.matchedParts,
      [result.abbreviation]
    );
    onSelect?.(result);
  };

  const handleMouseEnter = (index: number) => {
    if (!isNavigating) {
      setSelectedIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isNavigating) {
      setSelectedIndex(-1);
    }
  };

  if (!results.length) {
    return (
      <div className="mt-4 text-center text-gray-500">
        No results found for "{query}"
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {results.slice(0, maxResults).map((result, index) => (
        <div
          key={result.abbreviation}
          className={`group relative rounded-lg border p-4 transition-all ${
            selectedIndex === index
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
          }`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/decode/${result.abbreviation}`}
            className="block"
            onClick={() => handleSelect(result)}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {result.abbreviation}
                </h3>
                <p className="mt-1 text-gray-600">{result.meaning}</p>
                {(showScore || showMatchType) && (
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    {showScore && (
                      <span className="flex items-center">
                        <span className="mr-1">Score:</span>
                        <span className="font-medium">
                          {(result.score * 100).toFixed(1)}%
                        </span>
                      </span>
                    )}
                    {showMatchType && (
                      <span className="flex items-center">
                        <span className="mr-1">Match:</span>
                        <span className="font-medium capitalize">
                          {result.matchType}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {result.matchedParts.length} matches
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
      {results.length > maxResults && (
        <div className="text-center text-sm text-gray-500">
          Showing {maxResults} of {results.length} results
        </div>
      )}
    </div>
  );
} 