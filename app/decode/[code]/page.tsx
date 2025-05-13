'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ABBREVIATIONS } from '@/lib/abbreviations';
import { addToHistory } from '@/lib/history';

export default function DecodePage({ params }: { params: { code: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abbreviation, setAbbreviation] = useState<typeof ABBREVIATIONS[0] | null>(null);
  const [relatedAbbreviations, setRelatedAbbreviations] = useState<typeof ABBREVIATIONS>([]);

  useEffect(() => {
    const decodeAbbreviation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const decodedCode = decodeURIComponent(params.code);
        const found = ABBREVIATIONS.find(
          abbr => abbr.abbreviation.toLowerCase() === decodedCode.toLowerCase()
        );

        if (found) {
          setAbbreviation(found);
          // Find related abbreviations (those that share words in their meaning)
          const words = found.meaning.toLowerCase().split(/\s+/);
          const related = ABBREVIATIONS.filter(abbr => 
            abbr.abbreviation !== found.abbreviation &&
            words.some(word => 
              word.length > 3 && // Only consider words longer than 3 characters
              abbr.meaning.toLowerCase().includes(word)
            )
          ).slice(0, 3);
          setRelatedAbbreviations(related);
          
          // Add to history
          addToHistory(found.abbreviation);
        } else {
          setError('Abbreviation not found');
        }
      } catch (err) {
        setError('Invalid abbreviation format');
      } finally {
        setIsLoading(false);
      }
    };

    decodeAbbreviation();
  }, [params.code]);

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-slate-300">Decoding prescription...</p>
        </div>
      </main>
    );
  }

  if (error || !abbreviation) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Abbreviation Not Found</h1>
            <p className="text-xl text-slate-300 mb-8">
              We couldn't find that prescription abbreviation in our database.
            </p>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">
              Try these common abbreviations:
            </h2>
            <div className="grid gap-4">
              {ABBREVIATIONS
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map((abbr) => (
                  <Link
                    key={abbr.abbreviation}
                    href={`/decode/${abbr.abbreviation}`}
                    className="block p-4 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
                  >
                    <div className="font-mono text-lg">{abbr.abbreviation}</div>
                    <div className="text-slate-300">{abbr.meaning}</div>
                  </Link>
                ))}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <Link 
              href="/"
              className="text-emerald-400 hover:underline"
            >
              ← back to decoder
            </Link>
            <Link 
              href="/list"
              className="text-emerald-400 hover:underline"
            >
              browse all abbreviations
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 font-mono">{abbreviation.abbreviation}</h1>
          <p className="text-2xl text-slate-300">{abbreviation.meaning}</p>
        </div>

        {relatedAbbreviations.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-emerald-400">
              Related abbreviations:
            </h2>
            <div className="grid gap-4">
              {relatedAbbreviations.map((abbr) => (
                <Link
                  key={abbr.abbreviation}
                  href={`/decode/${abbr.abbreviation}`}
                  className="block p-4 rounded bg-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <div className="font-mono text-lg">{abbr.abbreviation}</div>
                  <div className="text-slate-300">{abbr.meaning}</div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="text-emerald-400 hover:underline"
          >
            ← back to decoder
          </Link>
          <Link 
            href="/list"
            className="text-emerald-400 hover:underline"
          >
            browse all abbreviations
          </Link>
        </div>
      </div>
    </main>
  );
} 