import React, { useState, useEffect } from 'react';

interface FloatingNavbarProps {
  locale?: 'en' | 'fa';
}

export default function FloatingNavbar({ locale = 'en' }: FloatingNavbarProps) {
  const isFa = locale === 'fa';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isFa ? [
    { label: 'درباره من', href: '/fa/about/' },
    { label: 'نمونه کارها', href: '/fa/work/' },
    { label: 'مستندات معماری', href: '/fa/whitepapers/' }
  ] : [
    { label: 'About', href: '/about/' },
    { label: 'Case Studies', href: '/work/' },
    { label: 'Whitepapers', href: '/whitepapers/' }
  ];

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl transition-all duration-300 ${scrolled ? 'top-4' : 'top-6'}`} dir={isFa ? 'rtl' : 'ltr'}>
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-6 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href={isFa ? '/fa/' : '/'} className="flex flex-col shrink-0">
          <span className="text-sm font-bold text-[#f8fafc] tracking-widest">ARIYA</span>
          <span className="text-[9px] text-[#06b6d4] font-mono tracking-widest uppercase">Sarrafzadeh</span>
        </a>

        {/* Desktop Links - Explicit gap-8 to prevent sticking */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a 
              key={item.href} 
              href={item.href}
              className="text-xs font-semibold text-[#cbd5e1] hover:text-[#06b6d4] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Language Toggle */}
        <div className="flex items-center shrink-0">
          <a 
            href={isFa ? '/' : '/fa/'} 
            className="px-2.5 py-1 rounded bg-white/[0.05] border border-white/10 text-[10px] font-mono text-[#e2c974] hover:bg-white/[0.1] transition-colors"
          >
            {isFa ? 'EN' : 'FA'}
          </a>
        </div>
      </div>
    </nav>
  );
}
