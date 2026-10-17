import React, { useState, useEffect, useRef, useMemo } from 'react';
import { stats } from '../../data/stats';
import { useTelemetryStream } from '../../hooks/useTelemetryStream';
import { useViewportBounds } from '../../hooks/useViewportBounds';
import { useActiveView, DASHBOARD_VIEWS, type DashboardViewId } from '../../hooks/useActiveView';
import { registerAgenticBridge } from '../../mcp/operationsAgentBridge';
import {
  Activity,
  Layers,
  Shield,
  Zap,
  Server,
  Terminal,
  Database,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  BarChart2,
  Calendar,
  Code2,
  Globe,
  Sliders,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface OperationsConsoleProps {
  locale?: 'en' | 'fa';
  initialView?: DashboardViewId;
}

export default function OperationsConsole({ locale = 'en', initialView = 'overview' }: OperationsConsoleProps) {
  const isFa = locale === 'fa';
  const { currentView, prevView, isTransitioning, setView, nextView, prevViewNav } = useActiveView(initialView);
  const { metrics, isConnected, isStreaming, error: streamError, toggleStream, reconnect } = useTelemetryStream(true);
  const viewport = useViewportBounds();
  const [mcpModalOpen, setMcpModalOpen] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

  // Register MCP Agentic Bridge on mount
  useEffect(() => {
    registerAgenticBridge(
      () => currentView,
      setView,
      () => metrics,
      () => viewport,
      () => isTransitioning,
      () => isStreaming,
      locale
    );
  }, [currentView, setView, metrics, viewport, isTransitioning, isStreaming, locale]);

  // Run in-browser WCAG audit
  const runAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__AGENTIC_CONSOLE__) {
        const res = (window as any).__AGENTIC_CONSOLE__.run_accessibility_audit('#operations-workstation');
        setAuditResult(res);
      }
      setAuditRunning(false);
    }, 400);
  };

  return (
    <div 
      id="operations-workstation"
      ref={viewport.containerRef}
      className="fixed inset-0 w-screen h-screen max-w-screen max-h-screen overflow-hidden flex flex-col bg-[#0B0F17] text-[#F8FAFC] select-none font-sans"
      dir={isFa ? 'rtl' : 'ltr'}
    >
      {/* =========================================================================
          TOP COMMAND & TELEMETRY BAR (Sticky Pinned 56px Frame)
          ========================================================================= */}
      <header className="h-14 min-h-[3.5rem] bg-[#0B0F17] border-b border-[#1E293B] px-4 flex items-center justify-between z-40 select-none">
        {/* Left: Branding & Node Telemetry Badge */}
        <div className="flex items-center gap-3">
          <a href={baseUrl} className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded bg-[#131926] border border-[#1E293B] flex items-center justify-center text-xs font-mono font-bold text-[#F8FAFC] group-hover:border-[#2563EB] transition-colors">
              AS
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold font-mono tracking-wider text-[#F8FAFC] leading-none">
                {isFa ? 'آریا صراف‌زاده // کنسول عملیات' : 'ARIYA SARRAFZADEH // CONSOLE'}
              </span>
              <span className="text-[10px] font-mono text-[#94A3B8] leading-tight">
                {isFa ? 'معماری سامانه‌های مقیاس‌بالا' : 'MISSION-CRITICAL ARCHITECTURE'}
              </span>
            </div>
          </a>

          {/* Engine Status Badge (Strict Nominal/Warning/Critical tokens) */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-mono transition-colors"
               style={{
                 backgroundColor: metrics.status === 'nominal' ? '#064E3B40' : metrics.status === 'warning' ? '#78350F40' : '#7F1D1D40',
                 borderColor: metrics.status === 'nominal' ? '#6EE7B7' : metrics.status === 'warning' ? '#FCD34D' : '#FCA5A5',
                 color: metrics.status === 'nominal' ? '#6EE7B7' : metrics.status === 'warning' ? '#FCD34D' : '#FCA5A5',
               }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: metrics.status === 'nominal' ? '#6EE7B7' : metrics.status === 'warning' ? '#FCD34D' : '#FCA5A5'
                  }} />
            <span className="font-semibold uppercase tracking-wider">
              {metrics.status === 'nominal' ? (isFa ? 'موتور: نرمال' : 'ENGINE: NOMINAL') : (isFa ? 'موتور: هشدار' : 'ENGINE: WARNING')}
            </span>
          </div>
        </div>

        {/* Center: Real-Time Operational Tab Switcher (Desktop 1024px+) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#131926] p-1 rounded-lg border border-[#1E293B]" role="tablist">
          {DASHBOARD_VIEWS.map((tab) => {
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setView(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  isActive 
                    ? 'bg-[#2563EB] text-[#FFFFFF] shadow-sm font-semibold' 
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/50'
                }`}
              >
                <span className="text-[10px] opacity-75">{tab.code}</span>
                <span>{isFa ? tab.labelFa : tab.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Controls, Stream Toggle, MCP Trigger & Locale Switch */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {/* Live Stream Toggle */}
          <button
            onClick={toggleStream}
            title={isStreaming ? 'Pause live telemetry stream' : 'Resume live telemetry stream'}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#131926] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#94A3B8] transition-colors"
          >
            {isStreaming ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#6EE7B7]" />
                <span className="hidden md:inline text-[11px] text-[#6EE7B7]">{metrics.tps.toLocaleString()} TPS</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#FCD34D]" />
                <span className="hidden md:inline text-[11px] text-[#FCD34D]">PAUSED</span>
              </>
            )}
          </button>

          {/* MCP Tools Inspector Button */}
          <button
            onClick={() => {
              setMcpModalOpen(true);
              runAudit();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#131926] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#2563EB] transition-colors"
            title="Inspect Agentic MCP Protocol & Trigger WCAG Audit"
          >
            <Sliders className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden xl:inline text-[11px]">MCP TOOLS</span>
          </button>

          {/* Language Switcher */}
          <a
            href={isFa ? `${baseUrl}?view=${currentView}` : `${baseUrl}fa/?view=${currentView}`}
            className="px-2 py-1 rounded bg-[#131926] border border-[#1E293B] text-[#F8FAFC] hover:border-[#2563EB] font-bold text-[11px] transition-colors"
          >
            {isFa ? 'EN' : 'فا'}
          </a>
        </div>
      </header>

      {/* =========================================================================
          PERSISTENT TELEMETRY KPI RIBBON (High-Density Fixed Metric Bar)
          ========================================================================= */}
      <div className="h-9 min-h-[2.25rem] bg-[#131926]/90 border-b border-[#1E293B] px-4 flex items-center justify-between text-xs font-mono overflow-x-auto whitespace-nowrap scrollbar-none z-30">
        <div className="flex items-center gap-6 divide-x divide-[#1E293B] rtl:divide-x-reverse">
          <div className="flex items-center gap-2">
            <span className="text-[#94A3B8] text-[10px] uppercase">
              {isFa ? 'ظرفیت اوج هم‌روند' : 'PEAK THROUGHPUT'}:
            </span>
            <span className="text-[#F8FAFC] font-semibold">{metrics.peakTps.toLocaleString()} TPS</span>
          </div>

          <div className="flex items-center gap-2 pl-6 rtl:pr-6">
            <span className="text-[#94A3B8] text-[10px] uppercase">
              {isFa ? 'انحراف مالی در تسویه' : 'FINANCIAL DRIFT'}:
            </span>
            <span className="text-[#6EE7B7] font-semibold">0.00% [ZERO DRIFT]</span>
          </div>

          <div className="flex items-center gap-2 pl-6 rtl:pr-6">
            <span className="text-[#94A3B8] text-[10px] uppercase">
              {isFa ? 'مهلت سوییچ و بازیابی' : 'FAILOVER SLA'}:
            </span>
            <span className="text-[#38BDF8] font-semibold">{metrics.failoverLatencyMs}ms (&lt;15ms)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-6 rtl:pr-6">
            <span className="text-[#94A3B8] text-[10px] uppercase">
              {isFa ? 'حلقه هوش تقلب و ریسک' : 'FRAUD RISK LOOP'}:
            </span>
            <span className="text-[#FCD34D] font-semibold">{metrics.fraudLoopSlaMs}ms SLA</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-6 rtl:pr-6">
            <span className="text-[#94A3B8] text-[10px] uppercase">
              {isFa ? 'گره‌های آنلاین کلاستر' : 'ACTIVE CLUSTER NODES'}:
            </span>
            <span className="text-[#F8FAFC] font-semibold">{metrics.activeNodes} ONLINE</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#94A3B8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>KEYBOARD: [0-7] JUMP · ALT+ARROWS NAV</span>
        </div>
      </div>

      {/* =========================================================================
          MAIN WORKSTATION VIEWPORT (100vw × 100vh Bound, Zero Window Scroll)
          ========================================================================= */}
      <div className="flex-1 w-full h-[calc(100vh-3.5rem-2.25rem-2rem)] overflow-hidden flex relative">
        {/* Left Operational Dossier Index (Desktop 1024px+) */}
        <aside 
          className={`h-full border-r border-[#1E293B] rtl:border-r-0 rtl:border-l bg-[#0B0F17] flex flex-col justify-between transition-all duration-200 z-20 ${
            sidebarCollapsed ? 'w-14' : 'w-64 xl:w-72'
          }`}
        >
          {/* Subsystem List */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="flex items-center justify-between px-2 py-1 text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider border-b border-[#1E293B] mb-2">
              {!sidebarCollapsed && <span>{isFa ? 'سامانه‌های عملیاتی' : 'OPERATIONAL SUBSYSTEMS'}</span>}
              <button 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hover:text-[#F8FAFC] transition-colors"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {DASHBOARD_VIEWS.map((tab) => {
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  title={isFa ? tab.labelFa : tab.labelEn}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-all text-left rtl:text-right ${
                    isActive 
                      ? 'bg-[#131926] border border-[#2563EB] text-[#F8FAFC]' 
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#131926]/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-[#2563EB] text-white' : 'bg-[#131926] text-[#94A3B8] border border-[#1E293B]'
                    }`}>
                      {tab.code}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="truncate font-medium">{isFa ? tab.labelFa : tab.labelEn}</span>
                    )}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Architect Spec Drawer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-[#1E293B] bg-[#131926]/50 text-xs font-mono space-y-2">
              <div className="text-[10px] text-[#94A3B8] uppercase">
                {isFa ? 'هویت فنی' : 'ARCHITECT IDENTITY'}
              </div>
              <div className="text-[11px] text-[#F8FAFC] leading-snug font-medium">
                {isFa ? 'آریا صراف‌زاده' : 'Ariya Sarrafzadeh'}
              </div>
              <div className="text-[10px] text-[#94A3B8]">
                {isFa ? 'مدیر محصول فنی و معمار سیستم' : 'Principal Architect & Tech PM'}
              </div>
              <div className="pt-2 flex items-center gap-2 text-[10px]">
                <a href="https://github.com/AriyaSrfZ" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] flex items-center gap-1">
                  GitHub <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <span>·</span>
                <a href="https://www.linkedin.com/in/ariya-sarrafzadeh/" target="_blank" rel="noopener noreferrer" className="hover:text-[#38BDF8] flex items-center gap-1">
                  LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* Central Workspace: Active View swapped in-place with isolated child scrolling */}
        <main 
          className="flex-1 h-full overflow-y-auto bg-[#0B0F17] p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-[#1E293B] scrollbar-track-transparent focus:outline-none"
          tabIndex={0}
        >
          <div 
            style={{
              opacity: isTransitioning ? 0.35 : 1,
              transform: isTransitioning ? 'translateY(4px)' : 'translateY(0)',
              transition: 'opacity 220ms cubic-bezier(0.16, 1, 0.3, 1), transform 220ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            className="w-full max-w-7xl mx-auto space-y-6"
          >
            {/* VIEW 00: SYSTEM OVERVIEW */}
            {currentView === 'overview' && (
              <div className="space-y-6">
                {/* Executive Briefing Banner */}
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
                      <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                        <span>{isFa ? 'نمای کلی سامانه و معماری زیرساخت' : 'SYSTEM OVERVIEW · PRODUCTION CONTROL DESK'}</span>
                      </div>
                      <span className="text-xs font-mono text-[#6EE7B7] bg-[#064E3B40] border border-[#6EE7B7]/30 px-2.5 py-0.5 rounded">
                        {isFa ? 'عملیاتی در ترافیک زنده' : 'LIVE PRODUCTION VERIFIED'}
                      </span>
                    </div>

                    <h1 className="text-xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
                      {isFa 
                        ? 'معماری سامانه‌های مقیاس‌بالا، سوییچ‌های پرداخت و دفاتر کل توزیع‌شده' 
                        : 'Systems Architecture, Payment Switches & Distributed Ledger Infrastructure'}
                    </h1>
                    <p className="text-sm md:text-base text-[#94A3B8] max-w-4xl leading-relaxed">
                      {isFa
                        ? 'طراحی و استقرار سیستم‌های با هم‌روندی بالا در لایه‌های بانکی، سوییچ‌های ISO 8583، موتورهای تسویه دفتری با انحراف مالی صفر و هاب‌های مخابراتی پیامکی با پایبندی سخت‌گیرانه به توافق‌نامه سطح خدمات.'
                        : 'Architectural engineering for mission-critical fintech and telecom backbones: 50,000 peak TPS double-entry ledgers, dynamic ISO 8583 multi-PSP payment switches with <15ms failover, real-time graph eKYC fraud defense, and 3-way automated clearing engines.'}
                    </p>

                    {/* Operational Proof Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
                      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                        <span className="text-[#94A3B8] block text-[10px] uppercase">{isFa ? 'ظرفیت سوییچ' : 'PEAK SWITCH TPS'}</span>
                        <span className="text-[#F8FAFC] font-bold text-base">{stats.ledgerPeakTps.shortEn}</span>
                      </div>
                      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                        <span className="text-[#94A3B8] block text-[10px] uppercase">{isFa ? 'تراز مالی' : 'FINANCIAL DRIFT'}</span>
                        <span className="text-[#6EE7B7] font-bold text-base">{stats.financialDriftPercent.shortEn}</span>
                      </div>
                      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                        <span className="text-[#94A3B8] block text-[10px] uppercase">{isFa ? 'حجم مخابراتی سالانه' : 'ANNUAL SMPP VOLUME'}</span>
                        <span className="text-[#38BDF8] font-bold text-base">{stats.telecomHubAnnualVolume.shortEn}</span>
                      </div>
                      <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                        <span className="text-[#94A3B8] block text-[10px] uppercase">{isFa ? 'زمان پایا / ساتنا' : 'PAYOUT WINDOW'}</span>
                        <span className="text-[#FCD34D] font-bold text-base">{stats.merchantPayoutWindow.shortEn}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4 Core Architectural Blueprint Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tile 01 */}
                  <div 
                    onClick={() => setView('payment-settlement')}
                    className="bg-[#131926] border border-[#1E293B] rounded-xl p-5 hover:border-[#2563EB] cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#38BDF8]">01 · SETTLEMENTS & LEDGERS</span>
                      <span className="text-[11px] font-mono text-[#6EE7B7] bg-[#064E3B40] px-2 py-0.5 rounded border border-[#6EE7B7]/30">ACID 2PC</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {isFa ? 'دفتر کل دوطرفه و رزرو دومرحله‌ای' : 'The Double-Entry Ledger & Two-Phase Balance Engine'}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {isFa 
                        ? 'تخصیص اتمیک موجودی با قفل‌های توزیع‌شده Redis SETNX و ثبت تغییرات Outbox CDC بدون امکان اوردرایو موجودی.'
                        : 'Atomic balance reservation state machine with Redis SETNX mutex, transactional CDC outbox, and zero financial drift under 50k TPS.'}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-2 border-t border-[#1E293B]">
                      <span>{stats.ledgerPeakTps.shortEn} · 0.00% DRIFT</span>
                      <span className="text-[#38BDF8] flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        {isFa ? 'مشاهده پرونده' : 'View Spec'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Tile 02 */}
                  <div 
                    onClick={() => setView('payment-switch')}
                    className="bg-[#131926] border border-[#1E293B] rounded-xl p-5 hover:border-[#2563EB] cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#38BDF8]">02 · PAYMENT SWITCH</span>
                      <span className="text-[11px] font-mono text-[#38BDF8] bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1E293B]">ISO 8583</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      {isFa ? 'سوییچ هوشمند پرداخت چندگانه' : 'Smart PSP Switch & Dynamic Weighted Routing'}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {isFa 
                        ? 'روتینگ دینامیک ISO 8583 بین PSPها با بازیابی زیر ۱۵ میلی‌ثانیه و بازگشت خودکار ۰۴۰۰ در خطاهای بانکی.'
                        : 'Dynamic ISO 8583 dispatch mesh across banking rails with <15ms failover, circuit breakers, and automated 0400 reversal.'}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-2 border-t border-[#1E293B]">
                      <span>{stats.switchFailoverSla.shortEn} · AUTO-0400</span>
                      <span className="text-[#38BDF8] flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        {isFa ? 'مشاهده پرونده' : 'View Spec'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Tile 03 */}
                  <div 
                    onClick={() => setView('fraud-forensics')}
                    className="bg-[#131926] border border-[#1E293B] rounded-xl p-5 hover:border-[#2563EB] cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#FCD34D]">03 · FRAUD RISK & eKYC</span>
                      <span className="text-[11px] font-mono text-[#FCD34D] bg-[#0B0F17] px-2 py-0.5 rounded border border-[#1E293B]">GRAPH FORENSICS</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#FCD34D] transition-colors">
                      {isFa ? 'احراز هویت و سامانه ضدتقلب' : 'Real-Time Fraud Forensics & Identity Engine'}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {isFa 
                        ? 'تحلیل بلادرنگ بردار رفتار و ردیابی گراف Neo4j در مهلت کمتر از ۳۰ میلی‌ثانیه با شیفت مسئولیت 3DS 2.0.'
                        : 'Real-time Neo4j graph traversal and behavioral fingerprinting evaluated within a strict sub-30ms window.'}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-2 border-t border-[#1E293B]">
                      <span>{stats.fraudRiskLoopSla.shortEn} · SHAHKAR eKYC</span>
                      <span className="text-[#FCD34D] flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        {isFa ? 'مشاهده پرونده' : 'View Spec'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Tile 04 */}
                  <div 
                    onClick={() => setView('reconciliation-engine')}
                    className="bg-[#131926] border border-[#1E293B] rounded-xl p-5 hover:border-[#2563EB] cursor-pointer transition-all shadow-md group space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#6EE7B7]">04 · RECONCILIATION & PAYOUTS</span>
                      <span className="text-[11px] font-mono text-[#6EE7B7] bg-[#064E3B40] px-2 py-0.5 rounded border border-[#6EE7B7]/30">3-WAY PARITY</span>
                    </div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#6EE7B7] transition-colors">
                      {isFa ? 'مغایرت‌گیری سه‌طرفه و تسویه زودهنگام' : '3-Way Reconciliation & Automated Clearing'}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {isFa 
                        ? 'تطبیق بلادرنگ صورت‌حساب بانک، لاگ سوییچ و دفتر کل با تسویه خودکار زودهنگام پذیرندگان در کمتر از ۱۸۰ ثانیه.'
                        : 'Multi-pass tri-party reconciliation matching bank statements, switch logs, and internal ledgers in sub-180s.'}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] pt-2 border-t border-[#1E293B]">
                      <span>{stats.reconAutoHealingSla.shortEn} · MT940 MATCH</span>
                      <span className="text-[#6EE7B7] flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        {isFa ? 'مشاهده پرونده' : 'View Spec'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subsystem Topology Summary Table with Sticky Header */}
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl overflow-hidden shadow-lg">
                  <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#F8FAFC]">
                      <Server className="w-4 h-4 text-[#2563EB]" />
                      <span>{isFa ? 'ماتریس مشخصات زیرساخت‌های فعال' : 'ACTIVE INFRASTRUCTURE SPECIFICATION MATRIX'}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#94A3B8]">CLUSTER HEALTH: 100% NOMINAL</span>
                  </div>
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-left font-mono text-xs text-[#94A3B8] border-collapse">
                      <thead className="sticky top-0 z-10 bg-[#131926] border-b border-[#1E293B]">
                        <tr className="text-[10px] text-[#94A3B8] uppercase">
                          <th className="py-2.5 px-4 font-semibold text-[#F8FAFC]">DOMAIN / SUBSYSTEM</th>
                          <th className="py-2.5 px-4 font-semibold">CORE PROTOCOL</th>
                          <th className="py-2.5 px-4 font-semibold">STORAGE & PERSISTENCE</th>
                          <th className="py-2.5 px-4 font-semibold">CONCURRENCY & CONSENSUS</th>
                          <th className="py-2.5 px-4 font-semibold text-[#6EE7B7]">PRODUCTION SLA</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E293B] text-[11px]">
                        <tr className="hover:bg-[#1E293B]/30 transition-colors">
                          <td className="py-2.5 px-4 text-[#F8FAFC] font-semibold">01 · Double-Entry Ledger</td>
                          <td className="py-2.5 px-4">Two-Phase Balance Reservation</td>
                          <td className="py-2.5 px-4">ScyllaDB + PostgreSQL Fact Tables</td>
                          <td className="py-2.5 px-4">Redis SETNX Atomic Mutex</td>
                          <td className="py-2.5 px-4 text-[#6EE7B7] font-semibold">{stats.ledgerPeakTps.shortEn} · 0.00% Drift</td>
                        </tr>
                        <tr className="hover:bg-[#1E293B]/30 transition-colors">
                          <td className="py-2.5 px-4 text-[#F8FAFC] font-semibold">02 · Smart PSP Switch</td>
                          <td className="py-2.5 px-4">ISO 8583 / Faravaran Hub</td>
                          <td className="py-2.5 px-4">In-Memory Redis + TimeSeries</td>
                          <td className="py-2.5 px-4">Dynamic Score Weighted Mesh</td>
                          <td className="py-2.5 px-4 text-[#38BDF8] font-semibold">&lt;15ms Failover · 99.99% Uptime</td>
                        </tr>
                        <tr className="hover:bg-[#1E293B]/30 transition-colors">
                          <td className="py-2.5 px-4 text-[#F8FAFC] font-semibold">03 · Fraud Risk & eKYC</td>
                          <td className="py-2.5 px-4">Shahkar Gateway / 3DS 2.0</td>
                          <td className="py-2.5 px-4">Neo4j Graph + Redis Bloom Filters</td>
                          <td className="py-2.5 px-4">Real-time Vector Fingerprinting</td>
                          <td className="py-2.5 px-4 text-[#FCD34D] font-semibold">&lt;30ms Risk Decision Loop</td>
                        </tr>
                        <tr className="hover:bg-[#1E293B]/30 transition-colors">
                          <td className="py-2.5 px-4 text-[#F8FAFC] font-semibold">04 · Reconciliation Engine</td>
                          <td className="py-2.5 px-4">Bank MT940 / Shaparak SFTP</td>
                          <td className="py-2.5 px-4">Spring Batch + PostgreSQL</td>
                          <td className="py-2.5 px-4">Transactional CDC Outbox Pattern</td>
                          <td className="py-2.5 px-4 text-[#6EE7B7] font-semibold">&lt;180s Auto-Healing Parity</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 01: DOUBLE-ENTRY LEDGER & 2PC ENGINE */}
            {currentView === 'payment-settlement' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                      <span>01 · {isFa ? 'دفاتر کل و تسویه مالی' : 'SETTLEMENTS & LEDGERS'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#6EE7B7] bg-[#064E3B40] border border-[#6EE7B7]/30 px-2.5 py-0.5 rounded">
                      ACID 2PC BALANCED
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'دفتر کل دوطرفه و موتور رزرو دومرحله‌ای موجودی' 
                      : 'The Double-Entry Ledger & Two-Phase Balance Reservation Engine'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Peak Throughput</span>
                      <span className="text-[#F8FAFC] font-bold text-sm">{stats.ledgerPeakTps.en}</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Financial Drift</span>
                      <span className="text-[#6EE7B7] font-bold text-sm">{stats.financialDriftPercent.en}</span>
                    </div>
                  </div>

                  {/* Full SVG Schematic */}
                  <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-2 px-1">
                      <span>TOPOLOGY SCHEMATIC · 2PC BALANCE RESERVATION</span>
                      <span className="text-[#6EE7B7]">MUTEX VERIFIED</span>
                    </div>
                    <img 
                      src={`${baseUrl}diagrams/double-entry-ledger-schematic.svg?v=fintech-v3`} 
                      alt="Double-Entry Ledger Schematic"
                      className="w-full h-auto rounded block"
                      loading="eager"
                    />
                  </div>

                  {/* 2-Column Technical Invariants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#38BDF8] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>Invariants & Business Logic</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Mathematical Parity:</strong> Strict Σ Debits − Σ Credits = 0 enforcement across fact tables.</li>
                        <li>• <strong className="text-[#F8FAFC]">Two-Phase Reservation:</strong> Transitions capital from AVAILABLE to RESERVED before upstream dispatch.</li>
                        <li>• <strong className="text-[#F8FAFC]">Distributed Idempotency:</strong> Redis SETNX mutex locks ({stats.ledgerLockTtl.en}) with a {stats.ledgerReplayWindow.textEn}.</li>
                      </ul>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#FCD34D] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
                        <span>Failure Modes & Recovery</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Banking Timeouts:</strong> Handled via transactional CDC outbox pattern, rejecting transient states.</li>
                        <li>• <strong className="text-[#F8FAFC]">Automated Rollback:</strong> Expired balance reservations revert to AVAILABLE upon timeout.</li>
                        <li>• <strong className="text-[#F8FAFC]">Production Result:</strong> 100% parity across {stats.reconciliationTrialEvents.en} with zero duplicate payouts.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 02: SMART PSP SWITCH & TELECOM ENGINE */}
            {currentView === 'payment-switch' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                      <span>02 · {isFa ? 'سوییچ پرداخت و روتینگ بانکی' : 'PAYMENT SWITCH & ISO 8583'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#38BDF8] bg-[#0B0F17] border border-[#1E293B] px-2.5 py-0.5 rounded">
                      H2H ISO 8583
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'سوییچ هوشمند پرداخت و روتینگ وزنی چندگانه' 
                      : 'Smart PSP Switch & Dynamic Weighted Routing Engine (ISO 8583)'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Failover SLA</span>
                      <span className="text-[#38BDF8] font-bold text-sm">{stats.switchFailoverSla.en}</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Gateway Uptime</span>
                      <span className="text-[#6EE7B7] font-bold text-sm">{stats.switchGatewayUptime.en}</span>
                    </div>
                  </div>

                  {/* SVG Schematic */}
                  <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-2 px-1">
                      <span>MULTI-PSP HEAD-TO-HEAD (H2H) ROUTING PIPELINE</span>
                      <span className="text-[#38BDF8]">DYNAMIC WEIGHTS</span>
                    </div>
                    <img 
                      src={`${baseUrl}diagrams/payment-switch-iso8583-pipeline.svg?v=fintech-v3`} 
                      alt="Smart PSP Switch Schematic"
                      className="w-full h-auto rounded block"
                      loading="eager"
                    />
                  </div>

                  {/* Dynamic Weight Routing Specs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#38BDF8] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>Dynamic Routing Architecture</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Head-to-Head (H2H) Switch:</strong> Unpacks ISO 8583 telegrams, parsing STAN, RRN, and terminal authentication headers in real time.</li>
                        <li>• <strong className="text-[#F8FAFC]">Multi-PSP Orchestration:</strong> Dynamically balances checkout loads across SEP (Saman), PEC (Parsian), BPM (Mellat), and PEP (Pasargad).</li>
                        <li>• <strong className="text-[#F8FAFC]">Score-Based Weighting:</strong> Real-time gateway health scores factoring rolling P99 latency and success ratios ({stats.switchConversionLift.en}).</li>
                      </ul>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#FCD34D] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
                        <span>Circuit Breakers & Failover</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Socket Shedding:</strong> Upstream network brownouts trigger automated circuit breakers shedding failing connections in {stats.switchFailoverSla.en}.</li>
                        <li>• <strong className="text-[#F8FAFC]">Zero User Drop:</strong> In-flight requests encountering disconnects seamlessly reroute to secondary PSP backbones.</li>
                        <li>• <strong className="text-[#F8FAFC]">Automated 0400:</strong> Dispatches ISO 8583 0400 reversal telegrams immediately when confirmation fails.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 03: FRAUD RISK & eKYC */}
            {currentView === 'fraud-forensics' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#FCD34D]" />
                      <span>03 · {isFa ? 'احراز هویت و کشف تقلب' : 'FRAUD RISK & eKYC'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#FCD34D] bg-[#0B0F17] border border-[#1E293B] px-2.5 py-0.5 rounded">
                      GRAPH FORENSICS
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'سامانه بلادرنگ مهار تقلب و احراز هویت شاهکار' 
                      : 'Real-Time Fraud Forensics & Identity Engine (Shahkar eKYC)'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Decision SLA</span>
                      <span className="text-[#FCD34D] font-bold text-sm">{stats.fraudRiskLoopSla.en}</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">National ID Coverage</span>
                      <span className="text-[#6EE7B7] font-bold text-sm">{stats.nationalIdEnriched.en}</span>
                    </div>
                  </div>

                  {/* SVG Schematic */}
                  <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-2 px-1">
                      <span>eKYC RISK & FRAUD GRAPH FORENSICS TOPOLOGY</span>
                      <span className="text-[#FCD34D]">NEO4J TRAVERSAL</span>
                    </div>
                    <img 
                      src={`${baseUrl}diagrams/ekyc-fraud-risk-schematic.svg?v=fintech-v3`} 
                      alt="eKYC and Fraud Risk Schematic"
                      className="w-full h-auto rounded block"
                      loading="eager"
                    />
                  </div>

                  {/* Technical Specifications */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#38BDF8] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>Behavioral Graph Forensics</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Sub-30ms Neo4j Traversal:</strong> Analyzes entity clustering across shared device fingerprints, IBANs, and IP subnets.</li>
                        <li>• <strong className="text-[#F8FAFC]">3DS 2.0 Liability Shift:</strong> Enforces dynamic Harim OTP challenges only on transactions exceeding dynamic risk thresholds.</li>
                        <li>• <strong className="text-[#F8FAFC]">Redis Bloom Filter:</strong> Instant existence validation preventing redundant heavy database lookups.</li>
                      </ul>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#FCD34D] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
                        <span>Production Impact</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Fraud Rate Cut:</strong> {stats.fraudChargebackReduction.textEn} while preserving sub-1 second checkout completion.</li>
                        <li>• <strong className="text-[#F8FAFC]">Zero False Halts:</strong> High-risk mule syndicates halted prior to authorization phase.</li>
                        <li>• <strong className="text-[#F8FAFC]">Audit Ready:</strong> Full cryptographic audit trail for regulatory Central Bank inquiries.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 04: RECONCILIATION & PAYOUTS */}
            {currentView === 'reconciliation-engine' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                      <span>04 · {isFa ? 'مغایرت‌گیری و تسویه' : 'RECONCILIATION & CLEARING'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#6EE7B7] bg-[#064E3B40] border border-[#6EE7B7]/30 px-2.5 py-0.5 rounded">
                      3-WAY PARITY
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'مغایرت‌گیری سه‌طرفه و موتور تسویه زودهنگام' 
                      : '3-Way Reconciliation & Automated Clearing Engine'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Auto-Healing SLA</span>
                      <span className="text-[#6EE7B7] font-bold text-sm">{stats.reconAutoHealingSla.en}</span>
                    </div>
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-lg p-3">
                      <span className="text-[#94A3B8] block text-[10px] uppercase">Daily Clearing Batches</span>
                      <span className="text-[#38BDF8] font-bold text-sm">{stats.clearingBatchesDaily.en}</span>
                    </div>
                  </div>

                  {/* SVG Schematic */}
                  <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] mb-2 px-1">
                      <span>TRI-PARTY SETTLEMENT MATCH MATRIX SCHEMATIC</span>
                      <span className="text-[#6EE7B7]">MT940 / SHAPARAK PARITY</span>
                    </div>
                    <img 
                      src={`${baseUrl}diagrams/reconciliation-clearing-schematic.svg?v=fintech-v3`} 
                      alt="Reconciliation Clearing Schematic"
                      className="w-full h-auto rounded block"
                      loading="eager"
                    />
                  </div>

                  {/* Reconciliation Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#38BDF8] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                        <span>Tri-Party Matching Mechanism</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Multi-Source SFTP Ingestion:</strong> Ingests MT940 bank statements, PSP transaction journals, and Shaparak clearing files.</li>
                        <li>• <strong className="text-[#F8FAFC]">Auto-Healing Refund-MNG:</strong> Identifies uncaptured authorizations and issues automated reverse credits ({stats.manualReconOverhead.en}).</li>
                        <li>• <strong className="text-[#F8FAFC]">Asynchronous Spring Batch:</strong> High-throughput reconciliation pipelines handling tens of millions of records nightly.</li>
                      </ul>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-mono font-bold text-[#6EE7B7] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7]" />
                        <span>Early Merchant Payouts</span>
                      </div>
                      <ul className="space-y-2 text-[#94A3B8] leading-relaxed">
                        <li>• <strong className="text-[#F8FAFC]">Sub-180s Payouts:</strong> Automated Paya/Satna ACH batches disburse early capital, eliminating cash-flow bottlenecks.</li>
                        <li>• <strong className="text-[#F8FAFC]">Dynamic Floating Fee:</strong> Deducts time-weighted credit fees calculated via delta interest curves.</li>
                        <li>• <strong className="text-[#F8FAFC]">Zero Drift Guarantee:</strong> Shadow trials proved 100% parity across {stats.reconciliationTrialEvents.en}.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 05: PRODUCTION INCIDENT DOSSIERS & POSTMORTEMS */}
            {currentView === 'incident-dossiers' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#FCD34D]" />
                      <span>05 · {isFa ? 'آرشیو بحران‌های زنده در پروداکشن' : 'PRODUCTION INCIDENT ARCHIVE'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#6EE7B7] bg-[#064E3B40] border border-[#6EE7B7]/30 px-2.5 py-0.5 rounded">
                      3/3 POSTMORTEMS RESOLVED
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'آرشیو مستند بحران‌های زنده پروداکشن و بازیابی معماری' 
                      : 'Battle-Tested Failure Resolution & Postmortem Archive'}
                  </h2>

                  {/* 3 Incident Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Incident 01 */}
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#1E293B] pb-2">
                        <span className="text-[#FCD34D] font-bold">INCIDENT 01 · SWITCH-PSP</span>
                        <span className="text-[#6EE7B7] bg-[#064E3B40] px-1.5 py-0.5 rounded">P0 RESOLVED</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">Upstream ISO 8583 Timeout & Reverse Storms</h4>
                      <div className="text-[11px] text-[#94A3B8] space-y-1.5 font-mono">
                        <p><strong className="text-[#FCD34D]">ROOT CAUSE:</strong> Bank host socket hangs triggered duplicate capture retries.</p>
                        <p><strong className="text-[#38BDF8]">INVARIANT:</strong> Mutex lock must outlive longest carrier retry window ({stats.ledgerReplayWindow.en}).</p>
                        <p><strong className="text-[#F8FAFC]">HARDENED FIX:</strong> Redis SETNX with {stats.incident01LockTtl.en} TTL + ScyllaDB append-only fact log.</p>
                      </div>
                      <div className="pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#6EE7B7]">
                        → {stats.incidentFinancialDrift.badgeEn}
                      </div>
                    </div>

                    {/* Incident 02 */}
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#1E293B] pb-2">
                        <span className="text-[#FCD34D] font-bold">INCIDENT 02 · TELECOM MESH</span>
                        <span className="text-[#6EE7B7] bg-[#064E3B40] px-1.5 py-0.5 rounded">P0 RESOLVED</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">National Telecom SMPP 3.4 Sliding-Window Choke</h4>
                      <div className="text-[11px] text-[#94A3B8] space-y-1.5 font-mono">
                        <p><strong className="text-[#FCD34D]">ROOT CAUSE:</strong> High-volume broadcast runs clogged SMSC binds, delaying Harim OTPs.</p>
                        <p><strong className="text-[#38BDF8]">INVARIANT:</strong> Auth queues must never share sliding windows with marketing traffic.</p>
                        <p><strong className="text-[#F8FAFC]">HARDENED FIX:</strong> Dual-plane RabbitMQ priority queues + dynamic SMPP window throttle.</p>
                      </div>
                      <div className="pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#6EE7B7]">
                        → {stats.incident02OtpSla.en}
                      </div>
                    </div>

                    {/* Incident 03 */}
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono border-b border-[#1E293B] pb-2">
                        <span className="text-[#FCD34D] font-bold">INCIDENT 03 · BIG DATA & eKYC</span>
                        <span className="text-[#6EE7B7] bg-[#064E3B40] px-1.5 py-0.5 rounded">P1 RESOLVED</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#F8FAFC]">{stats.incident03Title.en}</h4>
                      <div className="text-[11px] text-[#94A3B8] space-y-1.5 font-mono">
                        <p><strong className="text-[#FCD34D]">ROOT CAUSE:</strong> {stats.preKycUnindexedRecords.en} caused database table-level locks during peak lookups.</p>
                        <p><strong className="text-[#38BDF8]">INVARIANT:</strong> Enrichment must complete in {stats.switchFailoverSla.en} without locks.</p>
                        <p><strong className="text-[#F8FAFC]">HARDENED FIX:</strong> Redis Bloom filter for instant existence checks + phonetic cache.</p>
                      </div>
                      <div className="pt-2 border-t border-[#1E293B] text-[10px] font-mono text-[#6EE7B7]">
                        → {stats.incident03LockElimination.en}
                      </div>
                    </div>
                  </div>

                  {/* Circuit Breaker Matrix with Sticky Header */}
                  <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl overflow-hidden">
                    <div className="p-3 border-b border-[#1E293B] flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-[#F8FAFC]">PRODUCTION CIRCUIT BREAKER POLICY MATRIX</span>
                      <span className="text-[#94A3B8]">AUTO-HEALING ACTIVE</span>
                    </div>
                    <div className="overflow-x-auto max-h-64 overflow-y-auto">
                      <table className="w-full text-left font-mono text-xs text-[#94A3B8] border-collapse">
                        <thead className="sticky top-0 z-10 bg-[#0B0F17] border-b border-[#1E293B]">
                          <tr className="text-[10px] text-[#94A3B8] uppercase">
                            <th className="py-2 px-3 font-semibold text-[#F8FAFC]">SUBSYSTEM</th>
                            <th className="py-2 px-3 font-semibold">TARGET SLA</th>
                            <th className="py-2 px-3 font-semibold">FAILURE TRIGGER</th>
                            <th className="py-2 px-3 font-semibold text-[#6EE7B7]">AUTOMATED MITIGATION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B] text-[11px]">
                          <tr className="hover:bg-[#1E293B]/20">
                            <td className="py-2 px-3 text-[#F8FAFC] font-semibold">API Gateway</td>
                            <td className="py-2 px-3 text-[#38BDF8]">{stats.circuitBreakerApiP99.en}</td>
                            <td className="py-2 px-3">Socket saturation</td>
                            <td className="py-2 px-3 text-[#6EE7B7]">Dynamic token bucket scaling & route shedding</td>
                          </tr>
                          <tr className="hover:bg-[#1E293B]/20">
                            <td className="py-2 px-3 text-[#F8FAFC] font-semibold">Switch-PSP Core</td>
                            <td className="py-2 px-3 text-[#6EE7B7]">{stats.circuitBreakerSwitchPsr.en}</td>
                            <td className="py-2 px-3">Bank gateway 504s</td>
                            <td className="py-2 px-3 text-[#6EE7B7]">Zero out PSP weight; immediate failover</td>
                          </tr>
                          <tr className="hover:bg-[#1E293B]/20">
                            <td className="py-2 px-3 text-[#F8FAFC] font-semibold">Wallet Ledger</td>
                            <td className="py-2 px-3 text-[#FCD34D]">{stats.circuitBreakerLedgerInvariant.en}</td>
                            <td className="py-2 px-3">Concurrent debit race</td>
                            <td className="py-2 px-3 text-[#6EE7B7]">Halt withdrawals; trigger P1 on-call pager</td>
                          </tr>
                          <tr className="hover:bg-[#1E293B]/20">
                            <td className="py-2 px-3 text-[#F8FAFC] font-semibold">Merchant Settlement</td>
                            <td className="py-2 px-3 text-[#38BDF8]">{stats.circuitBreakerSettlementWindow.en}</td>
                            <td className="py-2 px-3">SFTP disconnects</td>
                            <td className="py-2 px-3 text-[#6EE7B7]">Jittered exponential backoff retry</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 06: PRODUCT LIFECYCLE & ENGINEERING LEADERSHIP */}
            {currentView === 'lifecycle' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                      <span>06 · {isFa ? 'چرخه حیات محصول فنی' : 'PRODUCT LIFECYCLE & LEADERSHIP'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#38BDF8] bg-[#0B0F17] border border-[#1E293B] px-2.5 py-0.5 rounded">
                      END-TO-END DELIVERY
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'راهبری محصول فنی و چرخه تحویل مهندسی سیستم‌ها' 
                      : 'Engineering Leadership & Technical Product Delivery Arc'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 space-y-2">
                      <div className="text-xs font-mono font-bold text-[#38BDF8]">01 · DISCOVERY & RFC</div>
                      <h4 className="text-sm font-bold text-[#F8FAFC]">System Boundary Definition</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Rigorous RFC architecture proposals, SLA mathematical contracts, and adversarial failure modeling before code touches version control.
                      </p>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 space-y-2">
                      <div className="text-xs font-mono font-bold text-[#6EE7B7]">02 · SHADOW TESTING</div>
                      <h4 className="text-sm font-bold text-[#F8FAFC]">Dark Traffic Verification</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Mirroring live production load into shadow clusters to prove zero financial drift and sub-15ms latency SLAs without user impact.
                      </p>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 space-y-2">
                      <div className="text-xs font-mono font-bold text-[#FCD34D]">03 · GOVERNANCE & AUDIT</div>
                      <h4 className="text-sm font-bold text-[#F8FAFC]">Regulatory Compliance</h4>
                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        Continuous telemetry audit trails, Shaparak reconciliation sign-offs, and automated zero-drift balance verifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 07: ARCHITECTURE INTAKE & CONSULTATION */}
            {currentView === 'book' && (
              <div className="space-y-6">
                <div className="bg-[#131926] border border-[#1E293B] rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] uppercase">
                      <span className="w-2 h-2 rounded-full bg-[#6EE7B7]" />
                      <span>07 · {isFa ? 'جلسه بررسی معماری و مشاوره تخصصی' : 'ARCHITECTURE INTAKE & CONSULTATION'}</span>
                    </div>
                    <span className="text-xs font-mono text-[#6EE7B7] bg-[#064E3B40] border border-[#6EE7B7]/30 px-2.5 py-0.5 rounded">
                      DIRECT ACCESS
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">
                    {isFa 
                      ? 'مشاوره معماری، بازطراحی زیرساخت و رفع گلوگاه‌های هم‌روندی' 
                      : 'Architecture Consultation, System Hardening & Concurrency Intake'}
                  </h2>

                  <p className="text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
                    Direct advisory for engineering organizations tackling high-concurrency payment switches, double-entry ledger parity, regulatory eKYC compliance, or critical infrastructure outages.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 space-y-3">
                      <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-[#2563EB]" />
                        <span>Direct Communication Channels</span>
                      </h4>
                      <div className="space-y-2 text-xs font-mono text-[#94A3B8]">
                        <div className="flex items-center justify-between py-1.5 border-b border-[#1E293B]">
                          <span>Email:</span>
                          <a href="mailto:ariasg2002@gmail.com" className="text-[#38BDF8] hover:underline">ariasg2002@gmail.com</a>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#1E293B]">
                          <span>Telegram:</span>
                          <a href="https://t.me/ariasg2002" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline">@ariasg2002</a>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#1E293B]">
                          <span>LinkedIn:</span>
                          <a href="https://www.linkedin.com/in/ariya-sarrafzadeh/" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline">/in/ariya-sarrafzadeh</a>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0B0F17] border border-[#1E293B] rounded-xl p-5 space-y-3 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6EE7B7]" />
                          <span>Schedule Technical Review Session</span>
                        </h4>
                        <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                          30 to 60 minute confidential architectural review covering ledger invariant design, multi-PSP routing, or telecom infrastructure.
                        </p>
                      </div>
                      <a
                        href="https://calendar.app.google/PfvF8Xo3rYc8Zk9q9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-center py-2.5 px-4 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <span>BOOK ARCHITECTURE REVIEW</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* =========================================================================
          BOTTOM SYSTEM STATUS & MCP DOCK (Sticky Pinned 32px Frame)
          ========================================================================= */}
      <footer className="h-8 min-h-[2rem] bg-[#0B0F17] border-t border-[#1E293B] px-4 flex items-center justify-between text-[11px] font-mono text-[#94A3B8] z-30 select-none">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EE7B7]" />
            <span className="text-[#F8FAFC]">TEH-CORE-01</span>
          </span>
          <span className="hidden sm:inline text-[#1E293B]">|</span>
          <span className="hidden sm:inline">MUTEX: REDIS-CLUSTER</span>
          <span className="hidden md:inline text-[#1E293B]">|</span>
          <span className="hidden md:inline">CDC OUTBOX: ACTIVE</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-[#94A3B8]">
            MCP READY: <code className="text-[#38BDF8]">window.__AGENTIC_CONSOLE__</code>
          </span>
          <span className="text-[#1E293B]">|</span>
          <a href={`${baseUrl}openapi.json`} target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC]">OpenAPI</a>
          <span>·</span>
          <a href={`${baseUrl}llms.txt`} target="_blank" rel="noopener noreferrer" className="hover:text-[#F8FAFC]">llms.txt</a>
        </div>
      </footer>

      {/* =========================================================================
          AGENTIC MCP PROTOCOL & WCAG AUDIT MODAL
          ========================================================================= */}
      {mcpModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131926] border border-[#1E293B] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs text-[#94A3B8]">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
              <div className="flex items-center gap-2 text-[#F8FAFC] font-bold">
                <Sliders className="w-4 h-4 text-[#2563EB]" />
                <span>AGENTIC MCP PROTOCOL & ACCESSIBILITY AUDITOR</span>
              </div>
              <button 
                onClick={() => setMcpModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] leading-relaxed">
                Autonomous AI agents can query UI state, switch views, or inspect telemetry via <code className="text-[#38BDF8]">window.__AGENTIC_CONSOLE__</code> or the registered MCP schema in <code className="text-[#38BDF8]">/mcp/operations-tools.json</code>.
              </p>

              <div className="bg-[#0B0F17] border border-[#1E293B] rounded p-3 space-y-2">
                <div className="text-[10px] uppercase text-[#94A3B8] font-bold">Current Agentic State</div>
                <div className="text-[11px] text-[#F8FAFC]">
                  Active Tab: <span className="text-[#38BDF8]">{currentView}</span> | Viewport: <span className="text-[#38BDF8]">{viewport.width}x{viewport.height}</span> ({viewport.isDesktop ? 'Desktop' : 'Mobile'})
                </div>
                <div className="text-[11px] text-[#F8FAFC]">
                  Telemetry TPS: <span className="text-[#6EE7B7]">{metrics.tps.toLocaleString()}</span> | Drift: <span className="text-[#6EE7B7]">0.00%</span>
                </div>
              </div>

              {/* WCAG Audit Results */}
              <div className="bg-[#0B0F17] border border-[#1E293B] rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase text-[#94A3B8] font-bold">In-Browser WCAG 2.1 Audit</div>
                  <button
                    onClick={runAudit}
                    disabled={auditRunning}
                    className="px-2 py-0.5 rounded bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px]"
                  >
                    {auditRunning ? 'RUNNING...' : 'RE-RUN AUDIT'}
                  </button>
                </div>
                {auditResult ? (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#94A3B8]">Audit Status:</span>
                      <span className={`font-bold ${auditResult.passed ? 'text-[#6EE7B7]' : 'text-[#FCD34D]'}`}>
                        {auditResult.passed ? 'PASSED (0 VIOLATIONS)' : `${auditResult.violations} VIOLATION(S) FOUND`}
                      </span>
                    </div>
                    <div className="text-[#94A3B8]">
                      Audited DOM Elements: <span className="text-[#F8FAFC]">{auditResult.auditedElements}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-[#94A3B8]">Auditing in progress...</div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={() => setMcpModalOpen(false)}
                className="px-4 py-1.5 rounded bg-[#1E293B] hover:bg-[#334155] text-white font-bold"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
