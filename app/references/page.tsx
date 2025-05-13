'use client';
import { REFS } from '@/lib/references';

export default function ReferencesPage() {
  return (
    <main className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">References</h1>
        
        <div className="space-y-6">
          {REFS.map((ref) => (
            <div key={ref.id} className="bg-slate-800 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                <a 
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {ref.name}
                </a>
              </h2>
              <p className="text-slate-300">{ref.citation}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <a 
            href="/"
            className="text-emerald-400 hover:underline"
          >
            ← Back to decoder
          </a>
        </div>
      </div>
    </main>
  );
} 