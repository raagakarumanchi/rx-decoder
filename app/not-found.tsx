import Link from 'next/link';
import { ABBREVIATIONS } from '@/lib/abbreviations';

export default function NotFound() {
  // Get some random suggestions
  const suggestions = ABBREVIATIONS
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

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
            {suggestions.map((abbr) => (
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