import React, { useState } from 'react';
import { UtilityBill, Campus } from '../../types';
import { calculateComparison } from '../../lib/calculations';
import { INDIA_EMISSION_FACTORS, DELHI_CAMPUSES } from '../../data/delhiCampuses';
import { formatInr, formatKwh, formatTariffRate, formatEmissions, formatPercent, formatDateIn } from '../../lib/formatters';
import { Calculator, AlertTriangle, ArrowDownRight, ArrowUpRight, Scale, Info, CheckCircle2, Building2 } from 'lucide-react';

interface EnergyAuditViewProps {
  bills: UtilityBill[];
  currentCampus?: Campus;
}

export const EnergyAuditView: React.FC<EnergyAuditViewProps> = ({
  bills,
  currentCampus = DELHI_CAMPUSES[0],
}) => {
  const [selectedFactorIndex, setSelectedFactorIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState<'full_year' | 'h1' | 'h2'>('full_year');
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const filteredBills =
    selectedRange === 'h1'
      ? bills.slice(0, 6)
      : selectedRange === 'h2'
      ? bills.slice(6)
      : bills;

  const currentFactor = INDIA_EMISSION_FACTORS[selectedFactorIndex] || INDIA_EMISSION_FACTORS[0];

  const comparison = calculateComparison(
    filteredBills,
    undefined,
    currentFactor.factorKgPerKwh,
    currentFactor.name,
    currentCampus.name
  );

  const hasData = bills.length > 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#cfc7b4] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>DETERMINISTIC ENERGY ENGINE · {currentCampus.name} ({currentCampus.abbreviation})</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
            Energy Audit & DERC Tariff Decoupling
          </h1>
          <p className="text-xs sm:text-sm text-[#574539] mt-1 font-light font-sans">
            Examine true thermodynamic consumption (kWh) decoupled from DISCOM billing charges (₹ INR).
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] border border-[#cfc7b4] rounded-full hover:bg-[#f0edde] transition-colors cursor-pointer self-start md:self-auto shadow-2xs"
        >
          <Calculator className="w-3.5 h-3.5 text-[#09453d]" />
          <span>Inspect Formulas</span>
        </button>
      </div>

      {/* Period & Emission Factor Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#fffefa] rounded-2xl border border-[#cfc7b4]">
        {/* Cycle Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-[#6f6052] uppercase">
            Audit Reporting Horizon
          </label>
          <div className="flex items-center gap-2">
            {[
              { id: 'full_year', label: 'Full Year (12 Cycles)' },
              { id: 'h1', label: 'H1 (Apr–Sep / Summer)' },
              { id: 'h2', label: 'H2 (Oct–Mar / Winter)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRange(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer ${
                  selectedRange === tab.id
                    ? 'bg-[#21150f] text-white font-semibold'
                    : 'bg-[#f7f4e9] text-[#574539] hover:bg-[#f0edde]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CEA Grid Emission Factor Model */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-[#6f6052] uppercase">
            India Grid Carbon Factor
          </label>
          <select
            value={selectedFactorIndex}
            onChange={(e) => setSelectedFactorIndex(parseInt(e.target.value, 10))}
            className="w-full p-2 text-xs font-mono bg-[#f7f4e9] border border-[#cfc7b4] rounded-lg text-[#21150f] focus:outline-none focus:border-[#09453d]"
          >
            {INDIA_EMISSION_FACTORS.map((f, idx) => (
              <option key={f.id} value={idx}>
                {f.name} ({f.factorKgPerKwh} kg/kWh)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Mathematical Audit Ledger */}
      {hasData ? (
        <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#e0d9c6] bg-[#f7f4e9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#09453d] font-semibold">
                AUDIT COMPARISON MATRIX
              </span>
              <h3 className="font-serif text-lg font-semibold text-[#21150f]">
                {comparison.comparisonPeriod.name} vs {comparison.baselinePeriod.name}
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-[#e8f1ec] text-[#09453d] rounded-full font-semibold">
              DERC Institutional HT Tariff
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#f0edde] text-[#6f6052] font-mono uppercase text-[11px] border-b border-[#cfc7b4]">
                <tr>
                  <th className="p-4">Thermodynamic Metric</th>
                  <th className="p-4">Baseline Cycle</th>
                  <th className="p-4">Current Cycle</th>
                  <th className="p-4">Absolute Delta</th>
                  <th className="p-4 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0d9c6]">
                {/* Row 1: Electricity Consumption */}
                <tr className="hover:bg-[#f7f4e9]">
                  <td className="p-4 font-medium text-[#21150f]">
                    <div>Total Electrical Energy (kWh)</div>
                    <div className="text-[10px] text-[#6f6052] font-mono">Utility meter read sum</div>
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {comparison.baselinePeriod.totalKwh.toLocaleString('en-IN')} kWh
                  </td>
                  <td className="p-4 font-mono font-bold text-[#21150f] tabular-nums">
                    {comparison.comparisonPeriod.totalKwh.toLocaleString('en-IN')} kWh
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#09453d]">
                    {comparison.kwhDelta.toLocaleString('en-IN')} kWh
                  </td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-[#09453d]">
                    {formatPercent(comparison.kwhDeltaPercent)}
                  </td>
                </tr>

                {/* Row 2: Normalized Daily Load */}
                <tr className="hover:bg-[#f7f4e9]">
                  <td className="p-4 font-medium text-[#21150f]">
                    <div>Average Daily Usage (kWh/day)</div>
                    <div className="text-[10px] text-[#6f6052] font-mono">Normalizes 28 vs 33-day cycles</div>
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {comparison.baselinePeriod.avgDailyKwh.toLocaleString('en-IN')} kWh/d
                  </td>
                  <td className="p-4 font-mono font-bold text-[#21150f] tabular-nums">
                    {comparison.comparisonPeriod.avgDailyKwh.toLocaleString('en-IN')} kWh/d
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#09453d]">
                    {comparison.dailyKwhDelta > 0 ? '+' : ''}{comparison.dailyKwhDelta} kWh/d
                  </td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-[#09453d]">
                    {formatPercent(comparison.dailyKwhDeltaPercent)}
                  </td>
                </tr>

                {/* Row 3: Total Cost in INR */}
                <tr className="hover:bg-[#f7f4e9]">
                  <td className="p-4 font-medium text-[#21150f]">
                    <div>Total DISCOM Charges (₹ INR)</div>
                    <div className="text-[10px] text-[#6f6052] font-mono">Billed utility expenditure in Indian Rupees</div>
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {formatInr(comparison.baselinePeriod.totalCostInr)}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#21150f] tabular-nums">
                    {formatInr(comparison.comparisonPeriod.totalCostInr)}
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {formatInr(comparison.costDelta)}
                  </td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-[#574539]">
                    {formatPercent(comparison.costDeltaPercent)}
                  </td>
                </tr>

                {/* Row 4: Average Unit Rate */}
                <tr className="hover:bg-[#f7f4e9]">
                  <td className="p-4 font-medium text-[#21150f]">
                    <div>Effective Tariff Rate (₹/kWh)</div>
                    <div className="text-[10px] text-[#6f6052] font-mono">Blended energy + fixed demand charges</div>
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {formatTariffRate(comparison.baselinePeriod.avgRatePerKwh)}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#21150f] tabular-nums">
                    {formatTariffRate(comparison.comparisonPeriod.avgRatePerKwh)}
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    ₹{(comparison.comparisonPeriod.avgRatePerKwh - comparison.baselinePeriod.avgRatePerKwh).toFixed(2)}/kWh
                  </td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-[#574539]">
                    {comparison.baselinePeriod.avgRatePerKwh > 0
                      ? formatPercent(
                          ((comparison.comparisonPeriod.avgRatePerKwh - comparison.baselinePeriod.avgRatePerKwh) /
                            comparison.baselinePeriod.avgRatePerKwh) *
                            100
                        )
                      : '0.0%'}
                  </td>
                </tr>

                {/* Row 5: Documented GHG Emissions */}
                <tr className="hover:bg-[#f7f4e9] bg-[#e8f1ec]/40">
                  <td className="p-4 font-medium text-[#21150f]">
                    <div>Scope 2 Greenhouse Gas Emissions</div>
                    <div className="text-[10px] text-[#09453d] font-mono font-semibold">
                      Based on {currentFactor.name.split('—')[0]} ({currentFactor.factorKgPerKwh} kg/kWh)
                    </div>
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#574539]">
                    {formatEmissions(comparison.emissionsBaselineTonsCo2e)}
                  </td>
                  <td className="p-4 font-mono font-bold text-[#09453d] tabular-nums">
                    {formatEmissions(comparison.emissionsComparisonTonsCo2e)}
                  </td>
                  <td className="p-4 font-mono tabular-nums text-[#09453d]">
                    {formatEmissions(comparison.emissionsDeltaTonsCo2e)}
                  </td>
                  <td className="p-4 text-right font-mono font-bold tabular-nums text-[#09453d]">
                    {formatPercent(comparison.kwhDeltaPercent)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#fffefa] border border-dashed border-[#cfc7b4] rounded-2xl p-10 text-center space-y-3">
          <Scale className="w-8 h-8 text-[#09453d] mx-auto opacity-70" />
          <h3 className="font-serif text-xl font-semibold text-[#21150f]">
            No verified audit records available yet for {currentCampus.abbreviation}.
          </h3>
          <p className="text-xs text-[#574539] max-w-sm mx-auto">
            Upload Delhi DISCOM bills in the Evidence Library or load sample records to generate the deterministic audit comparison.
          </p>
        </div>
      )}

      {/* Methodology Citation Box */}
      <div className="p-5 bg-[#f0edde] rounded-2xl border border-[#cfc7b4] text-xs font-mono text-[#574539] space-y-2">
        <div className="flex items-center gap-2 text-[#09453d] font-semibold">
          <Info className="w-4 h-4" />
          <span>OFFICIAL INDIAN REGULATORY CITATIONS</span>
        </div>
        <p>• {currentFactor.citation}</p>
        <p>
          • Delhi Electricity Regulatory Commission (DERC) Multi-Year Tariff (MYT) Order for Non-Domestic / Institutional Consumers.
        </p>
      </div>

      {/* Formula Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] max-w-xl w-full p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0d9c6]">
              <h3 className="text-xl font-serif font-bold text-[#21150f]">
                Deterministic Audit Formulas
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-xs font-mono px-3 py-1 rounded-full bg-[#f0edde] text-[#21150f] hover:bg-[#e0d9c6]"
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs font-mono text-[#21150f]">
              <div className="p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                <span className="font-bold block text-[#09453d]">Scope 2 Emissions (t CO₂e):</span>
                <code className="text-[#960d41] block mt-1">
                  Emissions = (Total kWh × CEA_Factor_kg_per_kWh) / 1,000
                </code>
              </div>

              <div className="p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                <span className="font-bold block text-[#09453d]">Average Daily Consumption:</span>
                <code className="text-[#960d41] block mt-1">
                  Avg Daily kWh = Total Billed kWh / Total Days in Billing Periods
                </code>
              </div>

              <div className="p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                <span className="font-bold block text-[#09453d]">Effective Tariff Rate:</span>
                <code className="text-[#960d41] block mt-1">
                  Rate (₹/kWh) = Total Billed DISCOM Cost (₹) / Total kWh Billed
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
