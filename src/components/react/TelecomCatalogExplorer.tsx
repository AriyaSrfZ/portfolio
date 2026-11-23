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
    <div className="w-full text-right" dir={isFa ? 'rtl' : 'ltr'}>
      {/* Search Bar & Filter Controls (Tactile 3D Glass Card) */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Recessed Live Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={isFa ? 'جستجو در ۴۵۴ ماژول (نام، پارامتر، جدول یا کاربرد)...' : 'Search 454 modules (title, param, tables, function)...'}
              className="input-recessed"
              style={{ paddingLeft: isFa ? '16px' : '40px', paddingRight: isFa ? '40px' : '16px' }}
            />
            <div 
              className="absolute top-3 text-[var(--icon-secondary)] pointer-events-none"
              style={{ right: isFa ? '14px' : 'auto', left: isFa ? 'auto' : '14px' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute top-2.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] px-2"
                style={{ left: isFa ? '12px' : 'auto', right: isFa ? 'auto' : '12px' }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Metrics & Total Result Badge */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs font-mono text-[var(--text-secondary)]">
              {isFa ? (
                <span>نمایش <strong className="text-[var(--text-primary)] font-bold">{filteredModules.length}</strong> از ۴۵۴ ماژول</span>
              ) : (
                <span>Showing <strong className="text-[var(--text-primary)] font-bold">{filteredModules.length}</strong> of 454 modules</span>
              )}
            </div>
            {(selectedCategory !== 'all' || selectedRisk !== 'all' || search !== '') && (
              <button
                onClick={resetFilters}
                className="text-xs text-[var(--text-primary)] underline font-bold cursor-pointer hover:opacity-80 transition"
              >
                {isFa ? 'پاکسازی فیلترها' : 'Reset Filters'}
              </button>
            )}
          </div>
        </div>

        <hr className="separator-etched" />

        {/* Risk / Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[var(--text-secondary)] ml-2">
            {isFa ? 'سطح دسترسی:' : 'Access Level:'}
          </span>
          <button
            onClick={() => { setSelectedRisk('all'); setCurrentPage(1); }}
            className={`dock-pill ${selectedRisk === 'all' ? 'active' : ''}`}
          >
            {isFa ? 'همه سطوح' : 'All Levels'}
          </button>
          <button
            onClick={() => { setSelectedRisk('god'); setCurrentPage(1); }}
            className={`dock-pill ${selectedRisk === 'god' ? 'active' : ''}`}
          >
            <span className="status-dot danger"></span>
            {isFa ? 'گاد-مود و سیستمی (۱۴)' : 'God-Mode (14)'}
          </button>
          <button
            onClick={() => { setSelectedRisk('sensitive'); setCurrentPage(1); }}
            className={`dock-pill ${selectedRisk === 'sensitive' ? 'active' : ''}`}
          >
            <span className="status-dot warning"></span>
            {isFa ? 'حساس مالی/روتینگ (۸۸)' : 'Sensitive (88)'}
          </button>
          <button
            onClick={() => { setSelectedRisk('normal'); setCurrentPage(1); }}
            className={`dock-pill ${selectedRisk === 'normal' ? 'active' : ''}`}
          >
            <span className="status-dot success"></span>
            {isFa ? 'عادی عملیاتی' : 'Standard'}
          </button>
        </div>

        {/* Category Domain Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 max-h-36 overflow-y-auto pt-1">
          <button
            onClick={() => { setSelectedCategory('all'); setCurrentPage(1); }}
            className={`dock-pill text-[11px] py-1 px-2.5 ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            {isFa ? 'همه دسته‌ها' : 'All Categories'} ({modulesData.length})
          </button>
          {categoriesWithCounts.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`dock-pill text-[11px] py-1 px-2.5 ${selectedCategory === cat ? 'active' : ''}`}
            >
              <span>{cat}</span>
              <span className="opacity-70 font-mono text-[10px]">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Data Table (RTL Glass Table) */}
      <div className="glass-table-wrapper">
        <table className={isFa ? 'glass-table' : 'glass-table-ltr'}>
          <thead>
            <tr>
              <th style={{ width: '48px', textAlign: 'center' }}>#</th>
              <th style={{ width: '130px' }}>{isFa ? 'حوزه معماری' : 'Domain'}</th>
              <th style={{ width: '220px' }}>{isFa ? 'عنوان ماژول' : 'Module Title'}</th>
              <th>{isFa ? 'شرح فنی و کارکرد عملیاتی' : 'Function & Scope'}</th>
              <th style={{ width: '180px' }}>{isFa ? 'پارامتر آدرس' : 'Page Param'}</th>
              <th style={{ width: '110px', textAlign: 'center' }}>{isFa ? 'سطح ریسک' : 'Risk'}</th>
              <th style={{ width: '90px', textAlign: 'center' }}>{isFa ? 'بررسی' : 'Action'}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedModules.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-tertiary)' }}>
                  {isFa ? 'هیچ ماژولی با شرایط جستجو یافت نشد.' : 'No modules found matching your query.'}
                </td>
              </tr>
            ) : (
              paginatedModules.map((m, idx) => {
                const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                return (
                  <tr
                    key={`${m.page}-${idx}`}
                    onClick={() => setActiveModule(m)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ textAlign: 'center' }} className="mono-tabular text-xs opacity-70">
                      {globalIndex}
                    </td>
                    <td>
                      <span className="status-pill text-[10px]">
                        {m.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {m.title}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.8125rem' }}>
                      {m.description}
                    </td>
                    <td style={{ direction: 'ltr', textAlign: 'left' }}>
                      <div className="flex items-center gap-1.5 mono-tabular text-xs">
                        <span className="truncate max-w-[130px]" title={m.page}>
                          {m.page}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`contents.telir?page=${m.page}`);
                          }}
                          className="btn-3d-secondary text-[10px]"
                          style={{ height: '24px', padding: '0 8px' }}
                          title={isFa ? 'کپی آدرس ماژول' : 'Copy Param'}
                        >
                          {copiedParam === `contents.telir?page=${m.page}` ? '✓' : 'Copy'}
                        </button>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {m.is_god ? (
                        <span className="status-pill" style={{ color: 'var(--status-danger)' }}>
                          <span className="status-dot danger"></span>
                          {isFa ? 'گاد-مود' : 'God-Mode'}
                        </span>
                      ) : m.risk === 'حساس' ? (
                        <span className="status-pill" style={{ color: 'var(--status-warning)' }}>
                          <span className="status-dot warning"></span>
                          {isFa ? 'حساس' : 'Sensitive'}
                        </span>
                      ) : (
                        <span className="status-pill" style={{ opacity: 0.8 }}>
                          <span className="status-dot success"></span>
                          {isFa ? 'عادی' : 'Standard'}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModule(m);
                        }}
                        className="btn-3d-secondary text-xs"
                        style={{ height: '30px', padding: '0 12px' }}
                      >
                        {isFa ? 'جزئیات' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls (Tactile 3D Buttons) */}
      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between px-2 text-xs text-[var(--text-secondary)] font-mono">
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
              className="btn-3d-secondary text-xs"
              style={{ height: '34px', padding: '0 14px', opacity: currentPage === 1 ? 0.4 : 1 }}
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
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={isActive ? 'btn-3d-primary text-xs' : 'btn-3d-secondary text-xs'}
                  style={{ width: '34px', height: '34px', padding: 0 }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn-3d-secondary text-xs"
              style={{ height: '34px', padding: '0 14px', opacity: currentPage === totalPages ? 0.4 : 1 }}
            >
              {isFa ? 'بعدی' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* Detail Inspection Modal (Concentric Squircle Glass Panel 28px) */}
      {activeModule && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.72)', backdropFilter: 'blur(16px)' }}
          onClick={() => setActiveModule(null)}
        >
          <div 
            className="glass-panel-hero p-8 w-full max-w-2xl relative"
            dir={isFa ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '28px' }}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="icon-well">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="status-pill text-[11px]">
                      {activeModule.category}
                    </span>
                    {activeModule.is_god && (
                      <span className="status-pill" style={{ color: 'var(--status-danger)' }}>
                        <span className="status-dot danger"></span>
                        {isFa ? 'دسترسی ریشه / God-Mode' : 'Root / God-Mode'}
                      </span>
                    )}
                    {activeModule.risk === 'حساس' && (
                      <span className="status-pill" style={{ color: 'var(--status-warning)' }}>
                        <span className="status-dot warning"></span>
                        {isFa ? 'حساسیت بالا' : 'High Sensitivity'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                    {activeModule.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveModule(null)}
                className="btn-3d-secondary"
                style={{ width: '36px', height: '36px', padding: 0, borderRadius: '9999px' }}
              >
                ✕
              </button>
            </div>

            <hr className="separator-etched" />

            {/* Modal Body */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase block mb-1.5 font-bold">
                  {isFa ? 'کارکرد و شرح عملیاتی' : 'Operational Function & Scope'}
                </label>
                <div className="glass-inner p-4 text-[var(--text-primary)] leading-relaxed">
                  {activeModule.description}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase block mb-1.5 font-bold">
                  {isFa ? 'پارامتر فراخوانی صفحه' : 'Invocation Parameter'}
                </label>
                <div className="glass-inner p-3 flex items-center justify-between font-mono text-xs" dir="ltr">
                  <span className="truncate select-all text-[var(--text-primary)]">contents.telir?page={activeModule.page}</span>
                  <button
                    onClick={() => copyToClipboard(`contents.telir?page=${activeModule.page}`)}
                    className="btn-3d-primary text-xs"
                    style={{ height: '32px', padding: '0 14px' }}
                  >
                    {copiedParam === `contents.telir?page=${activeModule.page}` ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی' : 'Copy')}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase block mb-1.5 font-bold">
                  {isFa ? 'جداول دیتابیس درگیر' : 'Impacted Database Tables'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {activeModule.tables.split(',').map((tbl, i) => (
                    <span key={i} className="status-pill mono-tabular text-xs">
                      {tbl.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <hr className="separator-etched" />

            {/* Modal Footer */}
            <div className="flex justify-between items-center text-xs">
              <span className="text-[var(--text-tertiary)] font-mono">
                {isFa ? 'پلتفرم تلیر · پرشیا فاوا گسترش' : 'Tellir / Persia Fava Platform'}
              </span>
              <button
                onClick={() => setActiveModule(null)}
                className="btn-3d-primary"
                style={{ height: '38px', padding: '0 20px' }}
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
