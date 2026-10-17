import { useState, useEffect, useRef } from 'react';
import { getLangFromUrl } from '../../i18n/ui';
import type { ActiveEnvironment } from './BackgroundController';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

interface FloatingNavbarProps {
  locale?: 'en' | 'fa';
}

export type AppearanceMode = 'dark' | 'light' | 'system';

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'fa'>(locale);
  const isFa = currentLang === 'fa';
  const defaultSwitchTarget = locale === 'fa' ? baseUrl : `${baseUrl}fa/`;
  const [switchTarget, setSwitchTarget] = useState<string>(defaultSwitchTarget);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('payment-settlement');

  // Theme & Appearance State
  const [appearance, setAppearance] = useState<AppearanceMode>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'dark' | 'light'>('dark');
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const applyTheme = (mode: AppearanceMode) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    let effective: 'dark' | 'light' = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;

    setEffectiveTheme(effective);
    root.setAttribute('data-appearance', effective);

    if (effective === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    try {
      localStorage.setItem('appearance-mode', mode);
      localStorage.setItem('apple-appearance-mode', mode);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('theme-change', { detail: { mode, effective } }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = getLangFromUrl(new URL(window.location.href));
      setCurrentLang(detected);

      // Read saved theme preferences
      try {
        const savedMode = (localStorage.getItem('appearance-mode') as AppearanceMode) || 
                          (localStorage.getItem('apple-appearance-mode') as AppearanceMode) || 
                          'system';
        setAppearance(savedMode);
        applyTheme(savedMode);
      } catch (e) {}

      // Listen for system theme changes if in system mode
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: MediaQueryListEvent) => {
        const currentMode = localStorage.getItem('appearance-mode') || 'system';
        if (currentMode === 'system') {
          applyTheme('system');
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);

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

      // Close popover on click outside
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          setAppearanceMenuOpen(false);
        }
      };
      window.addEventListener('mousedown', handleClickOutside);

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
        mediaQuery.removeEventListener('change', handleSystemChange);
        window.removeEventListener('mousedown', handleClickOutside);
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
    <header className="fixed top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-4 lg:inset-x-8 max-w-[1920px] 2xl:max-w-[2160px] mx-auto h-14 z-50 liquid-glass-navbar rounded-2xl sm:rounded-full transition-all" dir={isFa ? 'rtl' : 'ltr'}>
      <div className="w-full h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Monogram + Full Name */}
        <div className="flex items-center gap-3">
          <a
            href={isFa ? `${baseUrl}fa/` : baseUrl}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[var(--border)] shadow-sm shrink-0 flex items-center justify-center bg-[var(--surface-elevated)] group-hover:border-[var(--accent-primary)] transition-colors">
              <img 
                src={`${baseUrl}favicon.svg`} 
                alt="Ariya Sarrafzadeh Monogram" 
                className="w-5 h-5 block" 
              />
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors font-sans">
              {isFa ? 'آریا صراف‌زاده' : 'ARIYA SARRAFZADEH'}
            </span>
          </a>
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[11px] font-sans font-medium text-[var(--text-secondary)]">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)]"></span>
            <span>{isFa ? 'معمار سیستم‌ها' : 'Systems Architect'}</span>
          </span>
        </div>

        {/* Right: Section Pills + Secondary Links + Theme Switcher + Language Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 font-sans text-xs bg-[var(--surface-elevated)] p-1 rounded-full border border-[var(--border)]">
            {navItems.map((item) => {
              const isActive = activeSection === item.target;
              const targetHref = isFa ? `${baseUrl}fa/#${item.target}` : `${baseUrl}#${item.target}`;
              return (
                <a
                  key={item.target}
                  href={targetHref}
                  onClick={(e) => handleNavClick(e, item.target, item.env)}
                  className={`px-3 py-1 rounded-full transition-all font-sans text-xs font-medium active:scale-95 ${
                    isActive
                      ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Divider */}
          <span className="hidden lg:block w-px h-4 bg-[var(--border)] mx-1"></span>

          {/* Secondary Links */}
          <a
            href={isFa ? `${baseUrl}fa/dictionary/` : `${baseUrl}dictionary/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-sans font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isFa ? 'واژه‌نامه' : 'Dictionary'}
          </a>
          <a
            href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-sans font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isFa ? 'وایت‌پیپرها' : 'Whitepapers'}
          </a>

          {/* Theme Selector Popover */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setAppearanceMenuOpen(!appearanceMenuOpen)}
              className="h-8 px-2.5 sm:px-3 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5 text-xs transition-all active:scale-95 shadow-sm"
              aria-label="Theme & Appearance Settings"
              title={isFa ? 'تنظیمات تم و ظاهر' : 'Theme & Appearance Settings'}
            >
              {effectiveTheme === 'dark' ? (
                <svg className="w-3.5 h-3.5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[var(--accent-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
              <span className="hidden sm:inline font-sans text-[11px] font-medium">
                {appearance === 'system' ? (isFa ? 'خودکار' : 'System') : appearance === 'dark' ? (isFa ? 'تیره' : 'Dark') : (isFa ? 'روشن' : 'Light')}
              </span>
              <svg className={`w-3 h-3 text-[var(--text-secondary)] transition-transform ${appearanceMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Theme Popover Menu */}
            {appearanceMenuOpen && (
              <div
                className={`absolute top-11 ${isFa ? 'left-0' : 'right-0'} w-48 p-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-xl z-50 text-xs font-sans space-y-1`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2 py-1 text-[10px] uppercase font-semibold text-[var(--text-secondary)] tracking-wider border-b border-[var(--border)] mb-1">
                  {isFa ? 'حالت نمایش' : 'Theme Mode'}
                </div>
                {[
                  { id: 'dark' as AppearanceMode, label: isFa ? 'تیره (Carbon & Basalt)' : 'Dark (Carbon & Basalt)', icon: '🌙' },
                  { id: 'light' as AppearanceMode, label: isFa ? 'روشن (Porcelain & Paper)' : 'Light (Porcelain & Paper)', icon: '☀️' },
                  { id: 'system' as AppearanceMode, label: isFa ? 'خودکار بر اساس سیستم' : 'System Match (Auto)', icon: '💻' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAppearance(item.id);
                      applyTheme(item.id);
                      setAppearanceMenuOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors ${
                      appearance === item.id
                        ? 'bg-[var(--accent-primary)] text-white font-medium'
                        : 'text-[var(--text-primary)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </span>
                    {appearance === item.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <a
            href={switchTarget}
            className="h-8 px-2.5 sm:px-3 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] flex items-center gap-1.5 text-xs transition-all active:scale-95 shadow-sm font-sans font-medium"
            title={isFa ? 'Switch to English' : 'تغییر به فارسی'}
          >
            <span>{isFa ? 'EN' : 'فا'}</span>
          </a>

          {/* Mobile Navigation Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-8 w-8 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)]"
            aria-label="Open navigation menu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-20 inset-x-4 p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] shadow-2xl z-50 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.target}
              href={isFa ? `${baseUrl}fa/#${item.target}` : `${baseUrl}#${item.target}`}
              onClick={(e) => handleNavClick(e, item.target, item.env)}
              className="block px-3 py-2 rounded-lg text-sm text-[var(--text-primary)] hover:bg-[var(--surface)] transition-colors"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-around text-xs">
            <a href={isFa ? `${baseUrl}fa/dictionary/` : `${baseUrl}dictionary/`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {isFa ? 'واژه‌نامه' : 'Dictionary'}
            </a>
            <a href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {isFa ? 'وایت‌پیپرها' : 'Whitepapers'}
            </a>
            <a href={`${baseUrl}contact/`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              {isFa ? 'تماس' : 'Contact'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
