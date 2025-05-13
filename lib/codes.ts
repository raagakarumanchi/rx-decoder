export interface Entry {
  abbr: string;
  text: string;
}

export const CODES: Entry[] = [
  { abbr: 'po',  text: 'by mouth' },
  { abbr: 'iv',  text: 'intravenously' },
  { abbr: 'sc',  text: 'subcutaneously' },
  { abbr: 'prn', text: 'as needed' },
  { abbr: 'bid', text: 'twice a day' },
  { abbr: 'tid', text: 'three times a day' },
  { abbr: 'qid', text: 'four times a day' },
  { abbr: 'hs',  text: 'at bedtime' },
  { abbr: 'ac',  text: 'before meals' },
  { abbr: 'pc',  text: 'after meals' },
  // add more as desired
]; 