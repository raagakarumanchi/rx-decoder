export interface Ref {
  id: string;
  name: string;
  url: string;
  citation: string; // short AMA‑style note
}

export const REFS: Ref[] = [
  {
    id: 'drugs',
    name: 'Drugs.com – Top 150 Prescription Abbreviations',
    url: 'https://www.drugs.com/article/prescription-abbreviations.html',
    citation: 'Drugs.com. Top 150 Prescription Abbreviations & Medical Meanings. Accessed 2025‑05‑13',
  },
  {
    id: 'verywell',
    name: 'Verywell Health – Understanding Prescription Abbreviations',
    url: 'https://www.verywellhealth.com/prescription-abbreviations-list-1124124',
    citation: 'Cohen M. Understanding Prescription Abbreviations. Verywell Health. Accessed 2025‑05‑13',
  },
  {
    id: 'ismp',
    name: 'ISMP – Error‑Prone Abbreviation List (PDF)',
    url: 'https://www.ismp.org/sites/default/files/attachments/2020-04/Error-Prone%20Abbreviations.pdf',
    citation: 'Institute for Safe Medication Practices. ISMP's List of Error‑Prone Abbreviations. 2017.',
  },
  {
    id: 'mnboard',
    name: 'Minnesota Board of Pharmacy – Abbreviation Handout (PDF)',
    url: 'https://mn.gov/boards/assets/prescriptionabbreviations_tcm21-29299.pdf',
    citation: 'Minnesota Board of Pharmacy. Partial List of Prescription Abbreviations. 2014.',
  },
  {
    id: 'charter',
    name: 'Charter College – 72 Abbreviations Every Pharmacy Tech Needs to Know',
    url: 'https://www.chartercollege.edu/news-hub/72-abbreviations-every-pharmacy-tech-needs-know',
    citation: 'Charter College. 72 Abbreviations Every Pharmacy Tech Needs to Know. 2024.',
  },
]; 