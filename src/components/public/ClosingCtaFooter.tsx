import { ArrowRight, ArrowUpRight, ShieldCheck, Leaf } from 'lucide-react';
import { SubtleLeaf, BotanicalSprig } from '../common/BotanicalLeaf';

interface ClosingCtaFooterProps {
  onOpenApp: (tab?: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const ClosingCtaFooter: React.FC<ClosingCtaFooterProps> = ({ onOpenApp, onNavigateSection }) => {
  return (
    <footer className="bg-[#34150f] text-[#f4f0e5] border-t border-[#48211a] pt-24 pb-12 relative overflow-hidden">
      {/* Background Subtle Gradient & Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(#f4f0e5 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Big Editorial CTA */}
        <div className="max-w-3xl pb-20 border-b border-[#48211a]">
          <span className="text-xs font-mono uppercase tracking-widest text-[#eaceaa] block mb-4 font-semibold">
            START SUSTAINABILITY ACCOUNTING
          </span>

          <h2 className="st-h2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#fffefa] leading-[1.03] mb-8 text-balance">
            Measured today.<br />
            <em className="text-[#eaceaa] italic font-normal">Provable in ten years.</em>
          </h2>

          <p className="st-lede text-lg text-[#e0d9c6] font-light leading-relaxed mb-10 max-w-xl">
            Replace self-reported guesswork with an immutable energy ledger. Test the full audit workflow with pre-loaded university specimen data or upload your own bills.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenApp('overview')}
              className="flex items-center gap-2 px-7 py-3.5 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] hover:bg-[#f0edde] rounded-full transition-all duration-200 shadow-md cursor-pointer"
            >
              <span>Launch Workspace Demo</span>
              <ArrowRight className="w-4 h-4 text-[#21150f]" />
            </button>

            <button
              onClick={() => onOpenApp('evidence')}
              className="flex items-center gap-2 px-6 py-3.5 text-xs font-sans font-medium text-[#f4f0e5] hover:text-white border border-[#574539] hover:border-[#cfc7b4] rounded-full transition-colors cursor-pointer"
            >
              <span>Test Bill Upload & Extraction</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#eaceaa]" />
            </button>
          </div>
        </div>

        {/* Minimal Institutional Footer Links */}
        <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Col 1: Wordmark & Protocol Note (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5 text-2xl font-serif font-medium text-[#fffefa]">
              <span className="w-7 h-7 rounded-full bg-[#57927f]/20 border border-[#57927f]/40 flex items-center justify-center">
                <SubtleLeaf size={16} color="#57927f" secondaryColor="#eaceaa" />
              </span>
              <span className="tracking-tight">
                <span className="font-semibold text-[#57927f] mr-0.5">ग्रीन</span>Ledger
              </span>
            </div>
            <p className="text-xs text-[#c8c1af] leading-relaxed max-w-sm font-sans font-light">
              An editorial sustainability intelligence platform designed for universities, corporate campuses, and institutional facilities seeking defensible carbon accounting and transparent energy audits.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-[#eaceaa] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#57927f]" />
              <span>Deterministic Accounting Protocol v3.2</span>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="md:col-span-2 space-y-3 font-sans">
            <p className="text-xs font-mono uppercase tracking-widest text-[#c8c1af]">
              Platform
            </p>
            <ul className="space-y-2 text-sm text-[#e0d9c6] font-light">
              <li>
                <button
                  onClick={() => onNavigateSection('problem')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  The gap
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('capabilities')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('workflow')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Automation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('methodology')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('scorecard-preview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Scorecard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Workspace Tools (2 cols) */}
          <div className="md:col-span-2 space-y-3 font-sans">
            <p className="text-xs font-mono uppercase tracking-widest text-[#c8c1af]">
              Workspace
            </p>
            <ul className="space-y-2 text-sm text-[#e0d9c6] font-light">
              <li>
                <button
                  onClick={() => onOpenApp('overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('evidence')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Evidence Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('audit')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Energy Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('review')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Review Flags
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('scorecard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Green Scorecard
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Assurance & Standards (3 cols) */}
          <div className="md:col-span-3 space-y-3 font-sans">
            <p className="text-xs font-mono uppercase tracking-widest text-[#c8c1af]">
              Standards
            </p>
            <div className="text-xs text-[#c8c1af] space-y-2 font-mono">
              <p>• US EPA eGRID 2024 CAMX</p>
              <p>• GHG Protocol Scope 2 Guidance</p>
              <p>• ISO 14064-3 Verifiable Audit</p>
              <p>• Zero AI Numeric Hallucinations</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-[#48211a] flex flex-col sm:flex-row items-center justify-between text-xs text-[#c8c1af] font-mono gap-4">
          <p>© {new Date().getFullYear()} GreenLedger Systems. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[#c8c1af]">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Assurance Methodology</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
