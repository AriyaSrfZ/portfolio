export interface StatMetric {
  raw: number | string;
  en: string;
  fa: string;
  [key: string]: any;
}

export const stats = {
  // =========================================================================
  // 01. HERO COMMAND CONSOLE & GLOBAL PROOF METRICS
  // =========================================================================
  experienceYears: {
    raw: 15,
    en: "15+ YRS",
    fa: "۱۵+ سال",
    textEn: "15+ years",
    textFa: "بیش از ۱۵ سال",
  },
  telecomHubAnnualVolume: {
    raw: 1000000000,
    en: "1B+ SMS",
    fa: "۱B+ پیامک",
    textEn: "1B+ SMS / Year",
    textFa: "۱B+ پیامک / سال",
    badgeEn: "1B+ MSG / YR",
    badgeFa: "۱B+ پیامک/سال",
  },
  superAppMonthlyActives: {
    raw: 12000000,
    en: "12M+ Monthly Actives",
    fa: "۱۲M+ کاربر فعال",
  },
  superAppLatency: {
    raw: 25,
    en: "sub-25ms",
    fa: "زیر ۲۵ میلی‌ثانیه",
  },
  clearingBatchesDaily: {
    raw: 50000,
    en: "50K+ Daily Batches",
    fa: "۵۰K+ بچ روزانه",
    heroEn: "Across 50K+ Daily Clearing Batches",
    heroFa: "انحراف مالی در تسویه روزانه",
  },
  commercialPartnerBanks: {
    raw: 20,
    en: "20+ commercial banks",
    fa: "بیش از ۲۰ بانک عامل",
  },

  // =========================================================================
  // 02. DOSSIER 01 - SETTLEMENTS & DOUBLE-ENTRY LEDGERS
  // =========================================================================
  ledgerPeakTps: {
    raw: 50000,
    en: "50,000 TPS",
    fa: "50,000 TPS",
    dossierFa: "۵۰,۰۰۰ TPS",
    shortEn: "50K TPS",
    shortFa: "۵۰K TPS",
    textFa: "۵۰ هزار تراکنش هم‌روند",
  },
  ledgerLockTtl: {
    raw: 15000,
    en: "15,000ms SETNX",
    fa: "15,000ms SETNX",
    textEn: "15-second lock timeout",
    textFa: "مهلت زمانی ۱۵ ثانیه‌ای",
  },
  ledgerReplayWindow: {
    raw: 86400,
    en: "86,400s (24h)",
    fa: "۲۴ ساعت (۸۶,۴۰۰s)",
    textEn: "24-hour expiration window",
    textFa: "پنجره انقضای ۲۴ ساعته",
  },
  financialDriftPercent: {
    raw: 0.00,
    en: "0.00% (ZERO)",
    fa: "۰٫۰۰٪ (صفر مطلق)",
    shortEn: "0.00% DRIFT",
    shortFa: "۰٫۰۰٪",
    textEn: "0.00% financial drift",
    textFa: "انحراف مالی صفر (۰٫۰۰٪)",
    badgeCleanEn: "Zero Financial Drift",
    badgeCleanFa: "عدم انحراف مالی (Zero Drift)",
    zeroDriftFa: "مغایرت صفر",
  },

  // =========================================================================
  // 03. DOSSIER 02 - SMART PSP SWITCH & ISO 8583
  // =========================================================================
  switchFailoverSla: {
    raw: 30,
    en: "<30ms Failover",
    fa: "<30ms Failover",
    shortEn: "SUB-30MS",
    shortFa: "SUB-30MS",
    textEn: "sub-30ms",
    textFa: "زیر ۳۰ میلی‌ثانیه",
    badgeEn: "Sub-30ms Failover",
    badgeFa: "تاخیر زیر ۳۰ms",
    workBadgeFa: "تغییر مسیر خودکار ۳۰ms",
  },
  switchProtocolWireFormat: {
    raw: "ISO 8583 MTI 0200",
    en: "ISO 8583 MTI 0200",
    fa: "ISO 8583 MTI 0200",
  },
  switchGatewayUptime: {
    raw: 99.99,
    en: "99.99% Availability",
    fa: "99.99% Uptime",
    textEn: "99.99% core switch uptime",
    textFa: "آپ‌تایم ۹۹٫۹۹ درصدی",
  },
  switchConversionLift: {
    raw: 14,
    en: "+14% Gain",
    fa: "+14% Gain",
    textEn: "+14% checkout conversion lift",
    textFa: "رشد ۱۴ درصدی نرخ تبدیل",
  },

  // =========================================================================
  // 04. DOSSIER 03 - FORENSIC FRAUD MITIGATION & eKYC
  // =========================================================================
  fraudRiskLoopSla: {
    raw: 15,
    en: "<15ms (P99)",
    fa: "<15ms (P99)",
    shortEn: "<15ms SLA",
    shortFa: "زیر ۱۵ms",
    textEn: "sub-15ms",
    textFa: "زیر ۱۵ میلی‌ثانیه",
    workBadgeEn: "Sub-15ms SLA",
    workBadgeFa: "تأخیر کمتر از ۱۵ms",
  },
  fraudEdgeGatewaySla: {
    raw: 30,
    en: "< 30 ms Edge Scoring SLA",
    fa: "SLA کمتر از ۳۰ میلی‌ثانیه",
  },
  graphTraversalHop: {
    raw: 12,
    en: "<12ms",
    fa: "زیر ۱۲ میلی‌ثانیه",
  },
  cvv2RetentionTime: {
    raw: 0.00,
    en: "0.00s (Zero-Storage)",
    fa: "۰٫۰۰ ثانیه (عدم ذخیره)",
  },
  fraudDrainReduction: {
    raw: 94,
    en: "-94% Drain",
    fa: "۹۴- درصد کاهش",
    textEn: "94 percent",
    textFa: "کاهش ۹۴ درصدی",
  },
  frictionless3dsPassRate: {
    raw: 92,
    en: ">92% Pass Rate",
    fa: "بیش از ۹۲٪ عبور",
    textEn: ">92% of verified legitimate users",
    textFa: "بیش از ۹۲ درصد کاربران",
  },

  // =========================================================================
  // 05. DOSSIER 04 - MULTI-RAIL RECONCILIATION & SETTLEMENT
  // =========================================================================
  reconMatchParity: {
    raw: 100,
    en: "100% 3-Way Match",
    fa: "تطبیق ۱۰۰٪ سه‌طرفه",
    textEn: "100% mathematical ledger parity",
    textFa: "تطبیق ۱۰۰ درصدی",
  },
  merchantPayoutWindow: {
    raw: 24,
    en: "24h Early Settle",
    fa: "تسویه ۲۴ ساعته",
    textEn: "24h early merchant settlement",
    textFa: "تسویه زودهنگام ۲۴ ساعته",
  },
  reconBatchEngine: {
    raw: "Spring Batch",
    en: "Spring Batch",
    fa: "Spring Batch",
  },
  reconAutoHealingSla: {
    raw: 45,
    en: "SUB-45S",
    fa: "SUB-45S",
    textEn: "sub-45s auto-healing",
    textFa: "چرخه خودالتیام زیر ۴۵ ثانیه",
  },
  manualReconOverhead: {
    raw: 100,
    en: "-100% Eliminated",
    fa: "۱۰۰- درصد حذف",
    textEn: "eliminated 100% of manual reconciliation overhead",
    textFa: "حذف ۱۰۰ درصدی هزینه‌های مغایرت‌گیری دستی",
  },
  disputeResolutionWindow: {
    raw: "T+0 to T+2",
    en: "(T+0 to T+2)",
    fa: "(T+0 تا T+2)",
  },
  legacyManualPayoutDelay: {
    raw: 48,
    en: "48h+",
    fa: "بیش از ۴۸ ساعت",
  },
  reconciliationTrialEvents: {
    raw: 50000,
    en: "50,000+ daily events",
    fa: "بیش از ۵۰ هزار تراکنش",
    workEn: "50,000+ daily transactions",
    workFa: "۵۰ هزار تراکنش روزانه",
  },

  // =========================================================================
  // 06. PRODUCTION INCIDENT POSTMORTEMS
  // =========================================================================
  incidentMttr: {
    raw: 8,
    en: "< 8 min Failover",
    fa: "< 8 min Failover",
    textEn: "MTTR under 8 minutes",
    textFa: "میانگین زمان بازیابی زیر ۸ دقیقه",
  },
  incidentFinancialDrift: {
    raw: 0.00,
    en: "0.00 IRR (Zero Loss)",
    fa: "0.00 IRR (Zero Loss)",
    badgeEn: "0.00 IRR Drift",
    badgeFa: "انحراف مالی: صفر ریال (0.00 IRR)",
    textEn: "0.00 IRR discrepancy",
    textFa: "ثبت مغایرت صفر ریال",
  },
  incidentSwitchAvailability: {
    raw: 99.99,
    en: "99.99% Core Uptime",
    fa: "99.99% Core Uptime",
  },
  incidentResolutionSla: {
    raw: 100,
    en: "100% P0 Mitigated",
    fa: "100% P0 Mitigated",
  },
  incident01LockTtl: {
    raw: 24,
    en: "24h",
    fa: "۲۴ ساعته",
  },
  incident02SlidingWindow: {
    raw: "16-64 PDU",
    en: "16–64 PDU",
    fa: "۱۶ تا ۶۴ PDU",
  },
  incident02OtpSla: {
    raw: 2000,
    en: "<2,000ms Delivery SLA",
    fa: "<2,000ms Delivery SLA",
  },
  incident03Title: {
    en: "Smart DB — 100M Pre-KYC Scoring & Shahkar Deadlock",
    fa: "Smart DB — پالایش ۱۰۰ میلیون رکورد هویتی و بن‌بست دیتابیس",
  },
  preKycDatasetScale: {
    raw: 100000000,
    en: "100M",
    fa: "۱۰۰ میلیون",
  },
  preKycUnindexedRecords: {
    raw: 94700000,
    en: "94.7M unindexed legacy customer records",
    fa: "۹۴٫۷ میلیون رکورد بی‌ساختار و بدون ایندکس",
  },
  incident03LockElimination: {
    raw: 100,
    en: "100% Lock Elimination",
    fa: "۱۰۰٪ رفع بن‌بست جدول",
  },

  // =========================================================================
  // 07. CIRCUIT BREAKER & RECOVERY MATRIX TABLE
  // =========================================================================
  circuitBreakerApiP99: {
    raw: 50,
    en: "P99 < 50ms · 429 < 0.1%",
    fa: "P99 < 50ms · 429 < 0.1%",
  },
  circuitBreakerSwitchPsr: {
    raw: 88,
    en: "PSR > 88% per gateway",
    fa: "PSR > 88% per PSP",
  },
  circuitBreakerLedgerInvariant: {
    raw: 0.00,
    en: "ΔBalance = 0.00 (Strict Invariant)",
    fa: "ΔBalance = 0.00 (Strict Invariant)",
  },
  circuitBreakerSettlementWindow: {
    raw: 99.2,
    en: "> 99.2% in 24h Window",
    fa: "> 99.2% in 24h Window",
  },
  circuitBreakerShahkarLatency: {
    raw: 1200,
    en: "Latency < 1,200ms",
    fa: "Latency < 1,200ms",
  },
  circuitBreakerSmppOtp: {
    raw: 2000,
    en: "OTP Delivery < 2,000ms",
    fa: "OTP Delivery < 2,000ms",
  },
} as const;

export type StatKey = keyof typeof stats;
