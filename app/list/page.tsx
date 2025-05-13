'use client';
import { ABBREVIATIONS } from '@/lib/abbreviations';

const categoryLabels: Record<string, string> = {
  'roman': 'Roman Numerals',
  'frequency': 'Frequency',
  'route': 'Routes of Administration',
  'form': 'Dosage Forms',
  'unit': 'Units of Measurement',
  'latin': 'Latin Abbreviations',
  'misc': 'Miscellaneous',
  'error-prone': 'Error-Prone Abbreviations'
};

export default function ListPage() {
  // Group abbreviations by category
  const groupedAbbreviations = ABBREVIATIONS.reduce((acc, abbr) => {
    if (!acc[abbr.category]) {
      acc[abbr.category] = [];
    }
    acc[abbr.category].push(abbr);
    return acc;
  }, {} as Record<string, typeof ABBREVIATIONS>);

  return (
    <main className="min-h-screen p-6 bg-slate-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Prescription Abbreviations</h1>
        
        <div className="space-y-8">
          {Object.entries(groupedAbbreviations).map(([category, abbreviations]) => (
            <div key={category} className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4 text-emerald-400">
                {categoryLabels[category]}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {abbreviations.map((abbr) => (
                  <div 
                    key={abbr.abbreviation}
                    className={`p-3 rounded ${
                      category === 'error-prone' 
                        ? 'bg-red-900/30 border border-red-500/30' 
                        : 'bg-slate-700/50'
                    }`}
                  >
                    <div className="font-mono text-lg">{abbr.abbreviation}</div>
                    <div className="text-slate-300">{abbr.meaning}</div>
                  </div>
                ))}
              </div>
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