export interface SearchAnalytics {
  query: string;
  timestamp: number;
  success: boolean;
  parts: string[];
  relatedSearches: string[];
}

export interface PopularSearch {
  query: string;
  count: number;
  lastSearched: number;
  successRate: number;
}

const ANALYTICS_KEY = 'rx-decoder-analytics';
const MAX_ANALYTICS = 1000;
const POPULAR_SEARCHES_KEY = 'rx-decoder-popular-searches';
const MAX_POPULAR_SEARCHES = 50;

export function trackSearch(query: string, success: boolean, parts: string[], relatedSearches: string[]) {
  if (typeof window === 'undefined') return;
  
  try {
    // Track individual search
    const analytics = getAnalytics();
    const newAnalytics = [
      {
        query,
        timestamp: Date.now(),
        success,
        parts,
        relatedSearches,
      },
      ...analytics,
    ].slice(0, MAX_ANALYTICS);
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(newAnalytics));

    // Update popular searches
    const popularSearches = getPopularSearches();
    const existingSearch = popularSearches.find(s => s.query === query);
    
    if (existingSearch) {
      existingSearch.count++;
      existingSearch.lastSearched = Date.now();
      existingSearch.successRate = (existingSearch.successRate * (existingSearch.count - 1) + (success ? 1 : 0)) / existingSearch.count;
    } else {
      popularSearches.push({
        query,
        count: 1,
        lastSearched: Date.now(),
        successRate: success ? 1 : 0,
      });
    }

    // Sort by count and limit
    popularSearches.sort((a, b) => b.count - a.count);
    localStorage.setItem(POPULAR_SEARCHES_KEY, JSON.stringify(popularSearches.slice(0, MAX_POPULAR_SEARCHES)));
  } catch {
    // Ignore storage errors
  }
}

export function getAnalytics(): SearchAnalytics[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const analytics = localStorage.getItem(ANALYTICS_KEY);
    return analytics ? JSON.parse(analytics) : [];
  } catch {
    return [];
  }
}

export function getPopularSearches(): PopularSearch[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const searches = localStorage.getItem(POPULAR_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch {
    return [];
  }
}

export function clearAnalytics() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(POPULAR_SEARCHES_KEY);
  } catch {
    // Ignore storage errors
  }
}

export function getSearchStats() {
  const analytics = getAnalytics();
  const popularSearches = getPopularSearches();
  
  const totalSearches = analytics.length;
  const successfulSearches = analytics.filter(a => a.success).length;
  const successRate = totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0;
  
  const averageParts = analytics.reduce((acc, curr) => acc + curr.parts.length, 0) / totalSearches || 0;
  const uniqueQueries = new Set(analytics.map(a => a.query)).size;
  
  return {
    totalSearches,
    successfulSearches,
    successRate,
    averageParts,
    uniqueQueries,
    popularSearches: popularSearches.slice(0, 10),
  };
} 