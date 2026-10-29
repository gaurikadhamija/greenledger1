import React, { useState } from 'react';
import { QrCode, Cpu, BarChart3, ShieldCheck, Zap, Layers, RefreshCw, ZoomIn, CheckCircle2, RotateCw } from 'lucide-react';
import { ThreeExplodedCanvas } from './ThreeExplodedCanvas';
import { SubtleLeaf, LeafCornerAccent } from '../common/BotanicalLeaf';

export const HeroExplodedSpecimen: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'qr' | 'core' | 'base'>('all');
  const [isRotating, setIsRotating] = useState(true);

  // Live telemetry feed ticker items (constantly moving on the right)
  const telemetryFeed = [
    { time: '11:42:10', tag: 'INVOICE', text: 'IGDTUW DELHI HT FEEDER #JAN-2025 · 48,200 kWh', status: 'VERIFIED' },
    { time: '11:42:04', tag: 'OCR', text: 'CONFIDENCE: 98.2% · BOUNDING BOXES SIGNED', status: 'CONFIRMED' },
    { time: '11:41:58', tag: 'HASH', text: 'SHA256: 8F92D...3B1C · CRYPTOGRAPHIC LEDGER', status: 'LOCKED' },
    { time: '11:41:51', tag: 'SUB-MTR', text: 'KASHMERE GATE AUDIT REGISTER · 380 kW', status: 'ONLINE' },
    { time: '11:41:45', tag: 'NORMALIZE', text: '31-DAY CYCLE NORM: 1,416.7 kWh/day', status: 'BALANCED' },
    { time: '11:41:39', tag: 'SOLAR', text: 'DTU & IGDTUW PV ROOFTOP · 14,200 kWh GENERATED', status: 'EXPORTED' },
    { time: '11:41:32', tag: 'CEA-DELHI', text: 'GRID FACTOR: 0.716 kg CO2e/kWh APPLIED', status: 'SCORED' },
    { time: '11:41:25', tag: 'AUDIT', text: 'AUDITOR: DELHI NODAL OFFICER · STAMP APPROVED', status: 'DEFENSIBLE' },
  ];

  return (
    <div className="relative w-full bg-[#f4f0e5] border border-[#cfc7b4] rounded-2xl overflow-hidden shadow-sm select-none">
      <LeafCornerAccent position="top-right" className="absolute top-2 right-2 pointer-events-none z-20" />
      {/* Top Editorial Specimen Bar */}
      <div className="px-5 py-3 border-b border-[#e0d9c6] bg-[#fffefa]/90 backdrop-blur-xs flex flex-wrap items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2.5">
          <SubtleLeaf size={15} color="#09453d" />
          <span className="w-2 h-2 rounded-full bg-[#960d41] animate-ping" />
          <span className="font-mono text-[#21150f] font-semibold tracking-wider">
            FIG. 00 · 3D EXPLODED SPECIMEN
          </span>
          <span className="hidden sm:inline text-[#c8c1af]">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-[#6f6052]">
            THREE.JS AXONOMETRIC RIG · DRAG TO ORBIT
          </span>
        </div>

        {/* Zoom & Part Scrubber Controls + Rotate Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-[#cfc7b4] ${
              isRotating ? 'bg-[#fffefa] text-[#09453d]' : 'bg-[#f0edde] text-[#6f6052]'
            }`}
            title="Toggle Auto-Rotation"
          >
            <RotateCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">{isRotating ? 'ROTATING' : 'PAUSED'}</span>
          </button>

          <div className="flex items-center gap-1 bg-[#f4f0e5] p-1 rounded-lg border border-[#cfc7b4]">
            <button
              onClick={() => setActiveLayer('all')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                activeLayer === 'all'
                  ? 'bg-[#21150f] text-white font-medium shadow-xs'
                  : 'text-[#574539] hover:bg-[#fffefa]'
              }`}
            >
              ALL (EXPLODED)
            </button>
            <button
              onClick={() => setActiveLayer('qr')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                activeLayer === 'qr'
                  ? 'bg-[#960d41] text-white font-medium shadow-xs'
                  : 'text-[#574539] hover:bg-[#fffefa]'
              }`}
            >
              01. QR PROOF
            </button>
            <button
              onClick={() => setActiveLayer('core')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                activeLayer === 'core'
                  ? 'bg-[#09453d] text-white font-medium shadow-xs'
                  : 'text-[#574539] hover:bg-[#fffefa]'
              }`}
            >
              02. CORE & AI
            </button>
            <button
              onClick={() => setActiveLayer('base')}
              className={`px-2.5 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                activeLayer === 'base'
                  ? 'bg-[#57927f] text-white font-medium shadow-xs'
                  : 'text-[#574539] hover:bg-[#fffefa]'
              }`}
            >
              03. BASE METERS
            </button>
          </div>
        </div>
      </div>

      {/* Main Specimen Stage with Constantly Moving Right Ticker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] relative">
        {/* Left & Center 3D Exploded Diagram (9 cols) */}
        <div className="lg:col-span-9 p-2 sm:p-6 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f7f4e9] via-[#f4f0e5] to-[#ece6d5]">
          {/* Subtle Technical Hairline Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(to right, #21150f 1px, transparent 1px), linear-gradient(to bottom, #21150f 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Technical Corner Coordinate Callouts based on Reference Image 1 */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[10px] text-[#574539] pointer-events-none hidden sm:block">
            <div className="flex items-center gap-1.5 font-bold text-[#960d41]">
              <span className="w-1.5 h-1.5 bg-[#960d41]" />
              <span>4Y. 4P8C</span>
            </div>
            <p className="mt-0.5 tracking-wider text-[#6f6052]">
              8DQHJFC QYHJHSI<br />
              QWU16EIT 3RM KW<br />
              <span className="text-[9px] text-[#8e8072]">HOE AJQB. 4 OISY23S XC0ZDW2E92</span>
            </p>
          </div>

          <div className="absolute top-4 right-4 z-10 font-mono text-[10px] text-[#574539] pointer-events-none text-right hidden sm:block">
            <div className="flex items-center justify-end gap-1.5 font-bold text-[#960d41]">
              <span>XL. ESOEWT0</span>
              <span className="w-1.5 h-1.5 bg-[#960d41]" />
            </div>
            <p className="mt-0.5 tracking-wider text-[#6f6052]">
              50863QAM 5NK7<br />
              MLO 904L2GGHG7<br />
              <span className="text-[9px] text-[#8e8072]">AERNZA-ADSB8Q6 · 71 N68A3K</span>
            </p>
          </div>

          <div className="absolute bottom-4 left-4 z-10 font-mono text-[10px] text-[#574539] pointer-events-none hidden sm:block">
            <div className="flex items-center gap-1.5 font-bold text-[#960d41]">
              <span className="w-1.5 h-1.5 bg-[#960d41]" />
              <span>66. R5R1D</span>
            </div>
            <p className="mt-0.5 tracking-wider text-[#6f6052]">
              DEJ0JP 3GXA9Y5T006Y<br />
              VLXD RLUG I8NQHJY47<br />
              <span className="text-[9px] text-[#8e8072]">43. 8707 · 7RIL-1U0E TR65JU5M</span>
            </p>
          </div>

          <div className="absolute bottom-4 right-4 z-10 font-mono text-[10px] text-[#574539] pointer-events-none text-right hidden sm:block">
            <div className="flex items-center justify-end gap-1.5 font-bold text-[#960d41]">
              <span>8D. WT0VW03Y</span>
              <span className="w-1.5 h-1.5 bg-[#960d41]" />
            </div>
            <p className="mt-0.5 tracking-wider text-[#6f6052]">
              EP-XTKANV6 SNYD0KSCQC<br />
              MIB LXYCIIO · 7WUUPK<br />
              <span className="text-[9px] text-[#8e8072]">CAMPUS CONNECTED · AUDITED</span>
            </p>
          </div>

          {/* Floating Isometric Cards Over 3D WebGL Canvas */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
            <div className="bg-[#fffefa]/95 border border-[#cfc7b4] rounded-xl p-3 shadow-md backdrop-blur-xs max-w-[170px] transform -rotate-2">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#09453d] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#09453d] animate-pulse" />
                <span>CAMPUS SUB-METER</span>
              </div>
              <p className="text-[11px] font-sans font-semibold text-[#21150f] mt-1">
                Sub-meter #4B Quad
              </p>
              <p className="text-[9px] font-mono text-[#6f6052]">1,416.7 kWh/day · Linked</p>
              <div className="mt-1 pt-1 border-t border-[#e0d9c6] text-[8px] font-mono text-[#960d41]">
                ✓ PRIMARY AUDIT CONFIRMED
              </div>
            </div>
          </div>

          <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden md:block">
            <div className="bg-[#fffefa]/95 border border-[#cfc7b4] rounded-xl p-3 shadow-md backdrop-blur-xs max-w-[170px] transform rotate-2">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-[#960d41] font-bold">
                <Cpu className="w-3.5 h-3.5 text-[#960d41]" />
                <span>AI AUDIT ENGINE</span>
              </div>
              <p className="text-[9px] font-mono text-[#574539] mt-1.5 space-y-0.5">
                <span className="block">ANALYZE · DETECT</span>
                <span className="block">AUTOMATE · NORMALIZE</span>
                <span className="block text-[#09453d] font-bold">STATUS: ACTIVE</span>
              </p>
            </div>
          </div>

          {/* TRUE 3D THREE.JS WEBGL CANVAS */}
          <div className="w-full h-full relative z-0 flex items-center justify-center">
            <ThreeExplodedCanvas activeLayer={activeLayer} isRotating={isRotating} />
          </div>

          {/* Hint Overlay for User */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#fffefa]/95 border border-[#cfc7b4] px-4 py-1.5 rounded-full text-[11px] font-mono text-[#574539] shadow-xs flex items-center gap-2 pointer-events-none z-20">
            <ZoomIn className="w-3.5 h-3.5 text-[#960d41]" />
            <span>CLICK & DRAG TO ORBIT 360° · USE BUTTONS TO ZOOM PART</span>
          </div>
        </div>

        {/* RIGHT SIDE: CONSTANTLY MOVING TELEMETRY TICKER (User Requested) */}
        <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-[#cfc7b4] bg-[#fffefa] flex flex-col h-[320px] lg:h-auto overflow-hidden">
          {/* Header of the Ticker */}
          <div className="p-3.5 border-b border-[#e0d9c6] bg-[#f7f4e9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#09453d] animate-pulse" />
              <span className="text-[11px] font-mono font-bold text-[#21150f] uppercase tracking-wider">
                LIVE AUDIT STREAM
              </span>
            </div>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#f0edde] border border-[#cfc7b4] text-[#960d41]">
              MOVING REAL-TIME
            </span>
          </div>

          {/* Constantly Scrolling Ticker Container */}
          <div className="flex-1 relative overflow-hidden py-2">
            <div className="animate-telemetry flex flex-col gap-3 px-3.5">
              {/* Double array to create seamless infinite vertical loop */}
              {[...telemetryFeed, ...telemetryFeed].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-[#e0d9c6] bg-[#fdfcf9] hover:border-[#960d41] transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#6f6052] mb-1">
                    <span>{item.time}</span>
                    <span className="font-bold text-[#960d41] bg-[#f4f0e5] px-1.5 py-0.5 rounded text-[9px]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-[#21150f] font-medium leading-snug">
                    {item.text}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
                    <span className="text-[#09453d] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {item.status}
                    </span>
                    <span className="text-[#c8c1af]">LEDGER #419</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradient Mask for Smooth Scroll Fade */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#fffefa] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#fffefa] to-transparent pointer-events-none" />
          </div>

          {/* Ticker Bottom Metadata */}
          <div className="p-3 border-t border-[#e0d9c6] bg-[#f7f4e9] text-[10px] font-mono text-[#6f6052] flex items-center justify-between">
            <span>AUDIT CYCLE 2025</span>
            <span className="text-[#09453d] font-bold">100% IMMUTABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
