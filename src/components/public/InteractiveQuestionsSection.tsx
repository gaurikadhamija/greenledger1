import React, { useState } from 'react';
import { ArrowRight, Zap, AlertTriangle, FileSpreadsheet, Scale, ShieldAlert, Award } from 'lucide-react';

interface QuestionItem {
  id: string;
  n: string;
  figure: string;
  question: string;
  calloutTitle: string;
  calloutSubtitle: string;
  consequenceMain: string;
  consequenceSub: string;
  wireframeType: 'exit' | 'drawer' | 'estimate' | 'drift' | 'meter' | 'chance';
  solutionLink: string;
  solutionText: string;
}

export const InteractiveQuestionsSection: React.FC<{ onOpenApp: (tab?: string) => void }> = ({ onOpenApp }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items: QuestionItem[] = [
    {
      id: 'meter-data',
      n: '01',
      figure: 'FIG. 01',
      question: 'PRIMARY METER DATA?',
      calloutTitle: 'TELEMETRY DATA',
      calloutSubtitle: 'NOT CAPTURED',
      consequenceMain: 'WALKS OUT UNMETERED',
      consequenceSub: 'GONE WITH THE UTILITY BILL',
      wireframeType: 'exit',
      solutionLink: 'evidence',
      solutionText: 'Capture cryptographic OCR bills',
    },
    {
      id: 'warranty-records',
      n: '02',
      figure: 'FIG. 02',
      question: 'UTILITY BILL RECORDS?',
      calloutTitle: 'INVOICE PDF',
      calloutSubtitle: 'LOST IN A DRAWER',
      consequenceMain: 'LOST IN A DRAWER',
      consequenceSub: 'MISSING WHEN IT IS NEEDED',
      wireframeType: 'drawer',
      solutionLink: 'evidence',
      solutionText: 'Catalog invoices in evidence library',
    },
    {
      id: 'proof-ownership',
      n: '03',
      figure: 'FIG. 03',
      question: 'SUB-METER PROOF?',
      calloutTitle: 'SUB-METER LINK',
      calloutSubtitle: 'UNLINKED BLIND SPOT',
      consequenceMain: 'ANYONE CAN ESTIMATE',
      consequenceSub: 'FACT AND GUESSWORK LOOK ALIKE',
      wireframeType: 'estimate',
      solutionLink: 'audit',
      solutionText: 'Link facility sub-meters to ledger',
    },
    {
      id: 'cycle-claims',
      n: '04',
      figure: 'FIG. 04',
      question: 'CYCLE NORMALIZATION?',
      calloutTitle: '28 VS 33 DAYS',
      calloutSubtitle: 'CYCLE DRIFT UNNOTICED',
      consequenceMain: 'HOURS, NOT SECONDS',
      consequenceSub: 'A SPREADSHEET, A SEARCH, A GUESS',
      wireframeType: 'drift',
      solutionLink: 'audit',
      solutionText: 'Calculate daily normalized rates',
    },
    {
      id: 'buyer-relationships',
      n: '05',
      figure: 'FIG. 05',
      question: 'TARIFF REASONING?',
      calloutTitle: 'TARIFF ESCALATION',
      calloutSubtitle: 'ENDS AT THE METER',
      consequenceMain: 'END AT THE COUNTER',
      consequenceSub: 'NO WAY TO EXPLAIN RATE INCREASES',
      wireframeType: 'meter',
      solutionLink: 'review',
      solutionText: 'Separate kWh usage from rate hikes',
    },
    {
      id: 'repeat-customers',
      n: '06',
      figure: 'FIG. 06',
      question: 'ASSURANCE EVIDENCE?',
      calloutTitle: 'GREEN CLAIM',
      calloutSubtitle: 'ZERO AUDIT TRAIL',
      consequenceMain: 'LEFT TO CHANCE',
      consequenceSub: 'NO REASON FOR REGULATORS TO BELIEVE',
      wireframeType: 'chance',
      solutionLink: 'scorecard',
      solutionText: 'Publish certified Green Scorecard',
    },
  ];

  const current = items[activeIndex];

  return (
    <section id="the-gap" className="py-24 md:py-32 bg-[#34150f] text-[#f4f0e5] relative overflow-hidden">
      {/* Background Subtle Pramaan Coffee Dot Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(#f4f0e5 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Pramaan Section Mark */}
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-[#eaceaa] mb-6">
          <span className="font-bold text-[#f4f0e5]">02</span>
          <span className="text-[#a48e7d]">/ 07</span>
          <span className="w-10 h-px bg-[#574539]" />
          <span className="text-[#eaceaa]">THE GAP IN SUSTAINABILITY DATA</span>
        </div>

        {/* Section Heading matching Pramaan Editorial Aesthetic */}
        <div className="max-w-4xl mb-14">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[#fffefa] leading-[1.08] text-balance">
            When the utility bill is paid,<br />
            <em className="text-[#eaceaa] italic font-normal">what evidence do you actually have?</em>
          </h2>
          <p className="mt-4 text-[#cfc7b4] text-base sm:text-lg max-w-2xl font-sans font-light">
            Utility portals discard the link between invoices and audit records the moment you download the PDF. Without an immutable ledger, your energy records walk out the door.
          </p>
        </div>

        {/* 3-COLUMN INTERACTIVE QUESTION / POP-OUT WIREFRAME / CONSEQUENCE EXPLORER */}
        <div className="relative mt-8 border border-[#574539]/80 rounded-2xl bg-[#2b110c]/80 backdrop-blur-xs p-4 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* COLUMN 1: QUESTIONS LIST (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col gap-1.5 z-20">
              {items.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                      isActive
                        ? 'bg-[#f4f0e5] text-[#21150f] shadow-lg translate-x-1'
                        : 'bg-transparent text-[#d8cfbe] hover:bg-[#3d1a13] hover:text-white'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono font-bold shrink-0 ${
                        isActive ? 'text-[#960d41]' : 'text-[#b8384a]'
                      }`}
                    >
                      {item.n}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-mono font-semibold tracking-wider uppercase truncate ${
                        isActive ? 'text-[#21150f]' : 'text-[#d8cfbe]'
                      }`}
                    >
                      {item.question}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* COLUMN 2: CENTER POPOUT WIREFRAME ROOM (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="w-full max-w-[340px] aspect-[1/1] bg-[#1e0a07] border border-[#574539] rounded-xl p-4 relative shadow-2xl overflow-hidden group">
                {/* Technical Corner Brackets matching Reference Images 2 & 3 */}
                <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t border-l border-[#8e7a6d]" />
                <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t border-r border-[#8e7a6d]" />
                <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b border-l border-[#8e7a6d]" />
                <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b border-r border-[#8e7a6d]" />

                {/* Top-left Figure Number */}
                <span className="absolute top-3 left-4 text-[10px] font-mono text-[#8e7a6d] font-semibold">
                  {current.figure}
                </span>

                {/* Isometric Wireframe Room SVG */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 300 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Subtle room floor grid dots */}
                  {Array.from({ length: 6 }).map((_, r) =>
                    Array.from({ length: 6 }).map((_, c) => {
                      const isoX = 150 + (c - r) * 16;
                      const isoY = 160 + (c + r) * 9;
                      return <circle key={`${r}-${c}`} cx={isoX} cy={isoY} r="1" fill="#4d221b" />;
                    })
                  )}

                  {/* Room Back Walls */}
                  {/* Corner back vertex at (150, 75) */}
                  <line x1="150" y1="75" x2="150" y2="190" stroke="#775a4d" strokeWidth="1.5" />
                  <line x1="150" y1="75" x2="260" y2="135" stroke="#775a4d" strokeWidth="1.5" />
                  <line x1="150" y1="75" x2="40" y2="135" stroke="#775a4d" strokeWidth="1.5" />

                  {/* Room Floor Boundaries */}
                  <line x1="40" y1="135" x2="40" y2="215" stroke="#775a4d" strokeWidth="1.2" />
                  <line x1="260" y1="135" x2="260" y2="215" stroke="#775a4d" strokeWidth="1.2" />
                  <line x1="40" y1="215" x2="150" y2="275" stroke="#775a4d" strokeWidth="1.5" />
                  <line x1="260" y1="215" x2="150" y2="275" stroke="#775a4d" strokeWidth="1.5" />

                  {/* Window on Left Wall */}
                  <polygon
                    points="80,118 115,100 115,128 80,146"
                    stroke="#775a4d"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  <line x1="97" y1="109" x2="97" y2="137" stroke="#775a4d" strokeWidth="1" />
                  <line x1="80" y1="132" x2="115" y2="114" stroke="#775a4d" strokeWidth="1" />

                  {/* Doorway on Right Wall */}
                  <polygon
                    points="210,135 245,153 245,215 210,195"
                    stroke="#775a4d"
                    strokeWidth="1.2"
                    fill="none"
                  />
                  {/* Open door leaf */}
                  <polygon
                    points="245,153 270,145 270,205 245,215"
                    stroke="#775a4d"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    fill="none"
                  />

                  {/* Desk / Workstation on Left Floor */}
                  <polygon
                    points="75,175 125,148 150,162 100,189"
                    stroke="#a89283"
                    strokeWidth="1.2"
                    fill="#260e0a"
                  />
                  <line x1="75" y1="175" x2="75" y2="200" stroke="#a89283" strokeWidth="1.2" />
                  <line x1="100" y1="189" x2="100" y2="214" stroke="#a89283" strokeWidth="1.2" />
                  <line x1="150" y1="162" x2="150" y2="187" stroke="#a89283" strokeWidth="1.2" />
                  <line x1="75" y1="200" x2="100" y2="214" stroke="#a89283" strokeWidth="1.2" />
                  <line x1="100" y1="214" x2="150" y2="187" stroke="#a89283" strokeWidth="1.2" />

                  {/* Monitor / Energy Meter Terminal on Desk */}
                  <rect
                    x="105"
                    y="142"
                    width="18"
                    height="12"
                    stroke="#cfc7b4"
                    strokeWidth="1"
                    fill="#1e0a07"
                  />
                  <line x1="114" y1="154" x2="114" y2="158" stroke="#cfc7b4" strokeWidth="1" />

                  {/* Person Figurine standing in front of Desk */}
                  <circle cx="165" cy="182" r="5" stroke="#cfc7b4" strokeWidth="1.2" fill="#2b110c" />
                  <path
                    d="M 158 206 C 158 194 172 194 172 206 Z"
                    stroke="#cfc7b4"
                    strokeWidth="1.2"
                    fill="#2b110c"
                  />

                  {/* Animated Red Laser Trajectory Path shooting from Desk to Doorway */}
                  <path
                    d={
                      activeIndex === 4
                        ? "M 114 150 Q 180 130 230 170"
                        : "M 114 150 L 225 175"
                    }
                    stroke="#e63946"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-laser-dash"
                  />
                  {/* Traveling Pulsing Laser Dot */}
                  <circle
                    cx={activeIndex === 4 ? 180 : 225}
                    cy={activeIndex === 4 ? 142 : 175}
                    r="3.5"
                    fill="#e63946"
                    className="animate-pulse"
                  />
                  {/* Target reticle rings */}
                  <circle
                    cx={225}
                    cy={175}
                    r="8"
                    stroke="#e63946"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>

                {/* Right Callout Box with Leader Line (matching Reference Images 2 & 3) */}
                <div className="absolute top-7 right-4 z-20 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-[9px] font-mono font-bold text-[#e63946]">
                    <span className="w-1.5 h-1.5 bg-[#e63946]" />
                    <span>{current.calloutTitle}</span>
                  </div>
                  <div className="text-[10px] font-mono font-bold tracking-tight text-[#ff6b6b]">
                    {current.calloutSubtitle}
                  </div>
                </div>
              </div>

              {/* Action Button inside Stage */}
              <button
                onClick={() => onOpenApp(current.solutionLink)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#482017] hover:bg-[#5a281c] border border-[#6b3123] rounded-full text-xs font-mono text-[#eaceaa] transition-colors cursor-pointer"
              >
                <span>{current.solutionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* COLUMN 3: CONSEQUENCES IN RED BOLD + MUTED SUBTITLE (4 COLS) */}
            <div className="lg:col-span-4 flex flex-col gap-6 pl-0 lg:pl-6">
              {items.map((item, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => setActiveIndex(idx)}
                    className={`transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'opacity-100 scale-102'
                        : 'opacity-40 hover:opacity-75'
                    }`}
                  >
                    <h3
                      className={`text-base sm:text-lg font-mono font-bold tracking-wider uppercase leading-none ${
                        isActive ? 'text-[#ff4d4d]' : 'text-[#b8384a]'
                      }`}
                    >
                      {item.consequenceMain}
                    </h3>
                    <p className="text-xs sm:text-sm font-mono text-[#cfc7b4] mt-1 tracking-wide uppercase font-light">
                      {item.consequenceSub}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Bottom Right Helper Tag matching Reference Images 2 & 3 */}
          <div className="mt-8 pt-4 border-t border-[#48211a] flex items-center justify-between text-[11px] font-mono text-[#8e7a6d]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] animate-ping" />
              <span>THE UTILITY GAP PROTOCOL</span>
            </span>
            <span className="tracking-widest uppercase text-[#a48e7d]">
              POINT AT A LINE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
