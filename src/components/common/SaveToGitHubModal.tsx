import React, { useState } from 'react';
import {
  X,
  Github,
  GitBranch,
  Copy,
  Check,
  ExternalLink,
  Terminal,
  FolderArchive,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface SaveToGitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveToGitHubModal: React.FC<SaveToGitHubModalProps> = ({ isOpen, onClose }) => {
  const [repoUrl, setRepoUrl] = useState('https://github.com/your-username/greenledger.git');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<'aistudio' | 'cli' | 'zip'>('aistudio');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const cleanRepoUrl = repoUrl.trim() || 'https://github.com/your-username/greenledger.git';

  const gitPushScript = `# 1. Initialize git and commit files
git init -b main
git add .
git commit -m "Initial commit: Complete ग्रीनLedger sustainability platform"

# 2. Link your GitHub repository
git remote add origin ${cleanRepoUrl}

# 3. Push your code to GitHub
git push -u origin main`;

  const newRepoSetupScript = `# If you are cloning or pushing from a fresh directory:
git clone ${cleanRepoUrl}
cd greenledger
npm install
npm run dev`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-[#fffefa] border border-[#cfc7b4] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#f7f4e9] border-b border-[#cfc7b4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#21150f] text-white flex items-center justify-center shadow-xs">
              <Github className="w-5 h-5 text-[#eaceaa]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-[#21150f]">Save to GitHub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#e8f1ec] text-[#09453d] border border-[#09453d]/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Repo Ready
                </span>
              </div>
              <p className="text-xs text-[#574539] font-sans">
                Export, push, or sync the complete ग्रीनLedger codebase to your GitHub account.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6f6052] hover:text-[#21150f] hover:bg-[#e0d9c6] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Git Status Banner */}
        <div className="px-6 py-2.5 bg-[#f0edde] border-b border-[#cfc7b4] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#574539]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#09453d] font-semibold">
              <GitBranch className="w-3.5 h-3.5" />
              Branch: <strong>main</strong>
            </span>
            <span className="text-[#c8c1af]">·</span>
            <span>Project Size: <strong className="text-[#09453d]">8 MB (Lightweight)</strong></span>
            <span className="text-[#c8c1af]">·</span>
            <span>API Blobs: <strong className="text-[#09453d]">Compliant (&lt;25MB)</strong></span>
          </div>
          <span className="text-[11px] text-[#09453d] font-semibold">Ready for Export</span>
        </div>

        {/* Method Switcher Tabs */}
        <div className="px-6 pt-4 border-b border-[#e0d9c6] flex gap-2">
          {[
            { id: 'aistudio', label: '1. AI Studio Export (Easiest)', icon: Sparkles },
            { id: 'cli', label: '2. Push via Terminal (CLI)', icon: Terminal },
            { id: 'zip', label: '3. Offline Archive (ZIP)', icon: FolderArchive },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = activeMethod === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMethod(m.id as any)}
                className={`pb-2.5 px-3 text-xs font-sans font-medium flex items-center gap-1.5 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#09453d] text-[#09453d] font-semibold'
                    : 'border-transparent text-[#6f6052] hover:text-[#21150f]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs font-sans text-[#21150f] flex-1">
          {/* Method 1: AI Studio Built-In */}
          {activeMethod === 'aistudio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#e8f1ec]/60 border border-[#09453d]/20 space-y-2">
                <div className="flex items-center gap-2 text-sm font-serif font-bold text-[#09453d]">
                  <Sparkles className="w-4 h-4 text-[#09453d]" />
                  <span>One-Click Export via Google AI Studio Header</span>
                </div>
                <p className="text-xs text-[#27544a] leading-relaxed">
                  Google AI Studio Build has native GitHub integration. You can export directly into a new or existing repository in your GitHub account without typing any terminal commands!
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                  <span className="w-5 h-5 rounded-full bg-[#09453d] text-white flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">1</span>
                  <div>
                    <h4 className="font-semibold text-[#21150f]">Look at the top right of this AI Studio window</h4>
                    <p className="text-[#574539] mt-0.5">Click the <strong>Export</strong> or <strong>GitHub icon</strong> located next to the share / preview controls.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                  <span className="w-5 h-5 rounded-full bg-[#09453d] text-white flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">2</span>
                  <div>
                    <h4 className="font-semibold text-[#21150f]">Connect or Select your GitHub Account</h4>
                    <p className="text-[#574539] mt-0.5">Authorize AI Studio with GitHub, choose your organization or personal profile, and name your repository (e.g. <code className="bg-[#e0d9c6] px-1 py-0.5 rounded">delhi-green-ledger</code>).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#f7f4e9] rounded-xl border border-[#cfc7b4]">
                  <span className="w-5 h-5 rounded-full bg-[#09453d] text-white flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">3</span>
                  <div>
                    <h4 className="font-semibold text-[#21150f]">Sync & Commit Changes</h4>
                    <p className="text-[#574539] mt-0.5">AI Studio pushes the entire committed codebase, README, configuration, and documentation directly to GitHub in seconds.</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#f0edde] rounded-xl border border-[#cfc7b4] flex items-center justify-between">
                <span className="text-xs text-[#574539]">Prefer using Git commands directly on your own computer?</span>
                <button
                  onClick={() => setActiveMethod('cli')}
                  className="px-3 py-1 bg-[#21150f] text-white rounded-lg text-xs font-medium hover:bg-[#34150f] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>View Terminal Commands</span>
                  <ArrowRight className="w-3 h-3 text-[#eaceaa]" />
                </button>
              </div>
            </div>
          )}

          {/* Method 2: CLI Push */}
          {activeMethod === 'cli' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#21150f] mb-1">
                  Enter your GitHub Repository URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/your-username/greenledger.git"
                    className="flex-1 px-3 py-2 bg-[#f7f4e9] border border-[#cfc7b4] rounded-xl font-mono text-xs text-[#21150f] focus:outline-none focus:border-[#09453d]"
                  />
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-[#09453d] text-white font-medium rounded-xl text-xs hover:bg-[#073630] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <span>Create Repo</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-[#6f6052] mt-1">
                  Create an empty repository on GitHub without adding a README or license (we already have those ready).
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#574539]">
                  <span className="font-semibold text-[#21150f]">Run these commands to push:</span>
                  <button
                    onClick={() => copyToClipboard(gitPushScript, 'push')}
                    className="flex items-center gap-1 px-2.5 py-1 bg-[#e0d9c6] hover:bg-[#cfc7b4] text-[#21150f] rounded-lg transition-colors cursor-pointer text-[11px]"
                  >
                    {copiedSection === 'push' ? (
                      <>
                        <Check className="w-3 h-3 text-[#09453d]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Commands</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-[#21150f] text-[#f4f0e5] p-3.5 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#34150f]">
                  <pre className="whitespace-pre-wrap">{gitPushScript}</pre>
                </div>
              </div>

              {/* Cloning Guide */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#574539]">
                  <span>How to clone and run on any machine later:</span>
                  <button
                    onClick={() => copyToClipboard(newRepoSetupScript, 'clone')}
                    className="flex items-center gap-1 px-2 py-0.5 text-[11px] text-[#574539] hover:text-[#21150f] cursor-pointer"
                  >
                    {copiedSection === 'clone' ? (
                      <span className="text-[#09453d] font-bold">Copied</span>
                    ) : (
                      <span className="underline">Copy clone script</span>
                    )}
                  </button>
                </div>
                <div className="bg-[#f0edde] p-3 rounded-xl font-mono text-[11px] text-[#34150f] border border-[#cfc7b4] overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{newRepoSetupScript}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Method 3: ZIP Download */}
          {activeMethod === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#f7f4e9] border border-[#cfc7b4] space-y-2">
                <h4 className="font-serif font-bold text-base text-[#21150f]">
                  Direct Download & Offline Distribution
                </h4>
                <p className="text-xs text-[#574539] leading-relaxed">
                  In Google AI Studio, click the project menu (or download button) at the top of the interface to download the complete repository as a compressed <code>.zip</code> file containing all source files, scripts, assets, and tests.
                </p>
              </div>

              <div className="p-4 bg-[#fffefa] rounded-xl border border-[#cfc7b4] space-y-2 text-xs">
                <h5 className="font-semibold text-[#09453d]">Offline One-Click Launchers Included</h5>
                <p className="text-[#574539]">
                  This repository includes zero-config desktop launcher scripts:
                </p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-[#21150f]">
                  <li><code>start-app.bat</code> for Windows</li>
                  <li><code>start-app.sh</code> for macOS & Linux</li>
                  <li><code>dist/index.html</code> self-contained offline bundle</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f7f4e9] border-t border-[#cfc7b4] flex items-center justify-between">
          <div className="text-[11px] text-[#6f6052] font-mono">
            Repository includes complete README.md, MIT License & Express backend
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#21150f] hover:bg-[#34150f] text-white rounded-full text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
