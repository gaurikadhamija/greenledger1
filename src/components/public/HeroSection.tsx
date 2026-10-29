import React, { useState } from 'react';
import { ArrowRight, FileCheck, ArrowUpRight, Scan, ShieldCheck, Database, Check, Layers, Leaf } from 'lucide-react';
import { HeroExplodedSpecimen } from './HeroExplodedSpecimen';
import { ThreeCampusSpecimen } from './ThreeCampusSpecimen';
import { SubtleLeaf, BotanicalSprig, AmbientLeafBreeze } from '../common/BotanicalLeaf';

interface HeroSectionProps {
  onOpenApp: (tab?: string) => void;
  onScrollToScorecard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApp, onScrollToScorecard }) => {
  const [activeLeader, setActiveLeader] = useState<string>('scan');

  const leaderItems = [
    {
      id: 'scan',
      n: '01',
      title: 'Scan',
      tag: 'Instant utility invoice identity via OCR',
      desc: 'One scan, and the kilowatt-hours have an immutable source record.',
      badge: 'Optical extraction: 98.2% confidence',
    },
    {
      id: 'collect',
      n: '02',
      title: 'Collect',
      tag: 'Verified energy telemetry & validation',
      desc: 'Tamper-evident primary ledger. Trusted at source, built for real audits.',
      badge: 'Document hash: SHA-256 verified',
    },
    {
      id: 'build',
      n: '03',
      title: 'Build',
      tag: 'Direct audit trail with facility sub-meters',
      desc: 'Account-level traceability. Every meter reading links to its physical building.',
      badge: 'Campus: Quad A & B Sub-meters',
    },
    {
      id: 'automate',
      n: '04',
      title: 'Automate',
      tag: 'Deterministic cycle normalization',
      desc: 'Adjusts automatically for 28 vs 33 day billing duration and leap year variance.',
      badge: 'Normalized: 1,416.7 kWh/day',
    },
    {
      id: 'prove',
      n: '05',
      title: 'Prove',
      tag: 'Verifiable Green Scorecard ready for assurance',
      desc: 'Scope 2 GHG reductions backed by documented regional EPA factors.',
      badge: 'Evidentiary Coverage: 91.7%',
    },
  ];

  const current = leaderItems.find((l) => l.id === activeLeader) || leaderItems[0];

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#f4f0e5]">
      {/* Ambient ethereal floating botanical leaves breeze */}
      <AmbientLeafBreeze density="sparse" />

      {/* Background subtle Pramaan hairline grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #21150f 1px, transparent 1px), linear-gradient(to bottom, #21150f 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Pramaan Section Mark */}
        <div className="pr-secmark mb-6">
          <span className="pr-secmark__n">
            01 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <span className="pr-secmark__label">Institutional Verification</span>
        </div>

        {/* Hero Title & Subheading */}
        <div className="max-w-4xl mb-12">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-[#fffefa] border border-[#cfc7b4] rounded-full text-xs font-mono text-[#09453d] mb-4 shadow-2xs">
            <SubtleLeaf size={15} color="#09453d" />
            <span>INSTITUTIONAL ENERGY LEDGER PROTOCOL</span>
            <span className="text-[#cfc7b4]">·</span>
            <span className="text-[#57927f] font-medium">DELHI CAMPUS ASSURANCE</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-normal text-[#21150f] leading-[1.03] tracking-tight text-balance">
            Measure what matters.<br />
            <em className="text-[#960d41] italic font-normal">Prove what improves.</em>
          </h1>

          <p className="st-lede mt-6 max-w-2xl text-base sm:text-lg text-[#574539]">
            <strong className="font-semibold text-[#21150f]">ग्रीनLedger</strong> gives every kilowatt-hour a permanent record of who consumed it, when, and how it was verified. Made from primary utility invoices at the point of audit, ready for assurance and external disclosure.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenApp('overview')}
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-sans font-medium text-white bg-[#21150f] hover:bg-[#34150f] hover:shadow-md rounded-full transition-all duration-200 cursor-pointer"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onScrollToScorecard}
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] hover:bg-[#f0edde] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-[#09453d]" />
              <span>View Certified Scorecard</span>
            </button>
          </div>
        </div>

        {/* 3D Exploded Hologram Specimen with moving text ticker & zoom */}
        <div className="mb-14">
          <HeroExplodedSpecimen />
        </div>
        <div className="mt-14 bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Top Leader Scrubber Bar (01. Scan, 02. Collect, 03. Build, etc.) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pb-6 border-b border-[#e0d9c6]">
            {leaderItems.map((item) => {
              const isActive = activeLeader === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveLeader(item.id)}
                  className={`p-3 text-left rounded-xl transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-[#f4f0e5] border-[#960d41] text-[#21150f] shadow-xs'
                      : 'bg-transparent border-transparent text-[#6f6052] hover:bg-[#f7f4e9]'
                  }`}
                >
                  <span className={`text-[11px] font-mono font-bold block ${isActive ? 'text-[#960d41]' : 'text-[#c8c1af]'}`}>
                    {item.n}.
                  </span>
                  <span className="text-sm font-sans font-semibold text-[#21150f] block mt-0.5">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-[#6f6052] block truncate mt-0.5 font-light">
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Connected Specimen Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8">
            {/* Left Narrative Box */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#f0edde] border border-[#cfc7b4] rounded-full text-xs font-mono text-[#09453d]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>PHASE {current.n} · PROVENANCE LINK</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-[#21150f]">
                {current.title} — {current.tag}
              </h2>

              <p className="text-sm text-[#574539] leading-relaxed font-sans font-light">
                {current.desc}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 bg-[#f7f4e9] border border-[#cfc7b4] rounded text-[#960d41] font-medium">
                  {current.badge}
                </span>
                <button
                  onClick={() => onOpenApp(current.id === 'scan' ? 'evidence' : current.id === 'automate' ? 'audit' : 'scorecard')}
                  className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#21150f] hover:text-[#960d41] cursor-pointer"
                >
                  <span>Open in Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Architectural Specimen Frame: 3D Rotating Interactive Campus Twin with Readable Labels */}
            <div className="lg:col-span-7">
              <ThreeCampusSpecimen />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
