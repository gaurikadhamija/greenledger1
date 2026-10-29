import React from 'react';
import { ShieldCheck, Cpu, Code2, AlertCircle, FileCheck2, Scale } from 'lucide-react';

export const TrustMethodologySection: React.FC = () => {
  const statuses = [
    {
      name: 'Documented',
      description: 'Derived directly from primary utility bills or meter certificates with zero algorithmic estimation.',
      example: '48,200 kWh consumption extracted from Pacific Horizon invoice #INV-2025-00192.',
      color: '#09453d',
      icon: FileCheck2,
    },
    {
      name: 'Calculated',
      description: 'Produced strictly by deterministic, open-source mathematical formulas (such as daily usage normalization).',
      example: 'Daily Usage = 48,200 kWh ÷ 31 billing days = 1,554.8 kWh/day.',
      color: '#21150f',
      icon: Code2,
    },
    {
      name: 'Estimated',
      description: 'Used only when secondary coefficients are required and explicitly cited with public government registry sources.',
      example: 'Scope 2 GHG = kWh × 0.385 kg CO2e/kWh (US EPA eGRID 2024 Summary Tables).',
      color: '#574539',
      icon: Scale,
    },
    {
      name: 'Unverified',
      description: 'Freshly extracted documents awaiting human auditor inspection before inclusion in official impact reports.',
      example: 'December 2025 utility invoice scan queued for auditor signature.',
      color: '#6f6052',
      icon: AlertCircle,
    },
    {
      name: 'Flagged for Review',
      description: 'Identified variance, overlapping calendar window, or potential duplicate flagged for neutral inquiry—never accused as fraud.',
      example: 'July 2025 consumption (+28.4% MoM) marked for facilities mechanical check.',
      color: '#960d41',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="methodology" className="py-24 md:py-32 bg-[#f0edde] border-y border-[#cfc7b4] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Pramaan Section Tag */}
        <div className="pr-secmark mb-6">
          <span className="pr-secmark__n">
            06 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <span className="pr-secmark__label">Trust & Epistemology</span>
        </div>

        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
            Total transparency for every claim.<br />
            <em>Deterministic code.</em>
          </h2>
          <p className="st-lede mt-4 max-w-2xl">
            In sustainability intelligence, trust is not an aesthetic—it is an unbroken chain of custody. We distinguish between what is documented, what is calculated, and what is estimated.
          </p>
        </div>

        {/* Five Explicit Epistemological Statuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {statuses.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.name}
                className="bg-[#fffefa] p-5 rounded-2xl border border-[#cfc7b4] flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#6f6052]">
                      Tier 0{idx + 1}
                    </span>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-base font-serif font-semibold text-[#21150f] mb-2">
                    {s.name}
                  </h3>
                  <p className="text-xs text-[#574539] leading-relaxed font-sans font-light mb-4">
                    {s.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#e0d9c6] text-[11px] font-mono text-[#6f6052]">
                  <span className="text-[#21150f] font-medium block">Auditor Specimen:</span>
                  <span className="text-[10px] mt-0.5 block leading-normal">{s.example}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Two Guiding Principles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: AI Assistance vs Deterministic Calculations */}
          <div className="bg-[#fffefa] p-8 rounded-2xl border border-[#cfc7b4] shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#e0d9c6]">
              <div className="p-2 bg-[#f0edde] rounded-lg text-[#21150f]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#21150f]">
                AI Extracts. Deterministic Code Calculates.
              </h3>
            </div>
            <p className="text-sm text-[#574539] leading-relaxed font-sans font-light">
              Artificial intelligence excels at locating invoice totals, OCR bounding boxes, and drafting plain-language context. However, <strong className="text-[#21150f] font-medium">all arithmetic, daily normalizations, percentage changes, and carbon accounting equations are generated by audited, deterministic TypeScript functions.</strong> No language model ever computes your final carbon statements.
            </p>
            <div className="mt-4 p-3 bg-[#f4f0e5] rounded-xl border border-[#cfc7b4] text-xs font-mono text-[#09453d]">
              <span>Formula Rule: Total kWh / Days = Exact Average Daily Usage (unit-tested suite)</span>
            </div>
          </div>

          {/* Card 2: Neutral Flags & Tariff Integrity */}
          <div className="bg-[#fffefa] p-8 rounded-2xl border border-[#cfc7b4] shadow-xs">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#e0d9c6]">
              <div className="p-2 bg-[#f0edde] rounded-lg text-[#960d41]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-[#21150f]">
                Objective Inquiries, Never Accusations
              </h3>
            </div>
            <p className="text-sm text-[#574539] leading-relaxed font-sans font-light">
              When GreenLedger detects a 28% increase in July energy or an overlapping date boundary, <strong className="text-[#21150f] font-medium">it creates an objective review flag rather than declaring fraud.</strong> Furthermore, we strictly separate financial changes from energy consumption: a utility bill decrease caused by tariff credits is never falsely claimed as environmental kilowatt-hour conservation.
            </p>
            <div className="mt-4 p-3 bg-[#f4f0e5] rounded-xl border border-[#cfc7b4] text-xs font-mono text-[#960d41]">
              <span>Assurance Guardrail: Never conflate monetary fluctuations with thermodynamic impact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
