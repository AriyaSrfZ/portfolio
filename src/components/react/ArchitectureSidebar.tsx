import React, { useEffect, useState } from 'react';

interface ArchitectureSidebarProps {
  locale?: 'en' | 'fa';
}

export default function ArchitectureSidebar({ locale = 'en' }: ArchitectureSidebarProps) {
  const isFa = locale === 'fa';
  const [activeSection, setActiveSection] = useState<string>('overview');

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

  const sections = isFa
    ? [
        { id: 'overview', pageNum: '۰۱', label: 'خلاصه و نمایه اجرایی', tag: 'نمای کلی' },
        { id: 'payment-settlement', pageNum: '۰۲', label: 'دفتر کل دوطرفه و تسویه', tag: 'پرونده ۰۱' },
        { id: 'payment-switch', pageNum: '۰۳', label: 'سوییچ هوشمند پرداخت ISO', tag: 'پرونده ۰۲' },
        { id: 'fraud-forensics', pageNum: '۰۴', label: 'احراز هویت و ضدتقلب Neo4j', tag: 'پرونده ۰۳' },
        { id: 'reconciliation-engine', pageNum: '۰۵', label: 'مغایرت‌گیری سه‌طرفه و تسویه', tag: 'پرونده ۰۴' },
        { id: 'incident-dossiers', pageNum: '۰۶', label: 'بحران‌های زنده در پروداکشن', tag: 'آرشیو پایداری' },
        { id: 'lifecycle', pageNum: '۰۷', label: 'چرخه حیات محصول فنی', tag: 'متدولوژی TPM' },
        { id: 'book', pageNum: '۰۸', label: 'جلسه بررسی معماری', tag: 'رزرو جلسه' },
      ]
    : [
        { id: 'overview', pageNum: '01', label: 'Executive Landing Posture', tag: 'OVERVIEW' },
        { id: 'payment-settlement', pageNum: '02', label: 'Settlements & Ledgers', tag: 'DOSSIER 01' },
        { id: 'payment-switch', pageNum: '03', label: 'Smart PSP Switch (ISO 8583)', tag: 'DOSSIER 02' },
        { id: 'fraud-forensics', pageNum: '04', label: 'eKYC & Fraud Forensics', tag: 'DOSSIER 03' },
        { id: 'reconciliation-engine', pageNum: '05', label: 'Multi-Pass Reconciliation', tag: 'DOSSIER 04' },
        { id: 'incident-dossiers', pageNum: '06', label: 'Live Incident Postmortems', tag: 'RELIABILITY' },
        { id: 'lifecycle', pageNum: '07', label: 'Technical Product Lifecycle', tag: 'TPM ARC' },
        { id: 'book', pageNum: '08', label: 'Architecture Intake & Review', tag: 'INTAKE' },
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
    <aside className="hidden lg:block lg:col-span-3 sticky top-18 space-y-3 font-sans select-none" dir={isFa ? 'rtl' : 'ltr'}>
      
      {/* 1. MINIMIZED 1ST-PAGE BIO CARD (Appears on pages other than main page) */}
      {activeSection !== 'overview' && (
        <div className="bg-[#0f1217]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden group transition-all duration-300 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-[#13161c]">
              <img
                src={`${baseUrl}photos/ariya.jpg`}
                alt="Ariya Sarrafzadeh"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate font-mono">
                {isFa ? 'آریا صراف‌زاده' : 'ARIYA SARRAFZADEH'}
              </div>
              <div className="text-[10px] text-neutral-400 truncate font-mono">
                {isFa ? 'معمار ارشد سیستم و TPM' : 'Principal Systems Architect'}
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{isFa ? 'تهران · عملیاتی' : 'TEHRAN, IR · NOMINAL'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 text-[10px] font-mono text-neutral-300">
            <a
              href="#overview"
              onClick={(e) => handleNavClick(e, 'overview')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>↑</span>
              <span>{isFa ? 'صفحه نخست' : 'Page 01 Overview'}</span>
            </a>
            <div className="flex items-center gap-2">
              <a
                href="mailto:ariasg2002@gmail.com"
                className="hover:text-white transition-colors"
              >
                Email
              </a>
              <span className="text-white/20">·</span>
              <a
                href="https://www.linkedin.com/in/ariya-sarrafzadeh/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. ARCHITECTURE INDEX LIST */}
      <div className="bg-[#0f1217]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl space-y-3">
        <div className="text-xs font-bold text-[#e2c974] tracking-wider uppercase pb-2.5 border-b border-white/10 flex justify-between items-center font-mono">
          <span>{isFa ? 'فهرست سامانه‌ها' : 'Architecture Index'}</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            {activeItem.pageNum} / {isFa ? '۰۸' : '08'}
          </span>
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
                  <span className="truncate">{item.pageNum} · {item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 ml-1" />
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
            {isFa ? 'گردش صفحات' : 'ROLLING POSTURE'}
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
  );
}
