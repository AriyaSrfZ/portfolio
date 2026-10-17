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

const GENERIC_WORLDWIDE_EN = 'Global payment gateways (Stripe, Adyen, Worldpay) process real-time authorizations via multi-region API switches with sub-100ms processing SLAs and automated retry logic.';
const GENERIC_IRAN_EN = 'Iranian payment gateways operate under Shaparak regulations, routing IPG transactions through accredited PSP switches with mandatory dynamic Harim OTP.';
const GENERIC_WORLDWIDE_FA = 'درگاه‌های جهانی نظیر استرایپ و ادین تراکنش‌های پرداخت را از طریق سوییچ‌های ابری توزیع‌شده با تاخیر کمتر از ۱۰۰ میلی‌ثانیه و منطق تلاش مجدد خودکار پردازش می‌کنند.';
const GENERIC_IRAN_FA = 'درگاه‌های پرداخت اینترنتی در ایران تحت نظارت شاپرک فعالیت کرده و تراکنش‌ها را از طریق سوییچ شرکت‌های PSP با تاییدیه الزامی رمز پویا هدایت می‌کنند.';

function isGeneric(text?: string | null): boolean {
  if (!text) return true;
  const trimmed = text.trim();
  return (
    trimmed === GENERIC_WORLDWIDE_EN ||
    trimmed === GENERIC_IRAN_EN ||
    trimmed === GENERIC_WORLDWIDE_FA ||
    trimmed === GENERIC_IRAN_FA
  );
}

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
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--text-secondary)] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
            <span>{isFa ? 'مرجع فنی اصطلاحات فین‌تک و سیستم‌های پرداخت' : 'PRODUCTION SYSTEMS LEXICON · FINTECH STANDARDS'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReferencesModal(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--surface)] text-[var(--accent-primary)] border border-[var(--border)] font-mono text-xs transition-all active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{isFa ? 'پیوست‌ها و اسناد مرجع رگولاتوری (۱۷ منبع)' : 'Regulatory Reference Attachments (17 Specs)'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold uppercase text-[var(--text-primary)] mb-3 tracking-tight">
          {isFa ? 'واژه‌نامه تخصصی معماری سیستم‌ها و پرداخت' : 'Fintech Systems Architecture Dictionary'}
        </h1>
        
        <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed max-w-4xl mb-6">
          {isFa
            ? 'مجموعه جامع بیش از ۱,۰۰۰ اصطلاح معماری سوییچ‌های پرداخت، دفاتر کل توزیع‌شده، سوییچینگ مخابراتی، استانداردهای ISO 8583 و شاپرک، انطباق PCI-DSS و ریل‌های تسویه بانکی به زبان فارسی و انگلیسی.'
            : 'Comprehensive production dictionary covering 1,000+ terms across payment switches, double-entry ledgers, SMPP telecom aggregation, ISO 8583 / ISO 20022 schemas, PCI-DSS compliance, and interbank clearing rails.'}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[var(--border)] font-mono">
          <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{isFa ? 'تعداد اصطلاحات' : 'TOTAL TERMS'}</span>
            <span className="text-lg font-bold text-[var(--accent-primary)]">{dictionary.terms.length.toLocaleString(isFa ? 'fa-IR' : 'en-US')}</span>
          </div>
          <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{isFa ? 'حوزه‌های تخصصی' : 'CATEGORIES'}</span>
            <span className="text-lg font-bold text-[var(--text-primary)]">{dictionary.categories.length}</span>
          </div>
          <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{isFa ? 'مراجع و استانداردها' : 'AUTHORITATIVE SOURCES'}</span>
            <span className="text-lg font-bold text-[#B39A77]">{dictionary.sources.length}</span>
          </div>
          <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3">
            <span className="text-[10px] text-[var(--text-secondary)] uppercase block">{isFa ? 'پیوست‌های محلی' : 'OFFLINE ATTACHMENTS'}</span>
            <span className="text-lg font-bold text-[var(--accent-primary)]">17 / 17</span>
          </div>
        </div>
      </div>

      {/* Control Console: Search & Filters */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 mb-8 shadow-sm space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isFa ? 'جست‌وجوی اصطلاح، مخفف (مانند شتاب، شاپرک، Stripe، پایا، ISO 8583)...' : 'Search term, acronym (e.g. Stripe, Adyen, Shetab, Shaparak, Paya, ISO 8583)...'}
            className="w-full bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute top-1/2 -translate-y-1/2 end-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs px-2 py-1 font-mono"
            >
              ✕
            </button>
          )}
        </div>

        {/* Roles Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase shrink-0">
            {isFa ? 'فیلتر نقش:' : 'Target Role:'}
          </span>
          {ROLES_ORDER.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`text-xs px-2.5 py-1 rounded-md font-mono shrink-0 transition-all ${
                selectedRole === role
                  ? 'bg-[var(--accent-primary)] text-white border border-[var(--accent-primary)] font-bold shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]/20 border border-[var(--border)]'
              }`}
            >
              {isFa ? ROLES_FA[role] || role : role}
            </button>
          ))}
        </div>

        {/* Category Pills Scroller */}
        <div className="pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-lg shrink-0 font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--accent-primary)] text-white font-bold shadow-sm'
                  : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
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
                      ? 'bg-[var(--text-primary)] text-[var(--canvas)] font-bold shadow-sm'
                      : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
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
      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] mb-4 px-1">
        <div>
          <span>{isFa ? 'تعداد نتایج:' : 'Results:'} </span>
          <span className="text-[var(--text-primary)] font-bold">{filteredTerms.length}</span>
          <span> {isFa ? 'اصطلاح' : 'terms'}</span>
          {selectedCategory !== 'all' && (
            <span className="text-[var(--accent-primary)] ms-2">
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
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center my-8">
          <p className="text-[var(--text-secondary)] text-sm mb-3">
            {isFa ? 'اصطلاحی مطابق با عبارت جست‌وجو شده یافت نشد.' : 'No terms found matching your query.'}
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedRole('All');
            }}
            className="px-4 py-2 rounded-lg bg-[var(--surface-elevated)] hover:bg-[var(--border)]/20 text-[var(--text-primary)] font-mono text-xs border border-[var(--border)] transition-colors"
          >
            {isFa ? 'پاک‌کردن فیلترها' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {paginatedTerms.map((term) => {
            const cat = categoryMap.get(term.category);
            const isExpanded = expandedTermId === term.id;
            const hasCustomWorldwide = !isGeneric(term.caseWorldwideEn) || !isGeneric(term.caseWorldwideFa);
            const hasCustomIran = !isGeneric(term.caseIranEn) || !isGeneric(term.caseIranFa);

            return (
              <article
                key={term.id}
                className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent-primary)] rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group shadow-sm"
              >
                <div>
                  {/* Category & Acronym Header */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-[var(--border)] text-[10px] font-mono">
                    <span className="inline-flex items-center gap-1.5 text-[var(--accent-primary)] bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-0.5 rounded">
                      <span>{cat?.icon}</span>
                      <span className="truncate max-w-[140px] font-medium">{isFa ? cat?.fa : cat?.en}</span>
                    </span>

                    {term.acronym && (
                      <span className="text-[#B39A77] bg-[var(--surface-elevated)] border border-[var(--border)] px-2 py-0.5 rounded font-bold uppercase tracking-wider" dir="ltr">
                        {term.acronym}
                      </span>
                    )}
                  </div>

                  {/* Primary & Secondary Term Titles */}
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors mb-1 leading-snug">
                    {isFa ? term.termFa : term.term}
                  </h3>
                  <div className="text-xs text-[var(--text-secondary)] font-mono mb-3" dir={isFa ? 'ltr' : 'rtl'}>
                    {isFa ? term.term : term.termFa}
                  </div>

                  {/* Definition */}
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                    {isFa ? term.definitionFa : term.definitionEn}
                  </p>

                  {/* Expanded Specification & Custom Architectural Case Studies */}
                  {isExpanded && (
                    <div className="bg-[var(--code-surface)] border border-[var(--border)] rounded-xl p-3.5 text-xs text-[var(--text-secondary)] mb-4 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#B39A77] uppercase block mb-1">
                          {isFa ? 'تعریف انگلیسی:' : 'Persian Architectural Definition:'}
                        </span>
                        <p className="text-[11px] leading-relaxed text-[var(--text-primary)]" dir={isFa ? 'ltr' : 'rtl'}>
                          {isFa ? term.definitionEn : term.definitionFa}
                        </p>
                      </div>

                      {/* Only render case studies if they contain specific real architecture content */}
                      {(hasCustomWorldwide || hasCustomIran) && (
                        <div className="pt-2 border-t border-[var(--border)] space-y-2">
                          {hasCustomWorldwide && (isFa ? term.caseWorldwideFa : term.caseWorldwideEn) && (
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
                              <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase block font-semibold mb-1">
                                {isFa ? '🌐 پیاده‌سازی بین‌المللی' : '🌐 Global Architecture Case'}
                              </span>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {isFa ? term.caseWorldwideFa : term.caseWorldwideEn}
                              </p>
                            </div>
                          )}

                          {hasCustomIran && (isFa ? term.caseIranFa : term.caseIranEn) && (
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-2.5">
                              <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase block font-semibold mb-1">
                                {isFa ? '🇮🇷 ریل اجرایی ایران' : '🇮🇷 Iranian Production Rail'}
                              </span>
                              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                                {isFa ? term.caseIranFa : term.caseIranEn}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  {/* Roles and Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[var(--border)] text-[10px] font-mono">
                    <div className="flex flex-wrap gap-1">
                      {term.roles.slice(0, 3).map((r) => (
                        <span key={r} className="text-[var(--text-secondary)] px-1.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)]">
                          {isFa ? ROLES_FA[r] || r : r}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedTermId(isExpanded ? null : term.id)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        title={isFa ? 'نمایش مشخصات تکمیلی' : 'Toggle technical specs'}
                      >
                        {isExpanded ? (isFa ? 'بستن ↑' : 'Collapse ↑') : (isFa ? 'مشخصات تکمیلی ↓' : 'Details ↓')}
                      </button>
                    </div>
                  </div>

                  {/* Attached Sources Badges */}
                  {term.sources && term.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex flex-wrap gap-1">
                      {term.sources.map((sId) => {
                        const src = sourceMap.get(sId);
                        if (!src) return null;
                        return src.localFile ? (
                          <a
                            key={sId}
                            href={src.localFile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[9px] font-mono text-[var(--accent-primary)] hover:underline bg-[var(--surface-elevated)] border border-[var(--border)] px-1.5 py-0.5 rounded transition-colors"
                            title={`View PDF: ${src.name} (${src.fileSize})`}
                            dir="ltr"
                          >
                            <span>📎 {src.id}</span>
                            <span className="opacity-70">[{src.fileType}]</span>
                          </a>
                        ) : (
                          <span key={sId} className="text-[9px] font-mono text-[var(--text-secondary)] bg-[var(--surface-elevated)] border border-[var(--border)] px-1.5 py-0.5 rounded" dir="ltr">
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
        <div className="flex items-center justify-between bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 font-mono text-xs shadow-sm">
          <button
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[var(--border)]/20 disabled:opacity-30 text-[var(--text-primary)] transition-colors"
          >
            {isFa ? '← صفحه قبل' : '← Previous'}
          </button>

          <span className="text-[var(--text-secondary)]">
            {isFa ? 'صفحه' : 'Page'} <strong className="text-[var(--text-primary)]">{page}</strong> {isFa ? 'از' : 'of'} <strong className="text-[var(--text-primary)]">{totalPages}</strong>
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[var(--border)]/20 disabled:opacity-30 text-[var(--text-primary)] transition-colors"
          >
            {isFa ? 'صفحه بعد →' : 'Next →'}
          </button>
        </div>
      )}

      {/* Regulatory References Modal / Drawer */}
      {showReferencesModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--border)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider block mb-1">
                  OFFICIAL REPOSITORY ARCHIVE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {isFa ? 'اسناد مرجع رگولاتوری و استانداردهای متصل' : 'Authoritative Regulatory Standards & Attached Files'}
                </h2>
              </div>
              <button
                onClick={() => setShowReferencesModal(false)}
                className="w-8 h-8 rounded-full bg-[var(--surface-elevated)] hover:bg-[var(--border)]/20 text-[var(--text-primary)] border border-[var(--border)] flex items-center justify-center font-mono text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
              {isFa
                ? 'کلیه اصطلاحات این واژه‌نامه بر اساس ۱۷ منبع رسمی و استاندارد بین‌المللی و ملی تعریف شده‌اند. تمامی مستندات فنی و راهنماهای مرتبط مستقیماً دانلود و در هاست وب‌سایت جهت دانلود پیوست شده‌اند.'
                : 'All dictionary terms are derived from 17 official international and national standards bodies. All reference specifications have been downloaded and attached directly to the site for offline technical auditing.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dictionary.sources.map((src) => (
                <div
                  key={src.id}
                  className="bg-[var(--surface-elevated)] border border-[var(--border)] hover:border-[var(--accent-primary)] rounded-xl p-4 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                      <span className="text-[var(--accent-primary)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)] font-medium">
                        {src.type}
                      </span>
                      {src.fileType && (
                        <span className="text-[#B39A77] font-bold">
                          [{src.fileType} · {src.fileSize}]
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1.5">
                      {src.localFile ? (
                        <a
                          href={src.localFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--accent-primary)] transition-colors"
                        >
                          {src.attachmentTitle || src.name} ↗
                        </a>
                      ) : (
                        src.attachmentTitle || src.name
                      )}
                    </h4>

                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
                      {src.note}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
                    >
                      <span>Official Web</span>
                      <span>↗</span>
                    </a>

                    {src.localFile && (
                      <div className="flex items-center gap-2">
                        <a
                          href={src.localFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[var(--surface)] hover:bg-[var(--border)]/30 text-[var(--accent-primary)] border border-[var(--border)] font-semibold transition-all"
                        >
                          <span>{isFa ? 'مشاهده سند ↗' : 'View PDF ↗'}</span>
                        </a>
                        <a
                          href={src.localFile}
                          download
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--surface)] hover:bg-[var(--border)]/30 text-[var(--text-secondary)] border border-[var(--border)] transition-all"
                          title="Download PDF"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>PDF</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-[var(--border)] text-center">
              <button
                onClick={() => setShowReferencesModal(false)}
                className="px-6 py-2 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border)] hover:bg-[var(--border)]/20 text-[var(--text-primary)] font-mono text-xs transition-colors"
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
