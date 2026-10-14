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
export type DarkFlavor = 'oled' | 'spacegray' | 'midnight';
export type GlassIntensity = 'liquid' | 'clear' | 'reduced';

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'fa'>(locale);
  const isFa = currentLang === 'fa';
  const defaultSwitchTarget = locale === 'fa' ? baseUrl : `${baseUrl}fa/`;
  const [switchTarget, setSwitchTarget] = useState<string>(defaultSwitchTarget);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('payment-settlement');

  // Apple Appearance & Dark Mode State
  const [appearance, setAppearance] = useState<AppearanceMode>('dark');
  const [darkFlavor, setDarkFlavor] = useState<DarkFlavor>('spacegray');
  const [glassIntensity, setGlassIntensity] = useState<GlassIntensity>('liquid');
  const [appearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const applyTheme = (mode: AppearanceMode, flavor: DarkFlavor, glass: GlassIntensity) => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    let effective: 'dark' | 'light' = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;

    root.setAttribute('data-appearance', effective);
    root.setAttribute('data-dark-flavor', flavor);
    root.setAttribute('data-glass-intensity', glass);

    if (effective === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }

    try {
      localStorage.setItem('apple-appearance-mode', mode);
      localStorage.setItem('apple-dark-flavor', flavor);
      localStorage.setItem('apple-glass-intensity', glass);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('apple-theme-change', { detail: { mode, effective, flavor, glass } }));
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = getLangFromUrl(new URL(window.location.href));
      setCurrentLang(detected);

      // Read saved theme preferences
      try {
        const savedMode = (localStorage.getItem('apple-appearance-mode') as AppearanceMode) || 'dark';
        const savedFlavor = (localStorage.getItem('apple-dark-flavor') as DarkFlavor) || 'spacegray';
        const savedGlass = (localStorage.getItem('apple-glass-intensity') as GlassIntensity) || 'liquid';
        setAppearance(savedMode);
        setDarkFlavor(savedFlavor);
        setGlassIntensity(savedGlass);
        applyTheme(savedMode, savedFlavor, savedGlass);
      } catch (e) {}

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
    <header className="fixed top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-4 lg:inset-x-8 max-w-[1920px] 2xl:max-w-[2160px] mx-auto h-14 z-50 liquid-glass-navbar rounded-2xl sm:rounded-full transition-all">
      <div className="w-full h-full px-3 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand + Status Badge */}
        <div className="flex items-center gap-3">
          <a
            href={isFa ? `${baseUrl}fa/` : baseUrl}
            className="text-xs sm:text-sm font-bold tracking-wide text-[var(--system-label,#ffffff)] hover:opacity-80 transition-opacity uppercase font-sans"
          >
            ARIYA SARRAFZADEH
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-sans font-medium text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Fintech &amp; Telecom Infrastructure</span>
          </span>
        </div>

        {/* Right: Horizontal Section Pills + Appearance Menu + Language Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Nav Pills */}
          <nav className="hidden lg:flex items-center gap-1 font-sans text-xs bg-black/20 p-1 rounded-full border border-white/[0.08] backdrop-blur-md">
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
                      ? 'bg-white/20 text-white font-semibold border border-white/30 shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                      : 'text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-transparent'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Divider */}
          <span className="hidden lg:block w-px h-4 bg-white/15 mx-1"></span>

          {/* Secondary Links */}
          <a
            href={isFa ? `${baseUrl}fa/dictionary/` : `${baseUrl}dictionary/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-sans font-medium text-neutral-300 hover:text-white transition-colors"
          >
            {isFa ? 'واژه‌نامه' : 'Dictionary'}
          </a>
          <a
            href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-sans font-medium text-neutral-300 hover:text-white transition-colors"
          >
            {isFa ? 'وایت‌پیپرها' : 'Whitepapers'}
          </a>

          {/* Apple Appearance & Dark Mode Options Button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setAppearanceMenuOpen(!appearanceMenuOpen)}
              className="h-8 px-2.5 rounded-full bg-white/[0.08] hover:bg-white/15 border border-white/15 text-white flex items-center gap-1.5 text-xs transition-all active:scale-95"
              aria-label="Appearance and Dark Mode Options"
              title={isFa ? 'تنظیمات تم و دارک‌مود اپل' : 'Apple Appearance & Dark Mode Options'}
            >
              {appearance === 'light' ? (
                <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
              <span className="hidden sm:inline font-sans text-[11px] font-semibold tracking-wider text-neutral-200">
                {appearance === 'light' ? 'Light' : darkFlavor === 'oled' ? 'OLED' : darkFlavor === 'spacegray' ? 'Gray' : 'Dark'}
              </span>
              <svg className={`w-3 h-3 text-neutral-400 transition-transform ${appearanceMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Apple Liquid Glass Popover Sheet */}
            {appearanceMenuOpen && (
              <div
                className={`absolute top-11 ${isFa ? 'left-0' : 'right-0'} w-72 sm:w-80 p-4 rounded-2xl liquid-glass-card border border-white/20 shadow-2xl z-50 text-xs font-sans space-y-3.5 animate-in fade-in duration-200`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Popover Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {isFa ? 'تنظیمات ظاهر و دارک‌مود' : 'Display & Appearance'}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                    Apple HIG
                  </span>
                </div>

                {/* Section 1: Appearance Mode */}
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1.5 tracking-wider">
                    {isFa ? 'حالت ظاهر' : 'Appearance'}
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    {[
                      { id: 'dark' as AppearanceMode, label: isFa ? 'تاریک' : 'Dark', icon: '🌙' },
                      { id: 'light' as AppearanceMode, label: isFa ? 'روشن' : 'Light', icon: '☀️' },
                      { id: 'system' as AppearanceMode, label: isFa ? 'سیستم' : 'Auto', icon: '⚙️' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setAppearance(opt.id);
                          applyTheme(opt.id, darkFlavor, glassIntensity);
                        }}
                        className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all flex items-center justify-center gap-1 text-[11px] ${
                          appearance === opt.id
                            ? 'bg-white/20 text-white font-semibold shadow-sm border border-white/25'
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 2: Dark Mode Flavors */}
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1.5 tracking-wider flex items-center justify-between">
                    <span>{isFa ? 'گزینه‌های دارک‌مود (Dark Mode Options)' : 'Dark Mode Options'}</span>
                    <span className="text-[9px] text-cyan-400 font-mono">iOS / macOS</span>
                  </div>
                  <div className="space-y-1">
                    {[
                      { id: 'oled' as DarkFlavor, name: isFa ? 'مشکی اولد (OLED Pure Black)' : 'OLED Pitch Black', desc: '#000000 · High contrast & battery saver', color: 'bg-black border-white/40' },
                      { id: 'spacegray' as DarkFlavor, name: isFa ? 'خاکستری فضایی (Space Gray)' : 'Space Gray', desc: '#0e1117 · macOS Sequoia graphite depth', color: 'bg-[#0e1117] border-white/20' },
                      { id: 'midnight' as DarkFlavor, name: isFa ? 'سورمه‌ای نیمه‌شب (Midnight Navy)' : 'Midnight Navy', desc: '#07090e · Apple iOS flagship sapphire', color: 'bg-[#07090e] border-cyan-400/40' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setDarkFlavor(f.id);
                          applyTheme(appearance, f.id, glassIntensity);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-all border ${
                          darkFlavor === f.id
                            ? 'bg-white/15 border-white/30 shadow-md text-white'
                            : 'bg-white/[0.03] border-white/5 text-neutral-300 hover:bg-white/[0.08]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`w-3.5 h-3.5 rounded-full border ${f.color} shrink-0`} />
                          <div>
                            <div className="text-[11px] font-semibold leading-tight">{f.name}</div>
                            <div className="text-[9px] text-neutral-400 font-mono">{f.desc}</div>
                          </div>
                        </div>
                        {darkFlavor === f.id && (
                          <span className="text-cyan-400 font-bold text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Liquid Glass Material Level */}
                <div>
                  <div className="text-[10px] uppercase font-semibold text-neutral-400 mb-1.5 tracking-wider">
                    {isFa ? 'شدت شیشه مایع (Liquid Glass)' : 'Liquid Glass Material'}
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                    {[
                      { id: 'liquid' as GlassIntensity, label: isFa ? 'شیشه کامل' : 'Vibrant Glass' },
                      { id: 'clear' as GlassIntensity, label: isFa ? 'نیمه‌شفاف' : 'Clear Glass' },
                      { id: 'reduced' as GlassIntensity, label: isFa ? 'کدر' : 'Solid' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setGlassIntensity(g.id);
                          applyTheme(appearance, darkFlavor, g.id);
                        }}
                        className={`py-1 px-1.5 rounded-lg text-center text-[10px] font-medium transition-all truncate ${
                          glassIntensity === g.id
                            ? 'bg-white/20 text-white font-semibold border border-white/25 shadow-sm'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setAppearanceMenuOpen(false)}
                  className="w-full py-1.5 text-center text-[11px] rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition-all"
                >
                  {isFa ? 'بستن' : 'Done'}
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <a
            href={switchTarget}
            className="h-8 px-3 rounded-full bg-white/[0.08] hover:bg-white/15 border border-white/15 text-[11px] font-sans font-semibold text-white flex items-center justify-center transition-all tracking-wider active:scale-95"
          >
            {isFa ? 'EN' : 'FA'}
          </a>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full text-neutral-200 hover:text-white hover:bg-white/10 transition-colors"
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
        <div className="lg:hidden w-full mt-2 rounded-2xl liquid-glass-card border border-white/15 p-4 space-y-3 shadow-2xl">
          <div className="grid grid-cols-2 gap-2 font-sans text-xs">
            {navItems.map((item) => (
              <a
                key={item.target}
                href={isFa ? `${baseUrl}fa/#${item.target}` : `${baseUrl}#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target, item.env)}
                className="text-left px-3 py-2 rounded-xl bg-white/[0.04] border border-white/5 text-neutral-300 hover:text-white block font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-wrap gap-4 text-xs font-sans">
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
            <a href={`${baseUrl}docs/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'مستندات API' : 'Docs'}
            </a>
            <a href={isFa ? `${baseUrl}fa/contact/` : `${baseUrl}contact/`} className="text-neutral-400 hover:text-white">
              {isFa ? 'تماس' : 'Contact'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
