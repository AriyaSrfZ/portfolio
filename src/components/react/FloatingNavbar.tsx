import { useState, useEffect } from 'react';
import { getLangFromUrl } from '../../i18n/ui';

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
  const [activePath, setActivePath] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = getLangFromUrl(new URL(window.location.href));
      setCurrentLang(detected);
      setActivePath(window.location.pathname);

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
    }
  }, []);

  const navItems = isFa
    ? [
        { label: 'درباره من', href: '/fa/about/' },
        { label: 'نمونهکارها', href: '/fa/work/' },
        { label: 'مستندات معماری', href: '/fa/whitepapers/' },
      ]
    : [
        { label: 'About', href: '/about/' },
        { label: 'Case Studies', href: '/work/' },
        { label: 'Whitepapers', href: '/whitepapers/' },
      ];

  return (
    <header className="fixed top-0 inset-x-0 w-full h-14 z-50 backdrop-blur-md bg-[#0b0d11]/85 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left: Brand + Status Badge */}
        <div className="flex items-center gap-3">
          <a
            href={isFa ? `${baseUrl}fa/` : baseUrl}
            className="text-xs sm:text-sm font-semibold tracking-wider text-white hover:text-neutral-200 transition-colors uppercase font-mono"
          >
            ARIYA SARRAFZADEH
          </a>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/15 text-[11px] font-mono text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>[TPM · FINTECH &amp; SWITCHES]</span>
          </span>
        </div>

        {/* Center: Clean, Centered Navigation Pill */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs bg-white/[0.04] border border-white/10 rounded-full px-1.5 py-1">
          {navItems.map((item) => {
            const isActive = activePath === item.href || (item.href !== '/' && activePath.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                className={`px-3 py-1 rounded-full transition-all font-mono ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-2">
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
            className="md:hidden p-1.5 rounded-md text-neutral-200 hover:text-white hover:bg-white/10 transition-colors"
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
        <div className="md:hidden w-full bg-[#0b0d11]/95 border-b border-white/10 px-6 py-4 space-y-2 backdrop-blur-xl">
          <div className="flex flex-col gap-2 font-mono text-xs">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-left px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-neutral-200 hover:text-white block"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
