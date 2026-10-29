import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Leaf, Github } from 'lucide-react';
import { SubtleLeaf } from '../common/BotanicalLeaf';

interface PublicNavbarProps {
  onOpenApp: (tab?: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenGitHubModal?: () => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onOpenApp,
  onNavigateSection,
  onOpenGitHubModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The gap', id: 'problem' },
    { label: 'Capabilities', id: 'capabilities' },
    { label: 'Automation', id: 'workflow' },
    { label: 'Methodology', id: 'methodology' },
    { label: 'Scorecard', id: 'scorecard-preview' },
    { label: 'Questions', id: 'faq' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f4f0e5]/90 backdrop-blur-md border-b border-[#cfc7b4] py-3.5 shadow-xs'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark with Leaf Motif */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="group flex items-center gap-2.5 text-2xl font-serif font-medium tracking-tight text-[#21150f] shrink-0"
        >
          <span className="w-7 h-7 rounded-full bg-[#e8f1ec] border border-[#09453d]/25 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-2xs">
            <SubtleLeaf size={16} color="#09453d" />
          </span>
          <span className="tracking-tight">
            <span className="font-semibold text-[#09453d] mr-0.5">ग्रीन</span>Ledger
          </span>
        </a>

        {/* Zone 2: Pramaan Floating Nav Pill */}
        <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-[#fffefa]/90 backdrop-blur-md border border-[#cfc7b4] rounded-full shadow-[0_2px_8px_rgba(52,21,15,0.04)]">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="px-3.5 py-1 text-xs font-sans font-medium text-[#574539] hover:text-[#21150f] hover:bg-[#f0edde] rounded-full transition-all duration-150 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: GitHub Repo, Sign in & Launch Workspace */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {onOpenGitHubModal && (
            <button
              onClick={onOpenGitHubModal}
              title="Save to GitHub / Repository Guide"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-[#21150f] hover:text-[#09453d] bg-[#f0edde] hover:bg-[#e0d9c6] border border-[#cfc7b4] rounded-full transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </button>
          )}
          <button
            onClick={() => onOpenApp('overview')}
            className="text-xs font-sans font-medium text-[#574539] hover:text-[#21150f] transition-colors cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => onOpenApp('overview')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-white bg-[#21150f] hover:bg-[#34150f] hover:shadow-md rounded-full transition-all duration-200 cursor-pointer"
          >
            <span>Launch Workspace</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#eaceaa]" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#21150f] hover:bg-[#e8e6e0] rounded-md transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f4f0e5] border-b border-[#cfc7b4] px-6 py-5 shadow-lg">
          <div className="flex flex-col gap-3 text-sm font-sans font-medium text-[#574539]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left py-2 hover:text-[#21150f] border-b border-[#e0d9c6] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              {onOpenGitHubModal && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenGitHubModal();
                  }}
                  className="w-full py-2 text-center text-xs font-mono font-medium text-[#21150f] bg-[#f0edde] border border-[#cfc7b4] rounded-full flex items-center justify-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Save to GitHub / View Repo</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApp('overview');
                }}
                className="w-full py-2.5 text-center text-xs font-medium text-white bg-[#21150f] rounded-full"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
