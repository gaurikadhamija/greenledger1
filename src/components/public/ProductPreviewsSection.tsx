import React, { useState } from 'react';
import { LayoutDashboard, FileSpreadsheet, BarChart2, ShieldAlert, Award, ArrowUpRight } from 'lucide-react';
import { INITIAL_BILLS, INITIAL_REVIEW_FLAGS, GREEN_SCORECARD_MOCK } from '../../data/mockData';
import { formatInr } from '../../lib/formatters';

interface ProductPreviewsSectionProps {
  onOpenApp: (tab?: string) => void;
}

export const ProductPreviewsSection: React.FC<ProductPreviewsSectionProps> = ({ onOpenApp }) => {
  const [activePreview, setActivePreview] = useState<'overview' | 'evidence' | 'audit' | 'flags' | 'scorecard'>('overview');

  const tabs = [
    { id: 'overview', label: 'Campus Overview', icon: LayoutDashboard },
    { id: 'evidence', label: 'Evidence Library', icon: FileSpreadsheet },
    { id: 'audit', label: 'Energy Comparison', icon: BarChart2 },
    { id: 'flags', label: 'Review Flags', icon: ShieldAlert },
    { id: 'scorecard', label: 'Green Scorecard', icon: Award },
  ] as const;

  return (
    <section className="py-24 md:py-32 bg-[#f4f0e5] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Pramaan Section Tag */}
        <div className="pr-secmark mb-6">
          <span className="pr-secmark__n">
            05 <span className="pr-secmark__of">/ 07</span>
          </span>
          <span className="pr-secmark__rule" />
          <span className="pr-secmark__label">Authentic Interface</span>
        </div>

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="st-h2 text-4xl sm:text-5xl md:text-6xl text-[#21150f]">
              Real workspace.<br />
              <em>Working components.</em>
            </h2>
            <p className="st-lede mt-4">
              Explore live previews of the GreenLedger operating environment. What you see below is powered by the same deterministic calculation models used in our full application.
            </p>
          </div>

          <button
            onClick={() => onOpenApp(activePreview)}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-sans font-medium text-white bg-[#21150f] hover:bg-[#34150f] rounded-full transition-colors shrink-0 self-start md:self-auto cursor-pointer shadow-xs"
          >
            <span>Open in Full Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#eaceaa]" />
          </button>
        </div>

        {/* Pramaan Segmented Pill Bar */}
        <div className="flex items-center gap-1 p-1.5 bg-[#f0edde] border border-[#cfc7b4] rounded-full mb-8 overflow-x-auto scrollbar-none max-w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activePreview === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreview(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#fffefa] text-[#21150f] shadow-xs font-semibold'
                    : 'text-[#574539] hover:text-[#21150f]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#09453d]' : 'text-[#6f6052]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Viewport Shell */}
        <div className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl shadow-sm overflow-hidden">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 bg-[#f7f4e9] border-b border-[#cfc7b4] text-xs font-mono text-[#574539]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#cfc7b4]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#cfc7b4]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#cfc7b4]" />
              </div>
              <span className="text-[#c8c1af]">·</span>
              <span className="text-[#21150f] font-semibold">
                Workspace / {tabs.find((t) => t.id === activePreview)?.label}
              </span>
            </div>
            <span className="text-[11px] text-[#09453d] font-mono font-medium hidden sm:inline">
              LIVE AUDIT SPECIMEN: ST. JUDE HERITAGE CAMPUS
            </span>
          </div>

          {/* Tab Content Display */}
          <div className="p-6 md:p-8">
            {/* 1. Overview Preview */}
            {activePreview === 'overview' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e0d9c6]">
                  <div>
                    <span className="text-xs font-mono text-[#6f6052] uppercase">Reporting Entity</span>
                    <h3 className="text-xl font-serif font-semibold text-[#21150f]">
                      Indira Gandhi Delhi Technical University for Women (IGDTUW)
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#574539]">Current Period:</span>
                    <span className="px-2.5 py-0.5 bg-[#f0edde] border border-[#cfc7b4] rounded-full font-medium text-[#21150f]">
                      Jan – Dec 2025
                    </span>
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-xs font-mono text-[#6f6052] uppercase block">
                      Total Electricity Consumption
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl lg:text-3xl font-serif text-[#21150f] tabular-nums font-semibold">
                        517,100
                      </span>
                      <span className="text-xs text-[#574539] font-mono">kWh</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#09453d] font-mono">
                      <span>-3.96% vs 2024 baseline</span>
                      <span className="text-[#6f6052]">(saved 21,300 kWh)</span>
                    </div>
                  </div>

                  <div className="p-5 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-xs font-mono text-[#6f6052] uppercase block">
                      Utility Expenditure
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl lg:text-3xl font-serif text-[#21150f] tabular-nums font-semibold">
                        {formatInr(4343640)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#960d41] font-mono">
                      <span>+9.02% vs baseline</span>
                      <span className="text-[#6f6052]">(tariff increased)</span>
                    </div>
                  </div>

                  <div className="p-5 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-xs font-mono text-[#6f6052] uppercase block">
                      Evidence Coverage
                    </span>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl lg:text-3xl font-serif text-[#21150f] tabular-nums font-semibold">
                        91.7%
                      </span>
                      <span className="text-xs text-[#574539] font-mono">11 of 12 bills</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-[#574539] font-mono">
                      <span>1 bill awaiting auditor sign-off</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f0edde] rounded-xl border border-[#cfc7b4] flex items-center justify-between text-xs text-[#574539]">
                  <span>1 active review flag: December 2025 invoice pending auditor confirmation</span>
                  <button
                    onClick={() => onOpenApp('review')}
                    className="text-[#960d41] font-semibold hover:underline cursor-pointer"
                  >
                    View Flag →
                  </button>
                </div>
              </div>
            )}

            {/* 2. Evidence Library Preview */}
            {activePreview === 'evidence' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#e0d9c6]">
                  <span className="text-xs font-mono text-[#574539]">
                    Showing 4 of 12 documented utility invoices (IGDTUW Kashmere Gate)
                  </span>
                  <span className="text-xs font-mono text-[#09453d] font-semibold">OCR Confidence Avg: 98%</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-[#e0d9c6] text-[#6f6052] font-mono uppercase text-[11px]">
                        <th className="pb-2">Invoice #</th>
                        <th className="pb-2">Billing Period</th>
                        <th className="pb-2 text-right">Duration</th>
                        <th className="pb-2 text-right">kWh</th>
                        <th className="pb-2 text-right">Amount (₹)</th>
                        <th className="pb-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0d9c6]">
                      {INITIAL_BILLS.slice(0, 4).map((b) => (
                        <tr key={b.id} className="hover:bg-[#f7f4e9]">
                          <td className="py-2.5 font-mono font-medium text-[#21150f]">{b.invoiceNumber}</td>
                          <td className="py-2.5 text-[#574539]">
                            {b.startDate} to {b.endDate}
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#574539]">{b.daysInPeriod}d</td>
                          <td className="py-2.5 text-right font-mono font-semibold text-[#21150f] tabular-nums">
                            {b.consumptionKwh.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2.5 text-right font-mono text-[#21150f] tabular-nums">
                            {formatInr(b.totalCostInr)}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className="text-[11px] font-mono text-[#09453d] font-semibold">
                              {b.verificationStatus === 'user_verified' ? '✓ Verified' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Energy Comparison Preview */}
            {activePreview === 'audit' && (
              <div className="space-y-6">
                <div className="p-5 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono">
                    <span className="text-[#6f6052] uppercase">DETERMINISTIC FORMULA TRANSPARENCY</span>
                    <span className="text-[#09453d] font-semibold">Arithmetic Verified</span>
                  </div>
                  <p className="text-xs text-[#574539] leading-relaxed font-mono">
                    Average Daily Usage (kWh/day) = Total Period kWh ÷ Number of Elapsed Days in Billing Window
                  </p>
                  <div className="mt-3 pt-3 border-t border-[#e0d9c6] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[#6f6052] block">2024 Baseline Daily:</span>
                      <span className="text-[#21150f] font-semibold text-sm tabular-nums">1,471.0 kWh/d</span>
                    </div>
                    <div>
                      <span className="text-[#6f6052] block">2025 Audit Daily:</span>
                      <span className="text-[#21150f] font-semibold text-sm tabular-nums">1,416.7 kWh/d</span>
                    </div>
                    <div>
                      <span className="text-[#6f6052] block">Daily Usage Change:</span>
                      <span className="text-[#09453d] font-semibold text-sm tabular-nums">-3.69%</span>
                    </div>
                    <div>
                      <span className="text-[#6f6052] block">Net Carbon Saved:</span>
                      <span className="text-[#09453d] font-semibold text-sm tabular-nums">15.25 Tonnes</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f0edde] rounded-xl text-xs text-[#574539] font-sans">
                  <span className="font-semibold text-[#21150f]">Auditor Insight:</span> Notice that while average daily energy consumption dropped by 3.69%, unit electricity utility rates rose from ₹7.85 to ₹8.40 / kWh under DERC tariff revision. GreenLedger prevents confusing financial inflation with energy performance.
                </div>
              </div>
            )}

            {/* 4. Review Flags Preview */}
            {activePreview === 'flags' && (
              <div className="space-y-3">
                {INITIAL_REVIEW_FLAGS.map((flag) => (
                  <div
                    key={flag.id}
                    className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-mono font-bold ${
                            flag.status === 'resolved'
                              ? 'text-[#09453d]'
                              : flag.status === 'reviewed'
                              ? 'text-[#d4b94e]'
                              : 'text-[#960d41]'
                          }`}
                        >
                          {flag.status.toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-[#c8c1af]">·</span>
                        <h4 className="text-sm font-serif font-semibold text-[#21150f]">{flag.title}</h4>
                      </div>
                      <p className="text-xs text-[#574539] mt-1 max-w-xl font-sans font-light">
                        {flag.description}
                      </p>
                    </div>
                    <span className="text-[11px] font-mono text-[#6f6052] shrink-0">
                      Logged {flag.detectedAt}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Green Scorecard Preview */}
            {activePreview === 'scorecard' && (
              <div className="p-6 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4] space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#e0d9c6]">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#09453d] font-semibold">OFFICIAL GREEN SCORECARD</span>
                    <h4 className="text-xl font-serif font-bold text-[#21150f]">
                      {GREEN_SCORECARD_MOCK.institutionName}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#6f6052]">Evidence Coverage:</span>
                    <p className="text-lg font-serif font-semibold text-[#09453d] tabular-nums">
                      {GREEN_SCORECARD_MOCK.evidenceCoveragePercent}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-b border-[#e0d9c6] text-xs font-mono">
                  <div>
                    <span className="text-[#6f6052] block">Electrical Energy:</span>
                    <span className="text-[#09453d] font-bold text-sm">-3.96%</span>
                  </div>
                  <div>
                    <span className="text-[#6f6052] block">Scope 2 CO2e:</span>
                    <span className="text-[#09453d] font-bold text-sm">-15.25 T</span>
                  </div>
                  <div>
                    <span className="text-[#6f6052] block">Utility Cost:</span>
                    <span className="text-[#960d41] font-bold text-sm">+9.02%</span>
                  </div>
                  <div>
                    <span className="text-[#6f6052] block">Verified Documents:</span>
                    <span className="text-[#21150f] font-bold text-sm">11 of 12</span>
                  </div>
                </div>

                <div className="text-xs text-[#6f6052] font-mono flex items-center justify-between pt-2">
                  <span>Emission Factor: India CEA Baseline v19 (0.716 kg/kWh)</span>
                  <button
                    onClick={() => onOpenApp('scorecard')}
                    className="text-[#21150f] font-semibold hover:underline cursor-pointer"
                  >
                    View Complete Signed Scorecard →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
