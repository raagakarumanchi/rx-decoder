export interface Abbreviation {
  abbreviation: string;
  meaning: string;
  category: 'roman' | 'frequency' | 'route' | 'form' | 'unit' | 'latin' | 'misc' | 'error-prone';
}

// Roman numerals
const roman: Abbreviation[] = [
  { abbreviation: "i", meaning: "one", category: "roman" },
  { abbreviation: "ii", meaning: "two", category: "roman" },
  { abbreviation: "iii", meaning: "three", category: "roman" },
  { abbreviation: "iv", meaning: "four", category: "roman" },
  { abbreviation: "v", meaning: "five", category: "roman" },
  { abbreviation: "vi", meaning: "six", category: "roman" },
  { abbreviation: "vii", meaning: "seven", category: "roman" },
  { abbreviation: "viii", meaning: "eight", category: "roman" },
  { abbreviation: "ix", meaning: "nine", category: "roman" },
  { abbreviation: "x", meaning: "ten", category: "roman" },
  { abbreviation: "xi", meaning: "eleven", category: "roman" },
  { abbreviation: "xii", meaning: "twelve", category: "roman" }
];

// Frequency (hours)
const freqHours: Abbreviation[] = Array.from({ length: 24 }, (_, i) => ({
  abbreviation: `q${i + 1}h`,
  meaning: `every ${i + 1} hours`,
  category: "frequency"
}));

// Frequency (days)
const freqDays: Abbreviation[] = Array.from({ length: 13 }, (_, i) => ({
  abbreviation: `q${i + 2}d`,
  meaning: `every ${i + 2} days`,
  category: "frequency"
}));

// Routes of administration
const routes: Abbreviation[] = [
  { abbreviation: "po", meaning: "by mouth", category: "route" },
  { abbreviation: "iv", meaning: "intravenous", category: "route" },
  { abbreviation: "im", meaning: "intramuscular", category: "route" },
  { abbreviation: "sc", meaning: "subcutaneous", category: "route" },
  { abbreviation: "sl", meaning: "sublingual", category: "route" },
  { abbreviation: "pr", meaning: "rectally", category: "route" },
  { abbreviation: "pv", meaning: "vaginally", category: "route" },
  { abbreviation: "inh", meaning: "inhalation", category: "route" },
  { abbreviation: "top", meaning: "topically", category: "route" },
  { abbreviation: "id", meaning: "intradermal", category: "route" }
];

// Dosage forms
const forms: Abbreviation[] = [
  { abbreviation: "tab", meaning: "tablet", category: "form" },
  { abbreviation: "cap", meaning: "capsule", category: "form" },
  { abbreviation: "susp", meaning: "suspension", category: "form" },
  { abbreviation: "sol", meaning: "solution", category: "form" },
  { abbreviation: "elix", meaning: "elixir", category: "form" },
  { abbreviation: "ung", meaning: "ointment", category: "form" },
  { abbreviation: "supp", meaning: "suppository", category: "form" },
  { abbreviation: "patch", meaning: "transdermal patch", category: "form" },
  { abbreviation: "odt", meaning: "orally disintegrating tablet", category: "form" }
];

// Units of measurement
const units: Abbreviation[] = [
  { abbreviation: "mg", meaning: "milligram", category: "unit" },
  { abbreviation: "mcg", meaning: "microgram", category: "unit" },
  { abbreviation: "g", meaning: "gram", category: "unit" },
  { abbreviation: "mL", meaning: "milliliter", category: "unit" },
  { abbreviation: "IU", meaning: "international units", category: "unit" },
  { abbreviation: "mEq", meaning: "milliequivalent", category: "unit" }
];

// Latin abbreviations
const latin: Abbreviation[] = [
  { abbreviation: "ac", meaning: "before meals", category: "latin" },
  { abbreviation: "pc", meaning: "after meals", category: "latin" },
  { abbreviation: "hs", meaning: "at bedtime", category: "latin" },
  { abbreviation: "prn", meaning: "as needed", category: "latin" },
  { abbreviation: "stat", meaning: "immediately", category: "latin" },
  { abbreviation: "bid", meaning: "twice a day", category: "latin" },
  { abbreviation: "tid", meaning: "three times a day", category: "latin" },
  { abbreviation: "qid", meaning: "four times a day", category: "latin" },
  { abbreviation: "qam", meaning: "every morning", category: "latin" },
  { abbreviation: "qpm", meaning: "every evening", category: "latin" },
  { abbreviation: "qod", meaning: "every other day", category: "latin" },
  { abbreviation: "qw", meaning: "every week", category: "latin" },
  { abbreviation: "qs", meaning: "sufficient quantity", category: "latin" }
];

// Miscellaneous
const misc: Abbreviation[] = [
  { abbreviation: "NPO", meaning: "nothing by mouth", category: "misc" },
  { abbreviation: "d/c", meaning: "discontinue", category: "misc" },
  { abbreviation: "sig", meaning: "write on label", category: "misc" },
  { abbreviation: "disp", meaning: "dispense", category: "misc" },
  { abbreviation: "DAW", meaning: "dispense as written", category: "misc" },
  { abbreviation: "gtt", meaning: "drop", category: "misc" },
  { abbreviation: "ad lib", meaning: "as desired", category: "misc" },
  { abbreviation: "KVO", meaning: "keep vein open", category: "misc" },
  { abbreviation: "NS", meaning: "normal saline", category: "misc" },
  { abbreviation: "DW", meaning: "distilled water", category: "misc" },
  { abbreviation: "LA", meaning: "long acting", category: "misc" },
  { abbreviation: "ER", meaning: "extended release", category: "misc" },
  { abbreviation: "CR", meaning: "controlled release", category: "misc" },
  { abbreviation: "XR", meaning: "extended release", category: "misc" },
  { abbreviation: "XL", meaning: "extended release", category: "misc" }
];

// Error-prone abbreviations (with warnings)
const errorProne: Abbreviation[] = [
  { abbreviation: "u", meaning: "unit (write \"unit\")", category: "error-prone" },
  { abbreviation: "qd", meaning: "every day (write daily)", category: "error-prone" },
  { abbreviation: "qod", meaning: "every other day (write every other day)", category: "error-prone" },
  { abbreviation: "hs", meaning: "half-strength or bedtime (clarify)", category: "error-prone" }
];

// Combine all abbreviations
export const ABBREVIATIONS: Abbreviation[] = [
  ...roman,
  ...freqHours,
  ...freqDays,
  ...routes,
  ...forms,
  ...units,
  ...latin,
  ...misc,
  ...errorProne
].sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));

// Helper function to find abbreviations
export function findAbbreviations(query: string): Abbreviation[] {
  const normalizedQuery = query.toLowerCase().trim();
  return ABBREVIATIONS.filter(abbr => 
    abbr.abbreviation.toLowerCase().includes(normalizedQuery) ||
    abbr.meaning.toLowerCase().includes(normalizedQuery)
  );
} 