export interface SearchHistory {
  query: string;
  timestamp: number;
}

const HISTORY_KEY = 'rx-decoder-history';
const MAX_HISTORY = 10;

export function getSearchHistory(): SearchHistory[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

export function addToHistory(query: string) {
  if (typeof window === 'undefined') return;
  
  try {
    const history = getSearchHistory();
    const newHistory = [
      { query, timestamp: Date.now() },
      ...history.filter(item => item.query !== query)
    ].slice(0, MAX_HISTORY);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  } catch {
    // Ignore storage errors
  }
}

export function clearHistory() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Ignore storage errors
  }
} 