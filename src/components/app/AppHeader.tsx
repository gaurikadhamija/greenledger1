import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  BarChart2,
  ShieldAlert,
  Award,
  FileText,
  ArrowLeft,
  Building2,
  ChevronDown,
  Leaf,
  MapPin,
  Github,
} from 'lucide-react';
import { Campus } from '../../types';
import { DELHI_CAMPUSES } from '../../data/delhiCampuses';
import { SubtleLeaf, BotanicalSprig } from '../common/BotanicalLeaf';

export type WorkspaceTab = 'overview' | 'evidence' | 'audit' | 'review' | 'scorecard' | 'reports';

interface AppHeaderProps {
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onReturnToPublic: () => void;
  pendingFlagsCount: number;
  evidenceCoveragePercent: number;
  campuses?: Campus[];
  selectedCampusId?: string;
  onSelectCampus?: (campusId: string) => void;
  onOpenGitHubModal?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeTab,
  onTabChange,
  onReturnToPublic,
  pendingFlagsCount,
  evidenceCoveragePercent,
  campuses = DELHI_CAMPUSES,
  selectedCampusId = 'igdtuw',
  onSelectCampus = () => {},
  onOpenGitHubModal,
}) => {
  const tabs = [
    { id: 'overview' as const, label: 'Overview & Delhi Map', icon: LayoutDashboard },
    { id: 'evidence' as const, label: 'Evidence Library', icon: FileSpreadsheet },
    { id: 'audit' as const, label: 'Energy Audit', icon: BarChart2 },
    { id: 'review' as const, label: 'Review Flags', icon: ShieldAlert, badge: pendingFlagsCount },
    { id: 'scorecard' as const, label: 'Green Scorecard', icon: Award },
    { id: 'reports' as const, label: 'Reports & Settings', icon: FileText },
  ];

  const safeCampuses = campuses && campuses.length > 0 ? campuses : DELHI_CAMPUSES;
  const currentCampus = safeCampuses.find((c) => c.id === selectedCampusId) || safeCampuses[0];

  return (
    <header className="bg-[#fffefa] border-b border-[#cfc7b4] sticky top-0 z-40">
      {/* Top Bar: Operational context & entity */}
      <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between border-b border-[#e0d9c6] text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToPublic}
            className="flex items-center gap-1.5 text-[#574539] hover:text-[#21150f] font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Public Site</span>
          </button>
          <span className="text-[#c8c1af]">|</span>

          {/* Interactive Delhi Campus Switcher Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 text-[#21150f] font-medium bg-[#f0edde] px-2.5 py-1 rounded-md border border-[#cfc7b4] cursor-pointer hover:bg-[#e0d9c6] transition-colors">
              <Building2 className="w-3.5 h-3.5 text-[#09453d]" />
              <span className="font-semibold">{currentCampus ? currentCampus.abbreviation : 'Delhi Campus'}:</span>
              <span className="hidden md:inline text-[#574539] max-w-[200px] truncate">
                {currentCampus?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-[#6f6052] ml-1" />
            </div>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-1 w-72 bg-[#fffefa] border border-[#cfc7b4] rounded-xl shadow-lg p-1.5 hidden group-hover:block z-50">
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase text-[#6f6052] border-b border-[#e0d9c6] font-semibold">
                Switch Delhi Campus Registry
              </div>
              <div className="max-h-60 overflow-y-auto py-1 space-y-0.5">
                {safeCampuses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onSelectCampus(c.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      c.id === selectedCampusId
                        ? 'bg-[#e8f1ec] text-[#09453d] font-semibold'
                        : 'text-[#21150f] hover:bg-[#f4f0e5]'
                    }`}
                  >
                    <div>
                      <div className="font-serif font-semibold">{c.abbreviation}</div>
                      <div className="text-[11px] text-[#574539] truncate max-w-[190px]">{c.name}</div>
                    </div>
                    {c.id === selectedCampusId && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#09453d]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Metrics */}
        <div className="flex items-center gap-4 font-mono text-[11px] text-[#574539]">
          <span className="hidden sm:inline">
            Evidence Coverage:{' '}
            <strong className="text-[#09453d] font-bold">
              {evidenceCoveragePercent !== null && !isNaN(evidenceCoveragePercent)
                ? `${evidenceCoveragePercent}%`
                : '—'}
            </strong>
          </span>
          <span className="hidden sm:inline">
            Audit State:{' '}
            <strong className={pendingFlagsCount > 0 ? 'text-[#960d41] font-bold' : 'text-[#09453d] font-bold'}>
              {pendingFlagsCount > 0 ? `${pendingFlagsCount} Action Required` : 'Verified'}
            </strong>
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] bg-[#e8f1ec] text-[#09453d] px-2 py-0.5 rounded-full font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#09453d]" />
            Asia/Kolkata
          </span>
          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              title="Save to GitHub / Repository Guide"
              className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#f0edde] hover:bg-[#e0d9c6] text-[#21150f] border border-[#cfc7b4] rounded-full text-[10px] font-mono font-semibold transition-colors cursor-pointer"
            >
              <Github className="w-3 h-3 text-[#09453d]" />
              <span>GitHub</span>
            </button>
          )}
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 py-1">
          <div className="flex items-center gap-2 pr-5 font-serif font-semibold text-xl text-[#21150f] shrink-0">
            <span className="w-7 h-7 rounded-full bg-[#e8f1ec] border border-[#09453d]/25 flex items-center justify-center transition-transform hover:scale-105">
              <SubtleLeaf size={16} color="#09453d" />
            </span>
            <span className="tracking-tight flex items-center">
              <span className="font-semibold text-[#09453d] mr-0.5">ग्रीन</span>Ledger
              <span className="ml-1 text-[10px] font-mono font-normal text-[#57927f] border border-[#09453d]/20 px-1.5 py-0.2 rounded-full hidden sm:inline-flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#09453d]" />
                Delhi
              </span>
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-3 text-xs font-sans transition-all cursor-pointer whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'border-[#21150f] text-[#21150f] font-semibold'
                      : 'border-transparent text-[#574539] hover:text-[#21150f] hover:border-[#cfc7b4]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#09453d]' : 'text-[#6f6052]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && tab.badge > 0 ? (
                    <span className="px-1.5 py-0.2 bg-[#960d41] text-white text-[10px] font-mono rounded-full font-bold">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
