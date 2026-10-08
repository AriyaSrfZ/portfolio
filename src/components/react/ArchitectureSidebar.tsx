import React, { useEffect, useState } from 'react';

interface ArchitectureSidebarProps {
  locale?: 'en' | 'fa';
}

export default function ArchitectureSidebar({ locale = 'en' }: ArchitectureSidebarProps) {
  const isFa = locale === 'fa';
  const [activeSection, setActiveSection] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

  const sections = isFa
    ? [
        { id: 'overview', pageNum: '', label: 'نمای کلی', tag: 'نمای کلی' },
        { id: 'payment-settlement', pageNum: '۰۱', label: 'تسویه مالی و دفاتر کل توزیع‌شده', tag: 'بخش ۰۱' },
        { id: 'payment-switch', pageNum: '۰۲', label: 'سوییچ پرداخت و پروتکل‌های مخابراتی', tag: 'بخش ۰۲' },
        { id: 'fraud-forensics', pageNum: '۰۳', label: 'مدیریت ریسک، احراز هویت و مهار تقلب', tag: 'بخش ۰۳' },
        { id: 'reconciliation-engine', pageNum: '۰۴', label: 'مغایرت‌گیری و تسویه زودهنگام پذیرندگان', tag: 'بخش ۰۴' },
        { id: 'incident-dossiers', pageNum: '۰۵', label: 'آرشیو بحران‌های زنده در پروداکشن', tag: 'بخش ۰۵' },
        { id: 'lifecycle', pageNum: '۰۶', label: 'چرخه حیات محصول فنی', tag: 'بخش ۰۶' },
        { id: 'book', pageNum: '۰۷', label: 'جلسه بررسی معماری و مشاوره تخصصی', tag: 'بخش ۰۷' },
      ]
    : [
        { id: 'overview', pageNum: '', label: 'Overview', tag: 'OVERVIEW' },
        { id: 'payment-settlement', pageNum: '01', label: 'Settlements & Ledgers', tag: 'SECTION 01' },
        { id: 'payment-switch', pageNum: '02', label: 'Payment Switch', tag: 'SECTION 02' },
        { id: 'fraud-forensics', pageNum: '03', label: 'Fraud Risk & eKYC', tag: 'SECTION 03' },
        { id: 'reconciliation-engine', pageNum: '04', label: 'Reconciliation & Payouts', tag: 'SECTION 04' },
        { id: 'incident-dossiers', pageNum: '05', label: 'Production Incident Archive', tag: 'SECTION 05' },
        { id: 'lifecycle', pageNum: '06', label: 'Product Lifecycle Arc', tag: 'SECTION 06' },
        { id: 'book', pageNum: '07', label: 'Architecture Review & Intake', tag: 'SECTION 07' },
      ];

  useEffect(() => {
    const handleScroll = () => {
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 260 && rect.bottom > 180) {
            setActiveSection(s.id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isFa]);

  const currentIndex = sections.findIndex((s) => s.id === activeSection);
  const activeItem = sections[currentIndex] || sections[0];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    const nextIdx = (currentIndex + 1) % sections.length;
    const target = sections[nextIdx];
    const el = document.getElementById(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    const target = sections[prevIdx];
    const el = document.getElementById(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="lg:col-span-3 h-full">
      {/* =========================================================================
          MOBILE DOCK / STICKY STEPPER HUD (Visible on screens < 1024px)
          Solves missing left sidebar on mobile remote management
          ========================================================================= */}
      <div className="block lg:hidden sticky top-14 z-30 mb-4 font-sans select-none" dir={isFa ? 'rtl' : 'ltr'}>
        <div className="bg-[#0f1217]/95 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-2xl">
          <div className="flex items-center justify-between gap-2">
            {/* Active Dossier Indicator */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center gap-2 text-left truncate flex-1 min-w-0 px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all"
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded shrink-0">
                {activeItem.pageNum || (isFa ? 'نمای کلی' : 'Overview')}
              </span>
              <span className="text-xs font-mono font-medium text-white truncate">
                {activeItem.label}
              </span>
              <span className="text-xs text-neutral-400 ml-auto shrink-0">
                {mobileMenuOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Stepper Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handlePrevPage}
                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
                title={isFa ? 'صفحه قبل' : 'Prev'}
              >
                ←
              </button>
              <button
                onClick={handleNextPage}
                className="p-1.5 rounded-lg bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-xs font-mono transition-all"
                title={isFa ? 'صفحه بعد' : 'Next'}
              >
                →
              </button>
            </div>
          </div>

          {/* Expandable Mobile 8-Dossier Drawer */}
          {mobileMenuOpen && (
            <div className="mt-2.5 pt-2.5 border-t border-white/10 space-y-1 font-mono text-xs max-h-64 overflow-y-auto">
              {sections.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-white/15 text-white font-semibold border border-white/20'
                        : 'text-neutral-300 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{item.pageNum ? `${item.pageNum} · ` : ''}{item.label}</span>
                    <span className="text-[9px] text-cyan-400 font-mono ml-2 shrink-0">{item.tag}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP STICKY SIDEBAR (Visible on screens >= 1024px)
          ========================================================================= */}
      <aside className="hidden lg:block sticky top-20 space-y-3.5 pt-0.5 font-sans select-none" dir={isFa ? 'rtl' : 'ltr'}>
        {/* ARCHITECTURE INDEX LIST */}

        {/* 2. ARCHITECTURE INDEX LIST */}
        <div className="bg-[#0f1217]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
          <div className="text-xs font-bold text-[#e2c974] tracking-wider uppercase pb-2.5 border-b border-white/10 flex justify-between items-center font-mono">
            <span>{isFa ? 'فهرست سامانه‌ها' : 'Architecture Index'}</span>
          </div>

          {/* Section List */}
          <nav className="space-y-1 text-xs font-mono">
            {sections.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`block px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-md translate-x-0.5'
                      : 'text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.pageNum ? `${item.pageNum} · ` : ''}{item.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 ml-1" />
                    )}
                  </div>
                </a>
              );
            })}
          </nav>

          {/* Rolling Page Controls in Sidebar */}
          <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-300">
            <button
              onClick={handlePrevPage}
              className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
              title={isFa ? 'صفحه قبل' : 'Previous Page'}
            >
              <span>{isFa ? '→ قبلی' : '← Prev'}</span>
            </button>
            
            <span className="text-[10px] text-neutral-500 font-mono">
              {isFa ? 'فهرست بخش‌ها' : 'SECTIONS'}
            </span>

            <button
              onClick={handleNextPage}
              className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/10 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
              title={isFa ? 'صفحه بعد' : 'Next Page'}
            >
              <span>{isFa ? 'بعدی ←' : 'Next →'}</span>
            </button>
          </div>

          {/* Secondary Whitepapers Link */}
          <div className="pt-1 text-[11px] font-mono border-t border-white/5">
            <a
              href={isFa ? `${baseUrl}fa/whitepapers/` : `${baseUrl}whitepapers/`}
              className="block text-center py-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.04] transition-all"
            >
              {isFa ? 'مشاهده تمام وایت‌پیپرها ↗' : 'Browse All Whitepapers ↗'}
            </a>
          </div>
        </div>

      </aside>
    </div>
  );
}
