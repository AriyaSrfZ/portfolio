import React, { useState, useMemo } from 'react';
import modulesData from '../../data/telecom-modules.json';

export interface TelecomModule {
  category: string;
  page: string;
  title: string;
  href: string;
  description: string;
  is_god: boolean;
  risk: string;
  tables: string;
}

interface TelecomCatalogExplorerProps {
  locale?: 'en' | 'fa';
}

export default function TelecomCatalogExplorer({ locale = 'fa' }: TelecomCatalogExplorerProps) {
  const isFa = locale === 'fa';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [activeModule, setActiveModule] = useState<TelecomModule | null>(null);
  const [copiedParam, setCopiedParam] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Extract unique categories and counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    modulesData.forEach((m) => {
      counts[m.category] = (counts[m.category] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filter modules
  const filteredModules = useMemo(() => {
    return (modulesData as TelecomModule[]).filter((m) => {
      if (selectedCategory !== 'all' && m.category !== selectedCategory) {
        return false;
      }
      if (selectedRisk === 'god' && !m.is_god) {
        return false;
      }
      if (selectedRisk === 'sensitive' && m.risk !== 'حساس') {
        return false;
      }
      if (selectedRisk === 'normal' && (m.is_god || m.risk === 'حساس')) {
        return false;
      }
      if (search.trim() !== '') {
        const q = search.toLowerCase().trim();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchPage = m.page.toLowerCase().includes(q);
        const matchCat = m.category.toLowerCase().includes(q);
        const matchDesc = m.description.toLowerCase().includes(q);
        const matchTables = m.tables.toLowerCase().includes(q);
        if (!matchTitle && !matchPage && !matchCat && !matchDesc && !matchTables) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedCategory, selectedRisk]);

  // Pagination
  const totalPages = Math.ceil(filteredModules.length / pageSize) || 1;
  const paginatedModules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredModules.slice(start, start + pageSize);
  }, [filteredModules, currentPage, pageSize]);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedParam(text);
      setTimeout(() => setCopiedParam(null), 2000);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedRisk('all');
    setCurrentPage(1);
  };

  return (
    <div className="w-full font-sans text-right" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Search Bar & Filter Controls */}
      <div className="p-4 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isFa ? 'جستجو در ۴۵۴ ماژول (نام، پارامتر، جدول یا کاربرد)...' : 'Search 454 modules (title, param, tables, function)...'}
              className="w-full px-4 py-2.5 pl-10 rounded-xl border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:outline-none focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] transition"
            />
            <div className="absolute left-3 top-3 text-[var(--text-secondary)] pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Metrics & Total Result Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs font-mono text-[var(--text-secondary)]">
              {isFa ? (
                <span>نمایش <strong className="text-[var(--accent-primary)]">{filteredModules.length}</strong> از ۴۵۴ ماژول</span>
              ) : (
                <span>Showing <strong className="text-[var(--accent-primary)]">{filteredModules.length}</strong> of 454 modules</span>
              )}
            </div>
            {(selectedCategory !== 'all' || selectedRisk !== 'all' || search !== '') && (
              <button
                onClick={resetFilters}
                className="text-xs text-[var(--accent-warm)] hover:underline font-bold"
              >
                {isFa ? 'پاکسازی فیلترها' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>

        {/* Risk / Level Filter Pills */}
        <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-secondary)] ml-2">
            {isFa ? 'سطح دسترسی:' : 'Access Level:'}
          </span>
          <button
            onClick={() => { setSelectedRisk('all'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              selectedRisk === 'all'
                ? 'bg-[var(--accent-primary)] text-white font-bold'
                : 'bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFa ? 'همه سطوح' : 'All Levels'}
          </button>
          <button
            onClick={() => { setSelectedRisk('god'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              selectedRisk === 'god'
                ? 'bg-red-500 text-white font-bold'
                : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
            {isFa ? 'گاد-مود و سیستمی (۱۴)' : 'God-Mode (14)'}
          </button>
          <button
            onClick={() => { setSelectedRisk('sensitive'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              selectedRisk === 'sensitive'
                ? 'bg-amber-500 text-white font-bold'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            {isFa ? 'ماژول‌های حساس مالی/روتینگ (۸۸)' : 'Sensitive Financial/Route (88)'}
          </button>
          <button
            onClick={() => { setSelectedRisk('normal'); setCurrentPage(1); }}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
              selectedRisk === 'normal'
                ? 'bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--accent-primary)] font-bold'
                : 'bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFa ? 'ماژول‌های عادی عملیاتی' : 'Standard Operational'}
          </button>
        </div>

        {/* Category Domain Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto pt-1">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-[var(--accent-primary)] text-white font-bold'
                : 'bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFa ? 'همه دسته‌ها' : 'All Categories'} ({modulesData.length})
          </button>
          {categoriesWithCounts.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                selectedCategory === cat
                  ? 'bg-[var(--accent-primary)] text-white font-bold'
                  : 'bg-[var(--surface-sunken)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
              }`}
            >
              <span>{cat}</span>
              <span className="opacity-70 font-mono text-[10px]">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive RTL Data Table */}
      <div className="overflow-x-auto border border-[var(--border)] rounded-2xl bg-[var(--surface-card)] shadow-sm">
        <table className="w-full text-right text-xs" dir={isFa ? 'rtl' : 'ltr'}>
          <thead className="border-b border-[var(--border)] bg-[var(--surface-sunken)] font-mono text-[var(--text-primary)]">
            <tr>
              <th className="py-3 px-3 text-center w-12">#</th>
              <th className="py-3 px-4 w-36">{isFa ? 'حوزه معماری' : 'Domain'}</th>
              <th className="py-3 px-4 w-52">{isFa ? 'عنوان ماژول' : 'Module Title'}</th>
              <th className="py-3 px-4">{isFa ? 'شرح فنی و کارکرد عملیاتی' : 'Function & Scope'}</th>
              <th className="py-3 px-4 w-44">{isFa ? 'پارامتر آدرس' : 'Page Param'}</th>
              <th className="py-3 px-3 text-center w-24">{isFa ? 'سطح ریسک' : 'Risk'}</th>
              <th className="py-3 px-3 text-center w-24">{isFa ? 'اقدام' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {paginatedModules.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-[var(--text-secondary)]">
                  {isFa ? 'هیچ ماژولی با شرایط جستجو یافت نشد.' : 'No modules found matching your query.'}
                </td>
              </tr>
            ) : (
              paginatedModules.map((m, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={`${m.page}-${idx}`}
                    className="hover:bg-[var(--surface-hover)] transition-colors group cursor-pointer"
                    onClick={() => setActiveModule(m)}
                  >
                    <td className="py-3 px-3 text-center font-mono text-[var(--text-secondary)]">{globalIndex}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border)]">
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {m.title}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {m.description}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[var(--accent-warm)]">
                      <div className="flex items-center gap-1.5" dir="ltr">
                        <span className="truncate max-w-[130px] font-mono" title={m.page}>
                          {m.page}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`contents.telir?page=${m.page}`);
                          }}
                          className="p-1 rounded hover:bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          title={isFa ? 'کپی آدرس کامل ماژول' : 'Copy Full Param'}
                        >
                          {copiedParam === `contents.telir?page=${m.page}` ? (
                            <span className="text-emerald-400 font-bold text-[10px]">✓</span>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {m.is_god ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/30">
                          {isFa ? 'گاد-مود' : 'God-Mode'}
                        </span>
                      ) : m.risk === 'حساس' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          {isFa ? 'حساس' : 'Sensitive'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] text-[var(--text-secondary)]">
                          {isFa ? 'عادی' : 'Standard'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModule(m);
                        }}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[var(--border)] bg-[var(--surface-sunken)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition"
                      >
                        {isFa ? 'بررسی' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2 text-xs text-[var(--text-secondary)] font-mono">
          <div>
            {isFa ? (
              <span>صفحه {currentPage} از {totalPages}</span>
            ) : (
              <span>Page {currentPage} of {totalPages}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-card)] disabled:opacity-30 hover:border-[var(--accent-primary)] transition"
            >
              {isFa ? 'قبلی' : 'Previous'}
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg border text-xs font-bold transition ${
                    currentPage === pageNum
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-white'
                      : 'border-[var(--border)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-card)] disabled:opacity-30 hover:border-[var(--accent-primary)] transition"
            >
              {isFa ? 'بعدی' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal */}
      {activeModule && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveModule(null)}
        >
          <div 
            className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface-card)] p-6 shadow-2xl relative text-right"
            dir={isFa ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border)]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[var(--surface-sunken)] text-[var(--text-secondary)] border border-[var(--border)]">
                    {activeModule.category}
                  </span>
                  {activeModule.is_god && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-500/10 text-red-500 border border-red-500/30">
                      {isFa ? 'ابزار دسترسی ریشه / God-Mode' : 'Root / God-Mode Access'}
                    </span>
                  )}
                  {activeModule.risk === 'حساس' && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                      {isFa ? 'سطح حساسیت بالا' : 'High Sensitivity'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                  {activeModule.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--surface-sunken)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-[11px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                  {isFa ? 'کارکرد و شرح عملیاتی' : 'Operational Scope & Function'}
                </label>
                <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--surface-sunken)] p-3 rounded-xl border border-[var(--border)]">
                  {activeModule.description}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                  {isFa ? 'پارامتر فراخوانی صفحه' : 'Invocation Parameter'}
                </label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--code-bg)] border border-[var(--border)] font-mono text-sky-400" dir="ltr">
                  <span className="truncate select-all">contents.telir?page={activeModule.page}</span>
                  <button
                    onClick={() => copyToClipboard(`contents.telir?page=${activeModule.page}`)}
                    className="px-3 py-1 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-xs text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition"
                  >
                    {copiedParam === `contents.telir?page=${activeModule.page}` ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی' : 'Copy')}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                  {isFa ? 'جداول دیتابیس درگیر' : 'Impacted Database Tables'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {activeModule.tables.split(',').map((tbl, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[var(--surface-sunken)] border border-[var(--border)] font-mono text-[11px] text-[var(--accent-primary)]">
                      {tbl.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs">
              <span className="text-[var(--text-secondary)] font-mono">
                {isFa ? 'شناسه آرشیو فنی تلیر / پرشیا فاوا' : 'Tellir Archive ID'}
              </span>
              <button
                onClick={() => setActiveModule(null)}
                className="px-5 py-2 rounded-xl bg-[var(--accent-primary)] text-white font-bold hover:opacity-95 transition"
              >
                {isFa ? 'بستن پنجره' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
