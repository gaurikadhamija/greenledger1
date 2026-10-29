import React, { useState } from 'react';
import { UtilityBill, ReviewFlag, GreenScorecardData, Campus } from '../../types';
import { generateLiveScorecard } from '../../lib/calculations';
import { INDIA_EMISSION_FACTORS, DELHI_CAMPUSES } from '../../data/delhiCampuses';
import { formatInr, formatKwh, formatEmissions, formatPercent, formatDateIn } from '../../lib/formatters';
import { Printer, Download, CheckCircle2, ShieldCheck, FileText, ArrowRight, Share2, Check, Building2, Leaf } from 'lucide-react';
import { SubtleLeaf, BotanicalSprig, LeafCornerAccent } from '../common/BotanicalLeaf';

interface GreenScorecardViewProps {
  bills: UtilityBill[];
  flags: ReviewFlag[];
  currentCampus?: Campus;
}

export const GreenScorecardView: React.FC<GreenScorecardViewProps> = ({
  bills,
  flags,
  currentCampus = DELHI_CAMPUSES[0],
}) => {
  const [selectedFactorIndex, setSelectedFactorIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const factor = INDIA_EMISSION_FACTORS[selectedFactorIndex] || INDIA_EMISSION_FACTORS[0];

  // Generate live, deterministic scorecard for selected Delhi campus
  const scorecard = generateLiveScorecard(bills, flags, currentCampus, factor.factorKgPerKwh, factor.name);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const exportData = {
      scorecard,
      campus: {
        id: currentCampus.id,
        name: currentCampus.name,
        abbreviation: currentCampus.abbreviation,
        discom: currentCampus.discom,
        coordinates: currentCampus.coordinates,
      },
      billsAuditSummary: bills.map((b) => ({
        invoiceNumber: b.invoiceNumber,
        utilityProvider: b.utilityProvider,
        accountNumber: b.accountNumber,
        startDate: b.startDate,
        endDate: b.endDate,
        days: b.daysInPeriod,
        consumptionKwh: b.consumptionKwh,
        totalCostInr: b.totalCostInr,
        verificationStatus: b.verificationStatus,
        verifiedBy: b.verifiedBy,
      })),
      auditFlags: flags.map((f) => ({
        id: f.id,
        type: f.type,
        title: f.title,
        status: f.status,
        reviewerNotes: f.reviewerNotes,
      })),
      exportTimestamp: new Date().toISOString(),
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      assuranceStandard: 'GreenLedger India Institutional Energy Audit Protocol v3.2',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GreenScorecard_${currentCampus.abbreviation}_${new Date().getFullYear()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const hasBills = bills.length > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#cfc7b4] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>OFFICIAL SCORECARD SPECIMEN · {currentCampus.name} ({currentCampus.abbreviation})</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
            The Green Scorecard
          </h1>
          <p className="text-xs sm:text-sm text-[#574539] mt-1 font-light font-sans">
            Evidence-linked institutional statement of energy performance & Scope 2 greenhouse gas emissions.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCopyShare}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] border border-[#cfc7b4] rounded-full hover:bg-[#f0edde] transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#09453d]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share Audit'}</span>
          </button>
          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] border border-[#cfc7b4] rounded-full hover:bg-[#f0edde] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Evidence JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Scorecard</span>
          </button>
        </div>
      </div>

      {/* Grid Factor Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#fffefa] border border-[#cfc7b4] rounded-2xl gap-3">
        <div className="text-xs font-mono text-[#574539]">
          <span className="font-semibold text-[#21150f]">Carbon Accounting Model:</span>{' '}
          <span>Select certified factor to update Scope 2 calculations</span>
        </div>
        <div className="flex items-center gap-2">
          {INDIA_EMISSION_FACTORS.map((f, idx) => (
            <button
              key={f.id}
              onClick={() => setSelectedFactorIndex(idx)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                selectedFactorIndex === idx
                  ? 'bg-[#09453d] text-white font-semibold'
                  : 'bg-[#f7f4e9] text-[#574539] hover:bg-[#f0edde]'
              }`}
            >
              {f.id === 'cea-baseline-v19' ? 'CEA National (0.716)' : f.id === 'northern-regional-grid' ? 'Northern Grid (0.742)' : 'Delhi Solar Offset (0.820)'}
            </button>
          ))}
        </div>
      </div>

      {/* Official Scorecard Paper Container with Aesthetic Botanical Accents (Print-optimized) */}
      <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-sm p-8 sm:p-12 print:border-none print:shadow-none print:p-0 relative overflow-hidden">
        <LeafCornerAccent position="top-right" className="absolute top-3 right-3 hidden sm:block" />
        <LeafCornerAccent position="bottom-left" className="absolute bottom-3 left-3 hidden sm:block" />

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-8 border-b-2 border-[#21150f] gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-bold tracking-widest uppercase">
              <SubtleLeaf size={15} color="#09453d" />
              <span>GREENLEDGER CERTIFIED DISCLOSURE SPECIMEN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f] mt-2">
              {scorecard.institutionName}
            </h2>
            <p className="text-xs sm:text-sm text-[#574539] font-sans mt-1">
              Facility Scope: {scorecard.facilityScope}
            </p>
          </div>

          <div className="text-right sm:text-right font-mono text-xs text-[#574539] shrink-0">
            <div>Audit Period: <strong className="text-[#21150f]">{scorecard.reportingPeriod}</strong></div>
            <div>Issued Date: <strong className="text-[#21150f]">{scorecard.generationDate}</strong></div>
            <div className="text-[11px] text-[#6f6052] mt-1">{scorecard.auditorOrganization}</div>
          </div>
        </div>

        {/* Assurance Seal Strip */}
        <div className="py-6 border-b border-[#e0d9c6] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#f7f4e9]/50 -mx-8 px-8 sm:-mx-12 sm:px-12">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              {/* SVG Laurel Leaf Wreath */}
              <svg viewBox="0 0 80 80" fill="none" className="absolute inset-0 w-full h-full text-[#09453d] opacity-80">
                <path d="M 40 72 C 22 72 10 56 12 38 C 14 24 24 14 36 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 22 66 C 18 64 14 68 18 72 C 20 70 24 68 22 66 Z" fill="currentColor" />
                <path d="M 14 54 C 10 52 8 57 12 60 C 14 58 17 55 14 54 Z" fill="currentColor" />
                <path d="M 12 40 C 8 38 6 43 10 46 C 12 44 15 41 12 40 Z" fill="currentColor" />
                <path d="M 16 26 C 12 24 11 29 15 32 C 17 30 19 27 16 26 Z" fill="currentColor" />
                <path d="M 24 16 C 20 14 20 19 24 21 C 26 19 27 16 24 16 Z" fill="currentColor" />
                <path d="M 40 72 C 58 72 70 56 68 38 C 66 24 56 14 44 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M 58 66 C 62 64 66 68 62 72 C 60 70 56 68 58 66 Z" fill="currentColor" />
                <path d="M 66 54 C 70 52 72 57 68 60 C 66 58 63 55 66 54 Z" fill="currentColor" />
                <path d="M 68 40 C 72 38 74 43 70 46 C 68 44 65 41 68 40 Z" fill="currentColor" />
                <path d="M 64 26 C 68 24 69 29 65 32 C 63 30 61 27 64 26 Z" fill="currentColor" />
                <path d="M 56 16 C 60 14 60 19 56 21 C 54 19 53 16 56 16 Z" fill="currentColor" />
              </svg>
              <div className="w-13 h-13 rounded-full bg-[#f0edde] border border-[#cfc7b4] flex flex-col items-center justify-center relative z-10 shadow-2xs">
                <span className="font-serif font-bold text-sm text-[#09453d] tabular-nums leading-none">
                  {hasBills ? `${scorecard.evidenceCoveragePercent}%` : '—'}
                </span>
                <span className="text-[8px] font-mono uppercase text-[#6f6052] mt-0.5 font-semibold">Coverage</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-serif font-semibold text-[#21150f]">
                {hasBills && scorecard.evidenceCoveragePercent >= 90
                  ? 'High Evidentiary Assurance Level'
                  : hasBills
                  ? 'Active Partial Evidence Coverage'
                  : 'Awaiting Initial Audit Evidence'}
              </h4>
              <p className="text-xs text-[#574539] font-sans">
                {scorecard.verifiedBillsCount} of {scorecard.totalBillsCount} billing cycles backed by signed Delhi DISCOM bills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-[#6f6052] block">Review Flags:</span>
              <span className="text-[#09453d] font-semibold">{scorecard.resolvedReviewFlagsCount} Resolved</span>{' '}
              / <span className="text-[#960d41]">{scorecard.activeReviewFlagsCount} Pending</span>
            </div>
            <div>
              <span className="text-[#6f6052] block">Calculation Method:</span>
              <span className="text-[#21150f] font-semibold">Deterministic V3 (DERC)</span>
            </div>
          </div>
        </div>

        {/* 4 Core Summary Metrics */}
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-[#e0d9c6]">
          {/* Card 1: Billed Energy */}
          <div>
            <span className="text-xs font-mono uppercase text-[#6f6052] block">Total Billed Electricity</span>
            <div className="text-3xl font-serif font-bold text-[#21150f] mt-1 tabular-nums">
              {hasBills ? `${scorecard.kwhCurrent.toLocaleString('en-IN')} kWh` : '—'}
            </div>
            <div className="text-xs font-mono text-[#09453d] mt-1">
              {hasBills ? `${formatPercent(scorecard.kwhDeltaPercent)} vs comparison baseline` : 'No baseline recorded'}
            </div>
          </div>

          {/* Card 2: DISCOM Expenditure in INR */}
          <div>
            <span className="text-xs font-mono uppercase text-[#6f6052] block">DISCOM Expenditure (₹ INR)</span>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#21150f] mt-1 tabular-nums truncate">
              {hasBills ? formatInr(scorecard.costCurrent) : '—'}
            </div>
            <div className="text-xs font-mono text-[#574539] mt-1">
              {hasBills ? `₹${(scorecard.costCurrent / scorecard.kwhCurrent || 9.85).toFixed(2)}/kWh blended` : 'Tariff pending'}
            </div>
          </div>

          {/* Card 3: Daily Load */}
          <div>
            <span className="text-xs font-mono uppercase text-[#6f6052] block">Average Daily Load</span>
            <div className="text-3xl font-serif font-bold text-[#21150f] mt-1 tabular-nums">
              {hasBills ? `${scorecard.avgDailyKwhCurrent.toLocaleString('en-IN')} kWh/d` : '—'}
            </div>
            <div className="text-xs font-mono text-[#574539] mt-1">
              Normalizes leap days & cycle length
            </div>
          </div>

          {/* Card 4: Scope 2 Carbon */}
          <div>
            <span className="text-xs font-mono uppercase text-[#6f6052] block">Scope 2 Carbon Impact</span>
            <div className="text-3xl font-serif font-bold text-[#09453d] mt-1 tabular-nums">
              {hasBills ? formatEmissions(scorecard.emissionsCurrentTonsCo2e) : '—'}
            </div>
            <div className="text-xs font-mono text-[#09453d] mt-1">
              {hasBills ? `${formatEmissions(scorecard.emissionsDeltaTonsCo2e)} net change` : 'Pending evidence'}
            </div>
          </div>
        </div>

        {/* Audited Bill Evidence Line Items */}
        {hasBills && (
          <div className="py-8 border-b border-[#e0d9c6]">
            <h3 className="text-xs font-mono uppercase tracking-widest text-[#6f6052] mb-4">
              Verified Primary Utility Invoices ({bills.length} Cycles)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="border-b border-[#cfc7b4] text-[11px] font-mono uppercase text-[#6f6052]">
                    <th className="p-2.5">Invoice / Bill #</th>
                    <th className="p-2.5">Billing Window</th>
                    <th className="p-2.5 text-right">Days</th>
                    <th className="p-2.5 text-right">kWh Billed</th>
                    <th className="p-2.5 text-right">Total (₹ INR)</th>
                    <th className="p-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0d9c6]">
                  {bills.map((b) => (
                    <tr key={b.id} className="text-xs hover:bg-[#f7f4e9]">
                      <td className="p-2.5 font-mono font-medium text-[#21150f]">{b.invoiceNumber}</td>
                      <td className="p-2.5 text-[#574539]">
                        {formatDateIn(b.startDate)} to {formatDateIn(b.endDate)}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#574539]">{b.daysInPeriod}</td>
                      <td className="p-2.5 text-right font-mono font-medium text-[#21150f] tabular-nums">
                        {b.consumptionKwh.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-[#09453d] tabular-nums">
                        {formatInr(b.totalCostInr)}
                      </td>
                      <td className="p-2.5 text-center">
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

        {/* Prioritized Recommended Actions */}
        <div className="py-8 border-b border-[#e0d9c6]">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#6f6052] mb-4">
            Auditor Recommended Action Roadmap ({currentCampus.abbreviation})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scorecard.recommendedActions.map((act, i) => (
              <div key={i} className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#960d41]">
                    {act.priority}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#09453d]" />
                </div>
                <h4 className="font-serif font-bold text-sm text-[#21150f]">{act.title}</h4>
                <p className="text-xs text-[#574539] mt-1.5 font-sans leading-relaxed">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions & Regulatory Methodological Disclosures */}
        <div className="pt-8">
          <h3 className="text-xs font-mono uppercase tracking-widest text-[#6f6052] mb-3">
            Assumptions, Limitations & Government Disclosures
          </h3>
          <ul className="space-y-1.5 text-xs text-[#574539] font-sans list-disc list-inside">
            {scorecard.assumptionsAndLimitations.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
