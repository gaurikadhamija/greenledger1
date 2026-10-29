import React from 'react';
import { Layers, TrendingUp, ShieldAlert, AlertTriangle } from 'lucide-react';
import { SubtleLeaf, BotanicalSprig, BotanicalVineDivider, LeafCornerAccent } from '../common/BotanicalLeaf';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-24 md:py-32 bg-[#f0edde] border-y border-[#cfc7b4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Pramaan Section Mark with Botanical Accent */}
        <div className="pr-secmark mb-6 flex items-center gap-2">
          <span className="pr-secmark__n">
            02 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <BotanicalSprig size={16} color="#09453d" />
          <span className="pr-secmark__label">The Gap</span>
        </div>

        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
            After the billing period closes,<br />
            <em>what do you actually have to prove your impact?</em>
          </h2>
          <p className="st-lede mt-6 max-w-2xl">
            A bill arrives, the invoice gets approved by accounts payable, and the environmental data vanishes into fragmented spreadsheets. When assurance time comes, institutions find themselves holding claims instead of evidence.
          </p>
        </div>

        {/* Three Asymmetric Gap Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Pillar 1: Large Featured Problem (7 cols) */}
          <div className="lg:col-span-7 bg-[#fffefa] p-8 md:p-10 rounded-2xl border border-[#cfc7b4] flex flex-col justify-between shadow-xs relative overflow-hidden">
            <LeafCornerAccent position="top-right" className="absolute top-2 right-2" />
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#e0d9c6]">
                <div className="flex items-center gap-2">
                  <SubtleLeaf size={14} color="#960d41" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#960d41] font-semibold">
                    Failure 01 · Data Dispersal & Loss
                  </span>
                </div>
                <Layers className="w-5 h-5 text-[#6f6052]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#21150f] mb-4">
                Environmental records are scattered across paper bills, vendor portals, and isolated spreadsheets.
              </h3>

              <p className="text-sm md:text-base text-[#574539] leading-relaxed font-sans font-light mb-8">
                Utility billing dates rarely match academic semesters or calendar fiscal years. Meter read dates wander between 28 and 33 days. Peak demand fees are manually retyped into spreadsheets without validation or cryptographic source tracking.
              </p>
            </div>

            <div className="bg-[#f4f0e5] p-4 rounded-xl border border-[#cfc7b4] text-xs font-mono text-[#574539]">
              <div className="flex items-center justify-between text-[#6f6052] mb-1">
                <span>CONVENTIONAL REPORTING PIPELINE:</span>
                <span className="text-[#960d41] font-semibold">UNVERIFIABLE</span>
              </div>
              <p className="font-sans text-[11px] text-[#21150f]">
                Paper Bill → Untracked Spreadsheet Cell → Unsubstantiated Annual ESG Claim
              </p>
            </div>
          </div>

          {/* Pillar 2 & 3: Two Vertical Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Pillar 2: The Tariff Illusion */}
            <div className="bg-[#fffefa] p-7 rounded-2xl border border-[#cfc7b4] flex-1 shadow-xs relative overflow-hidden">
              <LeafCornerAccent position="top-right" className="absolute top-2 right-2" />
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e0d9c6]">
                <div className="flex items-center gap-1.5">
                  <SubtleLeaf size={13} color="#960d41" />
                  <span className="text-xs font-mono uppercase tracking-wider text-[#960d41] font-semibold">
                    Failure 02 · The Tariff Illusion
                  </span>
                </div>
                <TrendingUp className="w-5 h-5 text-[#6f6052]" />
              </div>
              <h3 className="text-xl font-serif text-[#21150f] mb-2">
                Changes in electricity costs do not indicate changes in consumption.
              </h3>
              <p className="text-xs md:text-sm text-[#574539] leading-relaxed font-sans font-light">
                When utility tariffs shift, a facility can achieve a real 4% electrical efficiency gain while paying 12% more on their bill. Financial accounting hides thermodynamic carbon reality.
              </p>
              <div className="mt-4 pt-3 border-t border-[#e0d9c6] flex items-center justify-between text-xs font-mono">
                <span className="text-[#09453d] font-semibold">-3.96% Actual kWh</span>
                <span className="text-[#960d41] font-semibold">+12.90% Billed ₹</span>
              </div>
            </div>

            {/* Pillar 3: Verification Deficit */}
            <div className="bg-[#fffefa] p-7 rounded-2xl border border-[#cfc7b4] flex-1 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e0d9c6]">
                <span className="text-xs font-mono uppercase tracking-wider text-[#960d41] font-semibold">
                  Failure 03 · Verification Deficit
                </span>
                <ShieldAlert className="w-5 h-5 text-[#6f6052]" />
              </div>
              <h3 className="text-xl font-serif text-[#21150f] mb-2">
                Disclosures lack sufficient supporting primary evidence.
              </h3>
              <p className="text-xs md:text-sm text-[#574539] leading-relaxed font-sans font-light">
                Without immutable links between every reported kilowatt-hour and verified source documents, external assurance auditors reject sustainability submissions.
              </p>
              <div className="mt-4 pt-3 border-t border-[#e0d9c6] text-xs font-mono text-[#09453d]">
                <span>Standard: ISO 14064-3 Verifiable Audit Trail</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
