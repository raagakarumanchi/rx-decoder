import { notFound } from 'next/navigation';
import Link from 'next/link';
import { findAbbreviations } from '@/lib/abbreviations';

interface Props {
  params: { code: string };
}

export default function DecodePage({ params }: Props) {
  const target = decodeURIComponent(params.code).toLowerCase();
  const matches = findAbbreviations(target);

  if (matches.length === 0) return notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 font-mono">{target}</h2>
          {matches.length === 1 ? (
            <p className="text-xl mb-8">{matches[0].meaning}</p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg text-slate-300 mb-4">Multiple matches found:</p>
              <div className="grid gap-4">
                {matches.map((match) => (
                  <div 
                    key={match.abbreviation}
                    className={`p-4 rounded-lg ${
                      match.category === 'error-prone'
                        ? 'bg-red-900/30 border border-red-500/30'
                        : 'bg-slate-800'
                    }`}
                  >
                    <div className="font-mono text-lg mb-1">{match.abbreviation}</div>
                    <div className="text-slate-300">{match.meaning}</div>
                    <div className="text-sm text-slate-400 mt-1">
                      Category: {match.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center space-x-4">
          <Link 
            href="/"
            className="text-emerald-400 hover:underline"
          >
            ← decode another
          </Link>
          <Link 
            href="/list"
            className="text-emerald-400 hover:underline"
          >
            browse all
          </Link>
        </div>
      </div>
    </main>
  );
} 