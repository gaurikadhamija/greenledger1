import React, { useState } from 'react';
import { ReviewFlag } from '../../types';
import { ShieldAlert, CheckCircle2, AlertCircle, MessageSquare, Clock, Filter, Check, ArrowRight } from 'lucide-react';

import { Campus } from '../../types';
import { DELHI_CAMPUSES } from '../../data/delhiCampuses';

interface ReviewFlagsViewProps {
  flags: ReviewFlag[];
  onUpdateFlag: (updatedFlag: ReviewFlag) => void;
  onNavigateToBill?: (billId: string) => void;
  currentCampus?: Campus;
}

export const ReviewFlagsView: React.FC<ReviewFlagsViewProps> = ({
  flags,
  onUpdateFlag,
  onNavigateToBill,
  currentCampus = DELHI_CAMPUSES[0],
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string>(flags[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [noteInput, setNoteInput] = useState('');

  const activeFlag = flags.find((f) => f.id === selectedFlagId) || flags[0];

  const filteredFlags = flags.filter((f) => {
    if (statusFilter === 'all') return true;
    return f.status === statusFilter;
  });

  const handleSaveNote = () => {
    if (!activeFlag || !noteInput.trim()) return;
    const updated: ReviewFlag = {
      ...activeFlag,
      reviewerNotes: noteInput.trim(),
      status: activeFlag.status === 'pending' ? 'reviewed' : activeFlag.status,
    };
    onUpdateFlag(updated);
    setNoteInput('');
  };

  const handleSetStatus = (newStatus: 'pending' | 'reviewed' | 'resolved') => {
    if (!activeFlag) return;
    const updated: ReviewFlag = {
      ...activeFlag,
      status: newStatus,
      resolvedAt: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : activeFlag.resolvedAt,
    };
    onUpdateFlag(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#cfc7b4] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
            <span>AUDIT INTEGRITY ENGINE · {currentCampus.name} ({currentCampus.abbreviation})</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
            Intelligent Review Flags
          </h1>
          <p className="text-xs sm:text-sm text-[#574539] mt-1 font-light font-sans">
            Explainable notifications alerting you to duplicate entries, DERC tariff shifts, and unusual meter variances for {currentCampus.abbreviation}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-[#fffefa] rounded-full border border-[#cfc7b4] text-xs font-mono self-start sm:self-auto">
          {(['all', 'pending', 'reviewed', 'resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full capitalize transition-colors cursor-pointer ${
                statusFilter === s
                  ? 'bg-[#21150f] text-white font-medium'
                  : 'text-[#574539] hover:text-[#21150f]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Flags Master-Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Flag Items List (5 cols) */}
        <div className="lg:col-span-5 bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#f7f4e9] border-b border-[#cfc7b4] flex items-center justify-between text-xs font-mono text-[#574539]">
            <span>{filteredFlags.length} Integrity Flags</span>
            <span>Severity Indexed</span>
          </div>

          <div className="divide-y divide-[#e0d9c6] max-h-[580px] overflow-y-auto">
            {filteredFlags.map((flag) => {
              const isSelected = activeFlag?.id === flag.id;
              return (
                <div
                  key={flag.id}
                  onClick={() => {
                    setSelectedFlagId(flag.id);
                    setNoteInput('');
                  }}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#f0edde] border-l-4 border-l-[#960d41]'
                      : 'hover:bg-[#f7f4e9]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span
                      className={`font-semibold uppercase text-[10px] px-2.5 py-0.5 rounded-full ${
                        flag.severity === 'critical'
                          ? 'bg-[#f8e7ec] text-[#960d41]'
                          : flag.severity === 'warning'
                          ? 'bg-[#f4f0e5] text-[#d4b94e]'
                          : 'bg-[#e8f1ec] text-[#09453d]'
                      }`}
                    >
                      {flag.severity} · {flag.type.replace('_', ' ')}
                    </span>
                    <span className="text-[#6f6052]">{flag.detectedAt}</span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-[#21150f] mt-1">
                    {flag.title}
                  </h4>

                  <p className="text-xs text-[#574539] line-clamp-2 mt-1 font-sans font-light">
                    {flag.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#e0d9c6] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#6f6052]">
                      Invoice: {flag.invoiceNumber || 'Batch Check'}
                    </span>
                    <span
                      className={`font-bold ${
                        flag.status === 'resolved'
                          ? 'text-[#09453d]'
                          : flag.status === 'reviewed'
                          ? 'text-[#d4b94e]'
                          : 'text-[#960d41]'
                      }`}
                    >
                      Status: {flag.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Flag Detail & Auditor Action Box (7 cols) */}
        <div className="lg:col-span-7 bg-[#fffefa] rounded-2xl border border-[#cfc7b4] shadow-xs p-6 md:p-8">
          {activeFlag ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#e0d9c6] gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#6f6052] uppercase">
                    <span>FLAG ID: {activeFlag.id}</span>
                    <span>·</span>
                    <span className="text-[#960d41] font-bold">{activeFlag.type.toUpperCase()}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#21150f] mt-1">
                    {activeFlag.title}
                  </h3>
                </div>

                {/* Status Toggles */}
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <button
                    onClick={() => handleSetStatus('pending')}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                      activeFlag.status === 'pending'
                        ? 'bg-[#960d41] text-white font-medium'
                        : 'bg-[#f0edde] text-[#574539] hover:bg-[#e0d9c6]'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleSetStatus('reviewed')}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                      activeFlag.status === 'reviewed'
                        ? 'bg-[#d4b94e] text-white font-medium'
                        : 'bg-[#f0edde] text-[#574539] hover:bg-[#e0d9c6]'
                    }`}
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => handleSetStatus('resolved')}
                    className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                      activeFlag.status === 'resolved'
                        ? 'bg-[#09453d] text-white font-medium'
                        : 'bg-[#f0edde] text-[#574539] hover:bg-[#e0d9c6]'
                    }`}
                  >
                    Resolved ✓
                  </button>
                </div>
              </div>

              {/* Objective Explanation */}
              <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4] space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#6f6052]">
                  Flag Investigation Details:
                </span>
                <p className="text-sm text-[#21150f] leading-relaxed font-sans font-light">
                  {activeFlag.description}
                </p>
                <div className="pt-2 text-xs font-mono text-[#574539]">
                  Associated Evidence: <strong>{activeFlag.invoiceNumber || 'Facility Account'}</strong>
                </div>
              </div>

              {/* Reviewer Notes & Explanation Thread */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#6f6052]">
                  <span>Auditor Rationale & Evidence Notes:</span>
                  <span>Appended to Official Audit Trail</span>
                </div>

                {activeFlag.reviewerNotes ? (
                  <div className="p-4 bg-[#f0edde] rounded-xl border border-[#cfc7b4] text-xs font-sans text-[#21150f]">
                    <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-[#574539]">
                      <MessageSquare className="w-3.5 h-3.5 text-[#09453d]" />
                      <span>Existing Auditor Note:</span>
                    </div>
                    <p className="leading-relaxed font-light">{activeFlag.reviewerNotes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-[#6f6052] font-mono italic">
                    No notes recorded yet. Add an explanatory justification below.
                  </p>
                )}

                <div className="space-y-2 pt-2">
                  <textarea
                    rows={3}
                    placeholder="Document facilities reason, meter calibration record, or equipment maintenance log..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full p-3 text-xs bg-[#f7f4e9] border border-[#cfc7b4] rounded-xl focus:outline-none focus:border-[#21150f] text-[#21150f] font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      disabled={!noteInput.trim()}
                      className="px-5 py-2 bg-[#21150f] hover:bg-[#34150f] disabled:opacity-40 text-white rounded-full text-xs font-sans font-medium cursor-pointer"
                    >
                      Save Auditor Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Guiding Principle footer note */}
              <div className="pt-4 border-t border-[#e0d9c6] text-[11px] font-mono text-[#6f6052]">
                Assurance Policy: Flags identify variance conditions for scientific inquiry. They are never published as accusations in external reports.
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#6f6052]">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Select a flag to examine its details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
