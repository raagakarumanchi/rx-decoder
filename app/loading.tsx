export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-slate-300">Decoding prescription...</p>
      </div>
    </main>
  );
} 