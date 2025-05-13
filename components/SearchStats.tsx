import { useEffect, useState } from 'react';
import { getSearchStats, PopularSearch } from '@/lib/analytics';
import Link from 'next/link';

export default function SearchStats() {
  const [stats, setStats] = useState<ReturnType<typeof getSearchStats> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      const currentStats = getSearchStats();
      setStats(currentStats);
      setIsLoading(false);
    };

    loadStats();
    const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900">Search Statistics</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Searches"
          value={stats.totalSearches}
          description="Total number of searches performed"
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate.toFixed(1)}%`}
          description="Percentage of successful searches"
        />
        <StatCard
          title="Unique Queries"
          value={stats.uniqueQueries}
          description="Number of unique search terms"
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900">Popular Searches</h3>
        <div className="mt-4 space-y-2">
          {stats.popularSearches.map((search) => (
            <PopularSearchItem key={search.query} search={search} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}

interface PopularSearchItemProps {
  search: PopularSearch;
}

function PopularSearchItem({ search }: PopularSearchItemProps) {
  return (
    <Link
      href={`/decode/${search.query}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:bg-blue-50/50"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-gray-900">{search.query}</h4>
          <p className="mt-1 text-sm text-gray-500">
            Searched {search.count} times
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {search.successRate.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-sm font-medium text-blue-800">
              {search.count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 