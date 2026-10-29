import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, FileText, CheckCircle2, SlidersHorizontal, AlertTriangle, Award, Printer, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { SubtleLeaf, BotanicalSprig } from '../common/BotanicalLeaf';

interface CapabilitiesSectionProps {
  onOpenApp: (tab?: string) => void;
}

export const CapabilitiesSection: React.FC<CapabilitiesSectionProps> = ({ onOpenApp }) => {
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 5500; // 5.5 seconds per slide
  const TICK_INTERVAL = 50;

  const capabilities = [
    {
      id: 'evidence',
      n: '01',
      kicker: 'Ingest',
      title: 'Evidence Library & PDF Catalog',
      tag: 'Every kilowatt-hour links to a physical utility invoice.',
      description:
        'A permanent digital repository for all monthly electricity bills, sub-meter photos, peak demand schedules, and tariff amendments. Never lose the physical basis for your sustainability disclosures.',
      appTab: 'evidence',
      image: '/src/assets/images/evidence_document_archive_1793182788099.jpg',
      highlights: [
        'PDF and high-resolution document ingestion',
        'Cryptographic document hashes for tamper resistance',
        'Campus-wide facility mapping by sub-meter register',
      ],
      icon: FileText,
    },
    {
      id: 'extraction',
      n: '02',
      kicker: 'Extract',
      title: 'Optical Extraction & Auditor Sign-off',
      tag: 'Extracted by optical AI. Signed by human discernment.',
      description:
        'Optical parsing identifies billing start/end dates, total kilowatt-hours, peak demand kilowatts, and currency amounts. Side-by-side interactive verification ensures no AI estimation enters the final ledger without auditor approval.',
      appTab: 'evidence',
      image: '/src/assets/images/evidence_document_archive_1793182788099.jpg',
      highlights: [
        'Visual bounding box overlays on source PDF invoices',
        'Confidence scoring with inline field editing',
        'Auditor identity stamping and timestamped sign-off logs',
      ],
      icon: CheckCircle2,
    },
    {
      id: 'audit',
      n: '03',
      kicker: 'Normalize',
      title: 'Transparent Energy Audits',
      tag: 'Normalize irregular billing durations and decouple cost from volume.',
      description:
        'Compare baseline and comparison periods using Average Daily Usage (kWh/day) to neutralize 28-day vs 33-day billing discrepancies. Clearly display mathematical formulas with zero hidden black-box adjustments.',
      appTab: 'audit',
      image: '/src/assets/images/energy_audit_telemetry_1793182789022.jpg',
      highlights: [
        'Day-normalized comparison prevents cycle length bias',
        'Separates unit tariff escalation ($/kWh) from true volumetric change',
        'Exposes the complete deterministic arithmetic formula for every metric',
      ],
      icon: SlidersHorizontal,
    },
    {
      id: 'flags',
      n: '04',
      kicker: 'Triage',
      title: 'Intelligent Review Flags',
      tag: 'Surface anomalies, overlaps, and duplicates before certification.',
      description:
        'Continuous automated integrity checks alert auditors to overlapping billing windows, duplicate invoice uploads, incomplete OCR extractions, and statistical consumption spikes without false accusations.',
      appTab: 'review',
      image: '/src/assets/images/energy_audit_telemetry_1793182789022.jpg',
      highlights: [
        'Overlapping date range collision detection prevents double-counting',
        'Unusual variance alerts (>25% MoM) prompt equipment checks',
        'Auditor note thread attached directly to flagged records',
      ],
      icon: AlertTriangle,
    },
    {
      id: 'scorecard',
      n: '05',
      kicker: 'Prove',
      title: 'Official Green Scorecard',
      tag: 'The single source of truth for institutional energy impact.',
      description:
        'Synthesizes verified electrical consumption, financial expenditure, Scope 2 greenhouse gas emissions, and Evidence Coverage percentage into an authoritative, defensible scorecard.',
      appTab: 'scorecard',
      image: '/src/assets/images/scorecard_institution_facade_1793182789329.jpg',
      highlights: [
        'Displays exact Evidence Coverage percentage (91.7% verified)',
        'Discloses documented emissions factors (EPA eGRID) with citations',
        'Explicitly articulates limitations, assumptions, and next steps',
      ],
      icon: Award,
    },
    {
      id: 'reporting',
      n: '06',
      kicker: 'Publish',
      title: 'Reporting & Assurance Export',
      tag: 'Print-ready summaries and machine-readable data trails.',
      description:
        'Publish print-ready audit reports formatted for trustees and third-party sustainability assurance officers, or export raw JSON schemas for carbon registry submission.',
      appTab: 'reports',
      image: '/src/assets/images/scorecard_institution_facade_1793182789329.jpg',
      highlights: [
        'High-contrast, publication-grade print stylesheet',
        'Comprehensive invoice bibliography and methodology appendix',
        'Structured JSON export for ESG compliance frameworks',
      ],
      icon: Printer,
    },
  ];

  // Auto-advancing Carousel Timer
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL / SLIDE_DURATION) * 100;
        if (next >= 100) {
          setActiveCapabilityIndex((curr) => (curr + 1) % capabilities.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, capabilities.length]);

  const handleSelectTab = (idx: number) => {
    setActiveCapabilityIndex(idx);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveCapabilityIndex((curr) => (curr - 1 + capabilities.length) % capabilities.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveCapabilityIndex((curr) => (curr + 1) % capabilities.length);
    setProgress(0);
  };

  const current = capabilities[activeCapabilityIndex];

  return (
    <section id="capabilities" className="py-24 md:py-32 bg-[#f4f0e5] border-y border-[#cfc7b4] relative select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Pramaan Section Mark */}
        <div className="pr-secmark mb-6 flex items-center gap-2">
          <span className="pr-secmark__n">
            05 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <BotanicalSprig size={16} color="#09453d" />
          <span className="pr-secmark__label">Capabilities</span>
        </div>

        {/* Section Heading & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
              Everything that happens<br />
              <em>after the utility meter ticks.</em>
            </h2>
            <p className="st-lede mt-4 text-[#574539]">
              Six capabilities, one record underneath them all. Auto-advancing interactive carousel showcasing each operational stage in full fidelity.
            </p>
          </div>

          {/* Carousel Controls: Play/Pause, Prev, Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-medium text-[#574539] bg-[#fffefa] hover:bg-[#f0edde] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer shadow-2xs"
              title={isAutoPlaying ? 'Pause Auto-slide' : 'Resume Auto-slide'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5 text-[#960d41]" /> : <Play className="w-3.5 h-3.5 text-[#09453d]" />}
              <span>{isAutoPlaying ? 'AUTOPLAY ON' : 'PAUSED'}</span>
            </button>

            <div className="flex items-center gap-1 bg-[#fffefa] border border-[#cfc7b4] rounded-full p-1 shadow-2xs">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#574539] hover:bg-[#f4f0e5] hover:text-[#21150f] transition-colors cursor-pointer"
                title="Previous capability"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-[#6f6052]">
                0{activeCapabilityIndex + 1} / 0{capabilities.length}
              </span>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#574539] hover:bg-[#f4f0e5] hover:text-[#21150f] transition-colors cursor-pointer"
                title="Next capability"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrubber Tabs with Animated Progress Fill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {capabilities.map((cap, idx) => {
            const isSelected = activeCapabilityIndex === idx;
            return (
              <button
                key={cap.id}
                onClick={() => handleSelectTab(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#fffefa] border-[#960d41] shadow-md ring-2 ring-[#960d41]/20 scale-102'
                    : 'bg-[#f7f4e9] border-[#cfc7b4] text-[#6f6052] hover:bg-[#fffefa]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#960d41]' : 'text-[#c8c1af]'}`}>
                    {cap.n}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                    {cap.kicker}
                  </span>
                </div>
                <h3 className="text-sm font-serif font-semibold text-[#21150f] line-clamp-1">
                  {cap.title.split('&')[0]}
                </h3>

                {/* Animated progress bar along bottom of active tab */}
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f0edde]">
                    <div
                      className="h-full bg-[#960d41] transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Carousel Slide Card with Pause-on-Hover */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#960d41] uppercase tracking-wider font-semibold">
                <span>00{current.n}</span>
                <span>·</span>
                <span>{current.kicker}</span>
                {isHovered && (
                  <span className="text-[10px] text-[#09453d] bg-[#e8f1ec] px-2 py-0.5 rounded font-mono">
                    PAUSED ON HOVER
                  </span>
                )}
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif text-[#21150f] leading-snug">
                {current.title}
              </h3>

              <p className="text-base font-serif italic text-[#960d41]">
                "{current.tag}"
              </p>

              <p className="text-sm md:text-base text-[#574539] leading-relaxed font-sans font-light">
                {current.description}
              </p>

              {/* Highlights */}
              <div className="pt-2 space-y-2">
                {current.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#21150f]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#09453d] mt-2 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onOpenApp(current.appTab)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#21150f] hover:bg-[#34150f] text-white text-xs font-medium rounded-full cursor-pointer transition-colors shadow-xs"
                >
                  <span>Launch {current.kicker} in Workspace</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#eaceaa]" />
                </button>

                <div className="flex items-center gap-1.5">
                  {capabilities.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => handleSelectTab(dotIdx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        activeCapabilityIndex === dotIdx ? 'w-6 bg-[#960d41]' : 'w-1.5 bg-[#cfc7b4]'
                      }`}
                      title={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Visual Image Frame */}
            <div className="lg:col-span-6">
              <div className="relative rounded-xl overflow-hidden border border-[#cfc7b4] aspect-[16/10] bg-[#f7f4e9] shadow-sm group">
                <img
                  key={current.id}
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Overlay Metadata */}
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono flex items-center justify-between">
                  <span>CAPABILITY 0{current.n} // {current.kicker.toUpperCase()}</span>
                  <span className="text-[#eaceaa] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#57927f] animate-pulse" />
                    <span>CAROUSEL ACTIVE</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
