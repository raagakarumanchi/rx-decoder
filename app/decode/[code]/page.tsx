'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ABBREVIATIONS } from '@/lib/abbreviations';
import { addToHistory } from '@/lib/history';

export default function DecodePage({ params }: { params: { code: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abbreviations, setAbbreviations] = useState<typeof ABBREVIATIONS>([]);
  const [relatedAbbreviations, setRelatedAbbreviations] = useState<typeof ABBREVIATIONS>([]);

  useEffect(() => {
    const decodeAbbreviation = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const decodedCode = decodeURIComponent(params.code);
        // Split the code into parts and find matches for each
        const parts = decodedCode.toLowerCase().split(/\s+/);
        const matches = parts.map(part => 
          ABBREVIATIONS.find(abbr => abbr.abbreviation.toLowerCase() === part)
        ).filter((match): match is typeof ABBREVIATIONS[0] => match !== undefined);

        if (matches.length > 0) {
          setAbbreviations(matches);
          
          // Find related abbreviations based on all matches
          const words = matches.flatMap(match => 
            match.meaning.toLowerCase().split(/\s+/)
          );
          const related = ABBREVIATIONS.filter(abbr => 
            !matches.some(match => match.abbreviation === abbr.abbreviation) &&
            words.some(word => 
              word.length > 3 && // Only consider words longer than 3 characters
              abbr.meaning.toLowerCase().includes(word)
            )
          ).slice(0, 3);
          setRelatedAbbreviations(related);
          
          // Add to history
          addToHistory(decodedCode);
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

  if (error || abbreviations.length === 0) {
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
          <h1 className="text-4xl font-bold mb-2 font-mono">{params.code}</h1>
          <div className="space-y-4">
            {abbreviations.map((abbr, index) => (
              <div key={abbr.abbreviation} className="p-4 bg-slate-800 rounded-lg">
                <div className="font-mono text-lg text-emerald-400">{abbr.abbreviation}</div>
                <div className="text-xl text-slate-300">{abbr.meaning}</div>
              </div>
            ))}
          </div>
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