import type { Level } from '@/lib/curriculum'

// BA II Plus practice drills. Answers are pre-computed and verified; the UI
// checks the user's input against `answer` within `tolerance`.
export interface Drill {
  id: string
  levels: Level[]
  category: string
  prompt: string
  answer: number
  tolerance: number
  unit?: string
  keystrokes: string
}

export const DRILLS: Drill[] = [
  {
    id: 'tvm-fv-1',
    levels: ['1', '2', '3'],
    category: 'Time Value of Money',
    prompt: 'Future value of $1,000 invested at 6% annual for 5 years?',
    answer: 1338.23,
    tolerance: 0.5,
    keystrokes: 'N=5, I/Y=6, PV=−1000, PMT=0 → CPT FV',
  },
  {
    id: 'tvm-pv-1',
    levels: ['1', '2', '3'],
    category: 'Time Value of Money',
    prompt: 'Present value of $5,000 received in 8 years, discounted at 7%?',
    answer: 2910.06,
    tolerance: 1,
    keystrokes: 'N=8, I/Y=7, FV=5000, PMT=0 → CPT PV (≈ −2910.06)',
  },
  {
    id: 'tvm-pmt-mortgage',
    levels: ['1', '2'],
    category: 'Time Value of Money',
    prompt: 'Monthly payment on a $200,000 loan, 30 years, 6% APR compounded monthly?',
    answer: 1199.1,
    tolerance: 2,
    keystrokes: 'P/Y=12, N=360, I/Y=6, PV=200000, FV=0 → CPT PMT (≈ −1199.10)',
  },
  {
    id: 'tvm-annuity-pv',
    levels: ['1', '2'],
    category: 'Time Value of Money',
    prompt: 'PV of an ordinary annuity of $2,000/year for 10 years at 8%?',
    answer: 13420.16,
    tolerance: 1,
    keystrokes: 'N=10, I/Y=8, PMT=2000, FV=0 → CPT PV (≈ −13420.16)',
  },
  {
    id: 'tvm-growth-rate',
    levels: ['1', '2', '3'],
    category: 'Time Value of Money',
    prompt: '$1,000 grows to $1,500 in 5 years. What annual growth rate? (in %)',
    answer: 8.45,
    tolerance: 0.1,
    unit: '%',
    keystrokes: 'N=5, PV=−1000, FV=1500, PMT=0 → CPT I/Y',
  },
  {
    id: 'rate-ear',
    levels: ['1', '2', '3'],
    category: 'Rates',
    prompt: 'Effective annual rate of 6% compounded monthly? (in %)',
    answer: 6.17,
    tolerance: 0.05,
    unit: '%',
    keystrokes: '2ND ICONV: NOM=6, C/Y=12 → CPT EFF',
  },
  {
    id: 'cf-npv',
    levels: ['1', '2'],
    category: 'Cash Flow',
    prompt: 'NPV: CF0 = −1,000; CF1–CF3 = 400 each; discount rate 10%?',
    answer: -5.26,
    tolerance: 0.5,
    keystrokes: 'CF: CF0=−1000, C01=400 F01=3 → NPV: I=10, CPT',
  },
  {
    id: 'cf-irr',
    levels: ['1', '2'],
    category: 'Cash Flow',
    prompt: 'IRR: CF0 = −1,000; CF1 = 600; CF2 = 600? (in %)',
    answer: 13.07,
    tolerance: 0.2,
    unit: '%',
    keystrokes: 'CF: CF0=−1000, C01=600 F01=2 → IRR CPT',
  },
  {
    id: 'stat-mean',
    levels: ['1', '2'],
    category: 'Statistics',
    prompt: 'Arithmetic mean of 4, 8, 10, 12, 16?',
    answer: 10,
    tolerance: 0.01,
    keystrokes: '2ND DATA: enter values → 2ND STAT → x̄',
  },
  {
    id: 'stat-sd-pop',
    levels: ['1', '2'],
    category: 'Statistics',
    prompt: 'Population standard deviation of 4, 8, 10, 12, 16?',
    answer: 4,
    tolerance: 0.05,
    keystrokes: '2ND DATA → 2ND STAT → σx (population)',
  },
  {
    id: 'stat-sd-sample',
    levels: ['1', '2'],
    category: 'Statistics',
    prompt: 'Sample standard deviation of 4, 8, 10, 12, 16?',
    answer: 4.47,
    tolerance: 0.05,
    keystrokes: '2ND DATA → 2ND STAT → Sx (sample)',
  },
  {
    id: 'fi-bond-price',
    levels: ['1', '2', '3'],
    category: 'Fixed Income',
    prompt: '5-year annual bond, 5% coupon, $1,000 par, YTM 6%. Price?',
    answer: 957.88,
    tolerance: 1,
    keystrokes: 'N=5, I/Y=6, PMT=50, FV=1000 → CPT PV (≈ −957.88)',
  },
]

export function drillsForLevel(level: Level): Drill[] {
  return DRILLS.filter((d) => d.levels.includes(level))
}
