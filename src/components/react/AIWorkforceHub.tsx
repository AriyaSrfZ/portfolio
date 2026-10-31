import React, { useState } from 'react';
import { 
  Cpu, 
  Calendar, 
  Mail, 
  CheckSquare, 
  Database, 
  Clock, 
  Share2, 
  Users, 
  Sparkles, 
  ChevronRight, 
  Terminal, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  FileText
} from 'lucide-react';

interface AIWorkforceHubProps {
  locale?: 'en' | 'fa';
}

export default function AIWorkforceHub({ locale = 'en' }: AIWorkforceHubProps) {
  const isFa = locale === 'fa';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'brain' | 'assistant' | 'marketing' | 'workforce'>('dashboard');

  const tabs = isFa
    ? [
        { id: 'dashboard', label: 'داشبورد زندگی', icon: LayoutDashboardIcon },
        { id: 'brain', label: 'مغز دوم (Obsidian)', icon: Database },
        { id: 'assistant', label: 'دستیار اجرایی', icon: Clock },
        { id: 'marketing', label: 'عامل بازاریابی محتوا', icon: Share2 },
        { id: 'workforce', label: 'نیروی کار عامل‌ها (Chief of Staff)', icon: Users },
      ]
    : [
        { id: 'dashboard', label: 'Life Dashboard', icon: LayoutDashboardIcon },
        { id: 'brain', label: 'Second Brain (Obsidian)', icon: Database },
        { id: 'assistant', label: 'Executive Assistant', icon: Clock },
        { id: 'marketing', label: 'Content Marketing Agent', icon: Share2 },
        { id: 'workforce', label: 'AI Workforce (Chief of Staff)', icon: Users },
      ];

  return (
    <div className={`w-full bg-[#0c0e12] border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl ${isFa ? "font-['Vazirmatn',sans-serif]" : "font-sans"}`} dir={isFa ? 'rtl' : 'ltr'}>
      {/* Top Console Status Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2 font-mono">
              <span>{isFa ? 'سیستم عامل هوش مصنوعی (AI OS) · جارویس' : 'AUTONOMOUS AI OS · JARVIS CHIEF OF STAFF'}</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                {isFa ? 'فعال در پروداکشن' : 'LIVE RUNTIME'}
              </span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isFa
                ? 'پنج پروژه کلیدی ساخته‌شده در کلود برای ارتقا به جمع ۱٪ کاربران ارشد هوش مصنوعی'
                : '5 Core Weekend Claude Implementations Operating at the Top 1% Autonomous Tier'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono text-xs font-semibold transition-all shadow-sm"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isFa ? 'اجرای داشبورد Agent OS' : 'Launch Agent OS (8080)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{isFa ? 'عامل‌های خودمختار: ۶ فعال' : '6 Sub-Agents Synchronized'}</span>
          </div>
        </div>
      </div>

      {/* Pill Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-3 mb-6 border-b border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white shadow-md font-semibold scale-[1.02]'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07] border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Panes */}
      <div className="transition-all duration-200">
        {/* TAB 1: LIFE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>{isFa ? 'همگام‌سازی روزانه' : 'DAILY BRIEFING CADENCE'}</span>
                  <span className="text-emerald-400 font-bold">07:00 AM</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {isFa ? 'تک‌صفحه متمرکز تله‌متری' : 'Single-Pane Glass'}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {isFa
                    ? 'یکپارچه‌سازی تقویم کاری، صندوق‌های پستی، وظایف تیم و شاخص‌های کلیدی در یک داشبورد خودکار.'
                    : 'Pulls calendar schedules, unread executive emails, Linear tickets, and infrastructure alarms onto one view.'}
                </p>
              </div>

              <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>{isFa ? 'ابزارهای متصل' : 'CONNECTED RUNTIME TOOLS'}</span>
                  <span className="text-cyan-400 font-bold">5 OF 5 OK</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> Google Calendar</span>
                    <span className="text-emerald-400">Synced</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-cyan-400" /> Gmail / Fastmail</span>
                    <span className="text-emerald-400">Triaged</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <span className="flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-violet-400" /> Linear / GitHub Tasks</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
                  <span>{isFa ? 'صرفه‌جویی هفتگی زمان' : 'LEVERAGE MULTIPLIER'}</span>
                  <span className="text-amber-400 font-bold">+25h / WK</span>
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  {isFa ? 'رفع حواس‌پرتی و پراکندگی' : 'Zero Context Fragmentation'}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {isFa
                    ? 'پایان جستجو میان تب‌های متعدد؛ شروع هر روز با اولویت‌های رتبه‌بندی‌شده و متمرکز.'
                    : 'Every day starts with auto-prioritized high-leverage decisions ready for execution.'}
                </p>
              </div>
            </div>

            {/* Simulated Live Morning Briefing Output */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-xs">
              <div className="flex items-center justify-between text-neutral-400 border-b border-white/5 pb-2 mb-3">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isFa ? 'خروجی خلاصه تحلیلی صبحگاهی جارویس (نمونه واقعی)' : 'JARVIS MORNING EXECUTIVE DISPATCH · AUTOMATED 07:00 BRIEF'}</span>
                </span>
                <span className="text-[10px] text-neutral-500">Claude-3.7-Sonnet Engine</span>
              </div>
              <div className="space-y-2 text-neutral-300 leading-relaxed">
                <p className="text-amber-300">
                  {isFa 
                    ? '► تقویم: ۳ جلسه کلیدی با کمیته ریسک و بررسی سوییچ پیامک (ساعت ۱۰:۳۰ و ۱۴:۰۰).'
                    : '► Calendar: 3 high-impact sessions queued (Risk Committee & Telecom Switch Failover at 10:30 & 14:00).'}
                </p>
                <p className="text-cyan-300">
                  {isFa 
                    ? '► ایمیل و ارتباطات: ۱۸ پیام تریاژ شد؛ ۲ ایمیل نیاز به تصمیم‌گیری مدیر ارشد دارد.'
                    : '► Communications: 18 threads triaged into Obsidian action queues; 2 partner approval drafts awaiting 1-click dispatch.'}
                </p>
                <p className="text-emerald-300">
                  {isFa 
                    ? '► تمرکز عمیق (Deep Work): بلوک اختصاصی ۲ ساعته برای نهایی‌سازی معماری سه‌طرفه مغایرت‌گیری.'
                    : '► Deep Work Block: 2 hours protected at 15:30 for 3-way reconciliation architectural sign-off.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECOND BRAIN */}
        {activeTab === 'brain' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141820] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-cyan-400 font-bold uppercase">{isFa ? 'ساختار پایگاه دانش آبسیدین' : 'OBSIDIAN MARKDOWN VAULT'}</span>
                  <span className="text-neutral-400">1,200+ Notes</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {isFa
                    ? 'تمام مستندات حقوقی، قراردادهای بانکی، بیمه‌نامه‌ها، مستندات معماری و آرشیو یادداشت‌ها در یک فولدر استاندارد مارک‌داون قرار گرفته و مستقیماً به ابزارهای MCP و عامل‌ها متصل است.'
                    : 'All corporate contracts, insurance policies, architectural RFCs, and administrative records stored as deterministic markdown with bi-directional wikilinks, connected via MCP.'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-neutral-400 block text-[10px]">{isFa ? 'قراردادها و حقوقی' : 'Contracts & Admin'}</span>
                    <span className="text-white font-semibold">{isFa ? '۱۴۰+ سند' : '140+ Files'}</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded border border-white/5">
                    <span className="text-neutral-400 block text-[10px]">{isFa ? 'معماری و سیستم‌ها' : 'Architecture RFCs'}</span>
                    <span className="text-white font-semibold">{isFa ? '۳۸۰+ سند' : '380+ Notes'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#141820] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 font-bold uppercase">{isFa ? 'بازیابی زمینه برای هوش مصنوعی' : 'AGENT CONTEXT INGESTION'}</span>
                  <span className="text-neutral-400">Sub-50ms RAG</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {isFa
                    ? 'عامل‌ها به جای اتکا به حافظه فرار یا توهمات زبانی، حقایق و سوابق را مستقیماً از گراف آبسیدین خوانده و پیوسته آن را به‌روزرسانی می‌کنند.'
                    : 'Instead of prompt amnesia or hallucinations, agents query the local Obsidian vault with graph traverse tools to load verified ground truth on demand.'}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-white/5 p-2.5 rounded border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{isFa ? 'همگام‌سازی لحظه‌ای با اسکریپت sync_vault.sh' : 'Continuous sync via sync_vault.sh & Obsidian MCP tools'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EXECUTIVE ASSISTANT */}
        {activeTab === 'assistant' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isFa ? 'چرخه صبحگاهی (AM Kickoff)' : 'MORNING KICKOFF PROTOCOL'}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                  {isFa
                    ? 'تعیین ۳ اولویت حیاتی روز، بررسی تقویم و مسدودکننده‌های بالقوه پیش از شروع کار.'
                    : 'Locks down the Top 3 strategic non-negotiables for the day, checks team dependencies, and clears blocker noise.'}
                </p>
                <ul className="text-xs font-mono space-y-1.5 text-neutral-400">
                  <li className="flex items-center gap-1.5 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isFa ? 'رتبه‌بندی وظایف بر اساس بازدهی اهرمی' : 'Eisenhower matrix leverage ranking'}</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isFa ? 'آماده‌سازی پیش‌نویس پاسخ به ذی‌نفعان' : 'Pre-flight meeting agenda briefings'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isFa ? 'بازنگری شبانه و تحلیل هفتگی (PM Retro)' : 'EVENING RETRO & WEEKLY ROLLUP'}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                  {isFa
                    ? 'ارزیابی بی‌تعارف اینکه چه مواردی پیش رفت و چه کارهایی متوقف شد؛ تجمیع هفتگی برای شناسایی گلوگاه‌ها.'
                    : 'Unforgiving audit of what shipped vs what stalled. Weekly rollup synthesizes velocity leaks and compound gains.'}
                </p>
                <ul className="text-xs font-mono space-y-1.5 text-neutral-400">
                  <li className="flex items-center gap-1.5 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isFa ? 'محاسبه نرخ تحقق اهداف و دلتای عملکرد' : 'Objective completion delta tracking'}</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-neutral-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isFa ? 'تغذیه بازخورد به چرخه برنامه‌ریزی هفته بعد' : 'Continuous optimization feedback loop'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT MARKETING AGENT */}
        {activeTab === 'marketing' && (
          <div className="space-y-4">
            <div className="bg-[#141820] border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-amber-400 font-bold uppercase">{isFa ? 'عامل تولید محتوا و هویت برند' : 'BRAND & ICP-AWARE CONTENT ENGINE'}</span>
                <span className="text-neutral-400">Zero-Slop Verified</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                {isFa
                  ? 'این عامل با شناخت دقیق هویت برند، پرسونای مخاطب (ICP) و ادبیات مهندسی، محتواهای تخصصی لینکدین، خبرنامه‌ها و تحلیل‌های فنی را بدون اسلوپ‌های هوش مصنوعی تولید و اعتبارسنجی می‌کند.'
                  : 'Monitors industry shifts, applies tested hook formulas, and drafts deeply technical, humanized posts for LinkedIn and technical newsletters that build authority without generic AI slop.'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-neutral-400 text-[10px] block">{isFa ? 'فرمول‌های هوک' : 'Tested Hook Engine'}</span>
                  <span className="text-emerald-400 font-bold">21 Proven Patterns</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-neutral-400 text-[10px] block">{isFa ? 'فیلتر انسانی‌سازی' : 'Anti-Slop Linter'}</span>
                  <span className="text-cyan-400 font-bold">100% De-Em Dash</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                  <span className="text-neutral-400 text-[10px] block">{isFa ? 'کانال‌های انتشار' : 'Distribution Channels'}</span>
                  <span className="text-white font-bold">LinkedIn · X · Blog</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI WORKFORCE */}
        {activeTab === 'workforce' && (
          <div className="space-y-4">
            <div className="bg-[#141820] border border-white/10 rounded-xl p-5">
              <div className="text-center max-w-xl mx-auto mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs mb-2">
                  <Brain className="w-3.5 h-3.5" />
                  <span>{isFa ? 'معماری سلسله‌مراتبی نیروی کار هوش مصنوعی' : 'HIERARCHICAL MULTI-AGENT SWARM'}</span>
                </div>
                <h4 className="text-lg font-bold text-white tracking-tight">
                  {isFa ? 'جارویس، مدیر ارشد ستادی هوش مصنوعی (Jarvis Chief of Staff)' : 'Jarvis Chief of Staff Runs The Team'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {isFa
                    ? 'تعیین اولویت‌ها، تفویض دقیق مأموریت‌ها میان ۶ عامل متخصص و تجمیع نتایج نهایی'
                    : 'Sets priorities • Delegates work • Synthesizes mission outcomes'}
                </p>
              </div>

              {/* Visual Multi-Agent Topology Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
                {[
                  { title: isFa ? 'دستیار اجرایی' : 'Executive Assistant', tag: 'Diurnal AM/PM', color: 'border-amber-500/30 text-amber-400' },
                  { title: isFa ? 'عامل محتوا' : 'Content Agent', tag: 'Brand & ICP', color: 'border-cyan-500/30 text-cyan-400' },
                  { title: isFa ? 'عامل پژوهش' : 'Research Agent', tag: 'Deep Search RAG', color: 'border-emerald-500/30 text-emerald-400' },
                  { title: isFa ? 'عامل فروش' : 'Sales Agent', tag: 'Inbound Pipeline', color: 'border-violet-500/30 text-violet-400' },
                  { title: isFa ? 'عامل عملیات' : 'Operations Agent', tag: 'Infra & Metrics', color: 'border-rose-500/30 text-rose-400' },
                  { title: isFa ? 'عامل تحلیل داده' : 'Analytics Agent', tag: 'Telemetry & Stats', color: 'border-blue-500/30 text-blue-400' },
                ].map((agent, i) => (
                  <div key={i} className={`bg-white/[0.03] border ${agent.color} rounded-xl p-3 text-center space-y-1 hover:bg-white/[0.06] transition-all`}>
                    <div className="text-xs font-bold text-white">{agent.title}</div>
                    <div className="text-[10px] font-mono text-neutral-400">{agent.tag}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
