import { ABBREVIATIONS } from './abbreviations';

export interface SearchResult {
  abbreviation: string;
  meaning: string;
  score: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
  matchedParts: string[];
}

export interface SearchOptions {
  fuzzy?: boolean;
  maxResults?: number;
  minScore?: number;
  includePartial?: boolean;
}

const DEFAULT_OPTIONS: SearchOptions = {
  fuzzy: true,
  maxResults: 10,
  minScore: 0.3,
  includePartial: true,
};

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + substitutionCost // substitution
      );
    }
  }

  return matrix[b.length][a.length];
}

// Calculate similarity score between 0 and 1
function calculateSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

// Split query into parts and find matches
function findMatches(query: string, options: SearchOptions = {}): SearchResult[] {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const results: SearchResult[] = [];
  const queryLower = query.toLowerCase();
  
  // Split query into parts (e.g., "ipo" -> ["i", "po"])
  const parts = queryLower.match(/([ivxlcdm]+|[a-z]+)/g) || [queryLower];
  
  for (const abbr of ABBREVIATIONS) {
    const abbrLower = abbr.abbreviation.toLowerCase();
    let score = 0;
    let matchType: 'exact' | 'partial' | 'fuzzy' = 'fuzzy';
    const matchedParts: string[] = [];

    // Check for exact match
    if (abbrLower === queryLower) {
      score = 1;
      matchType = 'exact';
      matchedParts.push(abbr.abbreviation);
    }
    // Check for partial match
    else if (mergedOptions.includePartial && abbrLower.includes(queryLower)) {
      score = 0.8;
      matchType = 'partial';
      matchedParts.push(abbr.abbreviation);
    }
    // Check for fuzzy match
    else if (mergedOptions.fuzzy) {
      const similarity = calculateSimilarity(queryLower, abbrLower);
      if (similarity >= mergedOptions.minScore!) {
        score = similarity;
        matchedParts.push(abbr.abbreviation);
      }
    }

    // Check for matches in parts
    for (const part of parts) {
      if (abbrLower.includes(part)) {
        score = Math.max(score, 0.6);
        matchedParts.push(part);
      } else if (mergedOptions.fuzzy) {
        const similarity = calculateSimilarity(part, abbrLower);
        if (similarity >= mergedOptions.minScore!) {
          score = Math.max(score, similarity * 0.8);
          matchedParts.push(part);
        }
      }
    }

    if (score > 0) {
      results.push({
        abbreviation: abbr.abbreviation,
        meaning: abbr.meaning,
        score,
        matchType,
        matchedParts,
      });
    }
  }

  // Sort by score and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, mergedOptions.maxResults);
}

// Get suggestions based on partial input
export function getSuggestions(query: string, options: SearchOptions = {}): SearchResult[] {
  if (!query.trim()) return [];
  return findMatches(query, { ...options, includePartial: true });
}

// Search for exact or fuzzy matches
export function search(query: string, options: SearchOptions = {}): SearchResult[] {
  if (!query.trim()) return [];
  return findMatches(query, options);
}

// Get related abbreviations based on meaning
export function getRelatedAbbreviations(abbreviation: string, maxResults: number = 3): SearchResult[] {
  const abbr = ABBREVIATIONS.find(a => a.abbreviation.toLowerCase() === abbreviation.toLowerCase());
  if (!abbr) return [];

  const words = abbr.meaning.toLowerCase().split(/\s+/);
  const results: SearchResult[] = [];

  for (const other of ABBREVIATIONS) {
    if (other.abbreviation === abbr.abbreviation) continue;

    const otherWords = other.meaning.toLowerCase().split(/\s+/);
    const commonWords = words.filter(word => 
      word.length > 3 && otherWords.includes(word)
    );

    if (commonWords.length > 0) {
      results.push({
        abbreviation: other.abbreviation,
        meaning: other.meaning,
        score: commonWords.length / Math.max(words.length, otherWords.length),
        matchType: 'partial',
        matchedParts: commonWords,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

// Get common combinations
export function getCommonCombinations(abbreviation: string): string[] {
  const abbr = ABBREVIATIONS.find(a => a.abbreviation.toLowerCase() === abbreviation.toLowerCase());
  if (!abbr) return [];

  const combinations = new Set<string>();
  const words = abbr.meaning.toLowerCase().split(/\s+/);

  for (const other of ABBREVIATIONS) {
    if (other.abbreviation === abbr.abbreviation) continue;

    const otherWords = other.meaning.toLowerCase().split(/\s+/);
    const hasCommonWords = words.some(word => 
      word.length > 3 && otherWords.includes(word)
    );

    if (hasCommonWords) {
      combinations.add(`${abbr.abbreviation} ${other.abbreviation}`);
      combinations.add(`${other.abbreviation} ${abbr.abbreviation}`);
    }
  }

  return Array.from(combinations);
} 