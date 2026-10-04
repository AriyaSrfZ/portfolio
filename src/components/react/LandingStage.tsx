import React, { useState } from 'react';

interface LandingStageProps {
  locale?: 'en' | 'fa';
}

export default function LandingStage({ locale = 'en' }: LandingStageProps) {
  const isFa = locale === 'fa';
  const [activeTab, setActiveTab] = useState<'pillars' | 'stack' | 'directives' | 'benchmarks'>('pillars');

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

  const proofMatrix = isFa
    ? [
        { val: "۱۵+ سال", label: "معماری سامانه‌های توزیع‌شده", tag: "زیرساخت حیاتی", href: "#payment-settlement" },
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
          tag: "ACID LEDGER",
          metrics: "50K TPS · 0.00% DRIFT"
        },
        {
          num: "۰۲",
          title: "سوییچ هوشمند پرداخت چندگانه",
          desc: "روتینگ دینامیک ISO 8583 بین PSPها با تاخیر زیر ۳۰ میلی‌ثانیه و بازگشت خودکار 0400.",
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH",
          metrics: "SUB-30MS · AUTO-0400"
        },
        {
          num: "۰۳",
          title: "احراز هویت و سامانه ضدتقلب",
          desc: "تحلیل بلادرنگ بردار رفتار و ردیابی گراف Neo4j در مهلت ۱۵ میلی‌ثانیه با شیفت مسئولیت 3DS 2.0.",
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS",
          metrics: "<15MS SLA · HARIM OTP"
        },
        {
          num: "۰۴",
          title: "مغایرت‌گیری سه‌طرفه و تسویه زودهنگام",
          desc: "تطبیق بلادرنگ صورت‌حساب بانک، لاگ سوییچ و دفتر کل با چرخه خودالتیام زیر ۴۵ ثانیه.",
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY",
          metrics: "SUB-45S · MT940 PARITY"
        }
      ]
    : [
        {
          num: "01",
          title: "Double-Entry Ledger & 2PC Mutex",
          desc: "Atomic balance reservation state machine with Redis SETNX mutex, CDC outbox, and zero financial drift.",
          href: "#payment-settlement",
          tag: "ACID LEDGER",
          metrics: "50K TPS · 0.00% DRIFT"
        },
        {
          num: "02",
          title: "Smart Multi-PSP Routing Switch",
          desc: "Dynamic ISO 8583 dispatch mesh across banking rails with sub-30ms failover and auto-0400 reversal.",
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH",
          metrics: "SUB-30MS · AUTO-0400"
        },
        {
          num: "03",
          title: "Real-Time Fraud & Graph Tracing",
          desc: "Sub-15ms ML vector risk evaluation, Neo4j temporal cluster hop, and 3DS 2.0 Harim OTP liability shift.",
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS",
          metrics: "<15MS SLA · HARIM OTP"
        },
        {
          num: "04",
          title: "Multi-Pass Reconciliation Engine",
          desc: "3-way automated matching (Bank MT940 ↔ Core Switch ↔ Double-Entry Ledger) with sub-45s auto-healing.",
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY",
          metrics: "SUB-45S · MT940 PARITY"
        }
      ];

  const techStack = isFa
    ? [
        { name: "ISO 8583 / AS 2805", role: "پروتکل پیام‌رسانی مالی بین‌بانکی", badge: "WIRE FORMAT" },
        { name: "SMPP 3.4 PDU", role: "هاب پیامک ملی ۵۰ هزار تراکنش هم‌روند", badge: "FLOW CONTROL" },
        { name: "Redis Distributed Mutex", role: "کنترل هم‌روندی با مهلت SETNX و توکن تصادفی", badge: "CONCURRENCY" },
        { name: "ScyllaDB Fact Log", role: "پایگاه داده رخدادنگار تغییرناپذیر بدون توقف GC", badge: "STORAGE" },
        { name: "Neo4j Cluster", role: "تحلیل گراف زمانی سندیکاهای تقلب در زیر ۱۲ میلی‌ثانیه", badge: "GRAPH DB" },
        { name: "RabbitMQ CDC Outbox", role: "رله رخدادهای تسویه با تضمین تحویل حداقل یک‌بار", badge: "EVENT RELAY" },
      ]
    : [
        { name: "ISO 8583 / AS 2805", role: "Interbank Financial Messaging Wire Format & Bitmap Unpacker", badge: "WIRE FORMAT" },
        { name: "SMPP 3.4 PDU", role: "National Telecom SMS Hub with Asynchronous Sliding Window", badge: "FLOW CONTROL" },
        { name: "Redis Distributed Mutex", role: "Concurrency Control via SETNX TTL & Deterministic Release Keys", badge: "CONCURRENCY" },
        { name: "ScyllaDB Fact Log", role: "Append-Only Immutable Ledger Fact Store with Zero GC Pauses", badge: "STORAGE" },
        { name: "Neo4j Cluster", role: "Temporal Graph Traversal Tracing Money-Laundering Rings in <12ms", badge: "GRAPH DB" },
        { name: "RabbitMQ CDC Outbox", role: "Transactional Outbox & Event Relay with At-Least-Once Delivery", badge: "EVENT RELAY" },
      ];

  const directives = isFa
    ? [
        { label: "اصل اول: تراز ریاضی غیرقابل‌انعطاف", text: "هیچ موجودی بدون ثبت متناظر بدهکار و بستانکار در دفتر کل تغییر نمی‌کند. انحراف ریاضی تحت هر شرایطی باید صفر باشد.", tag: "تراز قطعی" },
        { label: "اصل دوم: تقدم ارزیابی ریسک بر تسویه", text: "چرخه ارزیابی ریسک و استعلام شاهکار پیش از برقراری سوکت بانکی با بودجه ۱۵ میلی‌ثانیه نهایی می‌شود.", tag: "گارد پیشاتراکنش" },
        { label: "اصل سوم: تاب‌آوری در برابر قطع شبکه", text: "در صورت قطع ارتباط یا عدم دریافت تاییدیه، سناریوی لغو خودکار ۰۴۰۰ بلافاصله جهت حفاظت از کاربر فعال می‌شود.", tag: "لغو خودکار ۰۴۰۰" },
        { label: "اصل چهارم: کلید یکتایی و پارتیشن‌بندی", text: "هر درخواست دارای کلید یکتایی سراسری بوده و از اعمال تراکنش تکراری در شرایط ارسال مجدد شبکه جلوگیری می‌کند.", tag: "IDEMPOTENCY" }
      ]
    : [
        { label: "Rule 1: Invariant Non-Negotiability", text: "No balance is mutated without exact balanced debits and credits. Mathematical drift must remain strictly 0.00%.", tag: "ABSOLUTE PARITY" },
        { label: "Rule 2: Pre-Auth Risk Evaluation", text: "Fraud vectors and biometric step-ups execute inside a hard 15ms budget before any bank host socket opens.", tag: "PRE-SOCKET RISK" },
        { label: "Rule 3: Deterministic Failure Reversal", text: "Hanging downstream bank sockets trigger automatic ISO 8583 0400 reversals to prevent phantom debits.", tag: "AUTO-0400 ROLLBACK" },
        { label: "Rule 4: Strict Idempotency Partitioning", text: "Global deterministic idempotency keys partition incoming requests preventing duplicate debits during network retransmissions.", tag: "IDEMPOTENCY" }
      ];

  const benchmarks = isFa
    ? [
        { title: "سوپراپ فین‌تک ملی", metric: "۱۲M+ کاربر فعال", detail: "پردازش بدون وقفه با تاخیر میانگین زیر ۲۵ میلی‌ثانیه در مقیاس ملی" },
        { title: "تسویه بین‌بانکی شاپرک", metric: "۵۰K+ بچ روزانه", detail: "تراز کامل و تسویه بدون مغایرت در بیش از ۲۰ بانک عامل" },
        { title: "تاب‌آوری انفجار ترافیک", metric: "۱B+ پیامک / سال", detail: "تحمل پیک‌های جمعه سیاه با صفر درصد پس‌زدگی صف" }
      ]
    : [
        { title: "National Fintech SuperApp", metric: "12M+ Monthly Actives", detail: "Continuous sub-25ms transaction execution across national banking rails" },
        { title: "Shaparak Interbank Parity", metric: "50K+ Daily Batches", detail: "Zero financial loss and complete multi-rail reconciliation across 20+ commercial banks" },
        { title: "Telecom Peak Resilience", metric: "1B+ SMS / Year", detail: "National carrier high-traffic resilience with zero queue loss during peak shopping events" }
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
    <div id="overview" className="scroll-mt-20 w-full min-h-[calc(100vh-5.5rem)] flex flex-col justify-start gap-4 xl:gap-5 pb-4 font-sans" dir={isFa ? 'rtl' : 'ltr'}>
      
      {/* =========================================================================
          ZONE A: EXECUTIVE COMMAND HERO CONSOLE (Bigger Portrait + Full-Width Narrative)
          ========================================================================= */}
      <div className="bg-[#0f1217]/95 border border-white/10 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          
          {/* Portrait Column: Sized larger, authoritative, commanding */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-start gap-2.5">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 bg-[#13161c] shadow-2xl group">
              <img
                src={`${baseUrl}photos/ariya.jpg`}
                alt="Ariya Sarrafzadeh"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d11]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono bg-[#0b0d11]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15">
                <span className="text-neutral-200 font-semibold">{isFa ? 'تهران · شاپرک' : 'TEHRAN, IR'}</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NOMINAL · &lt;15MS
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 text-center lg:text-start flex items-center gap-2 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate">{isFa ? 'آماده مشاوره و ممیزی سیستم‌های مقیاس‌پذیر' : 'Available for Advisory & Platform Audits'}</span>
            </div>
          </div>

          {/* Narrative Column: Fills the entire right side purposefully */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] sm:text-[11px] font-mono text-neutral-300 tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]" />
              <span>{isFa ? 'معمار ارشد سیستم و مدیر ارشد محصول فنی' : 'PRINCIPAL SYSTEMS ARCHITECT & TECHNICAL PRODUCT LEADER'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              {isFa 
                ? 'معماری سوییچ‌های مالی، دفاتر کل دوطرفه و روتینگ مخابراتی' 
                : 'High-Throughput Financial Switches, Double-Entry Ledgers & Telecom Routing'}
            </h1>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-4xl">
              {isFa
                ? 'بیش از ۱۵ سال تجربه عملیاتی در زیرساخت‌های بانکی شاپرک، سوییچ‌های پرداخت ISO 8583 با تاخیر زیر ۳۰ میلی‌ثانیه، ماشین حالت تخصیص دومرحله‌ای موجودی با تضمین انحراف مالی صفر، و هاب‌های مخابراتی SMPP با ظرفیت ۵۰ هزار تراکنش هم‌روند.'
                : '15+ years engineering high-availability banking switches, sub-30ms ISO 8583 multi-PSP routing, two-phase balance reservation machines with zero financial drift, and national SMPP 3.4 telecom gateways handling 50,000 TPS burst capacity.'}
            </p>

            {/* Tactical Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5" dir="ltr">
              {["ISO 8583", "2PC MUTEX", "ACID LEDGERS", "SMPP 3.4", "SCYLLADB", "RABBITMQ CDC", "NEO4J", "REDIS SETNX"].map((chip) => (
                <span key={chip} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-neutral-200">
                  [{chip}]
                </span>
              ))}
            </div>

            {/* Strategic Focus Grid: Fills horizontal width with core system capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-mono text-[11px]">
              <div className="bg-[#13161c] border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-neutral-300 truncate">
                  {isFa ? 'سوییچ پرداخت بانکی: تاخیر زیر ۳۰ms و بازگشت خودکار ۰۴۰۰' : 'Interbank Switch: Sub-30ms failover & auto-0400'}
                </span>
              </div>
              <div className="bg-[#13161c] border border-white/5 rounded-lg p-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span className="text-neutral-300 truncate">
                  {isFa ? 'دفتر کل توزیع‌شده: قفل SETNX با انحراف مالی ۰٫۰۰٪' : 'Ledger Mutex: Zero drift via SETNX & CDC outbox'}
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-wrap gap-3 items-center text-xs font-mono">
              <a
                href="#payment-settlement"
                onClick={(e) => handleScrollToDossier(e, '#payment-settlement')}
                className="px-4 py-2 rounded-lg bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md text-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>{isFa ? 'بررسی پرونده‌های مهندسی' : 'Inspect Blueprints'}</span>
                <span>↓</span>
              </a>
              <a
                href="#book"
                onClick={(e) => handleScrollToDossier(e, '#book')}
                className="px-3.5 py-2 rounded-lg bg-white/[0.06] border border-white/15 text-white font-medium hover:bg-white/10 transition-all text-xs flex items-center gap-1.5"
              >
                <span>{isFa ? 'رزرو جلسه بررسی معماری' : 'Schedule Review'}</span>
                <span>→</span>
              </a>
              <div className="flex items-center gap-3 text-neutral-300">
                <a
                  href="mailto:ariasg2002@gmail.com?subject=Architecture%20Inquiry"
                  className="hover:text-white transition-colors"
                >
                  ariasg2002@gmail.com
                </a>
                <span className="text-white/20">/</span>
                <a
                  href="https://www.linkedin.com/in/ariya-sarrafzadeh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          ZONE B: LIVE IMPACT & SLA VITALS RIBBON
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {proofMatrix.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleScrollToDossier(e, item.href)}
            className="bg-[#0f1217]/95 border border-white/10 rounded-xl p-3.5 flex flex-col justify-between hover:border-emerald-400/50 hover:bg-[#13161c] transition-all group block shadow-xl"
          >
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 mb-1 flex items-center justify-between">
                <span>{item.tag}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 group-hover:animate-ping" />
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

      {/* =========================================================================
          ZONE C: INTERACTIVE ARCHITECTURAL OPERATIONS WORKBENCH
          ========================================================================= */}
      <div className="bg-[#0f1217]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
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
              <span>{isFa ? 'پشته پروتکل و داده' : 'Protocol Stack'}</span>
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

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'benchmarks'
                  ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isFa ? 'تاییدیه‌های پروداکشن' : 'Scale Proofs'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-neutral-400 uppercase">
            <span>INVARIANTS ACTIVE</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600" />
            <span className="text-emerald-400">REPLAY-SAFE</span>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="min-h-[180px] flex flex-col justify-center">
          
          {/* TAB 1: PILLARS */}
          {activeTab === 'pillars' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-fadeIn">
              {pillars.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleScrollToDossier(e, item.href)}
                  className="bg-[#13161c] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-400/50 hover:bg-[#161a22] transition-all group block shadow-md"
                >
                  <div className="space-y-2">
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
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500">{item.metrics}</span>
                    <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                      {isFa ? 'مشاهده پرونده ←' : 'View Blueprint →'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* TAB 2: STACK */}
          {activeTab === 'stack' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full animate-fadeIn">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-[#13161c] border border-white/10 rounded-xl p-3.5 flex items-start gap-3 shadow-md hover:border-white/20 transition-all">
                  <span className="w-2 h-2 rounded-full bg-[#e2c974] mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold font-mono text-white tracking-tight truncate">{tech.name}</div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-[#e2c974] border border-[#e2c974]/20 shrink-0">
                        {tech.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 leading-snug">{tech.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DIRECTIVES */}
          {activeTab === 'directives' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full animate-fadeIn">
              {directives.map((dir, idx) => (
                <div key={idx} className="bg-[#13161c] border border-white/10 rounded-xl p-3.5 space-y-2 shadow-md hover:border-rose-400/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold font-mono text-rose-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{dir.label}</span>
                    </div>
                  </div>
                  <span className="inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {dir.tag}
                  </span>
                  <p className="text-[11px] text-neutral-300 leading-relaxed pt-1">
                    {dir.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BENCHMARKS */}
          {activeTab === 'benchmarks' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full animate-fadeIn">
              {benchmarks.map((bench, idx) => (
                <div key={idx} className="bg-[#13161c] border border-white/10 rounded-xl p-4 space-y-2 shadow-md hover:border-emerald-400/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{bench.title}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    {bench.metric}
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    {bench.detail}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Stepper Prompt */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="text-neutral-400 text-[11px] flex items-center gap-2">
            <span className="text-emerald-400 font-semibold">{isFa ? 'صفحه ۱ از ۸' : 'PAGE 01 OF 08'}</span>
            <span>·</span>
            <span>{isFa ? 'نمای کلی معماری سیستم‌ها' : 'SYSTEM ARCHITECTURE OVERVIEW'}</span>
          </div>

          <a
            href="#payment-settlement"
            onClick={(e) => handleScrollToDossier(e, '#payment-settlement')}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-neutral-200 hover:text-white hover:bg-white/10 transition-all group"
          >
            <span>{isFa ? 'صفحه بعد: دفتر کل دوطرفه' : 'Next Page: Settlements & Ledgers'}</span>
            <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
          </a>
        </div>

      </div>

    </div>
  );
}
