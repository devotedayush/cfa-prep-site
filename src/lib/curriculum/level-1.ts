import type { LevelCurriculum } from './types'

// CFA Level I — topic areas, published weight ranges, and a working
// topic/subtopic breakdown. Names/weights are the public CFA Program
// structure (not copyrighted curriculum text); verify weights per exam year.

export const level1: LevelCurriculum = {
  level: '1',
  subjects: [
    {
      id: 'l1-eth',
      code: 'ETH',
      title: 'Ethical & Professional Standards',
      weightMin: 15,
      weightMax: 20,
      topics: [
        {
          id: 'l1-eth-code',
          title: 'Code of Ethics & Standards of Professional Conduct',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-eth-code-profession', title: 'Ethics & Trust in the Investment Profession' },
            { id: 'l1-eth-code-code-standards', title: 'Code of Ethics & Standards Overview' },
          ],
        },
        {
          id: 'l1-eth-standards',
          title: 'Guidance for Standards I–VII',
          estMinutes: 180,
          subtopics: [
            { id: 'l1-eth-std-professionalism', title: 'Standard I: Professionalism' },
            { id: 'l1-eth-std-integrity-markets', title: 'Standard II: Integrity of Capital Markets' },
            { id: 'l1-eth-std-duties-clients', title: 'Standard III: Duties to Clients' },
            { id: 'l1-eth-std-duties-employers', title: 'Standard IV: Duties to Employers' },
            { id: 'l1-eth-std-investment-analysis', title: 'Standard V: Investment Analysis & Recommendations' },
            { id: 'l1-eth-std-conflicts', title: 'Standard VI: Conflicts of Interest' },
            { id: 'l1-eth-std-member-responsibilities', title: 'Standard VII: Responsibilities as a CFA Member' },
          ],
        },
        {
          id: 'l1-eth-gips',
          title: 'Global Investment Performance Standards (GIPS)',
          estMinutes: 60,
          subtopics: [
            { id: 'l1-eth-gips-intro', title: 'Introduction to GIPS' },
          ],
        },
      ],
    },
    {
      id: 'l1-qm',
      code: 'QM',
      title: 'Quantitative Methods',
      weightMin: 6,
      weightMax: 9,
      topics: [
        {
          id: 'l1-qm-tvm',
          title: 'Rates & Time Value of Money',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-qm-tvm-interest-rates', title: 'Interest Rates & Required Returns' },
            { id: 'l1-qm-tvm-fv', title: 'Future Value of Cash Flows' },
            { id: 'l1-qm-tvm-pv', title: 'Present Value of Cash Flows' },
            { id: 'l1-qm-tvm-annuities', title: 'Annuities & Perpetuities' },
          ],
        },
        {
          id: 'l1-qm-stats',
          title: 'Statistical Measures & Probability',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-qm-stats-central', title: 'Measures of Central Tendency & Dispersion' },
            { id: 'l1-qm-stats-prob', title: 'Probability Concepts' },
            { id: 'l1-qm-stats-distributions', title: 'Probability Distributions' },
            { id: 'l1-qm-stats-sampling', title: 'Sampling & Estimation' },
          ],
        },
        {
          id: 'l1-qm-inference',
          title: 'Hypothesis Testing & Regression',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-qm-inference-hypothesis', title: 'Hypothesis Testing' },
            { id: 'l1-qm-inference-regression', title: 'Simple Linear Regression' },
          ],
        },
      ],
    },
    {
      id: 'l1-econ',
      code: 'ECON',
      title: 'Economics',
      weightMin: 6,
      weightMax: 9,
      topics: [
        {
          id: 'l1-econ-micro',
          title: 'Microeconomics',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-econ-micro-demand-supply', title: 'Demand & Supply Analysis' },
            { id: 'l1-econ-micro-firm', title: 'The Firm & Market Structures' },
          ],
        },
        {
          id: 'l1-econ-macro',
          title: 'Macroeconomics',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-econ-macro-aggregate', title: 'Aggregate Output, Prices & Growth' },
            { id: 'l1-econ-macro-cycles', title: 'Business Cycles' },
            { id: 'l1-econ-macro-policy', title: 'Monetary & Fiscal Policy' },
          ],
        },
        {
          id: 'l1-econ-currency',
          title: 'International Trade & Currency',
          estMinutes: 90,
          subtopics: [
            { id: 'l1-econ-currency-exchange', title: 'Currency Exchange Rates' },
          ],
        },
      ],
    },
    {
      id: 'l1-fsa',
      code: 'FSA',
      title: 'Financial Statement Analysis',
      weightMin: 11,
      weightMax: 14,
      topics: [
        {
          id: 'l1-fsa-intro',
          title: 'Introduction & Statements',
          estMinutes: 180,
          subtopics: [
            { id: 'l1-fsa-intro-overview', title: 'Introduction to Financial Statement Analysis' },
            { id: 'l1-fsa-intro-income', title: 'Income Statements' },
            { id: 'l1-fsa-intro-balance', title: 'Balance Sheets' },
            { id: 'l1-fsa-intro-cashflow', title: 'Cash Flow Statements' },
          ],
        },
        {
          id: 'l1-fsa-items',
          title: 'Analyzing Statement Items',
          estMinutes: 180,
          subtopics: [
            { id: 'l1-fsa-items-inventories', title: 'Inventories' },
            { id: 'l1-fsa-items-long-lived', title: 'Long-Lived Assets' },
            { id: 'l1-fsa-items-income-taxes', title: 'Income Taxes' },
            { id: 'l1-fsa-items-liabilities', title: 'Non-Current Liabilities' },
          ],
        },
        {
          id: 'l1-fsa-techniques',
          title: 'Analysis Techniques & Quality',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-fsa-techniques-ratios', title: 'Financial Analysis Techniques' },
            { id: 'l1-fsa-techniques-quality', title: 'Financial Reporting Quality' },
          ],
        },
      ],
    },
    {
      id: 'l1-ci',
      code: 'CI',
      title: 'Corporate Issuers',
      weightMin: 6,
      weightMax: 9,
      topics: [
        {
          id: 'l1-ci-governance',
          title: 'Structures & Governance',
          estMinutes: 90,
          subtopics: [
            { id: 'l1-ci-governance-forms', title: 'Organizational Forms & Features' },
            { id: 'l1-ci-governance-stakeholders', title: 'Corporate Governance & Stakeholders' },
          ],
        },
        {
          id: 'l1-ci-capital',
          title: 'Capital Decisions',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-ci-capital-investments', title: 'Capital Investments' },
            { id: 'l1-ci-capital-structure', title: 'Capital Structure' },
            { id: 'l1-ci-capital-working', title: 'Working Capital & Liquidity' },
            { id: 'l1-ci-capital-cost', title: 'Cost of Capital' },
          ],
        },
      ],
    },
    {
      id: 'l1-eq',
      code: 'EQ',
      title: 'Equity Investments',
      weightMin: 11,
      weightMax: 14,
      topics: [
        {
          id: 'l1-eq-markets',
          title: 'Markets & Indexes',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-eq-markets-organization', title: 'Market Organization & Structure' },
            { id: 'l1-eq-markets-indexes', title: 'Security Market Indexes' },
            { id: 'l1-eq-markets-efficiency', title: 'Market Efficiency' },
          ],
        },
        {
          id: 'l1-eq-analysis',
          title: 'Securities & Valuation',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-eq-analysis-securities', title: 'Overview of Equity Securities' },
            { id: 'l1-eq-analysis-company', title: 'Company & Industry Analysis' },
            { id: 'l1-eq-analysis-valuation', title: 'Equity Valuation: Concepts & Tools' },
          ],
        },
      ],
    },
    {
      id: 'l1-fi',
      code: 'FI',
      title: 'Fixed Income',
      weightMin: 11,
      weightMax: 14,
      topics: [
        {
          id: 'l1-fi-basics',
          title: 'Instruments & Markets',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-fi-basics-features', title: 'Fixed-Income Instrument Features' },
            { id: 'l1-fi-basics-issuance', title: 'Issuance, Trading & Markets' },
          ],
        },
        {
          id: 'l1-fi-valuation',
          title: 'Pricing, Yields & Risk',
          estMinutes: 180,
          subtopics: [
            { id: 'l1-fi-valuation-pricing', title: 'Bond Pricing & Yields' },
            { id: 'l1-fi-valuation-term-structure', title: 'The Term Structure' },
            { id: 'l1-fi-valuation-duration', title: 'Duration & Convexity' },
          ],
        },
        {
          id: 'l1-fi-credit',
          title: 'Credit & Securitization',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-fi-credit-analysis', title: 'Fundamentals of Credit Analysis' },
            { id: 'l1-fi-credit-securitized', title: 'Asset-Backed Securities' },
          ],
        },
      ],
    },
    {
      id: 'l1-der',
      code: 'DER',
      title: 'Derivatives',
      weightMin: 5,
      weightMax: 8,
      topics: [
        {
          id: 'l1-der-basics',
          title: 'Markets & Instruments',
          estMinutes: 90,
          subtopics: [
            { id: 'l1-der-basics-overview', title: 'Derivative Instrument & Market Features' },
            { id: 'l1-der-basics-forward-commitments', title: 'Forwards, Futures & Swaps' },
            { id: 'l1-der-basics-options', title: 'Options' },
          ],
        },
        {
          id: 'l1-der-valuation',
          title: 'Pricing & Valuation Basics',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-der-valuation-arbitrage', title: 'Arbitrage, Replication & Cost of Carry' },
            { id: 'l1-der-valuation-options', title: 'Option Pricing Basics' },
          ],
        },
      ],
    },
    {
      id: 'l1-alt',
      code: 'ALT',
      title: 'Alternative Investments',
      weightMin: 7,
      weightMax: 10,
      topics: [
        {
          id: 'l1-alt-features',
          title: 'Categories & Features',
          estMinutes: 90,
          subtopics: [
            { id: 'l1-alt-features-categories', title: 'Categories of Alternative Investments' },
            { id: 'l1-alt-features-performance', title: 'Performance, Fees & Returns' },
          ],
        },
      ],
    },
    {
      id: 'l1-pm',
      code: 'PM',
      title: 'Portfolio Management',
      weightMin: 8,
      weightMax: 12,
      topics: [
        {
          id: 'l1-pm-risk-return',
          title: 'Portfolio Risk & Return',
          estMinutes: 150,
          subtopics: [
            { id: 'l1-pm-risk-return-basics', title: 'Portfolio Risk & Return Fundamentals' },
            { id: 'l1-pm-risk-return-capm', title: 'The CAPM & Market Model' },
          ],
        },
        {
          id: 'l1-pm-planning',
          title: 'Planning & Construction',
          estMinutes: 120,
          subtopics: [
            { id: 'l1-pm-planning-process', title: 'Portfolio Planning & Construction' },
            { id: 'l1-pm-planning-risk-mgmt', title: 'Risk Management Basics' },
            { id: 'l1-pm-planning-fintech', title: 'Fintech in Investment Management' },
          ],
        },
      ],
    },
  ],
}
