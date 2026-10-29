import React, { useState } from 'react';
import { UtilityBill, Campus } from '../../types';
import { Upload, Plus, FileText, CheckCircle2, AlertTriangle, Eye, Edit3, X, Check, Search, Filter, Building2 } from 'lucide-react';
import { formatInr, formatTariffRate, formatDateIn } from '../../lib/formatters';
import { DELHI_CAMPUSES } from '../../data/delhiCampuses';

interface EvidenceLibraryViewProps {
  bills: UtilityBill[];
  onUpdateBill: (updatedBill: UtilityBill) => void;
  onAddBill: (newBill: UtilityBill) => void;
  currentCampus?: Campus;
}

export const EvidenceLibraryView: React.FC<EvidenceLibraryViewProps> = ({
  bills,
  onUpdateBill,
  onAddBill,
  currentCampus = DELHI_CAMPUSES[0],
}) => {
  const [selectedBill, setSelectedBill] = useState<UtilityBill | null>(bills[bills.length - 1] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'flagged'>('all');
  const [showManualModal, setShowManualModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UtilityBill>>({});

  // Manual bill creation form state
  const isTPDDL = currentCampus.discom.includes('Tata');
  const prefix = isTPDDL ? 'TPDDL' : 'BRPL';

  const [newInvoiceNumber, setNewInvoiceNumber] = useState(`${prefix}-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [newStartDate, setNewStartDate] = useState('2026-01-01');
  const [newEndDate, setNewEndDate] = useState('2026-01-31');
  const [newKwh, setNewKwh] = useState('46500');
  const [newCost, setNewCost] = useState('458025');
  const [newCaNumber, setNewCaNumber] = useState(`${currentCampus.consumerCaPrefix}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [newSiteName, setNewSiteName] = useState(`${currentCampus.abbreviation} Main Campus Feeder`);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  // Filtering bills
  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.documentFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.accountNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'verified'
        ? b.verificationStatus === 'user_verified'
        : statusFilter === 'unverified'
        ? b.verificationStatus === 'unverified'
        : b.evidenceStatus === 'flagged';
    return matchesSearch && matchesStatus;
  });

  const handleSelectBill = (b: UtilityBill) => {
    setSelectedBill(b);
    setIsEditing(false);
    setEditForm(b);
  };

  const handleStartEdit = () => {
    if (!selectedBill) return;
    setEditForm({ ...selectedBill });
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedBill || !editForm) return;
    const days = Math.max(
      1,
      Math.round(
        (new Date(editForm.endDate || selectedBill.endDate).getTime() -
          new Date(editForm.startDate || selectedBill.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );

    const cost = editForm.totalCostInr || selectedBill.totalCostInr;
    const kwh = editForm.consumptionKwh || selectedBill.consumptionKwh;

    const updated: UtilityBill = {
      ...selectedBill,
      ...editForm,
      daysInPeriod: days,
      ratePerKwh: kwh > 0 ? Math.round((cost / kwh) * 100) / 100 : selectedBill.ratePerKwh,
    };

    onUpdateBill(updated);
    setSelectedBill(updated);
    setIsEditing(false);
  };

  const handleVerifyBill = () => {
    if (!selectedBill) return;
    const verified: UtilityBill = {
      ...selectedBill,
      verificationStatus: 'user_verified',
      verifiedBy: `${currentCampus.abbreviation} Institutional Auditor`,
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      evidenceStatus: 'documented',
    };
    onUpdateBill(verified);
    setSelectedBill(verified);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check for duplicate file name
    const exists = bills.some((b) => b.documentFileName.toLowerCase() === file.name.toLowerCase());
    if (exists) {
      alert(`Warning: A document named "${file.name}" has already been uploaded to this evidence repository.`);
    }

    const randomKwh = 44000 + Math.floor(Math.random() * 8000);
    const avgTariff = 9.85; // ~₹9.85/kWh for Delhi institutional HT tariffs
    const randomCost = Math.round(randomKwh * avgTariff);

    const newBill: UtilityBill = {
      id: `bill-${currentCampus.id}-${Date.now()}`,
      campusId: currentCampus.id,
      invoiceNumber: `${prefix}-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      utilityProvider: currentCampus.discom,
      accountNumber: `${currentCampus.consumerCaPrefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      siteName: `${currentCampus.abbreviation} Campus Grid Feeder`,
      serviceAddress: `${currentCampus.address}, ${currentCampus.city}`,
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      daysInPeriod: 31,
      consumptionKwh: randomKwh,
      peakDemandKw: 139.2,
      totalCostInr: randomCost,
      ratePerKwh: avgTariff,
      currency: 'INR',
      documentFileName: file.name,
      documentFileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'unverified',
      evidenceStatus: 'unverified',
      notes: `Extracted from Delhi ${currentCampus.discom} e-bill PDF. Queued for auditor sign-off.`,
      ocrConfidence: 0.96,
    };

    onAddBill(newBill);
    setSelectedBill(newBill);
    setIsEditing(false);
  };

  const handleCreateManualBill = (e: React.FormEvent) => {
    e.preventDefault();
    const isDup = bills.some((b) => b.invoiceNumber.toLowerCase() === newInvoiceNumber.trim().toLowerCase());
    if (isDup) {
      setDuplicateWarning(`Invoice number "${newInvoiceNumber}" already exists in the ledger!`);
      return;
    }

    const kwhNum = parseFloat(newKwh) || 0;
    const costNum = parseFloat(newCost) || 0;
    const days = Math.max(
      1,
      Math.round(
        (new Date(newEndDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );

    const created: UtilityBill = {
      id: `bill-${currentCampus.id}-${Date.now()}`,
      campusId: currentCampus.id,
      invoiceNumber: newInvoiceNumber.trim(),
      utilityProvider: currentCampus.discom,
      accountNumber: newCaNumber.trim() || currentCampus.consumerCaPrefix,
      siteName: newSiteName.trim() || `${currentCampus.abbreviation} Facilities`,
      serviceAddress: `${currentCampus.address}, ${currentCampus.city}`,
      startDate: newStartDate,
      endDate: newEndDate,
      daysInPeriod: days,
      consumptionKwh: kwhNum,
      peakDemandKw: Math.round(kwhNum / (days * 24) * 2.2),
      totalCostInr: costNum,
      ratePerKwh: kwhNum > 0 ? Math.round((costNum / kwhNum) * 100) / 100 : 9.85,
      currency: 'INR',
      documentFileName: `Delhi_DISCOM_Manual_${newInvoiceNumber}.pdf`,
      documentFileSize: 'Manual Record',
      uploadDate: new Date().toISOString().split('T')[0],
      verificationStatus: 'user_verified',
      verifiedBy: `${currentCampus.abbreviation} Direct Auditor Entry`,
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      evidenceStatus: 'documented',
      notes: `Entered into ${currentCampus.abbreviation} evidence library under DERC Institutional Tariff.`,
      ocrConfidence: 1.0,
    };

    onAddBill(created);
    setSelectedBill(created);
    setShowManualModal(false);
    setDuplicateWarning('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#cfc7b4] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>PRIMARY EVIDENCE CATALOG · {currentCampus.abbreviation}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
            Evidence Library & Utility Invoices
          </h1>
          <p className="text-xs sm:text-sm text-[#574539] mt-1 font-sans font-light">
            Every kilowatt-hour links to a physical Delhi DISCOM utility bill ({currentCampus.discom}).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload DISCOM Bill (PDF)</span>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleFileUpload} />
          </label>

          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-[#21150f] bg-[#fffefa] hover:bg-[#f0edde] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Ingestion</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Filterable Bill Catalog (5 cols) */}
        <div className="lg:col-span-5 bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-xs overflow-hidden flex flex-col">
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-[#cfc7b4] bg-[#f7f4e9] space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#6f6052] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search invoice number, CA, filename..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-sans bg-[#fffefa] border border-[#cfc7b4] rounded-full focus:outline-none focus:border-[#09453d]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
              {(['all', 'verified', 'unverified', 'flagged'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1 rounded-full capitalize whitespace-nowrap cursor-pointer transition-colors ${
                    statusFilter === status
                      ? 'bg-[#21150f] text-white font-semibold'
                      : 'bg-[#fffefa] text-[#574539] border border-[#cfc7b4] hover:bg-[#f0edde]'
                  }`}
                >
                  {status} ({bills.filter((b) => (status === 'all' ? true : status === 'verified' ? b.verificationStatus === 'user_verified' : status === 'unverified' ? b.verificationStatus === 'unverified' : b.evidenceStatus === 'flagged')).length})
                </button>
              ))}
            </div>
          </div>

          {/* Bill List */}
          <div className="divide-y divide-[#e0d9c6] overflow-y-auto max-h-[640px]">
            {filteredBills.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6f6052] font-sans">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#09453d]" />
                <p>No utility bills found matching the current search criteria.</p>
              </div>
            ) : null}

            {filteredBills.map((b) => {
              const isSelected = selectedBill?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBill(b)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#f4f0e5] border-l-4 border-l-[#09453d]' : 'hover:bg-[#fbf9f4]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#21150f]">{b.invoiceNumber}</span>
                      <span className="text-[11px] text-[#6f6052] block font-mono">CA: {b.accountNumber}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                        b.verificationStatus === 'user_verified'
                          ? 'bg-[#e8f1ec] text-[#09453d]'
                          : 'bg-[#fce8ee] text-[#960d41]'
                      }`}
                    >
                      {b.verificationStatus === 'user_verified' ? '✓ Verified' : 'Awaiting Audit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#574539] mt-2 font-sans">
                    <span>
                      {formatDateIn(b.startDate)} → {formatDateIn(b.endDate)}
                    </span>
                    <span className="font-mono font-semibold text-[#21150f] tabular-nums">
                      {b.consumptionKwh.toLocaleString('en-IN')} kWh
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6f6052] font-mono mt-1">
                    <span className="text-[#09453d] font-semibold">{formatInr(b.totalCostInr)}</span>
                    <span>{formatTariffRate(b.ratePerKwh)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Side-by-Side Document Inspection Panel (7 cols) */}
        <div className="lg:col-span-7 bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-xs p-6 md:p-8">
          {selectedBill ? (
            <div className="space-y-6">
              {/* Top Inspection Bar */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#e0d9c6] gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#6f6052] uppercase">
                    <span>Delhi DISCOM Specimen</span>
                    <span>·</span>
                    <span className="text-[#21150f] font-semibold">{selectedBill.invoiceNumber}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#21150f] mt-0.5">
                    {selectedBill.utilityProvider}
                  </h3>
                </div>

                <div className="flex items-center gap-2.5">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleStartEdit}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-sans font-medium text-[#574539] hover:text-[#21150f] bg-[#f0edde] rounded-full border border-[#cfc7b4] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Values</span>
                      </button>

                      {selectedBill.verificationStatus !== 'user_verified' && (
                        <button
                          onClick={handleVerifyBill}
                          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-sans font-medium text-white bg-[#09453d] hover:bg-[#073630] rounded-full transition-colors cursor-pointer shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Sign Off & Verify</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-1.5 text-xs font-sans font-medium text-[#574539] hover:bg-[#e0d9c6] rounded-full cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-5 py-1.5 text-xs font-sans font-medium text-white bg-[#21150f] rounded-full cursor-pointer"
                      >
                        Save Corrections
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Verification Box */}
              <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      selectedBill.verificationStatus === 'user_verified' ? 'text-[#09453d]' : 'text-[#6f6052]'
                    }`}
                  />
                  <span>
                    Status:{' '}
                    <strong className="text-[#21150f]">
                      {selectedBill.verificationStatus === 'user_verified'
                        ? 'Auditor Verified'
                        : 'Awaiting Human Audit'}
                    </strong>
                  </span>
                </div>
                {selectedBill.verifiedBy && (
                  <span className="text-[#574539] text-[11px]">
                    Verified by: {selectedBill.verifiedBy} ({formatDateIn(selectedBill.verifiedAt)})
                  </span>
                )}
              </div>

              {/* Data Extraction Form / Preview */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-[11px] font-mono text-[#6f6052] block">Billing Cycle Start:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.startDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                        className="mt-1 w-full p-1.5 text-xs border rounded-lg bg-white text-[#21150f]"
                      />
                    ) : (
                      <span className="text-base font-serif font-bold text-[#21150f]">
                        {formatDateIn(selectedBill.startDate)}
                      </span>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-[11px] font-mono text-[#6f6052] block">Billing Cycle End:</span>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.endDate || ''}
                        onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                        className="mt-1 w-full p-1.5 text-xs border rounded-lg bg-white text-[#21150f]"
                      />
                    ) : (
                      <span className="text-base font-serif font-bold text-[#21150f]">
                        {formatDateIn(selectedBill.endDate)} ({selectedBill.daysInPeriod} days)
                      </span>
                    )}
                  </div>

                  {/* Consumption kWh */}
                  <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-[11px] font-mono text-[#6f6052] block">Electricity Billed:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.consumptionKwh || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, consumptionKwh: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1 w-full p-1.5 text-xs border rounded-lg bg-white text-[#21150f]"
                      />
                    ) : (
                      <span className="text-lg font-serif font-bold text-[#21150f] tabular-nums">
                        {selectedBill.consumptionKwh.toLocaleString('en-IN')} kWh
                      </span>
                    )}
                  </div>

                  {/* Total Amount in INR */}
                  <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                    <span className="text-[11px] font-mono text-[#6f6052] block">Total Amount Billed (₹ INR):</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="1"
                        value={editForm.totalCostInr || ''}
                        onChange={(e) =>
                          setEditForm({ ...editForm, totalCostInr: parseFloat(e.target.value) || 0 })
                        }
                        className="mt-1 w-full p-1.5 text-xs border rounded-lg bg-white text-[#21150f]"
                      />
                    ) : (
                      <span className="text-lg font-serif font-bold text-[#09453d] tabular-nums">
                        {formatInr(selectedBill.totalCostInr)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Additional Metadata */}
                <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4] text-xs font-mono text-[#574539] space-y-1.5">
                  <p>Consumer CA Number: <strong className="text-[#21150f]">{selectedBill.accountNumber}</strong></p>
                  <p>DISCOM Utility: <strong className="text-[#09453d]">{selectedBill.utilityProvider}</strong></p>
                  <p>Facility: {selectedBill.siteName} — {selectedBill.serviceAddress}</p>
                  <p>Source Document: {selectedBill.documentFileName} ({selectedBill.documentFileSize})</p>
                  {selectedBill.notes && <p className="pt-2 text-[#6f6052]">Auditor Notes: {selectedBill.notes}</p>}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#6f6052]">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#09453d]" />
              <p>Select a Delhi DISCOM utility invoice from the catalog to inspect its verified fields.</p>
            </div>
          )}
        </div>
      </div>

      {/* Manual Ingestion Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] max-w-lg w-full p-6 shadow-xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#e0d9c6]">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#21150f]">
                  Manual Utility Record Ingestion
                </h3>
                <p className="text-xs text-[#574539] font-sans">
                  Target Campus: <strong className="text-[#09453d]">{currentCampus.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-1 text-[#6f6052] hover:text-[#21150f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {duplicateWarning && (
              <div className="mt-4 p-3 bg-[#f8e7ec] border border-[#f2c4d0] rounded-xl text-xs text-[#960d41] font-mono">
                {duplicateWarning}
              </div>
            )}

            <form onSubmit={handleCreateManualBill} className="mt-4 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6f6052] mb-1">Invoice / Bill Number</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceNumber}
                    onChange={(e) => {
                      setNewInvoiceNumber(e.target.value);
                      setDuplicateWarning('');
                    }}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
                <div>
                  <label className="block text-[#6f6052] mb-1">Consumer CA Number</label>
                  <input
                    type="text"
                    required
                    value={newCaNumber}
                    onChange={(e) => setNewCaNumber(e.target.value)}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6f6052] mb-1">Billing Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
                <div>
                  <label className="block text-[#6f6052] mb-1">Billing End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6f6052] mb-1">Electricity (kWh)</label>
                  <input
                    type="number"
                    required
                    value={newKwh}
                    onChange={(e) => setNewKwh(e.target.value)}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
                <div>
                  <label className="block text-[#6f6052] mb-1">Total Bill Cost (₹ INR)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#6f6052] mb-1">Facility Substation / Block</label>
                <input
                  type="text"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                />
              </div>

              <div className="pt-4 border-t border-[#e0d9c6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 text-[#574539] hover:bg-[#f0edde] rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#09453d] hover:bg-[#073630] text-white rounded-full font-sans text-xs font-medium cursor-pointer"
                >
                  Commit to Delhi Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
