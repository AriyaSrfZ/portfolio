import { useState, useEffect } from 'react';
import { getLangFromUrl } from '../../i18n/ui';
import type { ActiveEnvironment } from './BackgroundController';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

interface FloatingNavbarProps {
  locale?: 'en' | 'fa';
}

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'fa'>(locale);
  const isFa = currentLang === 'fa';
  const defaultSwitchTarget = locale === 'fa' ? baseUrl : `${baseUrl}fa/`;
  const [switchTarget, setSwitchTarget] = useState<string>(defaultSwitchTarget);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('payment-settlement');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = getLangFromUrl(new URL(window.location.href));
      setCurrentLang(detected);

      const path = window.location.pathname;
      const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      let rel = path.startsWith(normalizedBase) ? path.slice(normalizedBase.length) : path.replace(/^\//, '');

      if (detected === 'fa') {
        if (rel.startsWith('fa/')) rel = rel.slice(3);
        else if (rel === 'fa') rel = '';
        setSwitchTarget(`${normalizedBase}${rel}${window.location.search}${window.location.hash}`);
      } else {
        setSwitchTarget(`${normalizedBase}fa/${rel}${window.location.search}${window.location.hash}`);
      }

      // Deterministic Scroll Spy
      const sectionIds = ['payment-settlement', 'payment-switch', 'fraud-forensics', 'reconciliation-engine', 'incident-dossiers', 'lifecycle', 'book'];
      const handleNavScroll = () => {
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 260 && rect.bottom > 180) {
              setActiveSection(id);
              return;
            }
          }
        }
        setActiveSection('');
      };

      window.addEventListener('scroll', handleNavScroll, { passive: true });
      window.addEventListener('resize', handleNavScroll, { passive: true });
      handleNavScroll();

      return () => {
        window.removeEventListener('scroll', handleNavScroll);
        window.removeEventListener('resize', handleNavScroll);
      };
    }
  }, []);

  const navItems = isFa
    ? [
        { label: 'دفتر کل', target: 'payment-settlement', env: 'core' as ActiveEnvironment },
        { label: 'سوییچ', target: 'payment-switch', env: 'switch' as ActiveEnvironment },
        { label: 'احراز هویت', target: 'fraud-forensics', env: 'switch' as ActiveEnvironment },
        { label: 'مغایرت‌گیری', target: 'reconciliation-engine', env: 'recon' as ActiveEnvironment },
        { label: 'بحران‌ها', target: 'incident-dossiers', env: 'incidents' as ActiveEnvironment },
        { label: 'چرخه محصول', target: 'lifecycle', env: 'core' as ActiveEnvironment },
        { label: 'مشاوره', target: 'book', env: 'core' as ActiveEnvironment },
      ]
    : [
        { label: 'Ledger', target: 'payment-settlement', env: 'core' as ActiveEnvironment },
        { label: 'Switch', target: 'payment-switch', env: 'switch' as ActiveEnvironment },
        { label: 'eKYC', target: 'fraud-forensics', env: 'switch' as ActiveEnvironment },
        { label: 'Reconcile', target: 'reconciliation-engine', env: 'recon' as ActiveEnvironment },
        { label: 'Incidents', target: 'incident-dossiers', env: 'incidents' as ActiveEnvironment },
        { label: 'Lifecycle', target: 'lifecycle', env: 'core' as ActiveEnvironment },
        { label: 'Consultation', target: 'book', env: 'core' as ActiveEnvironment },
      ];

  const handleNavClick = (e: React.MouseEvent, targetId: string, env: ActiveEnvironment) => {
    setActiveSection(targetId);
    setMobileMenuOpen(false);
    window.dispatchEvent(new CustomEvent('ambient-env-change', { detail: env }));
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 w-full h-14 z-50 backdrop-blur-md bg-[#0b0d11]/85 border-b border-white/5 transition-all">
      <div className="w-full max-w-[1920px] 2xl:max-w-[2160px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-full flex items-center justify-between">
        
        {/* Left: Brand + Status Badge */}
        <div className="flex items-center gap-3">
          <a
            href={isFa ? `${baseUrl}fa/` : baseUrl}
            className="text-xs sm:text-sm font-semibold tracking-wider text-white hover:text-neutral-200 transition-colors uppercase font-mono"
          >
            ARIYA SARRAFZADEH
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>[FINTECH &amp; TELECOM INFRASTRUCTURE]</span>
          </span>
        </div>

        {/* Right: Horizontal Section Pills + Language Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Nav Pills without numbers */}
          <nav className="hidden lg:flex items-center gap-1 font-mono text-xs">
            {navItems.map((item) => {
              const isActive = activeSection === item.target;
              const targetHref = isFa ? `${baseUrl}fa/#${item.target}` : `${baseUrl}#${item.target}`;
              return (
                <a
                  key={item.target}
                  href={targetHref}
                  onClick={(e) => handleNavClick(e, item.target, item.env)}
                  className={`px-2.5 py-1.5 rounded-md transition-all font-mono text-xs ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Divider */}
          <span className="hidden lg:block w-px h-4 bg-white/10 mx-1"></span>

          {/* Secondary Links */}
          <a
            href={isFa ? `${baseUrl}fa/dictionary/` : `${baseUrl}dictionary/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
          >
            {isFa ? 'واژه‌نامه' : 'Dictionary'}
          </a>
          <a
            href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white transition-colors"
          >
            {isFa ? 'وایت‌پیپرها' : 'Whitepapers'}
          </a>

          {/* Language Switcher */}
          <a
            href={switchTarget}
            className="px-2.5 py-1 rounded-md bg-white/[0.08] hover:bg-white/15 border border-white/15 text-[11px] font-mono font-semibold text-white transition-all tracking-wider"
          >
            {isFa ? 'EN' : 'FA'}
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-md text-neutral-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-[#0b0d11]/95 border-b border-white/10 px-6 py-4 space-y-2 backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={isFa ? `${baseUrl}fa/#${item.target}` : `${baseUrl}#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target, item.env)}
                className="text-left px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-neutral-300 hover:text-white block"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/5 flex flex-wrap gap-4 text-xs font-mono">
            <a href={isFa ? `${baseUrl}fa/dictionary/` : `${baseUrl}dictionary/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'واژه‌نامه' : 'Dictionary'}
            </a>
            <a href={isFa ? `${baseUrl}fa/work/` : `${baseUrl}work/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'پروژه‌ها' : 'Case Studies'}
            </a>
            <a href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'وایت‌پیپرها' : 'Whitepapers'}
            </a>
            <a href={isFa ? `${baseUrl}fa/about/` : `${baseUrl}about/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'درباره من' : 'About'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
