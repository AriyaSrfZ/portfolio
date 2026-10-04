import React, { useState } from 'react';

interface LandingStageProps {
  locale?: 'en' | 'fa';
}

export default function LandingStage({ locale = 'en' }: LandingStageProps) {
  const isFa = locale === 'fa';
  const [activeTab, setActiveTab] = useState<'metrics' | 'pillars' | 'stack' | 'directives'>('metrics');

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

  const proofMatrix = isFa
    ? [
        { val: "۱۵+ سال", label: "معماری سامانه‌های مقیاس‌پذیر", tag: "زیرساخت حیاتی", href: "#payment-settlement" },
        { val: "۱B+ پیامک", label: "هاب ملی مخابرات و SMPP 3.4", tag: "کنترل جریان", href: "#payment-switch" },
        { val: "۵۰K TPS", label: "ظرفیت اوج پردازش هم‌روند", tag: "سوییچ شتاب", href: "#payment-switch" },
        { val: "زیر ۱۵ms", label: "مهلت حلقه ارزیابی ریسک", tag: "گارد تقلب", href: "#fraud-forensics" },
        { val: "۰٫۰۰٪", label: "انحراف مالی در تسویه روزانه", tag: "تراز ریاضی", href: "#reconciliation-engine" },
      ]
    : [
        { val: "15+ YRS", label: "Production Infrastructure", tag: "CRITICAL CORE", href: "#payment-settlement" },
        { val: "1B+ SMS", label: "SMPP 3.4 Hub Messages / Year", tag: "FLOW CONTROL", href: "#payment-switch" },
        { val: "50K TPS", label: "Peak Concurrent Throughput", tag: "H2H SWITCH", href: "#payment-switch" },
        { val: "<15ms SLA", label: "Real-Time Fraud Risk Loop", tag: "GRAPH FORENSICS", href: "#fraud-forensics" },
        { val: "0.00% DRIFT", label: "Across 50K+ Daily Clearing Batches", tag: "ACID BALANCED", href: "#reconciliation-engine" },
      ];

  const pillars = isFa
    ? [
        {
          num: "۰۱",
          title: "دفتر کل دوطرفه و رزرو دومرحله‌ای",
          desc: "ماشین حالت اتمیک با قفل توزیع‌شده Redis SETNX و ثبت تغییرات Outbox CDC بدون اوررایت موجودی.",
          href: "#payment-settlement",
          tag: "ACID LEDGER"
        },
        {
          num: "۰۲",
          title: "سوییچ هوشمند پرداخت چندگانه",
          desc: "روتینگ دینامیک ISO 8583 بین PSPها با تاخیر زیر ۳۰ میلی‌ثانیه و بازگشت خودکار 0400.",
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH"
        },
        {
          num: "۰۳",
          title: "احراز هویت و سامانه ضدتقلب",
          desc: "تحلیل بلادرنگ بردار رفتار و ردیابی گراف Neo4j در مهلت ۱۵ میلی‌ثانیه با شیفت مسئولیت 3DS 2.0.",
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS"
        },
        {
          num: "۰۴",
          title: "مغایرت‌گیری سه‌طرفه و تسویه زودهنگام",
          desc: "تطبیق بلادرنگ صورت‌حساب بانک، لاگ سوییچ و دفتر کل با چرخه خودالتیام زیر ۴۵ ثانیه.",
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY"
        }
      ]
    : [
        {
          num: "01",
          title: "Double-Entry Ledger & 2PC Mutex",
          desc: "Atomic balance reservation state machine with Redis SETNX mutex, CDC outbox, and zero financial drift.",
          href: "#payment-settlement",
          tag: "ACID LEDGER"
        },
        {
          num: "02",
          title: "Smart Multi-PSP Routing Switch",
          desc: "Dynamic ISO 8583 dispatch mesh across banking rails with sub-30ms failover and auto-0400 reversal.",
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH"
        },
        {
          num: "03",
          title: "Real-Time Fraud & Graph Tracing",
          desc: "Sub-15ms ML vector risk evaluation, Neo4j temporal cluster hop, and 3DS 2.0 Harim OTP liability shift.",
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS"
        },
        {
          num: "04",
          title: "Multi-Pass Reconciliation Engine",
          desc: "3-way automated matching (Bank MT940 ↔ Core Switch ↔ Double-Entry Ledger) with sub-45s auto-healing.",
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY"
        }
      ];

  const techStack = [
    { name: "ISO 8583 / AS 2805", role: isFa ? "پروتکل پیام‌رسانی مالی بین‌بانکی" : "Interbank Financial Messaging Wire" },
    { name: "SMPP 3.4 PDU", role: isFa ? "هاب پیامک ملی ۵۰ هزار تراکنش" : "National Telecom SMS Gateway (50K TPS)" },
    { name: "Redis Distributed Mutex", role: isFa ? "کنترل هم‌روندی با مهلت SETNX" : "Distributed Idempotency & Concurrency Lock" },
    { name: "ScyllaDB Fact Log", role: isFa ? "پایگاه داده رخدادنگار تغییرناپذیر" : "Append-Only Immutable Ledger Fact Store" },
    { name: "Neo4j Cluster", role: isFa ? "تحلیل گراف زمانی سندیکاهای تقلب" : "Temporal Graph Tracing & Ring Isolation" },
    { name: "RabbitMQ CDC Outbox", role: isFa ? "رله رخدادهای تسویه با تضمین تحویل" : "Transactional Outbox & Event Relay" },
  ];

  const directives = isFa
    ? [
        { label: "اصل اول: تراز ریاضی غیرقابل‌انعطاف", text: "هیچ موجودی بدون ثبت متناظر بدهکار و بستانکار در دفتر کل تغییر نمی‌کند. تراز همواره باید صفر باشد." },
        { label: "اصل دوم: تقدم ارزیابی ریسک بر تسویه", text: "چرخه ارزیابی ریسک و هویت شاهکار پیش از برقراری سوکت بانکی با بودجه ۱۵ میلی‌ثانیه نهایی می‌شود." },
        { label: "اصل سوم: تاب‌آوری در برابر قطع شبکه", text: "در صورت قطع ارتباط یا عدم دریافت تاییدیه، سناریوی لغو خودکار ۰۴۰۰ بلافاصله جهت حفاظت از مشتری فعال می‌شود." }
      ]
    : [
        { label: "Rule 1: Invariant Non-Negotiability", text: "No balance is ever mutated without exact balanced debits and credits. Mathematical drift must remain 0.00%." },
        { label: "Rule 2: Pre-Auth Risk Evaluation", text: "Fraud vectors and biometric step-ups execute inside a hard 15ms budget before any bank host socket opens." },
        { label: "Rule 3: Deterministic Failure Reversal", text: "Hanging downstream bank sockets trigger automatic ISO 8583 0400 reversals to prevent phantom debits." }
      ];

  const handleScrollToDossier = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="overview" className="scroll-mt-20 w-full min-h-[calc(100vh-5.5rem)] flex flex-col justify-between py-2 space-y-5" dir={isFa ? 'rtl' : 'ltr'}>
      
      {/* SECTION 1: COMPACT HERO PROFILE & CREDENTIALS */}
      <div className="bg-[#0f1217]/90 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Portrait: Impactful & Proportional */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center md:justify-start">
            <div className="relative w-48 sm:w-52 md:w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/20 bg-[#13161c] shadow-xl group">
              <img
                src={`${baseUrl}photos/ariya.jpg`}
                alt="Ariya Sarrafzadeh"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11]/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono bg-[#0b0d11]/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15">
                <span className="text-neutral-200 font-semibold">{isFa ? 'تهران · ایران' : 'TEHRAN, IR'}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NOMINAL
                </span>
              </div>
            </div>
          </div>

          {/* Narrative & Credentials */}
          <div className="md:col-span-8 lg:col-span-9 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-mono text-neutral-300 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              <span>{isFa ? 'معمار ارشد سیستم و مدیر ارشد محصول فنی' : 'PRINCIPAL SYSTEMS ARCHITECT & TECHNICAL PRODUCT LEADER'}</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
              {isFa 
                ? 'معماری سوییچ‌های مالی، دفاتر کل دوطرفه و روتینگ مخابراتی' 
                : 'High-Throughput Financial Switches, Double-Entry Ledgers & Telecom Routing'}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              {isFa
                ? 'بیش از ۱۵ سال تجربه عملیاتی در زیرساخت‌های بانکی شاپرک، سوییچ‌های پرداخت ISO 8583 با تاخیر زیر ۳۰ میلی‌ثانیه، ماشین حالت تخصیص دومرحله‌ای موجودی با تضمین انحراف مالی صفر، و هاب‌های مخابراتی SMPP با ظرفیت ۵۰ هزار تراکنش هم‌روند.'
                : '15+ years engineering high-availability banking switches, sub-30ms ISO 8583 multi-PSP routing, two-phase balance reservation machines with zero financial drift, and national SMPP 3.4 telecom gateways handling 50,000 TPS burst capacity.'}
            </p>

            {/* Tactical Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1" dir="ltr">
              {["ISO 8583", "IDEMPOTENCY", "ACID LEDGERS", "SMPP 3.4", "SCYLLADB", "RABBITMQ"].map((chip) => (
                <span key={chip} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-200">
                  [{chip}]
                </span>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3 items-center text-xs font-mono">
              <a
                href="#payment-settlement"
                onClick={(e) => handleScrollToDossier(e, '#payment-settlement')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md text-xs flex items-center gap-1.5"
              >
                <span>{isFa ? 'ورود به پرونده‌های معماری' : 'Inspect Dossiers'}</span>
                <span>↓</span>
              </a>
              <a
                href="mailto:ariasg2002@gmail.com?subject=Architecture%20Inquiry"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                ariasg2002@gmail.com
              </a>
              <span className="text-white/20">/</span>
              <a
                href="https://www.linkedin.com/in/ariya-sarrafzadeh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-white transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 2: SUMMARIZED INTERACTIVE TABS */}
      <div className="bg-[#0f1217]/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'metrics'
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isFa ? 'شاخص‌های عملیاتی' : 'Impact Metrics'}</span>
            </button>

            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'pillars'
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{isFa ? 'ارکان ۴ گانه معماری' : 'Core Architecture'}</span>
            </button>

            <button
              onClick={() => setActiveTab('stack')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'stack'
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#e2c974]" />
              <span>{isFa ? 'پشته فناوری' : 'Protocol Stack'}</span>
            </button>

            <button
              onClick={() => setActiveTab('directives')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'directives'
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>{isFa ? 'اصول حاکمیت فنی' : 'Directives'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase">
            <span>EXECUTIVE SUMMARY</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="min-h-[160px] flex flex-col justify-center">
          
          {/* TAB 1: METRICS */}
          {activeTab === 'metrics' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full animate-fadeIn">
              {proofMatrix.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollToDossier(e, item.href)}
                  className="bg-[#13161c] border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-white/25 transition-all group block shadow-md"
                >
                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                      <span>{item.tag}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
                      {item.val}
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono tracking-wide mt-2 leading-snug">
                    {item.label}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* TAB 2: PILLARS */}
          {activeTab === 'pillars' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-fadeIn">
              {pillars.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollToDossier(e, item.href)}
                  className="bg-[#13161c] border border-white/10 rounded-xl p-3 flex flex-col justify-between hover:border-cyan-400/40 transition-all group block shadow-md"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-400 font-semibold">{item.num} · {item.tag}</span>
                      <span className="text-neutral-500 group-hover:text-white transition-colors">↗</span>
                    </div>
                    <h3 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                    <span>{isFa ? 'بررسی نمودار' : 'View Blueprint'}</span>
                    <span>→</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* TAB 3: STACK */}
          {activeTab === 'stack' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full animate-fadeIn">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-[#13161c] border border-white/10 rounded-xl p-3 flex items-start gap-3 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-[#e2c974] mt-1 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold font-mono text-white tracking-tight">{tech.name}</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">{tech.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: DIRECTIVES */}
          {activeTab === 'directives' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full animate-fadeIn">
              {directives.map((dir, idx) => (
                <div key={idx} className="bg-[#13161c] border border-white/10 rounded-xl p-3.5 space-y-2 shadow-md">
                  <div className="text-xs font-bold font-mono text-rose-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>{dir.label}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {dir.text}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Rolling Page Stepper Prompt */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="text-neutral-400 text-[11px] flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">{isFa ? 'صفحه ۱ از ۸' : 'PAGE 01 OF 08'}</span>
            <span>·</span>
            <span>{isFa ? 'پیش‌نمایش اجرایی کامل' : 'EXECUTIVE LANDING POSTURE'}</span>
          </div>

          <a
            href="#payment-settlement"
            onClick={(e) => handleScrollToDossier(e, '#payment-settlement')}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-neutral-200 hover:text-white hover:bg-white/10 transition-all group"
          >
            <span>{isFa ? 'صفحه بعد: دفتر کل دوطرفه' : 'Next Page: Settlements & Ledgers'}</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
        </div>

      </div>

    </div>
  );
}
