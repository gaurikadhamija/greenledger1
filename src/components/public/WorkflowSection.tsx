import React, { useState } from 'react';
import { Upload, ScanLine, Calculator, AlertOctagon, Award, ArrowRight, ArrowLeft, Check, RefreshCw, Eye, ShieldCheck, Database, FileCheck } from 'lucide-react';
import { BotanicalSprig, SubtleLeaf } from '../common/BotanicalLeaf';

export const WorkflowSection: React.FC<{ onOpenApp: (tab?: string) => void }> = ({ onOpenApp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const steps = [
    {
      id: 'upload',
      index: '01',
      title: 'UPLOAD',
      subtitle: 'Utility Invoices Ingestion',
      description:
        'Upload PDF electricity bills or scan paper utility envelopes. GreenLedger catalogs invoice files, timestamps upload metadata, and queues documents for optical parsing.',
      icon: Upload,
      frontImage: '/src/assets/images/hero_sustainability_architecture_1793182787052.jpg',
      frontLabel: 'PRIMARY INVOICE INGESTION',
      frontBadge: 'TPDDL DELHI HT FEEDER #JAN-2025',
      frontDetails: '48,200 kWh · 31 Days · Kashmere Gate Feeder #4',
      backTitle: 'CRYPTOGRAPHIC PROVENANCE LEDGER',
      backBadge: 'SHA-256 HASH VERIFIED',
      backSpecs: [
        { label: 'File Hash', value: 'sha256: 8f92a3b1c4e7...9d2' },
        { label: 'Ingestion Time', value: '2025-01-15T09:42:10Z' },
        { label: 'Mime & Size', value: 'application/pdf (1.42 MB)' },
        { label: 'Storage Node', value: 'Immutable Audit Vault #DELHI-IGDTUW' },
      ],
      backCode: `{\n  "invoice_id": "INV-TPDDL-2025-01",\n  "provenance": "PRIMARY_UTILITY",\n  "tamper_sealed": true\n}`,
    },
    {
      id: 'verify',
      index: '02',
      title: 'VERIFY',
      subtitle: 'OCR Extraction & Human Audit Sign-off',
      description:
        'AI extracts start/end dates, total kilowatt-hours, peak demand (kW), and billing charges. The auditor reviews side-by-side with bounding boxes before values enter the ledger.',
      icon: ScanLine,
      frontImage: '/src/assets/images/scorecard_editorial_cover_1793182855140.jpg',
      frontLabel: 'OPTICAL CHARACTER BOUNDING BOXES',
      frontBadge: 'OCR CERTAINTY: 98.2%',
      frontDetails: 'Field: Total kWh [48,200] · Rate [₹7.85/kWh]',
      backTitle: 'OPTICAL EXTRACTION MATRIX',
      backBadge: 'AUDITOR: APPROVED BY NODAL OFFICER',
      backSpecs: [
        { label: 'Billing Period', value: 'Jan 01, 2025 – Jan 31, 2025' },
        { label: 'Bounding Box', value: 'x: 142, y: 310, w: 90, h: 22' },
        { label: 'Peak Demand', value: '142.50 kW [Kashmere Gate #4]' },
        { label: 'Auditor Stamp', value: 'Sign-off: 2025-01-16T14:20Z' },
      ],
      backCode: `{\n  "status": "VERIFIED_BY_HUMAN",\n  "confidence": 0.982,\n  "signed_by": "Prof. Ananya Sharma"\n}`,
    },
    {
      id: 'analyse',
      index: '03',
      title: 'ANALYSE',
      subtitle: 'Deterministic Energy & Tariff Auditing',
      description:
        'The engine computes Average Daily Usage (kWh/day) to normalize varying billing cycle lengths (28 vs 33 days) and separates electricity volume changes from tariff rate increases.',
      icon: Calculator,
      frontImage: '/src/assets/images/hero_sustainability_architecture_1793182787052.jpg',
      frontLabel: 'CYCLE NORMALIZATION ENGINE',
      frontBadge: 'AVG DAILY: 1,416.7 kWh/day',
      frontDetails: 'Normalized vs Prior Year Baseline (-3.7%)',
      backTitle: 'MATHEMATICAL DETERMINISTIC FORMULA',
      backBadge: 'CYCLE SKEW DRIFT REMOVED',
      backSpecs: [
        { label: 'Days in Cycle', value: '31 Calendar Days (Exact)' },
        { label: 'Formula', value: 'Total kWh (48,200) ÷ 31 Days' },
        { label: 'Volume Delta', value: '-3.7% True Energy Reduction' },
        { label: 'Tariff Drift', value: '+₹0.35/kWh (DERC HT Tariff Adjustment)' },
      ],
      backCode: `{\n  "math_model": "DETERMINISTIC_DAILY_RATE",\n  "leap_year_adjusted": true,\n  "discom_derc_compliant": true\n}`,
    },
    {
      id: 'review',
      index: '04',
      title: 'REVIEW',
      subtitle: 'Intelligent Integrity Checks & Flags',
      description:
        'Algorithmic checks flag missing numbers, duplicate invoice uploads, overlapping date ranges, and month-over-month consumption surges (>25%) for triage and notes.',
      icon: AlertOctagon,
      frontImage: '/src/assets/images/scorecard_editorial_cover_1793182855140.jpg',
      frontLabel: 'INTEGRITY COLLISION AUDITOR',
      frontBadge: 'FLAG RESOLVED: JULY VARIANCE',
      frontDetails: 'Delhi Heatwave · Chiller Overhaul Note Appended',
      backTitle: 'INTEGRITY FLAG TRIAGE RECORD',
      backBadge: 'ZERO OVERLAPPING DATES',
      backSpecs: [
        { label: 'Collision Check', value: 'PASS · 0 Date Overlaps' },
        { label: 'Surge Test', value: '+28.4% MoM (Threshold: 25.0%)' },
        { label: 'Triage Status', value: 'RESOLVED with Facility Note' },
        { label: 'Auditor Comment', value: '"Compressor #2 serviced during heatwave"' },
      ],
      backCode: `{\n  "flag_id": "FLAG-003",\n  "check": "MOM_SURGE_THRESHOLD",\n  "resolution": "JUSTIFIED_HEATWAVE"\n}`,
    },
    {
      id: 'report',
      index: '05',
      title: 'REPORT',
      subtitle: 'Evidence-Linked Green Scorecard',
      description:
        'Generates an immutable Green Scorecard detailing verified energy changes, cost impacts, carbon reductions, evidence coverage percentage, and verifiable source citations.',
      icon: Award,
      frontImage: '/src/assets/images/scorecard_editorial_cover_1793182855140.jpg',
      frontLabel: 'AUDIT-DEFENSIBLE GREEN SCORECARD',
      frontBadge: 'EVIDENCE COVERAGE: 91.7%',
      frontDetails: 'Avoided: -15.25 Tonnes Scope 2 GHG · CEA Baseline v19',
      backTitle: 'OFFICIAL ASSURANCE CERTIFICATE',
      backBadge: 'EXPORTABLE PDF & JSON RECORD',
      backSpecs: [
        { label: 'Coverage Ratio', value: '11 of 12 Invoices Primary' },
        { label: 'Grid Factor', value: '0.716 kg CO2e/kWh (CEA Baseline v19)' },
        { label: 'Assurance Ready', value: 'GHG Protocol Corporate Standard' },
        { label: 'Citation Index', value: '12 Primary Invoices Attached' },
      ],
      backCode: `{\n  "scorecard_id": "SC-IGDTUW-2026",\n  "evidence_coverage": 0.9167,\n  "verdict": "ASSURANCE_READY"\n}`,
    },
  ];

  const currentStep = steps[activeStep];
  const StepIcon = currentStep.icon;

  const handleStepChange = (idx: number) => {
    setActiveStep(idx);
    setIsFlipped(false);
  };

  return (
    <section id="workflow" className="py-24 md:py-32 bg-[#f0edde] border-y border-[#cfc7b4] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header with Pramaan Secmark and Botanical Accent */}
        <div className="pr-secmark mb-6 flex items-center gap-2">
          <span className="pr-secmark__n">
            04 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <BotanicalSprig size={16} color="#09453d" />
          <span className="pr-secmark__label">Automation Pipeline</span>
        </div>

        <div className="max-w-3xl mb-14">
          <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
            A whole audit team for your campus,<br />
            <em>already on shift.</em>
          </h2>
          <p className="st-lede mt-4 max-w-2xl text-[#574539]">
            A continuous, five-stage verification pipeline where every step flips open to reveal its underlying cryptographic proof and deterministic audit formulas.
          </p>
        </div>

        {/* Workflow Step Scrubber Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            const isPast = activeStep > idx;
            return (
              <button
                key={s.id}
                onClick={() => handleStepChange(idx)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#21150f] text-white border-[#21150f] shadow-md scale-102'
                    : isPast
                    ? 'bg-[#f4f0e5] text-[#21150f] border-[#cfc7b4]'
                    : 'bg-[#fffefa] text-[#574539] border-[#cfc7b4] hover:bg-[#f4f0e5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected ? 'text-[#eaceaa]' : 'text-[#6f6052]'
                    }`}
                  >
                    {s.index}.
                  </span>
                  {isPast && !isSelected ? (
                    <Check className="w-4 h-4 text-[#09453d]" />
                  ) : (
                    <span className="text-[10px] uppercase font-mono tracking-wider opacity-75">
                      Stage
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono uppercase tracking-wider font-semibold">
                  {s.title}
                </p>
                <p
                  className={`text-[11px] font-sans truncate mt-0.5 ${
                    isSelected ? 'text-[#e0d9c6]' : 'text-[#6f6052]'
                  }`}
                >
                  {s.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* 3D FLIPPING IMAGE & STAGE CONTAINER */}
        <div className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Narrative Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#f0edde] border border-[#cfc7b4] rounded-full text-xs font-mono text-[#09453d] font-semibold flex items-center gap-1.5">
                  <StepIcon className="w-3.5 h-3.5" />
                  <span>STAGE {currentStep.index} OF 05</span>
                </span>
                <span className="text-xs font-mono text-[#960d41] uppercase tracking-wider">
                  FLIP IMAGE TO REVEAL PROOF
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl font-serif font-medium text-[#21150f]">
                {currentStep.title} — {currentStep.subtitle}
              </h3>

              <p className="text-sm sm:text-base text-[#574539] leading-relaxed font-sans font-light">
                {currentStep.description}
              </p>

              {/* Flip Card Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#f4f0e5] hover:bg-[#e0d9c6] border border-[#cfc7b4] rounded-full text-xs font-mono text-[#21150f] font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#960d41] transition-transform duration-500 ${isFlipped ? 'rotate-180' : ''}`} />
                  <span>{isFlipped ? 'FLIP TO PHYSICAL STAGE' : 'FLIP TO AUDIT EVIDENCE ⟳'}</span>
                </button>

                <button
                  onClick={() => {
                    const targetTab =
                      currentStep.id === 'upload' || currentStep.id === 'verify'
                        ? 'evidence'
                        : currentStep.id === 'analyse'
                        ? 'audit'
                        : currentStep.id === 'review'
                        ? 'review'
                        : 'scorecard';
                    onOpenApp(targetTab);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#21150f] hover:text-[#960d41] transition-colors cursor-pointer"
                >
                  <span>Open in Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Prev / Next Stage Buttons */}
              <div className="pt-4 flex items-center gap-3 text-xs font-mono border-t border-[#e0d9c6]">
                <button
                  disabled={activeStep === 0}
                  onClick={() => handleStepChange(Math.max(0, activeStep - 1))}
                  className="flex items-center gap-1 text-[#6f6052] hover:text-[#21150f] disabled:opacity-30 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>PREV STAGE</span>
                </button>
                <span className="text-[#cfc7b4]">|</span>
                <button
                  disabled={activeStep === steps.length - 1}
                  onClick={() => handleStepChange(Math.min(steps.length - 1, activeStep + 1))}
                  className="flex items-center gap-1 text-[#6f6052] hover:text-[#21150f] disabled:opacity-30 cursor-pointer"
                >
                  <span>NEXT STAGE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right 3D Flipping Card / Image Stage (7 cols) */}
            <div className="lg:col-span-7">
              <div className="perspective-1000 w-full min-h-[380px] sm:min-h-[420px] relative select-none">
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full h-full relative transition-transform duration-700 transform-style-3d cursor-pointer ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT FACE: PHYSICAL OPERATIONAL SPECIMEN */}
                  <div className="absolute inset-0 backface-hidden bg-[#f4f0e5] border border-[#cfc7b4] rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
                    <div>
                      {/* Top Bar of Front Face */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#e0d9c6] text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#09453d]" />
                          <span className="font-bold text-[#21150f]">{currentStep.frontLabel}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-[#fffefa] border border-[#cfc7b4] text-[#960d41] font-semibold text-[11px]">
                          {currentStep.frontBadge}
                        </span>
                      </div>

                      {/* Specimen Visual Artwork Frame */}
                      <div className="relative mt-4 rounded-xl overflow-hidden aspect-[16/9] border border-[#cfc7b4] shadow-inner group">
                        <img
                          src={currentStep.frontImage}
                          alt={currentStep.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Scanner Laser Bar */}
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#960d41] to-transparent animate-scanline pointer-events-none opacity-80" />

                        {/* Overlay Tag */}
                        <div className="absolute bottom-3 left-3 bg-[#21150f]/85 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
                          <Eye className="w-3.5 h-3.5 text-[#eaceaa]" />
                          <span>{currentStep.frontDetails}</span>
                        </div>

                        {/* Click to flip badge */}
                        <div className="absolute top-3 right-3 bg-[#fffefa]/90 border border-[#cfc7b4] px-2.5 py-1 rounded-md text-[10px] font-mono text-[#960d41] font-semibold shadow-xs flex items-center gap-1.5">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>CLICK TO FLIP</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="pt-3 border-t border-[#e0d9c6] flex items-center justify-between text-[11px] font-mono text-[#6f6052]">
                      <span>STAGE {currentStep.index} · PHYSICAL SURFACE</span>
                      <span className="text-[#09453d] font-semibold">CLICK IMAGE TO FLIP TO EVIDENCE</span>
                    </div>
                  </div>

                  {/* BACK FACE: CRYPTOGRAPHIC AUDIT EVIDENCE */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#21150f] text-[#f4f0e5] border border-[#48211a] rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between">
                    <div>
                      {/* Top Bar of Back Face */}
                      <div className="flex items-center justify-between pb-3 border-b border-[#3d1912] text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#57927f]" />
                          <span className="font-bold text-[#fffefa]">{currentStep.backTitle}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded bg-[#34150f] border border-[#574539] text-[#eaceaa] font-semibold text-[11px]">
                          {currentStep.backBadge}
                        </span>
                      </div>

                      {/* Technical Audit Proof Specs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                        {currentStep.backSpecs.map((spec, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-[#2b110c] border border-[#48211a]">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#a48e7d] block">
                              {spec.label}
                            </span>
                            <span className="text-xs font-mono font-medium text-[#fffefa] block mt-0.5 truncate">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Immutable JSON Block Stamp */}
                      <div className="mt-3.5 p-3 rounded-lg bg-[#140805] border border-[#3d1912] font-mono text-[11px] text-[#57927f]">
                        <pre className="overflow-x-auto">{currentStep.backCode}</pre>
                      </div>
                    </div>

                    {/* Bottom Metadata Bar */}
                    <div className="pt-3 border-t border-[#3d1912] flex items-center justify-between text-[11px] font-mono text-[#a48e7d]">
                      <span>CRYPTOGRAPHIC ATTESTATION · VALID</span>
                      <span className="text-[#eaceaa] font-semibold">CLICK TO FLIP BACK ⟳</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
