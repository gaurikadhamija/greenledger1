import React, { useState, useEffect, useCallback } from 'react';
import { Campus, UtilityBill, ReviewFlag, AuditComparison, GreenScorecardData } from './types';
import { DELHI_CAMPUSES, INDIA_EMISSION_FACTORS } from './data/delhiCampuses';
import { INITIAL_BILLS, INITIAL_REVIEW_FLAGS, HISTORICAL_BASELINE_DATA } from './data/mockData';
import { calculateComparison, runReviewFlagAudit, generateLiveScorecard } from './lib/calculations';
import { api, DashboardStats } from './lib/api';

// Public Components
import { PublicNavbar } from './components/public/PublicNavbar';
import { HeroSection } from './components/public/HeroSection';
import { ProblemSection } from './components/public/ProblemSection';
import { InteractiveQuestionsSection } from './components/public/InteractiveQuestionsSection';
import { MovingCrowdSection } from './components/public/MovingCrowdSection';
import { WorkflowSection } from './components/public/WorkflowSection';
import { CapabilitiesSection } from './components/public/CapabilitiesSection';
import { ProductPreviewsSection } from './components/public/ProductPreviewsSection';
import { TrustMethodologySection } from './components/public/TrustMethodologySection';
import { SampleScorecardSection } from './components/public/SampleScorecardSection';
import { FaqSection } from './components/public/FaqSection';
import { ClosingCtaFooter } from './components/public/ClosingCtaFooter';

// App Workspace Components
import { AppHeader, WorkspaceTab } from './components/app/AppHeader';
import { OverviewView } from './components/app/OverviewView';
import { EvidenceLibraryView } from './components/app/EvidenceLibraryView';
import { EnergyAuditView } from './components/app/EnergyAuditView';
import { ReviewFlagsView } from './components/app/ReviewFlagsView';
import { GreenScorecardView } from './components/app/GreenScorecardView';
import { ReportsSettingsView } from './components/app/ReportsSettingsView';
import { SaveToGitHubModal } from './components/common/SaveToGitHubModal';

export default function App() {
  // Navigation State
  const [viewMode, setViewMode] = useState<'public' | 'app'>('public');
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('overview');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  // Campus Registry State
  const [campuses, setCampuses] = useState<Campus[]>(DELHI_CAMPUSES);
  const [selectedCampusId, setSelectedCampusId] = useState<string>('igdtuw');

  // Application Data State
  const [bills, setBills] = useState<UtilityBill[]>(INITIAL_BILLS);
  const [flags, setFlags] = useState<ReviewFlag[]>(INITIAL_REVIEW_FLAGS);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | undefined>(undefined);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Selected Campus Entity
  const selectedCampus = campuses.find((c) => c.id === selectedCampusId) || campuses[0] || DELHI_CAMPUSES[0];

  // Refresh data from backend API
  const refreshBackendData = useCallback(async (campusId: string) => {
    try {
      setIsDataLoading(true);
      // Fetch latest campus directory with enriched stats
      const [fetchedCampuses, campusBills, campusFlags, stats] = await Promise.all([
        api.getCampuses(),
        api.getBills(campusId),
        api.getFlags(campusId),
        api.getDashboardStats(),
      ]);

      if (fetchedCampuses && fetchedCampuses.length > 0) {
        setCampuses(fetchedCampuses);
      }

      // If backend has bills for this campus, use them.
      // If it's igdtuw and backend returns empty, fallback to INITIAL_BILLS for first-load specimen.
      if (campusBills && campusBills.length > 0) {
        setBills(campusBills);
      } else if (campusId === 'igdtuw') {
        setBills(INITIAL_BILLS);
      } else {
        setBills([]);
      }

      if (campusFlags && campusFlags.length > 0) {
        setFlags(campusFlags);
      } else if (campusId === 'igdtuw') {
        setFlags(INITIAL_REVIEW_FLAGS);
      } else {
        setFlags([]);
      }

      if (stats) {
        setDashboardStats(stats);
      }
    } catch (err) {
      console.warn('[GreenLedger] Live API fetch fallback:', err);
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  // Initial load and campus switch
  useEffect(() => {
    refreshBackendData(selectedCampusId);
  }, [selectedCampusId, refreshBackendData]);

  // Handle switching campus
  const handleSelectCampus = (campusId: string) => {
    setSelectedCampusId(campusId);
  };

  // Seed realistic 12-month sample DISCOM bills for any empty campus
  const handleSeedSampleAudit = async (campusId: string) => {
    try {
      setIsDataLoading(true);
      await api.seedSampleAudit(campusId);
      await refreshBackendData(campusId);
    } catch (err) {
      console.error('Failed to seed sample audit:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Compute live deterministic metrics
  const comparison = calculateComparison(
    bills,
    bills.length > 0 ? undefined : undefined,
    INDIA_EMISSION_FACTORS[0].factorKgPerKwh,
    INDIA_EMISSION_FACTORS[0].name,
    selectedCampus.name
  );
  const pendingFlagsCount = flags.filter((f) => f.status === 'pending').length;

  // Handle URL hash routing on initial mount & hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('app/')) {
        const tab = hash.replace('app/', '') as WorkspaceTab;
        if (['overview', 'evidence', 'audit', 'review', 'scorecard', 'reports'].includes(tab)) {
          setViewMode('app');
          setWorkspaceTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      } else if (hash === 'app') {
        setViewMode('app');
        setWorkspaceTab('overview');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Public page hash target
      if (hash) {
        setViewMode('public');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 50);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handlers for switching views
  const handleOpenApp = (tab: string = 'overview') => {
    const validTab = (['overview', 'evidence', 'audit', 'review', 'scorecard', 'reports'].includes(tab)
      ? tab
      : 'overview') as WorkspaceTab;
    setViewMode('app');
    setWorkspaceTab(validTab);
    window.location.hash = `app/${validTab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToPublic = () => {
    setViewMode('public');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSection = (sectionId: string) => {
    if (viewMode !== 'public') {
      setViewMode('public');
    }
    window.location.hash = sectionId;
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleUpdateBill = async (updatedBill: UtilityBill) => {
    const updatedBills = bills.map((b) => (b.id === updatedBill.id ? updatedBill : b));
    setBills(updatedBills);

    // Save to backend API
    try {
      await api.updateBill(updatedBill.id, updatedBill);
    } catch (e) {
      console.warn('Backend update error:', e);
    }

    // Re-evaluate flags if a bill was verified
    if (updatedBill.verificationStatus === 'user_verified') {
      setFlags((prev) =>
        prev.map((f) =>
          f.billId === updatedBill.id && f.type === 'unverified_document'
            ? { ...f, status: 'resolved', resolvedAt: new Date().toISOString().split('T')[0] }
            : f
        )
      );
    }
  };

  const handleAddBill = async (newBill: UtilityBill) => {
    const updated = [...bills, newBill];
    setBills(updated);

    // Persist to backend
    try {
      await api.createBill({
        ...newBill,
        campusId: selectedCampusId,
      });
    } catch (e) {
      console.warn('Backend create bill error:', e);
    }

    // Run audit flag detector on updated set
    const freshFlags = runReviewFlagAudit(updated);
    setFlags(freshFlags);
  };

  const handleUpdateFlag = async (updatedFlag: ReviewFlag) => {
    setFlags((prev) => prev.map((f) => (f.id === updatedFlag.id ? updatedFlag : f)));
    try {
      await api.updateFlag(updatedFlag.id, updatedFlag);
    } catch (e) {
      console.warn('Backend update flag error:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f0e5] text-[#21150f] relative overflow-x-hidden">
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {viewMode === 'public' ? (
        /* PUBLIC EDITORIAL WEBSITE EXPERIENCE */
        <div className="flex-1 flex flex-col">
          <PublicNavbar
            onOpenApp={handleOpenApp}
            onNavigateSection={handleNavigateSection}
            onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          />

          <main className="flex-1">
            {/* Section 2: Cinematic Hero */}
            <HeroSection
              onOpenApp={handleOpenApp}
              onScrollToScorecard={() => handleNavigateSection('scorecard-preview')}
            />

            {/* Section 3: The Problem */}
            <ProblemSection />

            {/* Section 4: Scroll-Driven Interactive Questions (Dark Chocolate) */}
            <InteractiveQuestionsSection onOpenApp={handleOpenApp} />

            {/* Section 4B: Moving Crowd & Two-Tone Verification Stream */}
            <MovingCrowdSection onOpenApp={handleOpenApp} />

            {/* Section 5: The GreenLedger Workflow (Scrubber & Visual Pipeline) */}
            <WorkflowSection onOpenApp={handleOpenApp} />

            {/* Section 6: Interactive Capabilities */}
            <CapabilitiesSection onOpenApp={handleOpenApp} />

            {/* Section 7: Real Product Previews */}
            <ProductPreviewsSection onOpenApp={handleOpenApp} />

            {/* Section 8: Trust and Methodology (5 Statuses & Epistemology) */}
            <TrustMethodologySection />

            {/* Section 9: Certified Sample Scorecard */}
            <SampleScorecardSection onOpenApp={handleOpenApp} />

            {/* Section 10: Frequently Answered Questions */}
            <FaqSection />

            {/* Section 11: Closing CTA & Institutional Footer */}
            <ClosingCtaFooter
              onOpenApp={handleOpenApp}
              onNavigateSection={handleNavigateSection}
            />
          </main>
        </div>
      ) : (
        /* FUNCTIONAL APPLICATION WORKSPACE EXPERIENCE */
        <div className="flex-1 flex flex-col bg-[#f4f0e5]">
          <AppHeader
            activeTab={workspaceTab}
            onTabChange={(tab) => {
              setWorkspaceTab(tab);
              window.location.hash = `app/${tab}`;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onReturnToPublic={handleReturnToPublic}
            pendingFlagsCount={pendingFlagsCount}
            evidenceCoveragePercent={comparison.evidenceCoveragePercent}
            campuses={campuses}
            selectedCampusId={selectedCampusId}
            onSelectCampus={handleSelectCampus}
            onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          />

          <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-8 w-full">
            {workspaceTab === 'overview' && (
              <OverviewView
                campuses={campuses}
                selectedCampus={selectedCampus}
                onSelectCampus={handleSelectCampus}
                bills={bills}
                flags={flags}
                comparison={comparison}
                onNavigateTab={(tab) => {
                  setWorkspaceTab(tab);
                  window.location.hash = `app/${tab}`;
                }}
                onOpenUploadModal={() => {
                  setWorkspaceTab('evidence');
                  window.location.hash = 'app/evidence';
                }}
                onSeedSampleAudit={handleSeedSampleAudit}
                dashboardStats={dashboardStats}
              />
            )}

            {workspaceTab === 'evidence' && (
              <EvidenceLibraryView
                bills={bills}
                onUpdateBill={handleUpdateBill}
                onAddBill={handleAddBill}
                currentCampus={selectedCampus}
              />
            )}

            {workspaceTab === 'audit' && (
              <EnergyAuditView bills={bills} currentCampus={selectedCampus} />
            )}

            {workspaceTab === 'review' && (
              <ReviewFlagsView
                flags={flags}
                onUpdateFlag={handleUpdateFlag}
                currentCampus={selectedCampus}
              />
            )}

            {workspaceTab === 'scorecard' && (
              <GreenScorecardView
                bills={bills}
                flags={flags}
                currentCampus={selectedCampus}
              />
            )}

            {workspaceTab === 'reports' && (
              <ReportsSettingsView
                onOpenScorecard={() => setWorkspaceTab('scorecard')}
                currentCampus={selectedCampus}
                campuses={campuses}
                onSelectCampus={handleSelectCampus}
              />
            )}
          </main>

          {/* Minimal Workspace Footer */}
          <footer className="no-print bg-[#fffefa] border-t border-[#cfc7b4] py-4 text-center text-xs font-mono text-[#6f6052]">
            <span>
              GreenLedger Institutional Workspace · Delhi Higher Education Sustainability Audit Protocol v3.2 · Asia/Kolkata
            </span>
          </footer>
        </div>
      )}

      {/* Save to GitHub & Repository Export Modal */}
      <SaveToGitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
}
