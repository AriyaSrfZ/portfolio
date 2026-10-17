import React, { useState } from 'react';
import { stats } from '../../data/stats';

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
        { val: stats.experienceYears.fa, label: "معماری سامانه‌های توزیع‌شده", tag: "زیرساخت حیاتی", href: "#payment-settlement" },
        { val: stats.telecomHubAnnualVolume.fa, label: "هاب ملی مخابرات و SMPP 3.4", tag: "کنترل جریان", href: "#payment-switch" },
        { val: stats.ledgerPeakTps.shortFa, label: "ظرفیت اوج پردازش هم‌روند", tag: "سوییچ شتاب", href: "#payment-switch" },
        { val: stats.fraudRiskLoopSla.shortFa, label: "مهلت حلقه ارزیابی ریسک", tag: "گارد تقلب", href: "#fraud-forensics" },
        { val: stats.financialDriftPercent.shortFa, label: "انحراف مالی در تسویه روزانه", tag: "تراز ریاضی", href: "#reconciliation-engine" },
      ]
    : [
        { val: stats.experienceYears.en, label: "Production Infrastructure", tag: "CRITICAL CORE", href: "#payment-settlement" },
        { val: stats.telecomHubAnnualVolume.en, label: "SMPP 3.4 Hub Messages / Year", tag: "FLOW CONTROL", href: "#payment-switch" },
        { val: stats.ledgerPeakTps.shortEn, label: "Peak Concurrent Throughput", tag: "H2H SWITCH", href: "#payment-switch" },
        { val: stats.fraudRiskLoopSla.shortEn, label: "Real-Time Fraud Risk Loop", tag: "GRAPH FORENSICS", href: "#fraud-forensics" },
        { val: stats.financialDriftPercent.shortEn, label: stats.clearingBatchesDaily.heroEn, tag: "ACID BALANCED", href: "#reconciliation-engine" },
      ];

  const pillars = isFa
    ? [
        {
          num: "۰۱",
          title: "دفتر کل دوطرفه و رزرو دومرحله‌ای",
          desc: "ماشین حالت اتمیک با قفل توزیع‌شده Redis SETNX و ثبت تغییرات Outbox CDC بدون اوررایت موجودی.",
          href: "#payment-settlement",
          tag: "ACID LEDGER",
          metrics: `${stats.ledgerPeakTps.shortEn} · ${stats.financialDriftPercent.shortEn}`
        },
        {
          num: "۰۲",
          title: "سوییچ هوشمند پرداخت چندگانه",
          desc: `روتینگ دینامیک ISO 8583 بین PSPها با ${stats.switchFailoverSla.textFa} و بازگشت خودکار 0400.`,
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH",
          metrics: `${stats.switchFailoverSla.shortEn} · AUTO-0400`
        },
        {
          num: "۰۳",
          title: "احراز هویت و سامانه ضدتقلب",
          desc: `تحلیل بلادرنگ بردار رفتار و ردیابی گراف Neo4j در مهلت ${stats.fraudRiskLoopSla.raw} میلی‌ثانیه با شیفت مسئولیت 3DS 2.0.`,
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS",
          metrics: `${stats.fraudRiskLoopSla.shortEn} · HARIM OTP`
        },
        {
          num: "۰۴",
          title: "مغایرت‌گیری سه‌طرفه و تسویه زودهنگام",
          desc: `تطبیق بلادرنگ صورت‌حساب بانک، لاگ سوییچ و دفتر کل با ${stats.reconAutoHealingSla.textFa}.`,
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY",
          metrics: `${stats.reconAutoHealingSla.shortEn} · MT940 PARITY`
        }
      ]
    : [
        {
          num: "01",
          title: "Double-Entry Ledger & 2PC Mutex",
          desc: "Atomic balance reservation state machine with Redis SETNX mutex, CDC outbox, and zero financial drift.",
          href: "#payment-settlement",
          tag: "ACID LEDGER",
          metrics: `${stats.ledgerPeakTps.shortEn} · ${stats.financialDriftPercent.shortEn}`
        },
        {
          num: "02",
          title: "Smart Multi-PSP Routing Switch",
          desc: `Dynamic ISO 8583 dispatch mesh across banking rails with ${stats.switchFailoverSla.textEn} failover and auto-0400 reversal.`,
          href: "#payment-switch",
          tag: "ISO 8583 SWITCH",
          metrics: `${stats.switchFailoverSla.shortEn} · AUTO-0400`
        },
        {
          num: "03",
          title: "Real-Time Fraud & Graph Tracing",
          desc: `Sub-${stats.fraudRiskLoopSla.raw}ms ML vector risk evaluation, Neo4j temporal cluster hop, and 3DS 2.0 Harim OTP liability shift.`,
          href: "#fraud-forensics",
          tag: "GRAPH FORENSICS",
          metrics: `${stats.fraudRiskLoopSla.shortEn} · HARIM OTP`
        },
        {
          num: "04",
          title: "Multi-Pass Reconciliation Engine",
          desc: `3-way automated matching (Bank MT940 ↔ Core Switch ↔ Double-Entry Ledger) with ${stats.reconAutoHealingSla.textEn}.`,
          href: "#reconciliation-engine",
          tag: "3-WAY PARITY",
          metrics: `${stats.reconAutoHealingSla.shortEn} · MT940 PARITY`
        }
      ];

  const techStack = isFa
    ? [
        { name: "ISO 8583 / AS 2805", role: "پروتکل پیام‌رسانی مالی بین‌بانکی", badge: "WIRE FORMAT" },
        { name: "SMPP 3.4 PDU", role: `هاب پیامک ملی ${stats.ledgerPeakTps.textFa}`, badge: "FLOW CONTROL" },
        { name: "Redis Distributed Mutex", role: "کنترل هم‌روندی با مهلت SETNX و توکن تصادفی", badge: "CONCURRENCY" },
        { name: "ScyllaDB Fact Log", role: "پایگاه داده رخدادنگار تغییرناپذیر بدون توقف GC", badge: "STORAGE" },
        { name: "Neo4j Cluster", role: `تحلیل گراف زمانی سندیکاهای تقلب در ${stats.graphTraversalHop.fa}`, badge: "GRAPH DB" },
        { name: "RabbitMQ CDC Outbox", role: "رله رخدادهای تسویه با تضمین تحویل حداقل یک‌بار", badge: "EVENT RELAY" },
      ]
    : [
        { name: "ISO 8583 / AS 2805", role: "Interbank Financial Messaging Wire Format & Bitmap Unpacker", badge: "WIRE FORMAT" },
        { name: "SMPP 3.4 PDU", role: "National Telecom SMS Hub with Asynchronous Sliding Window", badge: "FLOW CONTROL" },
        { name: "Redis Distributed Mutex", role: "Concurrency Control via SETNX TTL & Deterministic Release Keys", badge: "CONCURRENCY" },
        { name: "ScyllaDB Fact Log", role: "Append-Only Immutable Ledger Fact Store with Zero GC Pauses", badge: "STORAGE" },
        { name: "Neo4j Cluster", role: `Temporal Graph Traversal Tracing Money-Laundering Rings in ${stats.graphTraversalHop.en}`, badge: "GRAPH DB" },
        { name: "RabbitMQ CDC Outbox", role: "Transactional Outbox & Event Relay with At-Least-Once Delivery", badge: "EVENT RELAY" },
      ];

  const directives = isFa
    ? [
        { label: "اصل اول: تراز ریاضی غیرقابل‌انعطاف", text: "هیچ موجودی بدون ثبت متناظر بدهکار و بستانکار در دفتر کل تغییر نمی‌کند. انحراف ریاضی تحت هر شرایطی باید صفر باشد.", tag: "تراز قطعی" },
        { label: "اصل دوم: تقدم ارزیابی ریسک بر تسویه", text: `چرخه ارزیابی ریسک و استعلام شاهکار پیش از برقراری سوکت بانکی با بودجه ${stats.fraudRiskLoopSla.raw} میلی‌ثانیه نهایی می‌شود.`, tag: "گارد پیشاتراکنش" },
        { label: "اصل سوم: تاب‌آوری در برابر قطع شبکه", text: "در صورت قطع ارتباط یا عدم دریافت تاییدیه، سناریوی لغو خودکار ۰۴۰۰ بلافاصله جهت حفاظت از کاربر فعال می‌شود.", tag: "لغو خودکار ۰۴۰۰" },
        { label: "اصل چهارم: کلید یکتایی و پارتیشن‌بندی", text: "هر درخواست دارای کلید یکتایی سراسری بوده و از اعمال تراکنش تکراری در شرایط ارسال مجدد شبکه جلوگیری می‌کند.", tag: "IDEMPOTENCY" }
      ]
    : [
        { label: "Rule 1: Invariant Non-Negotiability", text: `No balance is mutated without exact balanced debits and credits. Mathematical drift must remain strictly ${stats.financialDriftPercent.raw}%.`, tag: "ABSOLUTE PARITY" },
        { label: "Rule 2: Pre-Auth Risk Evaluation", text: `Fraud vectors and biometric step-ups execute inside a hard ${stats.fraudRiskLoopSla.raw}ms budget before any bank host socket opens.`, tag: "PRE-SOCKET RISK" },
        { label: "Rule 3: Deterministic Failure Reversal", text: "Hanging downstream bank sockets trigger automatic ISO 8583 0400 reversals to prevent phantom debits.", tag: "AUTO-0400 ROLLBACK" },
        { label: "Rule 4: Strict Idempotency Partitioning", text: "Global deterministic idempotency keys partition incoming requests preventing duplicate debits during network retransmissions.", tag: "IDEMPOTENCY" }
      ];

  const benchmarks = isFa
    ? [
        { title: "سوپراپ فین‌تک ملی", metric: stats.superAppMonthlyActives.fa, detail: `پردازش بدون وقفه با تاخیر میانگین ${stats.superAppLatency.fa} در مقیاس ملی` },
        { title: "تسویه بین‌بانکی شاپرک", metric: stats.clearingBatchesDaily.fa, detail: `تراز کامل و تسویه بدون مغایرت در ${stats.commercialPartnerBanks.fa}` },
        { title: "تاب‌آوری انفجار ترافیک", metric: stats.telecomHubAnnualVolume.textFa, detail: "تحمل پیک‌های جمعه سیاه با صفر درصد پس‌زدگی صف" }
      ]
    : [
        { title: "National Fintech SuperApp", metric: stats.superAppMonthlyActives.en, detail: `Continuous ${stats.superAppLatency.en} transaction execution across national banking rails` },
        { title: "Shaparak Interbank Parity", metric: stats.clearingBatchesDaily.en, detail: `Zero financial loss and complete multi-rail reconciliation across ${stats.commercialPartnerBanks.en}` },
        { title: "Telecom Peak Resilience", metric: stats.telecomHubAnnualVolume.textEn, detail: "National carrier high-traffic resilience with zero queue loss during peak shopping events" }
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
          ZONE A: EXECUTIVE POSITIONING CONSOLE
          ========================================================================= */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          
          {/* Portrait Column: Architectural, disciplined, grounded */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-start gap-2.5">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] lg:max-w-[380px] xl:max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg group">
              <img
                src={`${baseUrl}photos/ariya.jpg`}
                alt="Ariya Sarrafzadeh"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171C1A]/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono bg-[#202725]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[var(--border)]">
                <span className="text-[#F0EEE7] font-semibold">{isFa ? 'تهران · شاپرک' : 'TEHRAN, IR'}</span>
                <span className="text-[var(--accent-primary)] flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  NOMINAL · {stats.fraudRiskLoopSla.shortEn.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[var(--text-secondary)] text-center lg:text-start flex items-center gap-2 pt-0.5">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] shrink-0" />
              <span className="truncate">{isFa ? 'آماده مشاوره و ممیزی سیستم‌های مقیاس‌پذیر' : 'Available for Architecture Advisory & Audits'}</span>
            </div>
          </div>

          {/* Narrative Column: Clear positioning, core promise, systems thinker archetype */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--surface-elevated)] border border-[var(--border)] text-[10px] sm:text-[11px] font-sans font-medium text-[var(--text-secondary)] tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B39A77]" />
              <span className="text-[var(--text-primary)] font-semibold">{isFa ? 'آریا صراف‌زاده' : 'Ariya Sarrafzadeh'}</span>
              <span className="text-[var(--border)]">·</span>
              <span>{isFa ? 'معمار ارشد سیستم و مدیر ارشد محصول فنی' : 'Systems Architect & Technical Product Leader'}</span>
            </div>

            {/* Canonical Tagline & Primary Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)] leading-tight font-sans">
              {isFa 
                ? 'سامانه‌هایی که زیر فشار تاب می‌آورند.' 
                : 'Systems that hold under pressure.'}
            </h1>

            {/* Canonical Core Positioning Statement */}
            <p className="text-sm sm:text-base text-[var(--accent-primary)] font-medium leading-relaxed max-w-3xl font-sans">
              {isFa
                ? 'من در تقاطع معماری سیستم‌ها، مهندسی زیرساخت و تفکر محصول فعالیت می‌کنم؛ طراحی فناوری اتکاپذیر برای محیط‌های پیچیده و حیاتی.'
                : 'I work at the intersection of systems architecture, engineering, and product thinking—designing dependable technology for complex, high-stakes environments.'}
            </p>

            {/* Substantive Technical Scope */}
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-w-3xl font-sans">
              {isFa
                ? `${stats.experienceYears.textFa} تجربه عملیاتی در زیرساخت‌های بانکی شاپرک، سوییچ‌های پرداخت ISO 8583 با تاخیر ${stats.switchFailoverSla.textFa}، ماشین حالت تخصیص دومرحله‌ای موجودی با تضمین انحراف مالی صفر، و هاب‌های مخابراتی SMPP با ظرفیت ${stats.ledgerPeakTps.textFa}.`
                : `${stats.experienceYears.textEn} engineering high-availability banking switches, ${stats.switchFailoverSla.textEn} ISO 8583 multi-PSP routing, two-phase balance reservation machines with zero financial drift, and national SMPP 3.4 telecom gateways handling ${stats.ledgerPeakTps.en} burst capacity.`}
            </p>

            {/* Domain Capability Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5" dir="ltr">
              {["ISO 8583", "2PC MUTEX", "ACID LEDGERS", "SMPP 3.4", "SCYLLADB", "RABBITMQ CDC", "NEO4J", "REDIS SETNX"].map((chip) => (
                <span key={chip} className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)]">
                  [{chip}]
                </span>
              ))}
            </div>

            {/* Strategic Focus Grid: Core System Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 font-sans text-[11px]">
              <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg p-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />
                <span className="text-[var(--text-secondary)] truncate font-medium">
                  {isFa ? `سوییچ پرداخت بانکی: تاخیر ${stats.switchFailoverSla.shortFa} و بازگشت خودکار ۰۴۰۰` : `Interbank Switch: ${stats.switchFailoverSla.shortEn} failover & auto-0400`}
                </span>
              </div>
              <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-lg p-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />
                <span className="text-[var(--text-secondary)] truncate font-medium">
                  {isFa ? `دفتر کل توزیع‌شده: قفل SETNX با انحراف مالی ${stats.financialDriftPercent.shortFa}` : 'Ledger Mutex: Zero drift via SETNX & CDC outbox'}
                </span>
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-2 flex flex-wrap gap-3 items-center text-xs font-sans">
              <a
                href="#payment-settlement"
                onClick={(e) => handleScrollToDossier(e, '#payment-settlement')}
                className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-white font-semibold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm text-xs flex items-center gap-1.5 active:scale-95"
              >
                <span>{isFa ? 'بررسی پرونده‌های مهندسی' : 'Inspect Architecture'}</span>
                <span>↓</span>
              </a>
              <a
                href="#book"
                onClick={(e) => handleScrollToDossier(e, '#book')}
                className="px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-primary)] font-medium hover:bg-[var(--surface)] transition-all text-xs flex items-center gap-1.5"
              >
                <span>{isFa ? 'رزرو جلسه بررسی معماری' : 'Schedule Review'}</span>
                <span>→</span>
              </a>
              <div className="flex items-center gap-3 text-[var(--text-secondary)] font-sans text-xs">
                <a
                  href="mailto:ariasg2002@gmail.com?subject=Architecture%20Inquiry"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  ariasg2002@gmail.com
                </a>
                <span className="text-[var(--border)]">/</span>
                <a
                  href="https://www.linkedin.com/in/ariya-sarrafzadeh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          ZONE B: VERIFIED SLA & SCALE VITALS RIBBON
          ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
        {proofMatrix.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleScrollToDossier(e, item.href)}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-all group block shadow-sm active:scale-[0.98]"
          >
            <div>
              <div className="text-[9px] font-sans uppercase tracking-wider text-[var(--text-secondary)] mb-1 flex items-center justify-between font-semibold">
                <span>{item.tag}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] group-hover:scale-125 transition-transform" />
              </div>
              <div className="text-xl sm:text-2xl font-sans font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent-primary)] transition-colors">
                {item.val}
              </div>
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-sans font-medium tracking-normal mt-2 leading-snug">
              {item.label}
            </div>
          </a>
        ))}
      </div>

      {/* =========================================================================
          ZONE C: INTERACTIVE ARCHITECTURAL OPERATIONS WORKBENCH
          ========================================================================= */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4 shadow-sm">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-sans text-xs bg-[var(--surface-elevated)] p-1 rounded-full border border-[var(--border)]">
            <button
              onClick={() => setActiveTab('pillars')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium active:scale-95 ${
                activeTab === 'pillars'
                  ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{isFa ? 'ارکان ۴ گانه معماری' : 'Core Architecture'}</span>
            </button>

            <button
              onClick={() => setActiveTab('stack')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium active:scale-95 ${
                activeTab === 'stack'
                  ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{isFa ? 'پشته پروتکل و داده' : 'Protocol Stack'}</span>
            </button>

            <button
              onClick={() => setActiveTab('directives')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium active:scale-95 ${
                activeTab === 'directives'
                  ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{isFa ? 'اصول حاکمیت فنی' : 'Directives'}</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 font-medium active:scale-95 ${
                activeTab === 'benchmarks'
                  ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>{isFa ? 'تاییدیه‌های پروداکشن' : 'Scale Proofs'}</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-sans text-[10px] text-[var(--text-secondary)] uppercase font-semibold">
            <span>INVARIANTS ACTIVE</span>
            <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
            <span className="text-[var(--accent-primary)]">REPLAY-SAFE</span>
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
                  className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3.5 flex flex-col justify-between hover:border-[var(--accent-primary)] transition-all group block shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-secondary)] border-b border-[var(--border)] pb-2">
                      <span className="font-semibold text-[var(--text-primary)]">{item.num}</span>
                      <span className="text-[var(--accent-primary)]">{item.tag}</span>
                    </div>
                    <div className="font-sans font-bold text-xs text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono text-[var(--accent-primary)]">
                    <span>{item.metrics}</span>
                    <span>→</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* TAB 2: PROTOCOL STACK */}
          {activeTab === 'stack' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full animate-fadeIn">
              {techStack.map((tech) => (
                <div key={tech.name} className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-semibold text-[var(--accent-primary)]">[{tech.badge}]</span>
                  </div>
                  <div className="font-sans font-bold text-xs text-[var(--text-primary)]">{tech.name}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] leading-snug">{tech.role}</div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: DIRECTIVES */}
          {activeTab === 'directives' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full animate-fadeIn">
              {directives.map((dir, i) => (
                <div key={i} className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-3.5 space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[var(--accent-primary)] font-semibold">{dir.tag}</span>
                  </div>
                  <div className="font-sans font-bold text-xs text-[var(--text-primary)]">{dir.label}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{dir.text}</div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BENCHMARKS */}
          {activeTab === 'benchmarks' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full animate-fadeIn">
              {benchmarks.map((bench, i) => (
                <div key={i} className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-xl p-4 space-y-2 shadow-sm text-center">
                  <div className="text-[10px] font-mono text-[var(--accent-primary)] uppercase tracking-wider">{bench.title}</div>
                  <div className="text-2xl font-bold font-sans text-[var(--text-primary)]">{bench.metric}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] leading-tight">{bench.detail}</div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
