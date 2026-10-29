import React, { useState } from 'react';
import { ArrowUpRight, Check, Printer, Download, Info, ShieldCheck } from 'lucide-react';
import { GREEN_SCORECARD_MOCK, DOCUMENTED_EMISSION_FACTORS } from '../../data/mockData';
import { formatInr } from '../../lib/formatters';
import { SubtleLeaf, BotanicalSprig, LeafCornerAccent } from '../common/BotanicalLeaf';

interface SampleScorecardSectionProps {
  onOpenApp: (tab?: string) => void;
}

export const SampleScorecardSection: React.FC<SampleScorecardSectionProps> = ({ onOpenApp }) => {
  const [selectedFactorIndex, setSelectedFactorIndex] = useState(0);
  const factor = DOCUMENTED_EMISSION_FACTORS[selectedFactorIndex];

  // Recalculate emissions dynamically based on selected factor
  const currentEmissions = Math.round(((GREEN_SCORECARD_MOCK.kwhCurrent * factor.factorKgPerKwh) / 1000) * 100) / 100;
  const baselineEmissions = Math.round(((GREEN_SCORECARD_MOCK.kwhBaseline * factor.factorKgPerKwh) / 1000) * 100) / 100;
  const emissionsSaved = Math.round((baselineEmissions - currentEmissions) * 100) / 100;

  return (
    <section id="scorecard-preview" className="py-24 md:py-32 bg-[#f4f0e5] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Pramaan Section Tag with Botanical Accent */}
        <div className="pr-secmark mb-6 flex items-center gap-2">
          <span className="pr-secmark__n">
            06 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <BotanicalSprig size={16} color="#09453d" />
          <span className="pr-secmark__label">Certified Specimen</span>
        </div>

        {/* Section Heading & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
              The Green Scorecard.<br />
              <em>Transparent & defensible.</em>
            </h2>
            <p className="st-lede mt-4">
              An evidence-linked statement of institutional energy performance. Every number links directly to source utility invoices, documented grid factors, and transparent arithmetic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenApp('scorecard')}
              className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-sans font-medium text-white bg-[#21150f] hover:bg-[#34150f] rounded-full transition-colors cursor-pointer shadow-xs"
            >
              <span>Open in Full Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#eaceaa]" />
            </button>
          </div>
        </div>

        {/* Interactive Emission Factor Selector Bar */}
        <div className="p-4 bg-[#f0edde] border border-[#cfc7b4] rounded-2xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#574539]">
            <span className="font-semibold text-[#21150f]">Grid Emission Factor Model:</span>
            <span className="hidden sm:inline">Select factor to recalculate Scope 2 carbon</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DOCUMENTED_EMISSION_FACTORS.map((f, idx) => (
              <button
                key={f.name}
                onClick={() => setSelectedFactorIndex(idx)}
                className={`px-3 py-1.5 text-xs font-mono rounded-full border transition-colors cursor-pointer ${
                  selectedFactorIndex === idx
                    ? 'bg-[#21150f] text-white border-[#21150f]'
                    : 'bg-[#fffefa] text-[#574539] border-[#cfc7b4] hover:bg-[#f7f4e9]'
                }`}
              >
                <span>{f.name.split('—')[0].trim()}</span>
                <span className="ml-1 opacity-75">({f.factorKgPerKwh} kg/kWh)</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Formal Scorecard Document with Botanical Accents */}
        <div className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <LeafCornerAccent position="top-right" className="absolute top-3 right-3 hidden sm:block" />
          <LeafCornerAccent position="bottom-left" className="absolute bottom-3 left-3 hidden sm:block" />

          {/* Document Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between pb-8 border-b-2 border-[#21150f] gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#09453d] mb-2 font-medium">
                <SubtleLeaf size={14} color="#09453d" />
                <span>OFFICIAL GREEN SCORECARD · VERIFIED SPECIMEN</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
                {GREEN_SCORECARD_MOCK.institutionName}
              </h3>
              <p className="text-xs sm:text-sm text-[#574539] font-sans mt-2">
                Scope: {GREEN_SCORECARD_MOCK.facilityScope}
              </p>
            </div>

            <div className="text-left md:text-right font-mono text-xs text-[#574539] space-y-1">
              <div>
                <span className="text-[#6f6052]">Audit Period: </span>
                <span className="font-semibold text-[#21150f]">{GREEN_SCORECARD_MOCK.reportingPeriod}</span>
              </div>
              <div>
                <span className="text-[#6f6052]">Baseline Period: </span>
                <span>{GREEN_SCORECARD_MOCK.baselinePeriod}</span>
              </div>
              <div>
                <span className="text-[#6f6052]">Published: </span>
                <span>{GREEN_SCORECARD_MOCK.generationDate}</span>
              </div>
              <div>
                <span className="text-[#6f6052]">Assurance Protocol: </span>
                <span>{GREEN_SCORECARD_MOCK.auditorOrganization}</span>
              </div>
            </div>
          </div>

          {/* Evidence Coverage & Integrity Bar */}
          <div className="py-6 border-b border-[#e0d9c6] flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-18 h-18 flex items-center justify-center">
                {/* Botanical Laurel Wreath SVG */}
                <svg viewBox="0 0 80 80" fill="none" className="absolute inset-0 w-full h-full text-[#09453d] opacity-75">
                  {/* Left Wreath Branch */}
                  <path d="M 40 72 C 22 72 10 56 12 38 C 14 24 24 14 36 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 22 66 C 18 64 14 68 18 72 C 20 70 24 68 22 66 Z" fill="currentColor" />
                  <path d="M 14 54 C 10 52 8 57 12 60 C 14 58 17 55 14 54 Z" fill="currentColor" />
                  <path d="M 12 40 C 8 38 6 43 10 46 C 12 44 15 41 12 40 Z" fill="currentColor" />
                  <path d="M 16 26 C 12 24 11 29 15 32 C 17 30 19 27 16 26 Z" fill="currentColor" />
                  <path d="M 24 16 C 20 14 20 19 24 21 C 26 19 27 16 24 16 Z" fill="currentColor" />

                  {/* Right Wreath Branch */}
                  <path d="M 40 72 C 58 72 70 56 68 38 C 66 24 56 14 44 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M 58 66 C 62 64 66 68 62 72 C 60 70 56 68 58 66 Z" fill="currentColor" />
                  <path d="M 66 54 C 70 52 72 57 68 60 C 66 58 63 55 66 54 Z" fill="currentColor" />
                  <path d="M 68 40 C 72 38 74 43 70 46 C 68 44 65 41 68 40 Z" fill="currentColor" />
                  <path d="M 64 26 C 68 24 69 29 65 32 C 63 30 61 27 64 26 Z" fill="currentColor" />
                  <path d="M 56 16 C 60 14 60 19 56 21 C 54 19 53 16 56 16 Z" fill="currentColor" />
                </svg>

                <div className="w-13 h-13 rounded-full bg-[#f0edde] border border-[#cfc7b4] flex flex-col items-center justify-center relative z-10 shadow-2xs">
                  <span className="font-serif font-bold text-base text-[#09453d] tabular-nums leading-none">
                    {GREEN_SCORECARD_MOCK.evidenceCoveragePercent}%
                  </span>
                  <span className="text-[8px] font-mono uppercase text-[#6f6052] mt-0.5 font-semibold">Coverage</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold text-[#21150f]">
                  High Evidentiary Assurance Level
                </h4>
                <p className="text-xs text-[#574539] font-sans">
                  {GREEN_SCORECARD_MOCK.verifiedBillsCount} of {GREEN_SCORECARD_MOCK.totalBillsCount} monthly billing cycles backed by confirmed primary PDF utility bills.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs">
              <div>
                <span className="text-[#6f6052] block">Review Flags:</span>
                <span className="text-[#09453d] font-semibold">
                  {GREEN_SCORECARD_MOCK.resolvedReviewFlagsCount} Resolved
                </span>{' '}
                / <span className="text-[#960d41]">{GREEN_SCORECARD_MOCK.activeReviewFlagsCount} Pending</span>
              </div>
              <div>
                <span className="text-[#6f6052] block">Calculation Method:</span>
                <span className="text-[#21150f] font-semibold">Deterministic V3</span>
              </div>
            </div>
          </div>

          {/* Four Core Metric Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-8 border-b border-[#e0d9c6]">
            {/* Metric 1 */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052]">
                Electricity Consumption
              </span>
              <p className="text-3xl font-serif font-bold text-[#21150f] tabular-nums">
                {GREEN_SCORECARD_MOCK.kwhCurrent.toLocaleString()}{' '}
                <span className="text-xs font-mono font-normal text-[#574539]">kWh</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <span>-3.96% change</span>
                <span className="text-[#6f6052]">(21,300 kWh saved)</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052]">
                Average Daily Usage
              </span>
              <p className="text-3xl font-serif font-bold text-[#21150f] tabular-nums">
                {GREEN_SCORECARD_MOCK.avgDailyKwhCurrent}{' '}
                <span className="text-xs font-mono font-normal text-[#574539]">kWh/day</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <span>-3.69% daily rate</span>
                <span className="text-[#6f6052]">(normalized)</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052]">
                Scope 2 GHG Emissions
              </span>
              <p className="text-3xl font-serif font-bold text-[#09453d] tabular-nums">
                {currentEmissions}{' '}
                <span className="text-xs font-mono font-normal text-[#574539]">T CO₂e</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <span>Saved {emissionsSaved} Tonnes</span>
                <span className="text-[#6f6052]">CO₂e</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052]">
                Total Utility Expenditure
              </span>
              <p className="text-3xl font-serif font-bold text-[#21150f] tabular-nums">
                {formatInr(GREEN_SCORECARD_MOCK.costCurrent)}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#960d41]">
                <span>+{GREEN_SCORECARD_MOCK.costDeltaPercent}% cost</span>
                <span className="text-[#6f6052]">(DERC tariff revision)</span>
              </div>
            </div>
          </div>

          {/* Recommended Next Actions */}
          <div className="py-8 border-b border-[#e0d9c6]">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#6f6052] mb-4">
              Prioritized Auditor Next Actions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GREEN_SCORECARD_MOCK.recommendedActions.map((act, idx) => (
                <div key={idx} className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase font-semibold text-[#960d41]">
                      {act.priority}
                    </span>
                    <span className="text-xs font-mono text-[#6f6052]">Action 0{idx + 1}</span>
                  </div>
                  <h5 className="text-sm font-serif font-semibold text-[#21150f] mb-1">
                    {act.title}
                  </h5>
                  <p className="text-xs text-[#574539] leading-relaxed font-sans font-light">
                    {act.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Assumptions, Documented Citations & Limitations */}
          <div className="pt-6 font-mono text-xs text-[#574539] space-y-2">
            <p className="font-semibold text-[#21150f] uppercase text-[11px]">
              Assumptions & Evidentiary Citations:
            </p>
            <p>1. Emissions Factor: {factor.citation}</p>
            <p>2. Electricity data strictly sourced from Pacific Horizon Energy metered billing.</p>
            <p>3. Normalization accounts for 2024 leap year (366 days) vs 2025 non-leap year (365 days).</p>
          </div>
        </div>
      </div>
    </section>
  );
};
