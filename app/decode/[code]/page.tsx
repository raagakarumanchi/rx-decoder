import { notFound } from 'next/navigation';
import { CODES } from '@/lib/codes';

interface Props {
  params: { code: string };
}

export default function DecodePage({ params }: Props) {
  const target = params.code.toLowerCase();
  const entry = CODES.find(c => c.abbr === target);

  if (!entry) return notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
      <h2 className="text-4xl font-bold mb-4">{entry.abbr}</h2>
      <p className="text-xl mb-8 text-center">{entry.text}</p>
      <a href="/" className="text-emerald-400 hover:underline">decode another ↩</a>
    </main>
  );
} 