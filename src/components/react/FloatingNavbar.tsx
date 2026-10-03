import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, getLangFromUrl } from '../../i18n/ui';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const getWhitepaperDossiers = (isFa: boolean) => [
  {
    spec: isFa ? 'سند ۰۱' : 'Spec 01',
    title: isFa ? 'دفاتر کل و تسویه مالی' : 'Double-Entry Ledgers & Settlements',
    desc: isFa ? 'تخصیص دومرحله‌ای، قفل‌های ردیس و گارد تسویه مضاعف' : 'Two-Phase reservation, Redis locks & zero-drift ledgers',
    href: isFa ? `${baseUrl}fa/blog/payment-gateway/` : `${baseUrl}blog/payment-gateway/`,
  },
  {
    spec: isFa ? 'سند ۰۲' : 'Spec 02',
    title: isFa ? 'احراز هویت و مهار تقلب' : 'eKYC & Forensic Fraud Defense',
    desc: isFa ? 'احراز هویت شاهکار، 3DS 2.0 و زون ایزوله بانکی' : 'Shahkar eKYC, 3DS 2.0 & PCI-DSS token vault',
    href: isFa ? `${baseUrl}fa/blog/fraud-tracing/` : `${baseUrl}blog/fraud-tracing/`,
  },
  {
    spec: isFa ? 'سند ۰۳' : 'Spec 03',
    title: isFa ? 'سوییچ هوشمند پرداخت' : 'Smart PSP Switch & Routing',
    desc: isFa ? 'روتینگ پویا، هاب فناوران و پروتکل ISO 8583' : 'Dynamic weighted routing, Faravaran Hub & ISO 8583',
    href: isFa ? `${baseUrl}fa/blog/sms-infrastructure/` : `${baseUrl}blog/sms-infrastructure/`,
  },
  {
    spec: isFa ? 'سند ۰۴' : 'Spec 04',
    title: isFa ? 'مغایرت‌گیری و ریل‌های بانکی' : 'Multi-Pass Reconciliation & Payouts',
    desc: isFa ? 'مغایرت‌گیری شبانه، پایا، ساتنا و بازیابی Refund-MNG' : 'Spring Batch multi-pass reconciler & Paya/Satna bank proxy',
    href: isFa ? `${baseUrl}fa/blog/event-driven-migration/` : `${baseUrl}blog/event-driven-migration/`,
  },
];

interface FloatingNavbarProps {
  locale?: 'en' | 'fa';
}

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'fa'>(locale);
  const isFa = currentLang === 'fa';
  const defaultSwitchTarget = locale === 'fa' ? baseUrl : `${baseUrl}fa/`;
  const [switchTarget, setSwitchTarget] = useState<string>(defaultSwitchTarget);

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

  const t = useTranslations(currentLang);
  const homePath = isFa ? `${baseUrl}fa/` : baseUrl;
  const switchLabel = isFa ? 'EN' : 'FA';

  const navLinks = [
    { href: isFa ? `${baseUrl}fa/about/` : `${baseUrl}about/`, label: t('nav.about') },
    { href: isFa ? `${baseUrl}fa/#payment-settlement` : `${baseUrl}#payment-settlement`, label: t('nav.settlements') },
    { href: isFa ? `${baseUrl}fa/#fraud-forensics` : `${baseUrl}#fraud-forensics`, label: t('nav.fraud') },
    { href: isFa ? `${baseUrl}fa/#payment-switch` : `${baseUrl}#payment-switch`, label: t('nav.switch') },
    { href: isFa ? `${baseUrl}fa/#reconciliation-engine` : `${baseUrl}#reconciliation-engine`, label: t('nav.reconciliation') },
    { href: isFa ? `${baseUrl}fa/#incident-dossiers` : `${baseUrl}#incident-dossiers`, label: t('nav.dossiers') },
    { href: isFa ? `${baseUrl}fa/#lifecycle` : `${baseUrl}#lifecycle`, label: t('nav.lifecycle') },
    { href: isFa ? `${baseUrl}fa/work/` : `${baseUrl}work/`, label: t('nav.work') },
    { href: isFa ? `${baseUrl}fa/blog/` : `${baseUrl}blog/`, label: t('nav.blog') },
  ];

  const dossiers = getWhitepaperDossiers(isFa);

  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - lastY;
    if (current < 60) {
      setVisible(true);
    } else if (diff > 5) {
      setVisible(false);
      setDropdownOpen(false);
      setMobileOpen(false);
    } else if (diff < -5) {
      setVisible(true);
    }
    setLastY(current);
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1540px] ${isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"}`}
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <nav className="relative bg-[#0b1120]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-5 py-2.5 flex items-center justify-between shadow-2xl ring-1 ring-white/5">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
          <a href={homePath} className="font-bold text-xs sm:text-sm tracking-wider text-[#f8fafc] uppercase hover:text-[#e2c974] transition-colors whitespace-nowrap">
            {isFa ? 'آریا صراف‌زاده' : 'ARIYA SARRAFZADEH'}<span className="text-[#06b6d4]">.</span>
          </a>
        </div>

        {/* Desktop Links (lg+) */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3.5 2xl:gap-4 text-[10.5px] xl:text-[11px] uppercase tracking-wider text-[#94a3b8] whitespace-nowrap">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#e2c974] transition-colors py-1 px-1 focus-visible:outline-1 focus-visible:outline-[#e2c974]"
            >
              {item.label}
            </a>
          ))}

          {/* Whitepapers Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1 py-1 px-1 text-[#94a3b8] hover:text-[#e2c974] text-[10.5px] xl:text-[11px] uppercase transition-colors cursor-pointer"
            >
              <span>{t('nav.whitepapers')}</span>
              <span className="text-[9px]">{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute ${isFa ? 'left-0' : 'right-0'} top-full mt-2 w-96 bg-[#111827]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 ring-1 ring-white/5 ${isFa ? 'text-right' : 'text-left'}`}
                  dir={isFa ? 'rtl' : 'ltr'}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-2 flex justify-between items-center text-[10px] text-[#94a3b8] uppercase">
                    <span className="text-[#06b6d4] font-bold">{isFa ? 'مستندات معماری و مشخصات فنی' : 'Technical Specifications'}</span>
                    <a href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`} onClick={closeMenus} className="text-[#e2c974] hover:underline font-bold">
                      {isFa ? 'فهرست مقالات ←' : 'Open Index →'}
                    </a>
                  </div>

                  <div className="space-y-1">
                    {dossiers.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        onClick={closeMenus}
                        className={`block p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#06b6d4]/40 hover:bg-white/[0.05] transition-all duration-300 group ${isFa ? 'text-right' : 'text-left'}`}
                        dir={isFa ? 'rtl' : 'ltr'}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#e2c974] uppercase">{doc.spec}</span>
                          <span className="text-[10px] text-white/30 group-hover:text-[#06b6d4] transition">{isFa ? '←' : '→'}</span>
                        </div>
                        <p className="text-xs font-bold text-[#f8fafc] group-hover:text-[#e2c974] transition mt-1">{doc.title}</p>
                        <p className="text-[10px] text-[#94a3b8] mt-0.5 line-clamp-1">{doc.desc}</p>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Anchor */}
          <a
            href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
            className="hover:text-[#f8fafc] text-[#94a3b8] transition-colors py-1 px-1"
          >
            {t('nav.contact')}
          </a>
        </div>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-2.5 shrink-0" ref={mobileRef}>
          <a
            href={switchTarget}
            className="px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-[#e2c974] hover:border-[#e2c974] hover:text-[#f8fafc] font-bold text-xs uppercase transition tracking-wider active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2c974]"
            title={isFa ? 'Switch to English' : 'تغییر به فارسی'}
            aria-label={isFa ? 'Switch to English' : 'تغییر به فارسی'}
          >
            {switchLabel}
          </a>

          <a
            href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
            className="hidden sm:inline-flex px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#e2c974] text-[#0b1120] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2c974] whitespace-nowrap"
          >
            {t('nav.schedule')}
          </a>

          <button
            type="button"
            className="lg:hidden px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-[#f8fafc] text-xs uppercase tracking-wider hover:border-[#e2c974] hover:text-[#e2c974] transition active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e2c974]"
            aria-expanded={mobileOpen}
            aria-label="Open navigation"
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen(!mobileOpen);
              setDropdownOpen(false);
            }}
          >
            {mobileOpen ? (isFa ? 'بستن' : 'Close') : (isFa ? 'منو' : 'Menu')}
          </button>

          {/* Mobile Menu Dropdown */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`absolute ${isFa ? 'left-3' : 'right-3'} top-full mt-2 w-[min(26rem,calc(100vw-2rem))] max-h-[calc(100vh-5.5rem)] overflow-y-auto bg-[#111827]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 z-50 lg:hidden ring-1 ring-white/5 space-y-3`}
                dir={isFa ? 'rtl' : 'ltr'}
              >
                {/* Main Pages */}
                <div>
                  <div className="px-2 py-1 text-[10px] text-[#e2c974] uppercase font-bold tracking-wider border-b border-white/10 mb-1">
                    {isFa ? 'صفحات اصلی' : 'Main Pages'}
                  </div>
                  <div className="space-y-0.5">
                    <a
                      href={isFa ? `${baseUrl}fa/about/` : `${baseUrl}about/`}
                      onClick={closeMenus}
                      className="block px-3 py-2 rounded-lg text-xs uppercase tracking-wider text-[#cbd5e1] hover:bg-white/[0.06] hover:text-[#f8fafc] transition-colors font-medium"
                    >
                      {t('nav.about')}
                    </a>
                    <a
                      href={isFa ? `${baseUrl}fa/work/` : `${baseUrl}work/`}
                      onClick={closeMenus}
                      className="block px-3 py-2 rounded-lg text-xs uppercase tracking-wider text-[#cbd5e1] hover:bg-white/[0.06] hover:text-[#f8fafc] transition-colors font-medium"
                    >
                      {t('nav.work')}
                    </a>
                  </div>
                </div>

                {/* System Architecture Anchors */}
                <div>
                  <div className="px-2 py-1 text-[10px] text-[#06b6d4] uppercase font-bold tracking-wider border-b border-white/10 mb-1">
                    {isFa ? 'بخش‌های فنی و معماری' : 'Architecture Sections'}
                  </div>
                  <div className="space-y-0.5">
                    {navLinks.slice(1, 7).map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMenus}
                        className="block px-3 py-1.5 rounded-lg text-xs tracking-wider text-[#94a3b8] hover:bg-white/[0.05] hover:text-[#f8fafc] transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Whitepapers & Specifications */}
                <div>
                  <div className="px-2 py-1 text-[10px] text-[#e2c974] uppercase font-bold tracking-wider border-b border-white/10 mb-1 flex justify-between items-center">
                    <span>{t('nav.whitepapers')}</span>
                    <a
                      href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
                      onClick={closeMenus}
                      className="text-[#06b6d4] hover:underline normal-case text-[10px]"
                    >
                      {isFa ? 'مشاهده همه' : 'View All'} &rarr;
                    </a>
                  </div>
                  <div className="space-y-1 mt-1">
                    {dossiers.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        onClick={closeMenus}
                        className="block px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] tracking-wider text-[#cbd5e1] hover:text-[#e2c974] hover:bg-white/[0.05] transition-colors"
                      >
                        <span className="text-[10px] text-[#e2c974] font-mono me-2">{doc.spec}:</span>
                        <span>{doc.title}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Contact CTA in Mobile Menu */}
                <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                  <a
                    href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
                    onClick={closeMenus}
                    className="block text-center px-3 py-2 rounded-lg text-xs uppercase tracking-wider text-[#94a3b8] hover:bg-white/[0.05] hover:text-[#f8fafc] transition-colors"
                  >
                    {t('nav.contact')}
                  </a>
                  <a
                    href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
                    onClick={closeMenus}
                    className="block text-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#e2c974] text-[#0b1120] font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-[#d4af37]/25 transition-all"
                  >
                    {t('nav.schedule')}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </nav>
    </motion.header>
  );
}
