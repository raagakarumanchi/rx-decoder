'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <p className="text-xl text-slate-300 mb-8">
            We apologize for the inconvenience. Please try again.
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={reset}
            className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
} 