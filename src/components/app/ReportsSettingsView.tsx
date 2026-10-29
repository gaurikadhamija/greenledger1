import React, { useState } from 'react';
import { INDIA_EMISSION_FACTORS, DELHI_CAMPUSES } from '../../data/delhiCampuses';
import { Campus } from '../../types';
import {
  FileText,
  Settings,
  Download,
  Printer,
  Shield,
  Check,
  Building,
  RefreshCw,
  MapPin,
  Globe,
  Github,
  GitBranch,
  Copy,
  ExternalLink,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface ReportsSettingsViewProps {
  onOpenScorecard: () => void;
  currentCampus?: Campus;
  campuses?: Campus[];
  onSelectCampus?: (id: string) => void;
}

export const ReportsSettingsView: React.FC<ReportsSettingsViewProps> = ({
  onOpenScorecard,
  currentCampus = DELHI_CAMPUSES[0],
  campuses = DELHI_CAMPUSES,
  onSelectCampus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'settings' | 'methodology' | 'github'>('history');
  const [siteName, setSiteName] = useState(currentCampus.name);
  const [address, setAddress] = useState(currentCampus.address);
  const [areaAcres, setAreaAcres] = useState(String(currentCampus.campusAreaAcres));
  const [discom, setDiscom] = useState(currentCampus.discom);
  const [savedSettings, setSavedSettings] = useState(false);
  const [repoUrlInput, setRepoUrlInput] = useState('https://github.com/your-username/greenledger.git');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const reportHistory = [
    {
      id: `rep-${currentCampus.id}-2025`,
      title: `${currentCampus.abbreviation} Annual Green Scorecard (CY 2025)`,
      period: 'Jan 1, 2025 – Dec 31, 2025',
      generatedDate: 'February 2026',
      status: 'Audited & Signed',
      coverage: '91.7%',
      kwhTotal: '517,100 kWh',
    },
    {
      id: `rep-${currentCampus.id}-2024`,
      title: `${currentCampus.abbreviation} Historical Baseline Audit (CY 2024)`,
      period: 'Jan 1, 2024 – Dec 31, 2024',
      generatedDate: 'January 2025',
      status: 'Certified Baseline',
      coverage: '100.0%',
      kwhTotal: '538,400 kWh',
    },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#cfc7b4] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>DELHI INSTITUTIONAL GOVERNANCE · {currentCampus.abbreviation}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#21150f]">
            Reports & Campus Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#574539] mt-1 font-light font-sans">
            Archived institutional audit disclosures, DERC compliance standards, and Delhi campus parameters.
          </p>
        </div>

        {/* Subtab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-[#fffefa] border border-[#cfc7b4] rounded-full self-start sm:self-auto overflow-x-auto">
          {[
            { id: 'history', label: 'Scorecard Archive' },
            { id: 'settings', label: 'Campus Parameters' },
            { id: 'methodology', label: 'DERC & CEA Protocol' },
            { id: 'github', label: 'GitHub Repository' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-1.5 text-xs font-mono rounded-full transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-[#21150f] text-white font-semibold'
                  : 'text-[#574539] hover:text-[#21150f]'
              }`}
            >
              {tab.id === 'github' && <Github className="w-3 h-3 text-[#eaceaa]" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subtab 1: Report Archive */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#fffefa] rounded-2xl border border-[#cfc7b4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-[#21150f]">
                Published Institutional Scorecards ({currentCampus.name})
              </h3>
              <p className="text-xs text-[#574539] font-light">
                Permanent archival records linked to verified Delhi utility invoices and CEA carbon factors.
              </p>
            </div>
            <button
              onClick={onOpenScorecard}
              className="px-5 py-2 bg-[#09453d] hover:bg-[#073630] text-white text-xs font-sans font-medium rounded-full cursor-pointer shadow-xs whitespace-nowrap"
            >
              Generate New Scorecard
            </button>
          </div>

          <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#e0d9c6] text-[#6f6052] font-mono uppercase text-[11px] bg-[#f7f4e9]">
                  <th className="p-4">Report Title</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Coverage</th>
                  <th className="p-4">Total Energy</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0d9c6]">
                {reportHistory.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#f7f4e9]">
                    <td className="p-4 font-serif font-bold text-[#21150f]">
                      {rep.title}
                    </td>
                    <td className="p-4 font-mono text-[#574539]">{rep.period}</td>
                    <td className="p-4 font-mono font-medium text-[#09453d]">{rep.coverage}</td>
                    <td className="p-4 font-mono text-[#21150f]">{rep.kwhTotal}</td>
                    <td className="p-4">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#e8f1ec] text-[#09453d] font-bold">
                        {rep.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={onOpenScorecard}
                        className="text-xs font-mono text-[#09453d] hover:underline cursor-pointer font-semibold"
                      >
                        Inspect Scorecard →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Campus Parameters & Settings */}
      {activeSubTab === 'settings' && (
        <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] p-6 md:p-8 max-w-2xl shadow-xs">
          <h3 className="text-xl font-serif font-bold text-[#21150f] mb-1">
            Delhi Campus Directory & Site Parameters
          </h3>
          <p className="text-xs text-[#574539] mb-4">
            Configure verified institution metadata, DISCOM feeders, and local currency rules.
          </p>

          {savedSettings && (
            <div className="mb-4 p-3 bg-[#e8f1ec] border border-[#c6d8d0] text-xs font-mono text-[#09453d] rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Campus parameters saved successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-[#6f6052] mb-1">Institution Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
              />
            </div>

            <div>
              <label className="block text-[#6f6052] mb-1">Campus Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#6f6052] mb-1">Campus Area (Acres)</label>
                <input
                  type="text"
                  value={areaAcres}
                  onChange={(e) => setAreaAcres(e.target.value)}
                  className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                />
              </div>

              <div>
                <label className="block text-[#6f6052] mb-1">Assigned DISCOM</label>
                <select
                  value={discom}
                  onChange={(e) => setDiscom(e.target.value)}
                  className="w-full p-2.5 border border-[#cfc7b4] rounded-xl bg-[#f7f4e9] text-[#21150f]"
                >
                  <option value="Tata Power Delhi Distribution Limited (TPDDL)">Tata Power DDL (TPDDL)</option>
                  <option value="BSES Rajdhani Power Limited (BRPL)">BSES Rajdhani (BRPL)</option>
                  <option value="BSES Yamuna Power Limited (BYPL)">BSES Yamuna (BYPL)</option>
                </select>
              </div>
            </div>

            {/* Read-Only System Standards */}
            <div className="p-4 bg-[#f0edde] rounded-xl border border-[#cfc7b4] space-y-2 text-xs font-mono text-[#574539]">
              <div className="flex justify-between">
                <span>Operational Currency:</span>
                <strong className="text-[#21150f]">Indian Rupee (INR ₹)</strong>
              </div>
              <div className="flex justify-between">
                <span>System Timezone:</span>
                <strong className="text-[#21150f]">Asia/Kolkata (IST, UTC+05:30)</strong>
              </div>
              <div className="flex justify-between">
                <span>Tariff Benchmark:</span>
                <strong className="text-[#09453d]">DERC Non-Domestic Institutional Tariff</strong>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#09453d] hover:bg-[#073630] text-white rounded-full font-sans text-xs font-medium cursor-pointer shadow-xs"
            >
              Save Campus Preferences
            </button>
          </form>
        </div>
      )}

      {/* Subtab 3: Methodology */}
      {activeSubTab === 'methodology' && (
        <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] p-6 md:p-8 space-y-6 shadow-xs max-w-3xl">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#21150f]">
              GreenLedger India Audit Protocol (v3.2)
            </h3>
            <p className="text-xs text-[#574539] mt-1 font-sans">
              Methodological guidelines governing Scope 2 carbon accounting and utility verification in Delhi.
            </p>
          </div>

          <div className="space-y-4 text-xs font-sans text-[#574539] leading-relaxed">
            <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
              <h4 className="font-serif font-bold text-[#21150f] text-sm mb-1">
                1. Principle of Primary Evidence Supremacy
              </h4>
              <p>
                No energy number enters the Green Scorecard without an underlying primary PDF utility invoice issued by the authorized regional power distribution company (TPDDL, BRPL, or BYPL).
              </p>
            </div>

            <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
              <h4 className="font-serif font-bold text-[#21150f] text-sm mb-1">
                2. India Central Electricity Authority (CEA) Baseline
              </h4>
              <p>
                Indirect emissions are quantified against the CEA CO₂ Baseline Database for the Indian Power Sector (Version 19, weighted average grid emission factor: 0.716 kg CO₂/kWh).
              </p>
            </div>

            <div className="p-4 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
              <h4 className="font-serif font-bold text-[#21150f] text-sm mb-1">
                3. DERC Tariff Decoupling
              </h4>
              <p>
                Financial electricity expenditures in INR (₹) are decoupled from thermodynamic consumption (kWh) to protect institutional reporting from tariff escalations and power purchase surcharges.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 4: Git & GitHub Repository */}
      {activeSubTab === 'github' && (
        <div className="bg-[#fffefa] rounded-2xl border border-[#cfc7b4] p-6 md:p-8 space-y-6 shadow-xs max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#cfc7b4] gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#09453d] font-semibold mb-1">
                <Github className="w-3.5 h-3.5" />
                <span>VERSION CONTROL & CODEBASE EXPORT</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#21150f]">
                Save & Push to GitHub Repository
              </h3>
              <p className="text-xs text-[#574539] mt-0.5 font-sans">
                This project is initialized as a Git repository on branch <code className="bg-[#f0edde] px-1 py-0.5 rounded text-[#09453d] font-mono">main</code>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#e8f1ec] text-[#09453d] border border-[#09453d]/25 rounded-full font-mono text-xs font-semibold flex items-center gap-1.5">
                <GitBranch className="w-3 h-3" />
                <span>Branch: main (Clean)</span>
              </span>
            </div>
          </div>

          {/* Option 1: AI Studio One-Click Export */}
          <div className="p-5 rounded-2xl bg-[#e8f1ec]/60 border border-[#09453d]/25 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#09453d]">
                <Sparkles className="w-4 h-4 text-[#09453d]" />
                <span>Method 1: Google AI Studio Built-In 1-Click Export (Recommended)</span>
              </div>
              <span className="px-2 py-0.5 bg-[#09453d] text-white text-[10px] font-mono rounded-full font-semibold uppercase">
                Fastest
              </span>
            </div>
            <p className="text-xs text-[#27544a] leading-relaxed">
              Google AI Studio provides a native button in the top navigation bar. Click the <strong>Export</strong> or <strong>GitHub icon</strong> in the top header, connect your GitHub account, and choose a repository name to push all commits and source files in one click.
            </p>
          </div>

          {/* Option 2: CLI Push Commands */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#21150f]">
              <Terminal className="w-4 h-4 text-[#09453d]" />
              <span>Method 2: Push via Git Terminal / Command Line</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#21150f] mb-1">
                Your GitHub Repository Remote URL:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={repoUrlInput}
                  onChange={(e) => setRepoUrlInput(e.target.value)}
                  placeholder="https://github.com/your-username/greenledger.git"
                  className="flex-1 px-3.5 py-2.5 bg-[#f7f4e9] border border-[#cfc7b4] rounded-xl font-mono text-xs text-[#21150f] focus:outline-none focus:border-[#09453d]"
                />
                <a
                  href="https://github.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#09453d] hover:bg-[#073630] text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Create New Repo on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] text-[#6f6052] mt-1">
                Create a blank repository (without initializing README or license). Then copy and run the commands below.
              </p>
            </div>

            {/* Terminal Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#574539]">
                <span className="font-semibold text-[#21150f]">Terminal Commands:</span>
                <button
                  onClick={() => {
                    const text = `# Initialize git and commit files\ngit init -b main\ngit add .\ngit commit -m "Initial commit: Complete ग्रीनLedger sustainability platform"\n\n# Link remote and push to GitHub\ngit remote add origin ${repoUrlInput.trim() || 'https://github.com/your-username/greenledger.git'}\ngit push -u origin main`;
                    navigator.clipboard.writeText(text);
                    setCopiedSnippet('cli');
                    setTimeout(() => setCopiedSnippet(null), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#e0d9c6] hover:bg-[#cfc7b4] text-[#21150f] rounded-lg transition-colors cursor-pointer text-xs font-mono"
                >
                  {copiedSnippet === 'cli' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#09453d]" />
                      <span className="text-[#09453d] font-bold">Commands Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Commands</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#21150f] text-[#f4f0e5] p-4 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#34150f]">
                <pre>{`git init -b main
git add .
git commit -m "Initial commit: Complete ग्रीनLedger sustainability platform"
git remote add origin ${repoUrlInput.trim() || 'https://github.com/your-username/greenledger.git'}
git push -u origin main`}</pre>
              </div>
            </div>

            {/* Commit Log Details */}
            <div className="p-4 bg-[#f0edde] rounded-xl border border-[#cfc7b4] space-y-2 text-xs font-mono text-[#574539]">
              <div className="font-semibold text-[#21150f] mb-1">Pre-Packaged Repository Specifications:</div>
              <div className="flex justify-between">
                <span>Default Branch:</span>
                <strong className="text-[#09453d]">main</strong>
              </div>
              <div className="flex justify-between">
                <span>Documentation:</span>
                <strong className="text-[#21150f]">README.md (Included with badges & guides)</strong>
              </div>
              <div className="flex justify-between">
                <span>Server & Runtime:</span>
                <strong className="text-[#21150f]">Express + Vite + React 19 + TypeScript</strong>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <strong className="text-[#21150f]">MIT Open Source</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
