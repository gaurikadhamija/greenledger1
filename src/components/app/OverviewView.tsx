import React, { useState } from 'react';
import { UtilityBill, ReviewFlag, AuditComparison, Campus } from '../../types';
import {
  ArrowUpRight,
  ArrowDownRight,
  Upload,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  FileText,
  ChevronRight,
  AlertTriangle,
  Building2,
  PlusCircle,
  FileSpreadsheet,
  Award,
  Sparkles,
  Zap,
} from 'lucide-react';
import { WorkspaceTab } from './AppHeader';
import { DelhiCampusMap } from './DelhiCampusMap';
import { formatInr, formatKwh, formatPercent, formatDateIn } from '../../lib/formatters';
import { SubtleLeaf, BotanicalSprig, BotanicalVineDivider, LeafBadge } from '../common/BotanicalLeaf';

interface OverviewViewProps {
  campuses: Campus[];
  selectedCampus: Campus;
  onSelectCampus: (campusId: string) => void;
  bills: UtilityBill[];
  flags: ReviewFlag[];
  comparison: AuditComparison;
  onNavigateTab: (tab: WorkspaceTab) => void;
  onOpenUploadModal: () => void;
  onOpenAuditCreate?: (campusId: string) => void;
  onSeedSampleAudit?: (campusId: string) => Promise<void>;
  dashboardStats?: {
    registeredCampusesCount: number;
    totalAuditsCount: number;
    totalBillsCount: number;
    verifiedBillsCount: number;
    pendingVerificationCount: number;
    totalKwhVerified: number;
    totalCostInrVerified: number;
    activeFlagsCount: number;
  };
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  campuses,
  selectedCampus,
  onSelectCampus,
  bills,
  flags,
  comparison,
  onNavigateTab,
  onOpenUploadModal,
  onOpenAuditCreate,
  onSeedSampleAudit,
  dashboardStats,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const pendingFlags = flags.filter((f) => f.status === 'pending');
  const verifiedBills = bills.filter((b) => b.verificationStatus === 'user_verified');
  const hasBills = bills.length > 0;

  // Monthly values for SVG consumption chart when real records exist
  const monthlyData = bills.map((b) => ({
    month: b.startDate.substring(5, 7),
    label: new Date(b.startDate).toLocaleDateString('en-IN', { month: 'short' }),
    kwh: b.consumptionKwh,
    costInr: b.totalCostInr,
    invoice: b.invoiceNumber,
    isFlagged: b.evidenceStatus === 'flagged',
    isUnverified: b.verificationStatus === 'unverified',
    days: b.daysInPeriod,
  }));

  const maxKwh = hasBills
    ? Math.max(...monthlyData.map((d) => d.kwh), 1000)
    : 1000;

  const handleSeedQuick = async () => {
    if (!onSeedSampleAudit || isSeeding) return;
    setIsSeeding(true);
    try {
      await onSeedSampleAudit(selectedCampus.id);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Delhi Network Platform Aggregates Bar */}
      <div className="bg-[#fffefa] border border-[#cfc7b4] rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#e0d9c6]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
              <BotanicalSprig size={16} color="#09453d" />
              <span>DELHI CAMPUS SUSTAINABILITY INTELLIGENCE NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#21150f] flex items-center gap-2">
              <span>Institutional Energy Audit Registry</span>
              <SubtleLeaf size={18} color="#2d6a4f" className="hidden sm:inline-block" />
            </h1>
            <p className="text-xs sm:text-sm text-[#574539] mt-0.5 font-sans font-light">
              NCT of Delhi · Active Hub: <strong className="font-semibold text-[#09453d]">{selectedCampus.name}</strong> ({selectedCampus.abbreviation})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('scorecard')}
              className="px-4 py-2 text-xs font-sans font-medium text-[#21150f] bg-[#f0edde] border border-[#cfc7b4] rounded-full hover:bg-[#e0d9c6] transition-colors cursor-pointer"
            >
              View Green Scorecard
            </button>
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Utility Bill PDF</span>
            </button>
          </div>
        </div>

        {/* 5 Macro Network Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4 text-xs font-mono">
          <div className="p-2.5 bg-[#f7f4e9] rounded-xl border border-[#e0d9c6]">
            <span className="text-[#6f6052] block text-[10px] uppercase">Registered Campuses</span>
            <span className="text-xl font-serif font-bold text-[#21150f] block mt-0.5">
              {campuses.length} Universities
            </span>
            <span className="text-[10px] text-[#574539]">IGDTUW, DTU, NSUT, IIIT-D, IITD</span>
          </div>

          <div className="p-2.5 bg-[#f7f4e9] rounded-xl border border-[#e0d9c6]">
            <span className="text-[#6f6052] block text-[10px] uppercase">Stored Audits</span>
            <span className="text-xl font-serif font-bold text-[#21150f] block mt-0.5">
              {dashboardStats ? dashboardStats.totalAuditsCount : (selectedCampus.auditsCount || 0)}
            </span>
            <span className="text-[10px] text-[#09453d] font-semibold">Active Cycle Audits</span>
          </div>

          <div className="p-2.5 bg-[#f7f4e9] rounded-xl border border-[#e0d9c6]">
            <span className="text-[#6f6052] block text-[10px] uppercase">Primary Invoices</span>
            <span className="text-xl font-serif font-bold text-[#21150f] block mt-0.5">
              {dashboardStats ? dashboardStats.totalBillsCount : bills.length} Bills
            </span>
            <span className="text-[10px] text-[#574539]">
              {dashboardStats ? dashboardStats.verifiedBillsCount : verifiedBills.length} Verified
            </span>
          </div>

          <div className="p-2.5 bg-[#f7f4e9] rounded-xl border border-[#e0d9c6]">
            <span className="text-[#6f6052] block text-[10px] uppercase">Audit Flags</span>
            <span className="text-xl font-serif font-bold text-[#960d41] block mt-0.5">
              {dashboardStats ? dashboardStats.activeFlagsCount : pendingFlags.length} Pending
            </span>
            <span className="text-[10px] text-[#6f6052]">Data Quality Triage</span>
          </div>

          <div className="p-2.5 bg-[#e8f1ec] rounded-xl border border-[#09453d]/20 col-span-2 sm:col-span-1">
            <span className="text-[#09453d] block text-[10px] uppercase font-semibold">Delhi Grid Factor</span>
            <span className="text-xl font-serif font-bold text-[#09453d] block mt-0.5">
              0.716
            </span>
            <span className="text-[10px] text-[#57927f]">kg CO₂/kWh (CEA v19)</span>
          </div>
        </div>
      </div>

      {/* Primary Feature: Interactive Delhi Campus Map */}
      <section aria-label="Delhi Campus Map Experience">
        <DelhiCampusMap
          campuses={campuses}
          selectedCampusId={selectedCampus.id}
          onSelectCampus={onSelectCampus}
          onOpenAuditCreate={onOpenAuditCreate}
          onOpenWorkspaceTab={(tab) => onNavigateTab((tab as WorkspaceTab) || 'evidence')}
          onSeedSampleAudit={onSeedSampleAudit}
        />
      </section>

      {/* Aesthetic Botanical Vine Transition */}
      <BotanicalVineDivider label="Institutional Energy Performance" />

      {/* Selected Campus Performance Overview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#09453d]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#21150f]">
                {selectedCampus.name} ({selectedCampus.abbreviation})
              </h2>
            </div>
            <p className="text-xs text-[#574539] font-sans mt-0.5">
              DISCOM: <strong className="font-semibold text-[#09453d]">{selectedCampus.discom}</strong> · Consumer CA Prefix: {selectedCampus.consumerCaPrefix}
            </p>
          </div>

          {!hasBills && (
            <button
              onClick={handleSeedQuick}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono text-[#09453d] bg-[#e8f1ec] hover:bg-[#d5e7de] border border-[#09453d]/30 rounded-full transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#09453d]" />
              <span>{isSeeding ? 'Seeding 12 Months...' : `Load Verified CY 2025 Bills`}</span>
            </button>
          )}
        </div>

        {/* Real KPI Metric Quadrant or Honest Empty State */}
        {hasBills ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Total Electricity (kWh) */}
            <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#cfc7b4] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono text-[#6f6052]">
                <span className="uppercase">Electricity Consumption</span>
                <span className="text-[#09453d] font-semibold">Deterministic</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-serif font-bold text-[#21150f] tabular-nums">
                  {formatKwh(comparison.comparisonPeriod.totalKwh).replace(' kWh', '')}
                </span>
                <span className="text-xs font-mono text-[#574539]">kWh</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <ArrowDownRight className="w-4 h-4 shrink-0" />
                <span>{Math.abs(comparison.kwhDeltaPercent)}% vs baseline</span>
                <span className="text-[#6f6052]">({comparison.kwhDelta.toLocaleString('en-IN')} kWh)</span>
              </div>
            </div>

            {/* Metric 2: Utility Expenditure in INR (₹) */}
            <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#cfc7b4] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono text-[#6f6052]">
                <span className="uppercase">DISCOM Expenditure</span>
                <span className="text-[#09453d] font-semibold">DERC Tariffs</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#21150f] tabular-nums truncate">
                  {formatInr(comparison.comparisonPeriod.totalCostInr)}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#574539]">
                <span>Avg: ₹{(comparison.comparisonPeriod.avgRatePerKwh || 9.85).toFixed(2)}/kWh</span>
                <span className="text-[#6f6052]">· Institutional HT</span>
              </div>
            </div>

            {/* Metric 3: Average Daily Usage */}
            <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#cfc7b4] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono text-[#6f6052]">
                <span className="uppercase">Normalized Daily Load</span>
                <span className="text-[#574539] font-medium">Cycle Adjusted</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-serif font-bold text-[#21150f] tabular-nums">
                  {comparison.comparisonPeriod.avgDailyKwh.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-[#574539]">kWh/day</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <span>{comparison.comparisonPeriod.days} Days Audited</span>
              </div>
            </div>

            {/* Metric 4: Evidence Coverage */}
            <div className="bg-[#fffefa] p-5 rounded-2xl border border-[#cfc7b4] shadow-xs">
              <div className="flex items-center justify-between text-xs font-mono text-[#6f6052]">
                <span className="uppercase">Evidence Coverage</span>
                <span className="text-[#09453d] font-semibold">Assurance</span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-serif font-bold text-[#21150f] tabular-nums">
                  {comparison.evidenceCoveragePercent}%
                </span>
                <span className="text-xs font-mono text-[#574539]">verified</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-[#09453d]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#09453d]" />
                <span>{verifiedBills.length} of {bills.length} primary bills signed</span>
              </div>
            </div>
          </div>
        ) : (
          /* Honest Empty State for Campus Without Audits */
          <div className="bg-[#fffefa] border border-dashed border-[#cfc7b4] rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#f0edde] text-[#09453d] mx-auto flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-serif text-xl sm:text-2xl text-[#21150f] font-semibold">
                No verified audit records available yet for {selectedCampus.abbreviation}.
              </h3>
              <p className="text-xs sm:text-sm text-[#574539] mt-2 font-sans leading-relaxed">
                GreenLedger maintains an immutable primary evidence standard. Metrics are calculated only from verified Delhi utility invoices, avoiding fabricated estimates.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload First Utility Invoice</span>
              </button>
              <button
                onClick={handleSeedQuick}
                disabled={isSeeding}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-medium text-[#21150f] bg-[#f0edde] hover:bg-[#e0d9c6] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#09453d]" />
                <span>{isSeeding ? 'Generating...' : `Load 12-Month Sample DISCOM Bills`}</span>
              </button>
            </div>
          </div>
        )}

        {/* Monthly Consumption Bar Chart (Rendered when bills exist) */}
        {hasBills && (
          <div className="bg-[#fffefa] p-6 rounded-2xl border border-[#cfc7b4] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#cfc7b4] gap-2">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#21150f]">
                  Monthly Consumption & DISCOM Billing Ledger ({selectedCampus.abbreviation})
                </h3>
                <p className="text-xs text-[#574539] font-sans">
                  Deterministic kWh billed per cycle. Hover columns to view extracted invoice numbers and INR charges.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#09453d]">
                  <span className="w-3 h-3 bg-[#09453d] rounded-xs" />
                  <span>Audited Cycle</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#960d41]">
                  <span className="w-3 h-3 bg-[#960d41] rounded-xs" />
                  <span>Unverified Flag</span>
                </span>
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="mt-6 h-56 relative flex items-end justify-between gap-2 px-2 pb-6 border-b border-[#cfc7b4]">
              {monthlyData.map((d, idx) => {
                const heightPct = Math.min(100, (d.kwh / maxKwh) * 100);
                const isHovered = hoveredMonth === idx;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                    className="flex-1 flex flex-col items-center justify-end h-full relative cursor-pointer group"
                  >
                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 z-20 bg-[#21150f] text-white p-2.5 rounded-lg text-xs font-mono shadow-lg min-w-[170px] pointer-events-none">
                        <div className="text-[10px] text-[#eaceaa] uppercase">{d.label} 2025 · {d.invoice}</div>
                        <div className="text-sm font-bold text-white mt-0.5">{d.kwh.toLocaleString('en-IN')} kWh</div>
                        <div className="text-[11px] text-[#57927f] mt-0.5">{formatInr(d.costInr)}</div>
                        <div className="text-[9px] text-[#cfc7b4] mt-1">{d.days} days billing cycle</div>
                      </div>
                    )}

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[42px] rounded-t-sm transition-all duration-300 ${
                        d.isUnverified
                          ? 'bg-[#960d41]'
                          : isHovered
                          ? 'bg-[#073630]'
                          : 'bg-[#09453d]'
                      }`}
                    />

                    {/* Month Label */}
                    <span className="absolute top-full mt-1.5 text-[10px] font-mono text-[#574539]">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality Flags & Action Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Review Flags (2 cols) */}
          <div className="lg:col-span-2 bg-[#fffefa] p-6 rounded-2xl border border-[#cfc7b4] shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#cfc7b4]">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#960d41]" />
                <h3 className="font-serif text-lg font-semibold text-[#21150f]">
                  Active Review Flags ({pendingFlags.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('review')}
                className="text-xs font-sans text-[#09453d] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Flag Audit</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingFlags.length > 0 ? (
              <div className="divide-y divide-[#e0d9c6] mt-2">
                {pendingFlags.slice(0, 3).map((f) => (
                  <div key={f.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded-full bg-[#fce8ee] text-[#960d41]">
                          {f.severity}
                        </span>
                        <span className="text-xs font-serif font-bold text-[#21150f]">{f.title}</span>
                      </div>
                      <p className="text-xs text-[#574539] mt-1 font-sans">{f.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#6f6052] shrink-0 mt-0.5">
                      {f.detectedAt}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#574539] font-sans">
                <CheckCircle2 className="w-6 h-6 text-[#09453d] mx-auto mb-2" />
                <span>All evidence records for {selectedCampus.abbreviation} have been reviewed. Zero pending anomalies.</span>
              </div>
            )}
          </div>

          {/* Institutional Compliance Card */}
          <div className="bg-[#f0edde] p-6 rounded-2xl border border-[#cfc7b4] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#09453d] font-semibold block mb-2">
                GOVERNMENT REGULATORY FRAMEWORK
              </span>
              <h4 className="font-serif text-lg font-semibold text-[#21150f]">
                Delhi Electricity Regulatory Commission (DERC)
              </h4>
              <p className="text-xs text-[#574539] mt-2 leading-relaxed">
                Audits are prepared in accordance with the DERC Tariff Schedule for Non-Domestic / Educational Institutions and the CEA Carbon Accounting Standards.
              </p>
            </div>

            <div className="pt-4 border-t border-[#cfc7b4] space-y-2 text-xs font-mono mt-4">
              <div className="flex justify-between">
                <span className="text-[#6f6052]">Tariff Class:</span>
                <span className="font-semibold text-[#21150f]">HT Institutional (11kV)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f6052]">Emission Baseline:</span>
                <span className="font-semibold text-[#09453d]">0.716 kg CO₂/kWh</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6f6052]">Timezone:</span>
                <span className="font-semibold text-[#21150f]">Asia/Kolkata (IST)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
