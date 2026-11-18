import React from 'react';
import { stats } from '../../data/stats';

interface LandingStageProps {
  locale?: 'en' | 'fa';
}

export default function LandingStage({ locale = 'en' }: LandingStageProps) {
  const isFa = locale === 'fa';

  const baseUrl = (typeof window !== 'undefined' && (window as any).__BASE_URL__) 
    ? (window as any).__BASE_URL__ 
    : '/';

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

  const t = isFa
    ? {
        statement: 'سیستم‌های پرداخت، دفتر کل و مخابرات طراحی می‌کنم که زیر بار درست می‌مانند.',
        lead: 'معمار سیستم و مدیر محصول فنی. هم معماری را طراحی می‌کنم و هم تصمیم محصولی پشت آن را، و هر دو را مستند می‌کنم: بده‌بستان‌ها، حالت‌های خرابی و نتیجه.',
        book: 'رزرو جلسه',
        email: 'ایمیل',
        available: 'برای پروژه‌های طراحی سیستم و بازبینی معماری در دسترس هستم. برای گفت‌وگو درباره نقش‌های ارشد هم آماده‌ام.',
        plateCaption: 'برگه ۱ · دفتر کل دوطرفه و رزرو دومرحله‌ای موجودی',
        openSheet: 'باز کردن این برگه',
        note1: 'اول رزرو، بعد پرداخت: هیچ موجودی بدون بدهکار و بستانکار متناظر جابه‌جا نمی‌شود.',
        note2: 'به‌جای پرداخت سریع‌تر بدون رزرو انتخاب شد؛ جلوگیری از برداشت بدون پشتوانه مهم‌تر بود.',
        tbName: 'نام', tbRole: 'نقش', tbBase: 'محل', tbScope: 'حوزه', tbSheet: 'برگه',
        role: 'معمار سیستم و مدیر محصول فنی',
        base: 'تهران، ایران',
        scope: 'پرداخت · دفتر کل · مخابرات',
        sheetOf: '۱ از ۹',
        scheduleTitle: 'سیستم‌های مستندشده',
        scheduleIntro: 'هر ردیف یک برگه است: شماتیک، قواعد، حالت‌های خرابی و تصمیم محصولی.',
        colSheet: 'برگه', colSystem: 'سیستم', colWhat: 'چه می‌کند', colFig: 'اندازه‌گیری‌شده',
        notesTitle: 'یادداشت‌های عمومی',
        notesIntro: 'چهار قاعده‌ای که در همه این سیستم‌ها ثابت است.',
        materialsTitle: 'پروتکل‌ها و ابزارها',
        scaleTitle: 'در محیط عملیاتی',
        portraitAlt: 'آریا صراف‌زاده',
      }
    : {
        statement: 'I design payment, ledger and telecom systems that stay correct under load.',
        lead: 'Systems architect and technical product leader. I work out the architecture and the product decision behind it, then document both: the trade-offs, the failure modes and the result.',
        book: 'Book a call',
        email: 'Email me',
        available: 'Available for system-design projects and architecture reviews. Open to conversations about senior roles.',
        plateCaption: 'Sheet 1 · Double-entry ledger and two-phase balance reservation',
        openSheet: 'Open this sheet',
        note1: 'Reserve first, pay second: no balance moves without a matching debit and credit.',
        note2: 'Chosen over faster unreserved checkout. Preventing unbacked overdraws mattered more.',
        tbName: 'Drawn by', tbRole: 'Role', tbBase: 'Based in', tbScope: 'Discipline', tbSheet: 'Sheet',
        role: 'Systems Architect & Technical Product Leader',
        base: 'Tehran, Iran',
        scope: 'Payments · Ledgers · Telecom',
        sheetOf: '1 of 9',
        scheduleTitle: 'Systems on file',
        scheduleIntro: 'Each row is a sheet: the schematic, its rules, its failure modes and the product decision.',
        colSheet: 'Sheet', colSystem: 'System', colWhat: 'What it does', colFig: 'Measured',
        notesTitle: 'General notes',
        notesIntro: 'Four rules that hold across every system here.',
        materialsTitle: 'Protocols and tools',
        scaleTitle: 'In production',
        portraitAlt: 'Ariya Sarrafzadeh',
      };

  const moreSheets = [
    { id: 'payment-switch', file: 'payment-switch-iso8583-pipeline.svg', label: isFa ? 'برگه ۲ · سوییچ پرداخت' : 'Sheet 2 · Payment switch' },
    { id: 'fraud-forensics', file: 'fraud-tracing-architecture.svg', label: isFa ? 'برگه ۳ · ردیابی تقلب' : 'Sheet 3 · Fraud tracing' },
    { id: 'reconciliation-engine', file: 'multi-bank-reconciliation.svg', label: isFa ? 'برگه ۴ · مغایرت‌گیری' : 'Sheet 4 · Reconciliation' },
  ];

  const display = isFa ? undefined : { fontFamily: 'var(--font-display)' };

  const openSheet = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('dossier-select', { detail: { id } }));
  };

  return (
    <div id="overview" className="scroll-mt-24 w-full flex flex-col gap-14 lg:gap-20 pb-6 font-sans" dir={isFa ? 'rtl' : 'ltr'}>

      {/* SHEET 1: statement, action, plate, title block */}
      <div className="sheet">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          <div className="lg:col-span-5 p-6 sm:p-9 lg:p-12 flex flex-col">
            <h1
              className="font-semibold text-[var(--text-primary)] leading-[1.0] tracking-[-0.015em] text-[clamp(2.5rem,4.1vw,4.25rem)]"
              style={display}
            >
              {t.statement}
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-[var(--text-secondary)] max-w-[46ch]">
              {t.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#book" onClick={(e) => openSheet(e, 'book')} className="btn-ink">
                {t.book}
              </a>
              <a href="mailto:ariasg2002@gmail.com?subject=Project%20inquiry" className="btn-line">
                {t.email}
              </a>
              <a
                href="https://www.linkedin.com/in/ariya-sarrafzadeh/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-3 font-semibold text-[var(--accent-primary)] underline decoration-1 hover:text-[var(--accent-hover)]"
              >
                LinkedIn
              </a>
            </div>

            <div className="mt-10 lg:mt-auto pt-8 flex items-end gap-5">
              <div dir="ltr" className="w-[112px] sm:w-[140px] aspect-[4/5] overflow-hidden border border-[var(--border-strong)] shrink-0 bg-[var(--paper-3)]">
                <img
                  src={`${baseUrl}photos/ariya.jpg`}
                  alt={t.portraitAlt}
                  width={952}
                  height={1275}
                  className="block max-w-none w-[235%] -translate-x-[2%] -translate-y-[7%]"
                  loading="eager"
                />
              </div>
              <p className="text-[0.9375rem] leading-relaxed text-[var(--text-secondary)] max-w-[34ch] pb-1">
                {t.available}
              </p>
            </div>
          </div>

          <figure className="lg:col-span-7 m-0 border-t-[1.5px] lg:border-t-0 lg:border-s-[1.5px] border-[var(--border-strong)] bg-[var(--wash)] p-5 sm:p-8 lg:p-10 flex flex-col gap-5">
            <a href="#payment-settlement" onClick={(e) => openSheet(e, 'payment-settlement')} className="plate block">
              <img
                src={`${baseUrl}diagrams/double-entry-ledger-schematic.svg?v=sheet-1`}
                alt={isFa ? 'شماتیک دفتر کل دوطرفه و رزرو دومرحله‌ای' : 'Schematic of the double-entry ledger and two-phase balance reservation engine'}
                className="w-full h-auto block"
                loading="eager"
              />
            </a>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <p className="pencil-note text-[1.0625rem]">{t.note1}</p>
              <p className="pencil-note text-[1.0625rem]">{t.note2}</p>
            </div>
            <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-5 list-none p-0">
              {moreSheets.map((sh) => (
                <li key={sh.id}>
                  <a href={`#${sh.id}`} onClick={(e) => openSheet(e, sh.id)} className="group block">
                    <span className="plate block overflow-hidden">
                      <img
                        src={`${baseUrl}diagrams/${sh.file}?v=sheet-1`}
                        alt=""
                        className="w-full aspect-[16/10] object-cover object-left-top block transition-transform duration-300 ease-out group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </span>
                    <span className="mt-2 block text-[0.875rem] font-medium text-[var(--accent-primary)] group-hover:underline">
                      {sh.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <figcaption className="mt-auto pt-4 border-t border-[var(--border)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 text-[0.9375rem] text-[var(--text-secondary)]">
              <span>{t.plateCaption}</span>
              <a href="#payment-settlement" onClick={(e) => openSheet(e, 'payment-settlement')} className="font-semibold text-[var(--accent-primary)] underline decoration-1">
                {t.openSheet}
              </a>
            </figcaption>
          </figure>
        </div>

        <dl className="title-block grid-cols-2 lg:grid-cols-[1.1fr_1.7fr_1fr_1.4fr_0.6fr] m-0 max-lg:[&>*:nth-child(2n)]:border-e-0 max-lg:[&>*]:border-b max-lg:[&>*]:border-b-[var(--border)] max-lg:[&>*:last-child]:col-span-2 max-lg:[&>*:last-child]:border-b-0">
          <div><dt>{t.tbName}</dt><dd>{isFa ? 'آریا صراف‌زاده' : 'Ariya Sarrafzadeh'}</dd></div>
          <div><dt>{t.tbRole}</dt><dd>{t.role}</dd></div>
          <div><dt>{t.tbBase}</dt><dd>{t.base}</dd></div>
          <div><dt>{t.tbScope}</dt><dd>{t.scope}</dd></div>
          <div><dt>{t.tbSheet}</dt><dd>{t.sheetOf}</dd></div>
        </dl>
      </div>

      {/* SCHEDULE: the systems, as a drawing schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
        <div className="lg:col-span-4">
          <h2 className="font-semibold leading-[1.02] tracking-[-0.01em] text-[clamp(2rem,3.4vw,3.25rem)] text-[var(--text-primary)]" style={display}>
            {t.scheduleTitle}
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)] max-w-[36ch]">{t.scheduleIntro}</p>
        </div>
        <div className="lg:col-span-8">
          <table className="schedule">
            <thead>
              <tr>
                <th scope="col">{t.colSheet}</th>
                <th scope="col">{t.colSystem}</th>
                <th scope="col" className="max-sm:hidden">{t.colWhat}</th>
                <th scope="col">{t.colFig}</th>
              </tr>
            </thead>
            <tbody>
              {pillars.map((item) => (
                <tr key={item.href}>
                  <td className="fig">{item.num}</td>
                  <td>
                    <a href={item.href} onClick={(e) => openSheet(e, item.href.replace('#', ''))}>{item.title}</a>
                  </td>
                  <td className="text-[var(--text-secondary)] max-sm:hidden">{item.desc}</td>
                  <td className="fig max-sm:whitespace-normal" dir="ltr">{item.metrics}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GENERAL NOTES + MATERIALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-12">
        <div className="lg:col-span-7">
          <h2 className="font-semibold leading-[1.02] tracking-[-0.01em] text-[clamp(2rem,3.4vw,3.25rem)] text-[var(--text-primary)]" style={display}>
            {t.notesTitle}
          </h2>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">{t.notesIntro}</p>
          <ol className="mt-8 border-t-[1.5px] border-[var(--border-strong)]">
            {directives.map((dir, i) => (
              <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 py-5 border-b border-[var(--border)]">
                <span className="font-mono text-[var(--pencil)] font-medium pt-0.5">{isFa ? ['۱', '۲', '۳', '۴'][i] : i + 1}</span>
                <div>
                  <h3 className="font-semibold text-[1.0625rem] text-[var(--text-primary)]">{dir.label.replace(/^(Rule \d+|اصل \S+):\s*/, '')}</h3>
                  <p className="mt-1 text-[var(--text-secondary)] max-w-[62ch]">{dir.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5 lg:ps-10 lg:border-s lg:border-[var(--border)]">
          <h2 className="font-semibold text-xl text-[var(--text-primary)]">{t.materialsTitle}</h2>
          <dl className="mt-5">
            {techStack.map((tech) => (
              <div key={tech.name} className="py-3 border-b border-[var(--border)] first:border-t first:border-t-[var(--border-strong)]">
                <dt className="font-mono font-medium text-[var(--accent-primary)]" dir="ltr">{tech.name}</dt>
                <dd className="mt-0.5 text-[0.9375rem] text-[var(--text-secondary)]">{tech.role}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-12 font-semibold text-xl text-[var(--text-primary)]">{t.scaleTitle}</h2>
          <dl className="mt-5">
            {benchmarks.map((bench, i) => (
              <div key={i} className="py-3 border-b border-[var(--border)] first:border-t first:border-t-[var(--border-strong)]">
                <dt className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <span className="font-semibold text-[var(--text-primary)]">{bench.title}</span>
                  <span className="font-mono font-medium text-[var(--text-primary)]" dir="ltr">{bench.metric}</span>
                </dt>
                <dd className="mt-0.5 text-[0.9375rem] text-[var(--text-secondary)]">{bench.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

    </div>
  );
}
