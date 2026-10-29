import React, { useState } from 'react';
import { Check, ShieldCheck, Zap, ArrowRight, Sparkles, Building2, UserCheck } from 'lucide-react';

interface CrowdCharacter {
  id: string;
  name: string;
  role: string;
  asset: string;
  reading: string;
  badge: string;
  badgeColor: 'red' | 'green';
  renderSvg: (isHovered: boolean) => React.ReactNode;
}

export const MovingCrowdSection: React.FC<{ onOpenApp: (tab?: string) => void }> = ({ onOpenApp }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const characters: CrowdCharacter[] = [
    // 1. BEARDED AFRO BUN HIPSTER (Left - Unverified)
    {
      id: 'c1',
      name: 'T. Namboodiri',
      role: 'HVAC Facility Contractor',
      asset: 'Quad A Central Chiller',
      reading: 'Unlinked Feeder · 380 kW',
      badge: 'BACK · VISIT 3',
      badgeColor: 'red',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Hair Bun with band */}
          <circle cx="50" cy="18" r="14" fill="#21150f" />
          <path d="M 40 24 Q 50 18 60 24" stroke="#eaceaa" strokeWidth="2.5" />
          {/* Head & Neck */}
          <path d="M 42 70 L 42 85 L 58 85 L 58 70" fill="#fffefa" stroke="#21150f" strokeWidth="2" />
          <path d="M 32 46 C 32 30 68 30 68 46 C 68 64 32 64 32 46 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Big curly hair volume on sides */}
          <path d="M 28 36 Q 22 45 28 55 Q 32 48 30 40 Z" fill="#21150f" />
          <path d="M 72 36 Q 78 45 72 55 Q 68 48 70 40 Z" fill="#21150f" />
          {/* Big thick beard & mustache */}
          <path d="M 33 50 C 33 76 67 76 67 50 C 60 52 50 52 40 50 Z" fill="#21150f" />
          <path d="M 40 52 Q 50 58 60 52 Q 50 55 40 52 Z" fill="#f4f0e5" />
          {/* Spectacles */}
          <circle cx="43" cy="44" r="5" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <circle cx="57" cy="44" r="5" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <line x1="48" y1="44" x2="52" y2="44" stroke="#21150f" strokeWidth="2" />
          {/* Eyes & Eyebrows */}
          <circle cx="43" cy="44" r="1.5" fill="#21150f" />
          <circle cx="57" cy="44" r="1.5" fill="#21150f" />
          <path d="M 39 37 Q 44 35 48 37" stroke="#21150f" strokeWidth="1.5" />
          <path d="M 52 37 Q 56 35 61 37" stroke="#21150f" strokeWidth="1.5" />
          {/* Torso: Dark Polo */}
          <path d="M 24 130 L 28 85 C 38 80 62 80 72 85 L 76 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
          {/* White collar detail */}
          <polygon points="50,96 44,85 56,85" fill="#fffefa" stroke="#21150f" strokeWidth="1.5" />
        </svg>
      ),
    },

    // 2. GLASSES HIPSTER GIRL (Left - Unverified)
    {
      id: 'c2',
      name: 'Priyanka Das',
      role: 'Research Lab Coordinator',
      asset: 'Biotech Lab #2 Feeder',
      reading: 'Overlapping Billing Dates',
      badge: 'BACK · VISIT 2',
      badgeColor: 'red',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Ponytail / Hair knot */}
          <path d="M 32 30 C 26 14 74 14 68 30 C 74 44 76 65 72 75 C 62 80 38 80 28 75 C 24 65 26 44 32 30 Z" fill="#21150f" />
          <circle cx="50" cy="14" r="10" fill="#21150f" />
          {/* Face */}
          <path d="M 36 44 C 36 32 64 32 64 44 C 64 62 36 62 36 44 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Bangs */}
          <path d="M 36 38 Q 50 42 64 38 Q 50 34 36 38 Z" fill="#21150f" />
          {/* Cat-eye round glasses */}
          <circle cx="44" cy="46" r="6" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <circle cx="56" cy="46" r="6" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <line x1="50" y1="46" x2="50" y2="46" stroke="#21150f" strokeWidth="2" />
          <circle cx="44" cy="46" r="1.8" fill="#21150f" />
          <circle cx="56" cy="46" r="1.8" fill="#21150f" />
          {/* Freckles & Smile */}
          <circle cx="40" cy="54" r="0.8" fill="#960d41" />
          <circle cx="60" cy="54" r="0.8" fill="#960d41" />
          <path d="M 46 56 Q 50 60 54 56" stroke="#21150f" strokeWidth="1.8" strokeLinecap="round" />
          {/* Hoop Earrings */}
          <circle cx="34" cy="50" r="3" stroke="#d4b94e" strokeWidth="1.5" />
          {/* Torso: Patterned Cardigan */}
          <path d="M 26 130 L 30 84 C 40 80 60 80 70 84 L 74 130 Z" fill="#f0edde" stroke="#21150f" strokeWidth="2" />
          {/* Cardigan buttons */}
          <circle cx="50" cy="94" r="1.5" fill="#21150f" />
          <circle cx="50" cy="106" r="1.5" fill="#21150f" />
          <circle cx="50" cy="118" r="1.5" fill="#21150f" />
        </svg>
      ),
    },

    // 3. CURIOUS GENTLEMAN WITH MUSTACHE (Left - Unverified)
    {
      id: 'c3',
      name: 'K. S. Sundaram',
      role: 'Campus Facilities Director',
      asset: 'Substation Feeder #1',
      reading: 'Tariff Rate Hike Drift',
      badge: 'UNMETERED',
      badgeColor: 'red',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Hair: Classic side-part */}
          <path d="M 30 40 C 30 22 70 20 70 40 C 70 45 68 50 68 50 C 66 40 60 26 40 28 C 34 29 32 35 30 40 Z" fill="#21150f" />
          {/* Head */}
          <path d="M 34 44 C 34 32 66 32 66 44 C 66 64 34 64 34 44 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Eyes & Arched Brows */}
          <circle cx="43" cy="44" r="2" fill="#21150f" />
          <circle cx="57" cy="44" r="2" fill="#21150f" />
          <path d="M 40 38 Q 44 35 48 39" stroke="#21150f" strokeWidth="1.8" />
          <path d="M 52 39 Q 56 35 60 38" stroke="#21150f" strokeWidth="1.8" />
          {/* Classic Wavy Mustache */}
          <path d="M 42 54 Q 50 51 58 54 Q 63 50 64 54 Q 50 58 36 54 Q 37 50 42 54 Z" fill="#21150f" />
          {/* Torso: Dark jacket with high neck */}
          <path d="M 22 130 L 26 84 C 36 78 64 78 74 84 L 78 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
        </svg>
      ),
    },

    // 4. DISTINGUISHED PROFESSOR WITH GLASSES (Right - Known)
    {
      id: 'c4',
      name: 'Dr. C. R. Vance, PE',
      role: 'Chief Assurance Auditor',
      asset: 'Quad Energy Ledger Vault',
      reading: 'Primary Invoice Verified',
      badge: '✓ KNOWN',
      badgeColor: 'green',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Bald Head with side hair wings */}
          <path d="M 34 46 C 34 26 66 26 66 46 C 66 64 34 64 34 46 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          <path d="M 30 46 C 26 48 26 58 32 62 Z" fill="#21150f" />
          <path d="M 70 46 C 74 48 74 58 68 62 Z" fill="#21150f" />
          {/* Eyeglasses */}
          <circle cx="43" cy="45" r="6" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <circle cx="57" cy="45" r="6" stroke="#21150f" strokeWidth="2" fill="#fffefa" />
          <line x1="49" y1="45" x2="51" y2="45" stroke="#21150f" strokeWidth="2" />
          <circle cx="43" cy="45" r="1.8" fill="#21150f" />
          <circle cx="57" cy="45" r="1.8" fill="#21150f" />
          {/* Neat mustache & grandfatherly smile */}
          <path d="M 44 54 Q 50 52 56 54 Q 50 56 44 54 Z" fill="#21150f" />
          <path d="M 46 58 Q 50 61 54 58" stroke="#21150f" strokeWidth="1.5" strokeLinecap="round" />
          {/* Torso: Light Auditor Lab Coat / Sweater */}
          <path d="M 24 130 L 28 85 C 38 80 62 80 72 85 L 76 130 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2" />
          {/* Auditor pen in pocket */}
          <rect x="36" y="94" width="4" height="12" fill="#09453d" rx="1" />
        </svg>
      ),
    },

    // 5. FEDORA HAT RETRO AUDITOR (Right - Known)
    {
      id: 'c5',
      name: 'Farhan Qureshi',
      role: 'Solar Grid Engineer',
      asset: 'Student Union PV Array',
      reading: '14,200 kWh Export Calibrated',
      badge: '✓2 RECORDED',
      badgeColor: 'green',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Fedora Hat tilted up */}
          <path d="M 22 36 Q 50 26 78 36 Q 72 20 50 18 Q 28 20 22 36 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
          <path d="M 18 36 Q 50 32 82 36 L 80 39 Q 50 35 20 39 Z" fill="#f4f0e5" stroke="#21150f" strokeWidth="1.5" />
          {/* Head & Neck */}
          <path d="M 36 46 C 36 34 64 34 64 46 C 64 64 36 64 36 46 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Side hair curl */}
          <path d="M 34 42 Q 28 48 34 54" stroke="#21150f" strokeWidth="2" />
          {/* Eyes with confident wink */}
          <circle cx="44" cy="46" r="2" fill="#21150f" />
          <path d="M 54 46 Q 58 44 60 47" stroke="#21150f" strokeWidth="2" strokeLinecap="round" />
          {/* French Curly Mustache */}
          <path d="M 43 54 Q 50 52 57 54 Q 63 50 65 52 Q 50 56 35 52 Q 37 50 43 54 Z" fill="#21150f" />
          {/* Torso: Dark jacket */}
          <path d="M 24 130 L 28 85 C 38 80 62 80 72 85 L 76 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
          {/* White inner shirt V-neck */}
          <polygon points="50,98 44,84 56,84" fill="#fffefa" />
        </svg>
      ),
    },

    // 6. CHIC BLUNT BOB ANALYST (Right - Audited)
    {
      id: 'c6',
      name: 'Z. Farooqui',
      role: 'Sustainability Director',
      asset: 'Campus Master Energy Scorecard',
      reading: 'Scope 2 GHG: -8.20 T CO2e',
      badge: '✓ AUDITED',
      badgeColor: 'green',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Chic Blunt Bob Hair with Straight Bangs */}
          <path d="M 28 32 C 28 18 72 18 72 32 L 76 68 L 68 66 L 68 38 L 32 38 L 32 66 L 24 68 Z" fill="#21150f" />
          {/* Face */}
          <path d="M 36 44 C 36 32 64 32 64 44 C 64 62 36 62 36 44 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Sharp Brows & Cat Eyes */}
          <path d="M 39 40 Q 44 38 48 40" stroke="#21150f" strokeWidth="2" />
          <path d="M 52 40 Q 56 38 61 40" stroke="#21150f" strokeWidth="2" />
          <ellipse cx="44" cy="45" rx="2" ry="2.5" fill="#21150f" />
          <ellipse cx="56" cy="45" rx="2" ry="2.5" fill="#21150f" />
          {/* Confident Smirk */}
          <path d="M 46 54 Q 52 56 56 52" stroke="#21150f" strokeWidth="1.8" strokeLinecap="round" />
          {/* Torso: Black Turtleneck */}
          <path d="M 26 130 L 30 84 C 40 80 60 80 70 84 L 74 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
          <rect x="44" y="78" width="12" height="10" fill="#21150f" stroke="#21150f" strokeWidth="1.5" rx="2" />
        </svg>
      ),
    },

    // 7. CHEERFUL BALD & MUSTACHE MANAGER (Right - Audited)
    {
      id: 'c7',
      name: 'A. Mehta',
      role: 'Sub-meter Lead Engineer',
      asset: 'Campus Feeder Sub-meter #4B',
      reading: 'Daily Rate: 1,416.7 kWh/day',
      badge: '✓ AUDITED',
      badgeColor: 'green',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Clean bald head with wide ears */}
          <path d="M 34 46 C 34 24 66 24 66 46 C 66 64 34 64 34 46 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          <ellipse cx="32" cy="46" rx="3" ry="5" fill="#fffefa" stroke="#21150f" strokeWidth="1.5" />
          <ellipse cx="68" cy="46" rx="3" ry="5" fill="#fffefa" stroke="#21150f" strokeWidth="1.5" />
          {/* Playful curved eyebrows */}
          <path d="M 40 38 Q 44 34 48 37" stroke="#21150f" strokeWidth="1.8" />
          <path d="M 52 37 Q 56 34 60 38" stroke="#21150f" strokeWidth="1.8" />
          <circle cx="44" cy="44" r="2" fill="#21150f" />
          <circle cx="56" cy="44" r="2" fill="#21150f" />
          {/* Grand Curved Handlebar Mustache */}
          <path d="M 40 52 Q 50 48 60 52 Q 66 48 68 50 Q 50 56 32 50 Q 34 48 40 52 Z" fill="#21150f" />
          {/* Torso: Sleeveless vest */}
          <path d="M 28 130 L 32 86 C 40 82 60 82 68 86 L 72 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
          <path d="M 36 86 C 42 98 58 98 64 86 Z" fill="#fffefa" stroke="#21150f" strokeWidth="1.5" />
        </svg>
      ),
    },

    // 8. LONG HAIR SUSTAINABILITY FELLOW (Right - Audited)
    {
      id: 'c8',
      name: 'Elena Rostova',
      role: 'GHG Assurance Specialist',
      asset: 'EPA eGRID CAMX Emission Model',
      reading: '0.385 kg CO2e/kWh Validated',
      badge: '✓ AUDITED',
      badgeColor: 'green',
      renderSvg: (isHovered) => (
        <svg viewBox="0 0 100 130" className="w-20 h-28 overflow-visible" fill="none">
          {/* Long flowing wavy hair */}
          <path d="M 30 30 C 24 16 76 16 70 30 C 78 50 82 85 76 95 C 68 86 64 45 64 38 C 50 34 36 38 36 45 C 36 45 32 86 24 95 C 18 85 22 50 30 30 Z" fill="#21150f" />
          {/* Headband */}
          <path d="M 30 32 Q 50 25 70 32" stroke="#d4b94e" strokeWidth="3" />
          {/* Face */}
          <path d="M 36 44 C 36 32 64 32 64 44 C 64 62 36 62 36 44 Z" fill="#fffefa" stroke="#21150f" strokeWidth="2.5" />
          {/* Big happy eyes & gentle smile */}
          <circle cx="44" cy="45" r="2" fill="#21150f" />
          <circle cx="56" cy="45" r="2" fill="#21150f" />
          <path d="M 45 54 Q 50 58 55 54" stroke="#21150f" strokeWidth="1.8" strokeLinecap="round" />
          {/* Torso: Dark cozy sweater */}
          <path d="M 26 130 L 30 84 C 40 80 60 80 70 84 L 74 130 Z" fill="#21150f" stroke="#21150f" strokeWidth="2" />
        </svg>
      ),
    },
  ];

  const activeRecord = characters.find((c) => c.id === hoveredId) || characters[3];

  return (
    <section className="relative border-b border-[#cfc7b4] overflow-hidden select-none">
      {/* Top Section Editorial Headline */}
      <div className="bg-[#f4f0e5] pt-20 pb-10 px-6 md:px-12 border-b border-[#cfc7b4]">
        <div className="max-w-7xl mx-auto">
          {/* Pramaan Section Mark */}
          <div className="pr-secmark mb-4">
            <span className="pr-secmark__n">
              03 <span className="pr-secmark__of">/ 07</span>
            </span>
            <span className="pr-secmark__rule" />
            <span className="pr-secmark__label">Verification Continuum</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#21150f] leading-[1.08]">
                Strangers walk through.<br />
                <em className="text-[#960d41] italic font-normal">Regulars walk back.</em>
              </h2>
            </div>
            <p className="text-sm md:text-base text-[#574539] max-w-md font-sans font-light leading-relaxed">
              Recognise at the counter, verify at the sub-meter, and remind facility managers before their verification expires.
            </p>
          </div>
        </div>
      </div>

      {/* TWO-TONE SPLIT STAGE: BEIGE (LEFT) VS PALE MINT (RIGHT) */}
      <div className="relative min-h-[560px]">
        {/* Split Backgrounds */}
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
          {/* Left Warm Beige Side */}
          <div
            className="bg-[#f0edde] relative border-b md:border-b-0 md:border-r border-[#cfc7b4]"
            style={{
              backgroundImage: `radial-gradient(#21150f 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
              opacity: 0.95,
            }}
          />
          {/* Right Pale Mint/Sage Side */}
          <div
            className="bg-[#e8f1ec] relative"
            style={{
              backgroundImage: `radial-gradient(#09453d 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
              opacity: 0.95,
            }}
          />
        </div>

        {/* Floating Center Division Badge (pinned right on the seam line) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 hidden md:flex flex-col items-center">
          <div className="bg-[#fffefa] border border-[#cfc7b4] px-6 py-2.5 rounded-2xl shadow-md text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#21150f] font-bold block">
              YOUR COUNTER
            </span>
            <span className="text-xs font-serif italic text-[#574539] block">
              Every sale, recorded
            </span>
            <div className="w-2 h-2 bg-[#960d41] mx-auto mt-2" />
          </div>

          <div className="mt-3 bg-[#fffefa]/90 border border-[#cfc7b4] px-3.5 py-1 rounded-full text-[10px] font-mono text-[#6f6052] tracking-wider uppercase shadow-2xs">
            POINT AT ANYONE IN THE CROWD
          </div>
        </div>

        {/* Content Overlay Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN: STRANGERS / UNVERIFIED */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#6f6052] font-semibold">
                  STRANGERS
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif italic font-normal text-[#21150f] mt-1">
                  No name, no number, no history.
                </h3>
              </div>

              {/* What the marks mean legend */}
              <div className="pt-2">
                <span className="text-xs font-sans text-[#6f6052] block mb-3 font-medium">
                  What the marks mean
                </span>
                <div className="space-y-3 font-sans text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 border border-dashed border-[#960d41] flex items-center justify-center text-[10px] font-mono text-[#960d41] shrink-0">
                      01
                    </span>
                    <span className="text-[#21150f]">
                      <strong className="font-semibold">Recorded</strong> at your counter, in seconds
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#09453d] text-white flex items-center justify-center text-[10px] font-mono shrink-0">
                      ✓
                    </span>
                    <span className="text-[#21150f]">
                      <strong className="font-semibold">Known</strong> by name, purchase and date
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-1.5 py-0.5 rounded bg-[#960d41] text-white text-[9px] font-mono font-bold shrink-0">
                      BACK
                    </span>
                    <span className="text-[#21150f]">
                      <strong className="font-semibold">Returning</strong> to the shop that remembered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CUSTOMERS / AUDITED LEDGER */}
            <div className="space-y-6 md:pl-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#27544a] font-semibold">
                  CUSTOMERS
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif italic font-normal text-[#21150f] mt-1">
                  Known, reachable, coming back.
                </h3>
              </div>

              {/* LIVE FLOATING CUSTOMER BOOK / ENERGY LEDGER CARD */}
              <div className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-5 shadow-lg max-w-md">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0d9c6] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#09453d] animate-pulse" />
                    <span className="font-mono font-bold tracking-wider text-[#21150f]">
                      CUSTOMER BOOK
                    </span>
                  </div>
                  <span className="font-serif italic text-[#574539]">
                    IGDTUW Delhi Campus
                  </span>
                </div>

                <div className="pt-3 space-y-2.5 text-xs font-mono">
                  <div className={`flex items-center justify-between py-1.5 px-2 rounded border transition-colors ${
                    activeRecord.id === 'c6' ? 'bg-[#e8f1ec] border-[#09453d]' : 'border-transparent'
                  }`}>
                    <span className="text-[#6f6052]">11:40</span>
                    <span className="font-bold text-[#09453d] bg-[#d9e5dc] px-1.5 py-0.5 rounded text-[10px]">
                      RECORDED
                    </span>
                    <span className="text-[#21150f] font-medium truncate max-w-[150px]">
                      Z. Farooqui · Ceiling fan
                    </span>
                  </div>

                  <div className={`flex items-center justify-between py-1.5 px-2 rounded border transition-colors ${
                    activeRecord.id === 'c5' ? 'bg-[#e8f1ec] border-[#09453d]' : 'border-transparent'
                  }`}>
                    <span className="text-[#6f6052]">11:37</span>
                    <span className="font-bold text-[#27544a] bg-[#d9e5dc] px-1.5 py-0.5 rounded text-[10px]">
                      REMINDER
                    </span>
                    <span className="text-[#21150f] font-medium truncate max-w-[150px]">
                      F. Qureshi · Service due
                    </span>
                  </div>

                  <div className={`flex items-center justify-between py-1.5 px-2 rounded border transition-colors ${
                    activeRecord.id === 'c7' ? 'bg-[#f0edde] border-[#960d41]' : 'border-transparent'
                  }`}>
                    <span className="text-[#6f6052]">11:36</span>
                    <span className="font-bold text-[#960d41] bg-[#f0edde] px-1.5 py-0.5 rounded text-[10px]">
                      BACK
                    </span>
                    <span className="text-[#21150f] font-medium truncate max-w-[150px]">
                      A. Mehta · visit 2
                    </span>
                  </div>
                </div>

                {/* Active Hover Inspector Status */}
                <div className="mt-4 pt-3 border-t border-[#cfc7b4] bg-[#f7f4e9] -mx-5 -mb-5 p-4 rounded-b-2xl">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-bold text-[#21150f] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#09453d]" />
                      <span>{activeRecord.name}</span>
                    </span>
                    <span className="text-[#09453d] font-bold">{activeRecord.reading}</span>
                  </div>
                  <p className="text-[10px] text-[#6f6052] mt-0.5 font-sans">
                    {activeRecord.role} · {activeRecord.asset}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM ROW: BEAUTIFULLY ILLUSTRATED CARTOON CHARACTERS WALKING WITH BOBBING ANIMATION */}
        <div className="absolute bottom-0 left-0 right-0 h-44 border-t border-[#cfc7b4] bg-white/50 backdrop-blur-xs overflow-hidden flex items-end">
          <div className="animate-crowd-stream flex items-end gap-12 whitespace-nowrap px-6 pb-0">
            {/* Repeat array for seamless infinite moving conveyor */}
            {[...characters, ...characters].map((char, idx) => {
              const isHovered = hoveredId === char.id;
              return (
                <div
                  key={`${char.id}-${idx}`}
                  onMouseEnter={() => setHoveredId(char.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => onOpenApp('evidence')}
                  style={{
                    animationDelay: `${(idx % 4) * 0.4}s`,
                  }}
                  className="animate-bob flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:-translate-y-3 shrink-0 relative"
                >
                  {/* Floating Overhead Badge (matching Pramaan Reference) */}
                  <div className="mb-2 transition-transform duration-200 group-hover:scale-110">
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-xs tracking-wider uppercase transition-all ${
                        char.badgeColor === 'red'
                          ? 'bg-[#960d41] text-white'
                          : 'bg-[#09453d] text-white'
                      } ${isHovered ? 'ring-2 ring-white scale-110' : ''}`}
                    >
                      {char.badge}
                    </span>
                  </div>

                  {/* High-character Cartoon Illustration SVG */}
                  <div
                    className={`transition-all duration-300 ${
                      isHovered
                        ? 'scale-110 drop-shadow-[0_8px_16px_rgba(52,21,15,0.25)]'
                        : 'opacity-95'
                    }`}
                  >
                    {char.renderSvg(isHovered)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
