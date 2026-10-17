import type { LevelCurriculum } from './types'

// CFA Level II — same 10 topic areas as Level I, but item-set ("vignette")
// focused and more valuation-heavy. Weights are published ranges; verify per
// exam year. Subtopics are a starting breakdown, expandable over time.

export const level2: LevelCurriculum = {
  level: '2',
  subjects: [
    {
      id: 'l2-eth',
      code: 'ETH',
      title: 'Ethical & Professional Standards',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l2-eth-application',
          title: 'Application of the Code & Standards',
          estMinutes: 150,
          subtopics: [
            { id: 'l2-eth-application-cases', title: 'Code & Standards: Application' },
            { id: 'l2-eth-application-gips', title: 'GIPS for Firms' },
          ],
        },
      ],
    },
    {
      id: 'l2-qm',
      code: 'QM',
      title: 'Quantitative Methods',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l2-qm-regression',
          title: 'Multiple Regression',
          estMinutes: 150,
          subtopics: [
            { id: 'l2-qm-regression-multiple', title: 'Multiple Regression & Model Building' },
            { id: 'l2-qm-regression-violations', title: 'Assumption Violations & Diagnostics' },
          ],
        },
        {
          id: 'l2-qm-timeseries-ml',
          title: 'Time-Series & Machine Learning',
          estMinutes: 150,
          subtopics: [
            { id: 'l2-qm-timeseries', title: 'Time-Series Analysis' },
            { id: 'l2-qm-ml', title: 'Machine Learning & Big Data Projects' },
          ],
        },
      ],
    },
    {
      id: 'l2-econ',
      code: 'ECON',
      title: 'Economics',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l2-econ-currency',
          title: 'Currency Exchange Rates',
          estMinutes: 120,
          subtopics: [
            { id: 'l2-econ-currency-determination', title: 'Exchange-Rate Determination' },
          ],
        },
        {
          id: 'l2-econ-growth',
          title: 'Economic Growth',
          estMinutes: 90,
          subtopics: [
            { id: 'l2-econ-growth-models', title: 'Economic Growth Models' },
          ],
        },
      ],
    },
    {
      id: 'l2-fsa',
      code: 'FSA',
      title: 'Financial Statement Analysis',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l2-fsa-intercorporate',
          title: 'Intercorporate Investments & Combinations',
          estMinutes: 180,
          subtopics: [
            { id: 'l2-fsa-intercorporate-investments', title: 'Intercorporate Investments' },
            { id: 'l2-fsa-business-combinations', title: 'Business Combinations' },
          ],
        },
        {
          id: 'l2-fsa-pensions-multinational',
          title: 'Pensions, Multinational & Quality',
          estMinutes: 180,
          subtopics: [
            { id: 'l2-fsa-pensions', title: 'Employee Compensation: Pensions' },
            { id: 'l2-fsa-multinational', title: 'Multinational Operations' },
            { id: 'l2-fsa-quality', title: 'Evaluating Quality of Financial Reports' },
          ],
        },
      ],
    },
    {
      id: 'l2-ci',
      code: 'CI',
      title: 'Corporate Issuers',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l2-ci-analysis',
          title: 'Corporate Analysis',
          estMinutes: 120,
          subtopics: [
            { id: 'l2-ci-analysis-capital-structure', title: 'Capital Structure' },
            { id: 'l2-ci-analysis-esg', title: 'ESG Considerations' },
          ],
        },
      ],
    },
    {
      id: 'l2-eq',
      code: 'EQ',
      title: 'Equity Valuation',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l2-eq-models',
          title: 'Valuation Models',
          estMinutes: 210,
          subtopics: [
            { id: 'l2-eq-models-ddm', title: 'Discounted Dividend Valuation' },
            { id: 'l2-eq-models-fcf', title: 'Free Cash Flow Valuation' },
            { id: 'l2-eq-models-residual', title: 'Residual Income Valuation' },
            { id: 'l2-eq-models-market', title: 'Market-Based Valuation' },
          ],
        },
      ],
    },
    {
      id: 'l2-fi',
      code: 'FI',
      title: 'Fixed Income',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l2-fi-term-structure',
          title: 'Term Structure & Valuation',
          estMinutes: 180,
          subtopics: [
            { id: 'l2-fi-term-structure-models', title: 'The Term Structure & Interest-Rate Dynamics' },
            { id: 'l2-fi-arbitrage-free', title: 'Arbitrage-Free Valuation' },
          ],
        },
        {
          id: 'l2-fi-credit',
          title: 'Credit & Structured',
          estMinutes: 150,
          subtopics: [
            { id: 'l2-fi-credit-analysis', title: 'Credit Analysis Models' },
            { id: 'l2-fi-credit-default-swaps', title: 'Credit Default Swaps' },
          ],
        },
      ],
    },
    {
      id: 'l2-der',
      code: 'DER',
      title: 'Derivatives',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l2-der-valuation',
          title: 'Valuation of Contingent Claims',
          estMinutes: 180,
          subtopics: [
            { id: 'l2-der-valuation-forwards-futures', title: 'Pricing & Valuation of Forwards/Futures' },
            { id: 'l2-der-valuation-swaps', title: 'Valuation of Swaps' },
            { id: 'l2-der-valuation-options', title: 'Valuation of Options' },
          ],
        },
      ],
    },
    {
      id: 'l2-alt',
      code: 'ALT',
      title: 'Alternative Investments',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l2-alt-private',
          title: 'Private Markets & Real Assets',
          estMinutes: 150,
          subtopics: [
            { id: 'l2-alt-private-equity', title: 'Private Equity & Venture Capital' },
            { id: 'l2-alt-real-estate', title: 'Real Estate & Infrastructure' },
          ],
        },
      ],
    },
    {
      id: 'l2-pm',
      code: 'PM',
      title: 'Portfolio Management',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l2-pm-analysis',
          title: 'Risk & Active Management',
          estMinutes: 180,
          subtopics: [
            { id: 'l2-pm-analysis-active', title: 'Analysis of Active Portfolio Management' },
            { id: 'l2-pm-analysis-economics', title: 'Economics & Investment Markets' },
            { id: 'l2-pm-analysis-trading', title: 'Trading Costs & Electronic Markets' },
          ],
        },
      ],
    },
  ],
}
