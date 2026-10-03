import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, getLangFromUrl } from '../../i18n/ui';
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
  const [activeTab, setActiveTab] = useState<ActiveEnvironment>('core');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

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
    }
  }, []);

  // Update active tab on scroll
  useEffect(() => {
    const handleEnvChange = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveEnvironment>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('ambient-env-change', handleEnvChange);
    return () => window.removeEventListener('ambient-env-change', handleEnvChange);
  }, []);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - lastY;
    if (current < 50) {
      setVisible(true);
    } else if (diff > 10) {
      setVisible(false);
      setMenuOpen(false);
    } else if (diff < -10) {
      setVisible(true);
    }
    setLastY(current);
  });

  const selectTab = (tab: ActiveEnvironment, targetId: string) => {
    setActiveTab(tab);
    window.dispatchEvent(new CustomEvent('ambient-env-change', { detail: tab }));
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = isFa ? `${baseUrl}fa/#${targetId}` : `${baseUrl}#${targetId}`;
    }
  };

  const tabs: { id: ActiveEnvironment; label: string; target: string }[] = [
    { id: 'core', label: isFa ? 'دفتر کل' : 'ARCH', target: 'payment-settlement' },
    { id: 'switch', label: isFa ? 'سوییچ' : 'SWITCH', target: 'payment-switch' },
    { id: 'recon', label: isFa ? 'مغایرت‌گیری' : 'RECON', target: 'reconciliation-engine' },
    { id: 'incidents', label: isFa ? 'پرونده‌ها' : 'DOSSIERS', target: 'incident-dossiers' },
  ];

  const moreLinks = [
    { href: isFa ? `${baseUrl}fa/work/` : `${baseUrl}work/`, label: isFa ? 'مطالعات موردی' : 'Case Studies' },
    { href: isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`, label: isFa ? 'وایت‌پیپرها' : 'Whitepapers' },
    { href: isFa ? `${baseUrl}fa/blog/` : `${baseUrl}blog/`, label: isFa ? 'وبلاگ مهندسی' : 'Blog' },
    { href: isFa ? `${baseUrl}fa/about/` : `${baseUrl}about/`, label: isFa ? 'درباره من' : 'About' },
  ];

  return (
    <>
      {/* Sub-44px Compact Data HUD */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: visible ? 0 : -60, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-3 inset-x-0 mx-auto max-w-4xl h-11 px-3.5 z-50 rounded-full border border-white/[0.08] bg-black/60 backdrop-blur-xl flex items-center justify-between shadow-2xl ring-1 ring-white/[0.04]"
        dir="ltr"
      >
        {/* Brand mark & Telemetry status */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <a
            href={isFa ? `${baseUrl}fa/` : baseUrl}
            className="font-semibold tracking-wider text-neutral-200 hover:text-white transition-colors"
          >
            ARIYA SARRAFZADEH
          </a>
          <span className="text-neutral-700 hidden sm:inline">/</span>
          <span className="text-neutral-500 text-[10px] hidden md:inline tracking-wider">
            UTC+3:30 · NOMINAL
          </span>
        </div>

        {/* Segmented Pill Tabs for Ambient Architecture Switch */}
        <nav className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.06] rounded-full p-0.5 gap-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id, tab.target)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all duration-200 ${
                  isActive
                    ? 'bg-white/10 text-white font-medium shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Nav Dropdown + Language Switcher */}
        <div className="flex items-center gap-1.5">
          {/* Menu Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2.5 py-1 rounded-full text-[11px] font-mono text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all flex items-center gap-1"
            >
              <span>INDEX</span>
              <svg
                className={`w-3 h-3 text-neutral-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 py-1.5 rounded-2xl border border-white/10 bg-[#090a0c]/90 backdrop-blur-2xl shadow-2xl z-50 flex flex-col"
                >
                  <div className="px-3 py-1 text-[10px] font-mono uppercase text-neutral-500 tracking-wider border-b border-white/[0.06]">
                    Navigation
                  </div>
                  {moreLinks.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="sm:hidden border-t border-white/[0.06] pt-1 mt-1">
                    <div className="px-3 py-1 text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
                      Architectural Pillars
                    </div>
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          selectTab(tab.id, tab.target);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compact Language Toggle */}
          <a
            href={switchTarget}
            aria-label={isFa ? 'Switch to English' : 'تغییر به فارسی'}
            className="px-2 py-1 rounded-full text-[10px] font-mono font-semibold text-neutral-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all tracking-wider"
          >
            {isFa ? 'EN' : 'FA'}
          </a>
        </div>
      </motion.header>
    </>
  );
}
