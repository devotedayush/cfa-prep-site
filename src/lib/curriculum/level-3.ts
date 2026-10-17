import type { LevelCurriculum } from './types'

// CFA Level III — portfolio-management and application focused (essay + item
// sets). The 2025+ curriculum splits into a common core plus specialized
// pathways (Portfolio Management, Private Markets, Private Wealth). This models
// the common functional areas; verify pathway structure/weights per exam year.

export const level3: LevelCurriculum = {
  level: '3',
  subjects: [
    {
      id: 'l3-eth',
      code: 'ETH',
      title: 'Ethical & Professional Standards',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l3-eth-application',
          title: 'Code, Standards & GIPS Application',
          estMinutes: 150,
          subtopics: [
            { id: 'l3-eth-application-cases', title: 'Application of the Code & Standards' },
            { id: 'l3-eth-application-asset-manager', title: 'Asset Manager Code of Conduct' },
          ],
        },
      ],
    },
    {
      id: 'l3-bg',
      code: 'BG',
      title: 'Behavioral Finance & Capital Market Expectations',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l3-bg-behavioral',
          title: 'Behavioral Finance',
          estMinutes: 120,
          subtopics: [
            { id: 'l3-bg-behavioral-biases', title: 'Behavioral Biases of Individuals' },
            { id: 'l3-bg-behavioral-markets', title: 'Behavioral Finance & Markets' },
          ],
        },
        {
          id: 'l3-bg-cme',
          title: 'Capital Market Expectations',
          estMinutes: 150,
          subtopics: [
            { id: 'l3-bg-cme-framework', title: 'Forecasting: Framework & Macro' },
            { id: 'l3-bg-cme-asset-classes', title: 'Forecasting Asset-Class Returns' },
          ],
        },
      ],
    },
    {
      id: 'l3-aa',
      code: 'AA',
      title: 'Asset Allocation',
      weightMin: 15,
      weightMax: 20,
      topics: [
        {
          id: 'l3-aa-principles',
          title: 'Allocation Principles & Approaches',
          estMinutes: 210,
          subtopics: [
            { id: 'l3-aa-principles-overview', title: 'Overview of Asset Allocation' },
            { id: 'l3-aa-principles-strategic', title: 'Principles of Asset Allocation' },
            { id: 'l3-aa-principles-implementation', title: 'Asset Allocation with Real-World Constraints' },
          ],
        },
      ],
    },
    {
      id: 'l3-pc',
      code: 'PC',
      title: 'Portfolio Construction',
      weightMin: 15,
      weightMax: 25,
      topics: [
        {
          id: 'l3-pc-fixed-income',
          title: 'Fixed-Income Portfolios',
          estMinutes: 180,
          subtopics: [
            { id: 'l3-pc-fixed-income-liability', title: 'Liability-Driven & Index-Based Strategies' },
            { id: 'l3-pc-fixed-income-active', title: 'Active Fixed-Income Strategies' },
          ],
        },
        {
          id: 'l3-pc-equity',
          title: 'Equity Portfolios',
          estMinutes: 180,
          subtopics: [
            { id: 'l3-pc-equity-passive-active', title: 'Passive & Active Equity Investing' },
            { id: 'l3-pc-equity-construction', title: 'Equity Portfolio Construction' },
          ],
        },
        {
          id: 'l3-pc-alternatives',
          title: 'Alternatives & Real Assets',
          estMinutes: 120,
          subtopics: [
            { id: 'l3-pc-alternatives-portfolio', title: 'Alternatives in Portfolios' },
          ],
        },
      ],
    },
    {
      id: 'l3-drm',
      code: 'DRM',
      title: 'Derivatives & Risk Management',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l3-drm-strategies',
          title: 'Risk Management Strategies',
          estMinutes: 150,
          subtopics: [
            { id: 'l3-drm-strategies-options', title: 'Options Strategies' },
            { id: 'l3-drm-strategies-swaps-futures', title: 'Swaps, Forwards & Futures Strategies' },
            { id: 'l3-drm-strategies-currency', title: 'Currency Management' },
          ],
        },
      ],
    },
    {
      id: 'l3-pwm',
      code: 'PWM',
      title: 'Private Wealth Management',
      weightMin: 10,
      weightMax: 15,
      topics: [
        {
          id: 'l3-pwm-individuals',
          title: 'Planning for Individuals',
          estMinutes: 180,
          subtopics: [
            { id: 'l3-pwm-individuals-overview', title: 'Overview of Private Wealth Management' },
            { id: 'l3-pwm-individuals-tax', title: 'Taxes & Private Wealth' },
            { id: 'l3-pwm-individuals-estate', title: 'Estate Planning' },
          ],
        },
      ],
    },
    {
      id: 'l3-pi',
      code: 'PI',
      title: 'Portfolio Management for Institutions',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l3-pi-institutional',
          title: 'Institutional Investors',
          estMinutes: 150,
          subtopics: [
            { id: 'l3-pi-institutional-types', title: 'Pensions, Endowments, Insurers & SWFs' },
          ],
        },
      ],
    },
    {
      id: 'l3-perf',
      code: 'PERF',
      title: 'Performance & Trading',
      weightMin: 5,
      weightMax: 10,
      topics: [
        {
          id: 'l3-perf-evaluation',
          title: 'Performance Evaluation',
          estMinutes: 120,
          subtopics: [
            { id: 'l3-perf-evaluation-attribution', title: 'Performance Attribution' },
            { id: 'l3-perf-evaluation-appraisal', title: 'Performance Appraisal' },
          ],
        },
        {
          id: 'l3-perf-execution',
          title: 'Trade Execution & Manager Selection',
          estMinutes: 120,
          subtopics: [
            { id: 'l3-perf-execution-trading', title: 'Trading & Execution' },
            { id: 'l3-perf-execution-manager', title: 'Investment Manager Selection' },
          ],
        },
      ],
    },
  ],
}
