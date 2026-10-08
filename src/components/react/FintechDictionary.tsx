import React, { useState, useMemo, useEffect } from 'react';
import { dictionary } from '../../data/dictionary';
import type { DictionaryTerm, DictionaryCategory, DictionarySource } from '../../data/dictionary/types';

interface FintechDictionaryProps {
  locale?: 'en' | 'fa';
}

const ROLES_ORDER = [
  'All',
  'Architecture',
  'Engineering',
  'Product',
  'Operations',
  'Risk',
  'Finance',
  'Compliance',
  'Security',
  'Data'
];

const ROLES_FA: Record<string, string> = {
  'All': 'همه نقش‌ها',
  'Architecture': 'معماری سیستم',
  'Engineering': 'مهندسی و توسعه',
  'Product': 'مدیریت محصول',
  'Operations': 'عملیات پرداخت',
  'Risk': 'کنترل ریسک',
  'Finance': 'مالی و خزانه‌داری',
  'Compliance': 'تطبیق و رگولاتوری',
  'Security': 'امنیت سایبری',
  'Data': 'مهندسی داده'
};

export default function FintechDictionary({ locale = 'en' }: FintechDictionaryProps) {
  const isFa = locale === 'fa';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [page, setPage] = useState(1);
  const [showReferencesModal, setShowReferencesModal] = useState(false);
  const [expandedTermId, setExpandedTermId] = useState<string | null>(null);

  const PAGE_SIZE = 24;

  // Filtered terms calculation
  const filteredTerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dictionary.terms.filter((term) => {
      // Category filter
      if (selectedCategory !== 'all' && term.category !== selectedCategory) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'All' && !term.roles.includes(selectedRole)) {
        return false;
      }

      // Search query filter
      if (q) {
        const matchEn = term.term.toLowerCase().includes(q);
        const matchFa = term.termFa.toLowerCase().includes(q);
        const matchAcr = term.acronym?.toLowerCase().includes(q) ?? false;
        const matchDefEn = term.definitionEn.toLowerCase().includes(q);
        const matchDefFa = term.definitionFa.toLowerCase().includes(q);
        const matchCaseWwEn = term.caseWorldwideEn?.toLowerCase().includes(q) ?? false;
        const matchCaseWwFa = term.caseWorldwideFa?.toLowerCase().includes(q) ?? false;
        const matchCaseIrEn = term.caseIranEn?.toLowerCase().includes(q) ?? false;
        const matchCaseIrFa = term.caseIranFa?.toLowerCase().includes(q) ?? false;
        return (
          matchEn ||
          matchFa ||
          matchAcr ||
          matchDefEn ||
          matchDefFa ||
          matchCaseWwEn ||
          matchCaseWwFa ||
          matchCaseIrEn ||
          matchCaseIrFa
        );
      }

      return true;
    });
  }, [search, selectedCategory, selectedRole]);

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory, selectedRole]);

  const totalPages = Math.ceil(filteredTerms.length / PAGE_SIZE) || 1;
  const paginatedTerms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTerms.slice(start, start + PAGE_SIZE);
  }, [filteredTerms, page]);

  // Category map for fast lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, DictionaryCategory>();
    dictionary.categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, []);

  // Source map for fast lookup
  const sourceMap = useMemo(() => {
    const map = new Map<string, DictionarySource>();
    dictionary.sources.forEach((src) => map.set(src.id, src));
    return map;
  }, []);

  return (
    <div className={`w-full max-w-7xl mx-auto ${isFa ? 'font-[\'Vazirmatn\',sans-serif]' : 'font-sans'}`} dir={isFa ? 'rtl' : 'ltr'}>
      
      {/* Top Header & Metrics Banner */}
      <div className="bg-[#111317]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8 shadow-2xl ring-1 ring-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#94a3b8] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>{isFa ? 'مرجع فنی اصطلاحات فین‌تک و سیستم‌های پرداخت' : 'PRODUCTION SYSTEMS LEXICON · FINTECH STANDARDS'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReferencesModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#06b6d4]/10 hover:bg-[#06b6d4]/20 text-[#38bdf8] border border-[#06b6d4]/30 font-mono text-xs transition-all active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isFa ? 'پیوست‌ها و اسناد مرجع رگولاتوری (۱۷ منبع)' : 'Regulatory Reference Attachments (17 Specs)'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold uppercase text-[#ededed] mb-3 tracking-tight">
          {isFa ? 'واژه‌نامه تخصصی معماری سیستم‌ها و پرداخت' : 'Fintech Systems Architecture Dictionary'}
        </h1>
        
        <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed max-w-4xl mb-6">
          {isFa
            ? 'مجموعه جامع بیش از ۱,۰۰۰ اصطلاح معماری سوییچ‌های پرداخت، دفاتر کل توزیع‌شده، سوییچینگ مخابراتی، استانداردهای ISO 8583 و شاپرک، انطباق PCI-DSS و ریل‌های تسویه بانکی به زبان فارسی و انگلیسی همراه با نمونه‌های پیاده‌سازی واقعی ایران و جهان به سبک مهندسی آریا صراف‌زاده.'
            : 'Comprehensive production dictionary covering 1,000+ terms across payment switches, double-entry ledgers, SMPP telecom aggregation, ISO 8583 / ISO 20022 schemas, PCI-DSS compliance, and interbank clearing rails with concrete worldwide and Iranian production case studies.'}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/[0.05] font-mono">
          <div className="bg-[#090a0c]/60 border border-white/[0.05] rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 uppercase block">{isFa ? 'تعداد اصطلاحات' : 'TOTAL TERMS'}</span>
            <span className="text-lg font-bold text-[#10b981]">{dictionary.terms.length.toLocaleString(isFa ? 'fa-IR' : 'en-US')}</span>
          </div>
          <div className="bg-[#090a0c]/60 border border-white/[0.05] rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 uppercase block">{isFa ? 'حوزه‌های تخصصی' : 'CATEGORIES'}</span>
            <span className="text-lg font-bold text-[#38bdf8]">{dictionary.categories.length}</span>
          </div>
          <div className="bg-[#090a0c]/60 border border-white/[0.05] rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 uppercase block">{isFa ? 'مراجع و استانداردها' : 'AUTHORITATIVE SOURCES'}</span>
            <span className="text-lg font-bold text-[#fbbf24]">{dictionary.sources.length}</span>
          </div>
          <div className="bg-[#090a0c]/60 border border-white/[0.05] rounded-xl p-3">
            <span className="text-[10px] text-neutral-400 uppercase block">{isFa ? 'پیوست‌های محلی' : 'OFFLINE ATTACHMENTS'}</span>
            <span className="text-lg font-bold text-[#a78bfa]">17 / 17</span>
          </div>
        </div>
      </div>

      {/* Control Console: Search & Filters */}
      <div className="bg-[#111317]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-5 mb-8 shadow-xl space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isFa ? 'جست‌وجوی اصطلاح، مخفف، نمونه‌های ایران و جهان (مانند شتاب، شاپرک، Stripe، پایا، Harim)...' : 'Search term, acronym, worldwide or Iran cases (e.g. Stripe, Adyen, Shetab, Shaparak, Paya)...'}
            className="w-full bg-[#090a0c] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#ededed] placeholder:text-neutral-500 focus:outline-none focus:border-[#06b6d4] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-neutral-400 hover:text-white text-xs px-2 py-1 font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Roles Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-[10px] font-mono text-neutral-400 uppercase shrink-0">
            {isFa ? 'فیلتر نقش:' : 'Target Role:'}
          </span>
          {ROLES_ORDER.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`text-xs px-2.5 py-1 rounded-md font-mono shrink-0 transition-all ${
                selectedRole === role
                  ? 'bg-white/15 text-white border border-white/20 font-bold'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.06] border border-white/[0.05]'
              }`}
            >
              {isFa ? ROLES_FA[role] || role : role}
            </button>
          ))}
        </div>

        {/* Category Pills Scroller */}
        <div className="pt-2 border-t border-white/[0.05]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#10b981] text-black font-bold shadow-lg shadow-[#10b981]/20'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-neutral-200 border border-white/[0.06]'
              }`}
            >
              {isFa ? 'همه حوزه‌ها' : 'All Categories'} ({dictionary.terms.length})
            </button>
            {dictionary.categories.map((cat) => {
              const count = dictionary.terms.filter((t) => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'bg-white/[0.03] text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.07] border border-white/[0.06]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{isFa ? cat.fa : cat.en}</span>
                  <span className="text-[10px] opacity-70 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4 px-1">
        <div>
          <span>{isFa ? 'تعداد نتایج:' : 'Results:'} </span>
          <span className="text-white font-bold">{filteredTerms.length}</span>
          <span> {isFa ? 'اصطلاح' : 'terms'}</span>
          {selectedCategory !== 'all' && (
            <span className="text-[#38bdf8] ms-2">
              · {isFa ? categoryMap.get(selectedCategory)?.fa : categoryMap.get(selectedCategory)?.en}
            </span>
          )}
        </div>
        <div>
          <span>{isFa ? 'صفحه' : 'Page'} {page} {isFa ? 'از' : 'of'} {totalPages}</span>
        </div>
      </div>

      {/* Terms Grid */}
      {paginatedTerms.length === 0 ? (
        <div className="bg-[#111317]/60 border border-white/10 rounded-2xl p-12 text-center my-8">
          <p className="text-neutral-400 text-sm mb-3">
            {isFa ? 'اصطلاحی مطابق با عبارت جست‌وجو شده یافت نشد.' : 'No terms found matching your query.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedRole('All');
            }}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
          >
            {isFa ? 'پاک‌کردن فیلترها' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {paginatedTerms.map((term) => {
            const cat = categoryMap.get(term.category);
            const isExpanded = expandedTermId === term.id;

            return (
              <article
                key={term.id}
                className="bg-[#111317]/85 border border-white/[0.07] hover:border-white/20 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-black/40"
              >
                <div>
                  {/* Category & Acronym Header */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-white/[0.05] text-[10px] font-mono">
                    <span className="inline-flex items-center gap-1 text-[#38bdf8] bg-[#06b6d4]/10 border border-[#06b6d4]/20 px-2 py-0.5 rounded">
                      <span>{cat?.icon}</span>
                      <span className="truncate max-w-[140px]">{isFa ? cat?.fa : cat?.en}</span>
                    </span>

                    {term.acronym && (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider" dir="ltr">
                        {term.acronym}
                      </span>
                    )}
                  </div>

                  {/* Primary & Secondary Term Titles */}
                  <h3 className="text-base font-bold text-[#ededed] group-hover:text-white transition-colors mb-1 leading-snug">
                    {isFa ? term.termFa : term.term}
                  </h3>
                  <div className="text-xs text-neutral-400 font-mono mb-3" dir={isFa ? 'ltr' : 'rtl'}>
                    {isFa ? term.term : term.termFa}
                  </div>

                  {/* Definition */}
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-3">
                    {isFa ? term.definitionFa : term.definitionEn}
                  </p>

                  {/* Production Cases Preview */}
                  <div className="space-y-2 mb-4 pt-2.5 border-t border-white/[0.04]">
                    {/* Worldwide Case */}
                    {(isFa ? term.caseWorldwideFa : term.caseWorldwideEn) && (
                      <div className="bg-[#090a0c]/60 border border-sky-500/15 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#38bdf8] mb-1">
                          <span>🌐</span>
                          <span className="font-bold uppercase tracking-wider">{isFa ? 'مورد اجرایی بین‌المللی' : 'Global Architecture Case'}</span>
                        </div>
                        <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                          {isFa ? term.caseWorldwideFa : term.caseWorldwideEn}
                        </p>
                      </div>
                    )}

                    {/* Iran Case */}
                    {(isFa ? term.caseIranFa : term.caseIranEn) && (
                      <div className="bg-[#090a0c]/60 border border-emerald-500/15 rounded-lg p-2.5">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#34d399] mb-1">
                          <span>🇮🇷</span>
                          <span className="font-bold uppercase tracking-wider">{isFa ? 'ریل و اجرای ایران' : 'Iranian Production Rail'}</span>
                        </div>
                        <p className="text-[11px] text-[#cbd5e1] leading-relaxed">
                          {isFa ? term.caseIranFa : term.caseIranEn}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Secondary Definition & Deep Specs (Toggle) */}
                  {isExpanded && (
                    <div className="bg-[#090a0c]/90 border border-white/[0.08] rounded-xl p-3.5 text-xs text-neutral-300 mb-4 space-y-3 shadow-inner" dir={isFa ? 'ltr' : 'rtl'}>
                      <div>
                        <span className="text-[10px] font-mono text-[#fbbf24] uppercase block mb-1">
                          {isFa ? 'English Architectural Specification:' : 'تعریف مهندسی فارسی:'}
                        </span>
                        <p className="text-[11px] leading-relaxed text-[#94a3b8]">
                          {isFa ? term.definitionEn : term.definitionFa}
                        </p>
                      </div>

                      {/* Alternate language case studies */}
                      <div className="pt-2 border-t border-white/[0.05] space-y-2">
                        {isFa ? (
                          <>
                            {term.caseWorldwideEn && (
                              <div>
                                <span className="text-[10px] font-mono text-[#38bdf8] uppercase block">Global Architecture Spec:</span>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">{term.caseWorldwideEn}</p>
                              </div>
                            )}
                            {term.caseIranEn && (
                              <div>
                                <span className="text-[10px] font-mono text-[#34d399] uppercase block">Iran Infrastructure Spec:</span>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">{term.caseIranEn}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {term.caseWorldwideFa && (
                              <div>
                                <span className="text-[10px] font-mono text-[#38bdf8] uppercase block">مورد اجرایی بین‌المللی (فارسی):</span>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">{term.caseWorldwideFa}</p>
                              </div>
                            )}
                            {term.caseIranFa && (
                              <div>
                                <span className="text-[10px] font-mono text-[#34d399] uppercase block">ریل زیرساخت ایران (فارسی):</span>
                                <p className="text-[11px] text-neutral-400 leading-relaxed">{term.caseIranFa}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {/* Roles and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.05] text-[10px] font-mono">
                    <div className="flex flex-wrap gap-1">
                      {term.roles.slice(0, 3).map((r) => (
                        <span key={r} className="text-neutral-400 px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.04]">
                          {isFa ? ROLES_FA[r] || r : r}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title={isFa ? 'نمایش معادل دو زبانه' : 'Toggle bilingual view'}
                      >
                        {isExpanded ? (isFa ? 'بستن ↑' : 'Collapse ↑') : (isFa ? 'نمایش انگلیسی ↓' : 'Farsi view ↓')}
                      </button>
                    </div>
                  </div>

                  {/* Attached Sources Badges with Direct Download Links */}
                  {term.sources && term.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/[0.03] flex flex-wrap gap-1">
                      {term.sources.map((sId) => {
                        const src = sourceMap.get(sId);
                        if (!src) return null;
                        return src.localFile ? (
                          <a
                            key={sId}
                            href={src.localFile}
                            download
                            className="inline-flex items-center gap-1 text-[9px] font-mono text-[#a78bfa] hover:text-white bg-[#a78bfa]/10 hover:bg-[#a78bfa]/20 border border-[#a78bfa]/20 px-1.5 py-0.5 rounded transition-colors"
                            title={`Download ${src.name} (${src.fileSize})`}
                            dir="ltr"
                          >
                            <span>📎 {src.id}</span>
                            <span className="opacity-70">[{src.fileType}]</span>
                          </a>
                        ) : (
                          <span key={sId} className="text-[9px] font-mono text-neutral-400 bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5 rounded" dir="ltr">
                            {src.id}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-[#111317]/80 border border-white/[0.07] rounded-xl p-4 font-mono text-xs">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/[0.05] text-white transition-colors"
          >
            {isFa ? '← صفحه قبل' : '← Previous'}
          </button>

          <span className="text-neutral-400">
            {isFa ? 'صفحه' : 'Page'} <strong className="text-white">{page}</strong> {isFa ? 'از' : 'of'} <strong className="text-white">{totalPages}</strong>
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/[0.05] text-white transition-colors"
          >
            {isFa ? 'صفحه بعد →' : 'Next →'}
          </button>
        </div>
      )}

      {/* Regulatory References Modal / Drawer */}
      {showReferencesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111317] border border-white/15 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#06b6d4] uppercase tracking-wider block mb-1">
                  OFFICIAL REPOSITORY ARCHIVE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {isFa ? 'اسناد مرجع رگولاتوری و استانداردهای متصل' : 'Authoritative Regulatory Standards & Attached Files'}
                </h2>
              </div>
              <button
                onClick={() => setShowReferencesModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-mono text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#94a3b8] mb-6 leading-relaxed">
              {isFa
                ? 'کلیه اصطلاحات این واژه‌نامه بر اساس ۱۷ منبع رسمی و استاندارد بین‌المللی و ملی تعریف شده‌اند. تمامی مستندات فنی و راهنماهای مرتبط مستقیماً دانلود و در هاست وب‌سایت جهت دانلود پیوست شده‌اند.'
                : 'All dictionary terms are derived from 17 official international and national standards bodies. All reference specifications have been downloaded and attached directly to the site for offline technical auditing.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dictionary.sources.map((src) => (
                <div
                  key={src.id}
                  className="bg-[#090a0c]/90 border border-white/[0.08] hover:border-white/20 rounded-xl p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {src.type}
                      </span>
                      {src.fileType && (
                        <span className="text-[#a78bfa] font-bold">
                          [{src.fileType} · {src.fileSize}]
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1.5">
                      {src.attachmentTitle || src.name}
                    </h4>

                    <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                      {src.note}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Official Web</span>
                      <span>↗</span>
                    </a>

                    {src.localFile && (
                      <a
                        href={src.localFile}
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/30 font-semibold transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Download Spec</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() => setShowReferencesModal(false)}
                className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs transition-colors"
              >
                {isFa ? 'بستن پنجره' : 'Close Window'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
