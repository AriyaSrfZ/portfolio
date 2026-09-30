import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTranslations, getLangFromUrl, type ui } from '../../i18n/ui';

const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const getWhitepaperDossiers = (isFa: boolean) => [
  {
    spec: isFa ? 'سند ۰۱' : 'Spec 01',
    title: isFa ? 'سوییچ پرداخت و دفاتر کل' : 'Payment Switch & Ledgers',
    desc: isFa ? 'تایم‌اوت ISO 8583، قفل‌های ردیس و گارد تسویه مضاعف' : 'ISO 8583 timeouts, Redis locks & double-settlement guards',
    href: isFa ? `${baseUrl}fa/blog/payment-gateway/` : `${baseUrl}blog/payment-gateway/`,
  },
  {
    spec: isFa ? 'سند ۰۲' : 'Spec 02',
    title: isFa ? 'مهار جرم‌شناسانه تقلب' : 'Forensic Fraud Mitigation',
    desc: isFa ? 'تله‌متری لبه، 3DS 2.0 و حلقه ریسک زیر ۱۵ میلی‌ثانیه' : 'Edge telemetry, 3DS 2.0 & sub-15ms risk loops',
    href: isFa ? `${baseUrl}fa/blog/fraud-tracing/` : `${baseUrl}blog/fraud-tracing/`,
  },
  {
    spec: isFa ? 'سند ۰۳' : 'Spec 03',
    title: isFa ? 'زیرساخت پیامک مخابراتی' : 'Telecom & SMS Infrastructure',
    desc: isFa ? 'تجمیع‌کنندگان SMPP 3.4 و پنجره‌های UCS-2' : 'SMPP 3.4 aggregators & UCS-2 windowing',
    href: isFa ? `${baseUrl}fa/blog/sms-infrastructure/` : `${baseUrl}blog/sms-infrastructure/`,
  },
  {
    spec: isFa ? 'سند ۰۴' : 'Spec 04',
    title: isFa ? 'ماشین‌های وضعیت وب۳' : 'Web3 & Crypto State Machines',
    desc: isFa ? 'محاسبات قطعی EVM و نهایی‌سازی رول‌آپ' : 'Deterministic EVM compute & rollup finality',
    href: `${baseUrl}blog/web3-infrastructure/`,
  },
];

interface FloatingNavbarProps {
  locale?: 'en' | 'fa';
}

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const [currentLang, setCurrentLang] = useState<'en' | 'fa'>(locale);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected = getLangFromUrl(new URL(window.location.href));
      setCurrentLang(detected);
    }
  }, []);

  const isFa = currentLang === 'fa';
  const t = useTranslations(currentLang);
  const homePath = isFa ? `${baseUrl}fa/` : baseUrl;
  const switchTarget = isFa ? baseUrl : `${baseUrl}fa/`;
  const switchLabel = isFa ? 'EN' : 'FA';

  const inPageAnchors = [
    { href: isFa ? `${baseUrl}fa/#payment-settlement` : `${baseUrl}#payment-settlement`, label: t('nav.settlements') },
    { href: isFa ? `${baseUrl}fa/#fraud-forensics` : `${baseUrl}#fraud-forensics`, label: t('nav.fraud') },
    { href: isFa ? `${baseUrl}fa/#sms-gateway` : `${baseUrl}#sms-gateway`, label: t('nav.sms') },
    { href: isFa ? `${baseUrl}fa/#data-pipeline` : `${baseUrl}#data-pipeline`, label: t('nav.data') },
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1500px] font-['IBM_Plex_Mono',monospace]"
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <nav className="relative bg-[#141210] border-2 border-[#5c6650] px-5 py-2.5 flex items-center justify-between shadow-2xl rugged-hatch">
        <span className="absolute -top-[4px] -left-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -top-[4px] -right-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -bottom-[4px] -left-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -bottom-[4px] -right-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />

        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#c9a15a] animate-pulse" />
          <a href={homePath} className="font-bold text-xs sm:text-sm tracking-wider text-[#e8e2d5] uppercase hover:text-[#c9a15a] transition-colors">
            {isFa ? 'آریا صراف‌زاده' : 'ARIYA SARRAFZADEH'}<span className="text-[#c4562e]">.</span>
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-5 text-xs uppercase tracking-wider text-[#a8a196]">
          {inPageAnchors.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#c9a15a] transition-colors py-1 focus-visible:outline-1 focus-visible:outline-[#c9a15a]"
            >
              {item.label}
            </a>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1.5 py-1 text-[#a8a196] hover:text-[#c9a15a] text-xs uppercase transition-colors cursor-pointer"
            >
              <span>{t('nav.whitepapers')}</span>
              <span className="text-[10px]">{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-[#1c1916] border-2 border-[#5c6650] shadow-2xl p-2 z-50 rugged-hatch"
                >
                  <div className="px-3 py-1.5 border-b border-[#5c6650] mb-2 flex justify-between items-center text-[10px] text-[#a8a196] uppercase">
                    <span className="text-[#c4562e] font-bold">{isFa ? 'اسناد مشخصات فنی' : 'Technical Specifications'}</span>
                    <a href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`} onClick={closeMenus} className="text-[#c9a15a] hover:underline font-bold">
                      {isFa ? 'فهرست اسناد ←' : 'Open Index →'}
                    </a>
                  </div>

                  <div className="space-y-1">
                    {dossiers.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        onClick={closeMenus}
                        className="block p-2.5 bg-[#141210] border border-[#5c6650]/60 hover:border-[#c4562e] hover:bg-[#1c1916] transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#c9a15a] uppercase">{doc.spec}</span>
                          <span className="text-[10px] text-[#5c6650] group-hover:text-[#c4562e] transition">&rarr;</span>
                        </div>
                        <p className="text-xs font-bold text-[#e8e2d5] uppercase group-hover:text-[#c9a15a] transition mt-0.5">{doc.title}</p>
                        <p className="text-[10px] text-[#a8a196] mt-0.5 line-clamp-1">{doc.desc}</p>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
            className="hover:text-[#e8e2d5] text-[#a8a196] transition-colors py-1"
          >
            {t('nav.contact')}
          </a>
        </div>

        <div className="flex items-center gap-3" ref={mobileRef}>
          <a
            href={switchTarget}
            className="px-2.5 py-1 border border-[#5c6650] text-[#c9a15a] hover:border-[#c4562e] hover:text-[#e8e2d5] font-bold text-xs uppercase transition tracking-wider"
            title={isFa ? 'Switch to English' : 'تغییر به فارسی'}
          >
            {switchLabel}
          </a>

          <a
            href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
            className="hidden sm:inline-flex px-3 py-1.5 bg-[#c4562e] text-[#141210] font-bold text-xs uppercase tracking-wider hover:brightness-90 transition"
          >
            {t('nav.schedule')}
          </a>

          <button
            type="button"
            className="lg:hidden px-2.5 py-1.5 border border-[#5c6650] text-[#e8e2d5] text-xs uppercase tracking-wider hover:border-[#c9a15a] hover:text-[#c9a15a] transition"
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

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.12 }}
                className="absolute right-3 top-full mt-2 w-[min(24rem,calc(100%-1.5rem))] bg-[#1c1916] border-2 border-[#5c6650] shadow-2xl p-2 z-50 lg:hidden rugged-hatch"
              >
                <div className="px-3 py-1.5 border-b border-[#5c6650] mb-2 text-[10px] text-[#a8a196] uppercase">
                  {isFa ? 'فهرست سامانه‌ها' : 'System Index'}
                </div>
                <div className="space-y-1">
                  {inPageAnchors.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={closeMenus}
                      className="block px-3 py-2 text-xs uppercase tracking-wider text-[#a8a196] hover:bg-[#141210] hover:text-[#e8e2d5] border border-transparent hover:border-[#c4562e]"
                    >
                      {item.label}
                    </a>
                  ))}
                  <a
                    href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
                    onClick={closeMenus}
                    className="block px-3 py-2 text-xs uppercase tracking-wider text-[#a8a196] hover:bg-[#141210] hover:text-[#e8e2d5] border border-transparent hover:border-[#c4562e]"
                  >
                    {t('nav.whitepapers')}
                  </a>
                  {dossiers.map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      onClick={closeMenus}
                      className="block px-5 py-1.5 text-[10px] uppercase tracking-wider text-[#c9a15a] hover:text-[#e8e2d5]"
                    >
                      {doc.spec} // {doc.title}
                    </a>
                  ))}
                  <a
                    href={isFa ? `${baseUrl}fa/#book` : `${baseUrl}#book`}
                    onClick={closeMenus}
                    className="block px-3 py-2 text-xs uppercase tracking-wider text-[#a8a196] hover:bg-[#141210] hover:text-[#e8e2d5] border border-transparent hover:border-[#c4562e]"
                  >
                    {t('nav.contact')}
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
