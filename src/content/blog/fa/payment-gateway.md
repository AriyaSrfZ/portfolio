---
title: "معماری درگاه پرداخت: سوئیچ‌های ترافیک بالا و دفترهای کل توزیع‌شده"
description: "سوئیچ با دسترس‌پذیری بالا به سازگاری قطعی، سقف تأخیر زیر یک ثانیه و جداسازی کامل وضعیت تغییرپذیر از واقعیت تغییرناپذیر تراکنش نیاز دارد."
pubDate: 2026-09-30
category: "fintech"
technologies: ["معماری سیستم", "مقاله فنی", "ISO 8583", "Redis", "دفترهای کل توزیع‌شده"]
metric: "SLA تأخیر درگاه: کمتر از ۲۵۰ میلی‌ثانیه"
lang: "fa"
---

درگاه پرداخت، مرز تبدیل پروتکل و مسیریابی میان سامانه پذیرنده، بانک پذیرنده، شبکه کارت و بانک صادرکننده است. سوئیچ با دسترس‌پذیری بالا به سازگاری قطعی، سقف تأخیر زیر یک ثانیه و جداسازی کامل وضعیت تغییرپذیر از واقعیت تغییرناپذیر تراکنش نیاز دارد.

## حدود ثابت عملکرد سیستم

- **بودجه تأخیر سوئیچ:** SLA رفت‌وبرگشت کمتر از ۲۵۰ میلی‌ثانیه
- **TTL قفل Idempotency:** عمر کلید قفل Redis برابر با ۸۶٬۴۰۰ ثانیه
- **پروتکل سوئیچ:** پیام مبتنی بر Bitmap در ISO 8583
- **الگوی ذخیره‌سازی:** ثبت افزایشی واقعیت / رویداد در دفتر کل دوطرفه

---

## ۰۱. هدف معماری: مدل واقعیت در برابر وضعیت

سوئیچ‌های یکپارچه قدیمی به‌دلیل به‌روزرسانی مخرب ردیف‌ها شکست می‌خوردند. بازنویسی رکورد پایگاه داده حین پردازش زنده تراکنش، هنگام اختلال کوتاه شبکه یا پایان مهلت پاسخ میزبان بانکی، رقابت هم‌زمانی غیرقابل‌بازیابی و بن‌بست پایگاه داده ایجاد می‌کند.

پلتفرم پرداخت، اجرا را به وضعیت‌های گذرا و واقعیت‌های تغییرناپذیر تفکیک می‌کند:

- **وضعیت:** مراحل تغییرپذیر چرخه عمر را نشان می‌دهد: `Pending`، `Authorized`، `Captured` و `Settled`. سامانه آن‌ها را در ذخیره‌ساز توزیع‌شده درون‌حافظه‌ای، با قفل‌گذاری خوش‌بینانه، کش می‌کند.
- **واقعیت:** رویداد کسب‌وکار تغییرناپذیر با ثبت صرفاً افزایشی است: `AuthRequested`، `FundsReserved` و `CaptureConfirmed`. سامانه واقعیت‌ها را به‌صورت دائمی در دفتر کل دوطرفه می‌نویسد و امکان تغییر آن‌ها را نمی‌دهد.

> **قاعده ثابت اجرا:**  
> درگاه لبه باید پیش از ارسال پیام تراکنش، Idempotency درخواست را با قفل توزیع‌شده اتمیک بررسی کند.

<div class="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120]/90 p-2 shadow-2xl" dir="ltr">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="auto" class="w-full h-auto font-mono text-[11px]" dir="ltr">
    <defs>
      <linearGradient id="fa-ledger-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.02"/>
      </linearGradient>
      <linearGradient id="fa-ledger-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e2c974" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#e2c974" stop-opacity="0.02"/>
      </linearGradient>
      <pattern id="fa-grid-dots-ledger" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity="0.04"/>
      </pattern>
      <marker id="fa-arrow-cyan-led" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4"/>
      </marker>
      <marker id="fa-arrow-gold-led" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#e2c974"/>
      </marker>
    </defs>

    <!-- Canvas Background -->
    <rect width="800" height="400" fill="#0b1120" rx="12"/>
    <rect width="800" height="400" fill="url(#fa-grid-dots-ledger)" rx="12"/>
    <rect width="798" height="398" x="1" y="1" fill="none" stroke="#ffffff" stroke-opacity="0.08" rx="11"/>

    <!-- Header & Invariant Title -->
    <g transform="translate(30, 24)">
      <circle cx="5" cy="5" r="4" fill="#06b6d4" />
      <text x="18" y="9" fill="#06b6d4" font-weight="700" letter-spacing="1.5">ARCHITECTURE SCHEMATIC · DOUBLE-ENTRY LEDGER</text>
      <text x="18" y="24" fill="#94a3b8" font-size="10">IMMUTABLE FACT STORE &amp; TWO-PHASE BALANCE RESERVATION</text>
      <rect x="520" y="-3" width="220" height="24" rx="6" fill="#06b6d4" fill-opacity="0.1" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="532" y="13" fill="#38bdf8" font-size="10" font-weight="600">INVARIANT: Σ DEBITS - Σ CREDITS = 0</text>
    </g>

    <!-- Column 1: Ingress & Mutation Request -->
    <g transform="translate(30, 75)">
      <rect width="160" height="285" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="160" height="28" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="12" y="18" fill="#e2c974" font-weight="700">01. MUTATION INGRESS</text>
      
      <!-- Sub-card: Client Token -->
      <rect x="12" y="42" width="136" height="58" rx="6" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="20" y="58" fill="#f8fafc" font-weight="600">POST /checkout</text>
      <text x="20" y="73" fill="#94a3b8" font-size="9">Idempotency-Key:</text>
      <text x="20" y="87" fill="#06b6d4" font-size="9">uuid-v4-tx-9942a</text>

      <!-- Sub-card: Atomic SETNX -->
      <rect x="12" y="115" width="136" height="70" rx="6" fill="#0b1120" stroke="#e2c974" stroke-opacity="0.3"/>
      <text x="20" y="131" fill="#e2c974" font-weight="600">Redis SETNX</text>
      <text x="20" y="146" fill="#94a3b8" font-size="9">TTL: 86,400s (24h)</text>
      <text x="20" y="160" fill="#cbd5e1" font-size="9">Status: MUTEX_ACQUIRED</text>
      <text x="20" y="173" fill="#10b981" font-size="9">Replay Attack: BLOCKED</text>

      <!-- Sub-card: Transient State -->
      <rect x="12" y="200" width="136" height="70" rx="6" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.1"/>
      <text x="20" y="216" fill="#f8fafc" font-weight="600">Mutable State</text>
      <text x="20" y="231" fill="#94a3b8" font-size="9">Phase: PENDING</text>
      <text x="20" y="245" fill="#94a3b8" font-size="9">Optimistic Lock: v1</text>
      <text x="20" y="259" fill="#06b6d4" font-size="9">In-Memory Cache</text>
    </g>

    <!-- Connector: Ingress -> Two-Phase -->
    <path d="M 190 145 L 245 145" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#fa-arrow-cyan-led)"/>
    <text x="200" y="138" fill="#06b6d4" font-size="8">DISPATCH</text>

    <!-- Column 2: Two-Phase Balance Reservation Machine -->
    <g transform="translate(250, 75)">
      <rect width="245" height="285" rx="8" fill="#111827" fill-opacity="0.8" stroke="#06b6d4" stroke-opacity="0.4"/>
      <rect width="245" height="28" rx="8" fill="url(#fa-ledger-cyan-grad)"/>
      <text x="14" y="18" fill="#38bdf8" font-weight="700">02. 2-PHASE RESERVATION</text>
      
      <!-- State 1: Available -->
      <rect x="14" y="42" width="217" height="48" rx="6" fill="#0b1120" stroke="#10b981" stroke-opacity="0.4"/>
      <circle cx="26" cy="58" r="4" fill="#10b981"/>
      <text x="36" y="62" fill="#f8fafc" font-weight="600">AVAILABLE: $1,000.00</text>
      <text x="36" y="77" fill="#94a3b8" font-size="9">Unrestricted user balance pool</text>

      <!-- Arrow down to Reserved -->
      <path d="M 122 90 L 122 110" fill="none" stroke="#e2c974" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#fa-arrow-gold-led)"/>
      <text x="128" y="103" fill="#e2c974" font-size="8">HOLD $250.00</text>

      <!-- State 2: Reserved -->
      <rect x="14" y="114" width="217" height="60" rx="6" fill="#0b1120" stroke="#e2c974" stroke-opacity="0.5"/>
      <circle cx="26" cy="132" r="4" fill="#e2c974"/>
      <text x="36" y="136" fill="#e2c974" font-weight="600">RESERVED: $250.00</text>
      <text x="36" y="151" fill="#94a3b8" font-size="9">Ring-fenced during settlement window</text>
      <text x="36" y="163" fill="#cbd5e1" font-size="8">Remaining Available: $750.00</text>

      <!-- Dual Branch: Commit or Rollback -->
      <path d="M 70 174 L 70 205" fill="none" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3 3" marker-end="url(#fa-arrow-cyan-led)"/>
      <path d="M 175 174 L 175 205" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3 3"/>

      <!-- Branch A: Commit -->
      <rect x="14" y="208" width="102" height="62" rx="6" fill="#0b1120" stroke="#10b981" stroke-opacity="0.3"/>
      <text x="22" y="225" fill="#10b981" font-weight="700">SETTLED</text>
      <text x="22" y="240" fill="#94a3b8" font-size="8">AuthConfirmed</text>
      <text x="22" y="253" fill="#cbd5e1" font-size="8">Burn Reservation</text>
      <text x="22" y="264" fill="#06b6d4" font-size="8">Credit Merchant</text>

      <!-- Branch B: Rollback -->
      <rect x="129" y="208" width="102" height="62" rx="6" fill="#0b1120" stroke="#f43f5e" stroke-opacity="0.3"/>
      <text x="137" y="225" fill="#f43f5e" font-weight="700">COMPENSATE</text>
      <text x="137" y="240" fill="#94a3b8" font-size="8">Host Timeout / 0400</text>
      <text x="137" y="253" fill="#cbd5e1" font-size="8">Release Reserve</text>
      <text x="137" y="264" fill="#e2c974" font-size="8">Refund Available</text>
    </g>

    <!-- Connector: Two-Phase -> Ledger Books -->
    <path d="M 495 145 L 530 145" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#fa-arrow-cyan-led)"/>
    <text x="500" y="138" fill="#06b6d4" font-size="8">APPEND</text>

    <!-- Column 3: Append-Only Immutable Journal -->
    <g transform="translate(535, 75)">
      <rect width="235" height="285" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="235" height="28" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="14" y="18" fill="#e2c974" font-weight="700">03. IMMUTABLE JOURNAL</text>
      
      <!-- Journal Table Header -->
      <rect x="12" y="42" width="211" height="22" rx="4" fill="#0b1120"/>
      <text x="18" y="57" fill="#94a3b8" font-size="8" font-weight="600">ID / EVENT</text>
      <text x="120" y="57" fill="#94a3b8" font-size="8" font-weight="600">DEBIT (DR)</text>
      <text x="172" y="57" fill="#94a3b8" font-size="8" font-weight="600">CREDIT (CR)</text>

      <!-- Row 1: AuthRequested -->
      <rect x="12" y="68" width="211" height="34" rx="4" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.05"/>
      <text x="18" y="82" fill="#38bdf8" font-size="9" font-weight="600">E1: AuthHold</text>
      <text x="18" y="94" fill="#94a3b8" font-size="8">User:CashPool</text>
      <text x="120" y="87" fill="#f8fafc" font-size="9">$250.00</text>
      <text x="172" y="87" fill="#94a3b8" font-size="9">-</text>

      <!-- Row 2: ReserveCreated -->
      <rect x="12" y="106" width="211" height="34" rx="4" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.05"/>
      <text x="18" y="120" fill="#e2c974" font-size="9" font-weight="600">E2: EscrowLock</text>
      <text x="18" y="132" fill="#94a3b8" font-size="8">Vault:Reserved</text>
      <text x="120" y="125" fill="#94a3b8" font-size="9">-</text>
      <text x="172" y="125" fill="#f8fafc" font-size="9">$250.00</text>

      <!-- Row 3: CaptureConfirmed -->
      <rect x="12" y="144" width="211" height="34" rx="4" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.05"/>
      <text x="18" y="158" fill="#10b981" font-size="9" font-weight="600">E3: CaptureSettle</text>
      <text x="18" y="170" fill="#94a3b8" font-size="8">Merchant:Settled</text>
      <text x="120" y="163" fill="#94a3b8" font-size="9">-</text>
      <text x="172" y="163" fill="#10b981" font-size="9">$250.00</text>

      <!-- Row 4: NetworkFee -->
      <rect x="12" y="182" width="211" height="34" rx="4" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.05"/>
      <text x="18" y="196" fill="#38bdf8" font-size="9" font-weight="600">E4: SwitchFee</text>
      <text x="18" y="208" fill="#94a3b8" font-size="8">Network:FeePool</text>
      <text x="120" y="201" fill="#f8fafc" font-size="9">$2.50</text>
      <text x="172" y="201" fill="#f8fafc" font-size="9">$2.50</text>

      <!-- Bottom Invariant Proof Badge -->
      <rect x="12" y="224" width="211" height="46" rx="6" fill="#06b6d4" fill-opacity="0.08" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="20" y="240" fill="#38bdf8" font-weight="700" font-size="9">AUDIT CHECK: ZERO DRIFT</text>
      <text x="20" y="254" fill="#cbd5e1" font-size="8">DR: $252.50  |  CR: $252.50</text>
      <text x="20" y="264" fill="#10b981" font-size="8">DELTA: $0.000000 (EXACT REPLAY)</text>
    </g>

    <!-- Footer Bar -->
    <g transform="translate(30, 372)">
      <line x1="0" y1="0" x2="740" y2="0" stroke="#ffffff" stroke-opacity="0.08"/>
      <text x="0" y="15" fill="#94a3b8" font-size="9">PROTOCOL SPECIFICATION · SHARED RAFT / SCYLLADB ACID CONSENSUS LOG</text>
      <text x="610" y="15" fill="#06b6d4" font-size="9" font-weight="600">ZERO BALANCE OVERWRITE</text>
    </g>
  </svg>
</div>

---

## ۰۲. سازوکار اصلی پروتکل

### قفل Idempotency و قفل وضعیت
کاربر سرویس، توکن یکتای UUIDv4 را در سرآیند درخواست می‌فرستد. درگاه، فرمان اتمیک `SETNX` را روی خوشه Redis با TTL برابر با ۸۶٬۴۰۰ ثانیه، معادل ۲۴ ساعت، اجرا می‌کند. اگر کلید موجود باشد، سامانه درخواست تکراری را حذف می‌کند یا نتیجه کش‌شده اجرای قبلی را برمی‌گرداند. این کنترل جلوی تسویه تکراری را می‌گیرد.

### مسیریابی پروتکل ISO 8583
درگاه‌های API، پیام ورودی JSON را به قالب دودویی مبتنی بر Bitmap در ISO 8583 سریال‌سازی می‌کنند. فیلدها در جایگاه استاندارد قرار می‌گیرند:
- **فیلد ۳:** کد پردازش، شامل خرید، برگشت تراکنش و استعلام مانده
- **فیلد ۴:** مبلغ تراکنش، به‌صورت عدد صحیح در کوچک‌ترین واحد پول با صفرهای پیشرو
- **فیلد ۱۱:** شماره پیگیری ممیزی سیستم (STAN)
- **فیلدهای ۴۱ و ۴۲:** شناسه پایانه و کد شناسایی پذیرنده کارت

بسته‌ها از تونل رمز‌شده IPsec VPN به پردازشگر بانک پذیرنده می‌رسند و باید دقیقاً از قالب قاب‌بندی دودویی بانک پیروی کنند.

### اجماع توزیع‌شده و ACID
ذخیره‌ساز دفتر کل به سازگاری قابل‌ترتیب‌سازی در چند منطقه نیاز دارد. خوشه‌های شاردشده PostgreSQL یا CockroachDB از اجماع Raft استفاده می‌کنند. ثبت تراکنش، توازن دفتر کل دوطرفه را اعمال می‌کند: هر ثبت بدهکار باید ثبت بستانکار دقیقاً برابر داشته باشد تا اختلاف مالی در پلتفرم صفر بماند.

### تخصیص بودجه تأخیر درگاه با هدف ۲۵۰ میلی‌ثانیه
درگاه‌های پرداخت با ترافیک بالا، بودجه رفت‌وبرگشت را با مرزهای مشخص تقسیم می‌کنند:
- **برقراری اتصال TLS در ورودی:** ۲۵ میلی‌ثانیه
- **قفل Mutex و امتیازدهی ریسک:** ۳۵ میلی‌ثانیه
- **اخذ مجوز از میزبان اصلی بانک:** ۱۴۰ میلی‌ثانیه
- **تسویه و ثبت قطعی در پایگاه داده دفتر کل:** ۳۵ میلی‌ثانیه
- **بسته‌بندی پاسخ و ارسال خروجی:** ۱۵ میلی‌ثانیه

---

## ۰۳. مقایسه توپولوژی: سوئیچ شاپرک و الگوی جهانی

| بُعد معماری | پذیرندگان جهانی (Stripe / Adyen) | سوئیچ ایران (شاپرک / PSPها) |
| :--- | :--- | :--- |
| **توپولوژی شبکه** | شبکه مش چندمنطقه‌ای با اتصال مستقیم به Visa و Mastercard. | مسیریاب متمرکز پایاپای ملی که سوئیچ PSPهای مجاز را متصل می‌کند. |
| **ذخیره‌سازی توکن** | مخازن امن PCI-DSS سطح ۱ با رمزنگاری کلید در چند ابر. | تجهیزات اختصاصی ماژول امنیت سخت‌افزاری (HSM) در محل سازمان. |
| **تبدیل پروتکل** | نقاط پایانی REST با سریال‌سازی پویا به پروتکل شبکه کارت. | پیام دودویی با قالب ثابت ISO 8583 روی تونل‌های APN خصوصی. |
| **کشف تقلب و کنترل ریسک** | امتیازدهی پویای یادگیری ماشین در لبه و احراز هویت بدون چالش با 3D-Secure 2.0. | تأیید متمرکز بانک، فهرست‌های مسدودی ملی و الزام رمز پویای پیامکی. |
| **تأخیر تسویه** | پایاپای پیوسته با دسته‌های پرداخت چرخشی T+2. | چرخه‌های متمرکز پایاپای و تسویه دسته‌ای پایا و ساتنا. |

---

## ۰۴. زنجیره پردازش تراکنش سوئیچ

- **ورودی:** سامانه پذیرنده، درخواست POST را روی HTTPS با TLS 1.3 و کلید یکتای Idempotency آغاز می‌کند.
- **قفل کش:** خوشه درون‌حافظه‌ای Redis، توکن را با `SETNX` اتمیک بررسی می‌کند. پردازش درخواست تکراری بلافاصله متوقف می‌شود.
- **سریال‌ساز:** موتور تبدیل پروتکل، فیلدهای JSON را به پیام دودویی بسته‌بندی‌شده مبتنی بر Bitmap در ISO 8583 تبدیل می‌کند.
- **سوئیچ اصلی:** بسته ISO از خطوط APN / VPN به میزبان کارت می‌رسد.
- **دفتر کل تسویه:** سامانه پاسخ را از قالب انتقال خارج می‌کند، وضعیت تغییرپذیر را به‌روز می‌کند و ثبت بدهکار و بستانکار را به دفتر کل دوطرفه تغییرناپذیر می‌افزاید.

<div class="my-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1120]/90 p-2 shadow-2xl" dir="ltr">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="100%" height="auto" class="w-full h-auto font-mono text-[11px]" dir="ltr">
    <defs>
      <linearGradient id="fa-switch-cyan-glow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.3"/>
      </linearGradient>
      <pattern id="fa-grid-dots-switch" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill="#ffffff" fill-opacity="0.04"/>
      </pattern>
      <marker id="fa-arrow-cyan-sw" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#06b6d4"/>
      </marker>
      <marker id="fa-arrow-gold-sw" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="#e2c974"/>
      </marker>
    </defs>

    <!-- Background -->
    <rect width="800" height="400" fill="#0b1120" rx="12"/>
    <rect width="800" height="400" fill="url(#fa-grid-dots-switch)" rx="12"/>
    <rect width="798" height="398" x="1" y="1" fill="none" stroke="#ffffff" stroke-opacity="0.08" rx="11"/>

    <!-- Header Section -->
    <g transform="translate(30, 24)">
      <circle cx="5" cy="5" r="4" fill="#06b6d4"/>
      <text x="18" y="9" fill="#06b6d4" font-weight="700" letter-spacing="1.5">PAYMENT SWITCH TOPOLOGY · ISO 8583 H2H PIPELINE</text>
      <text x="18" y="24" fill="#94a3b8" font-size="10">SUB-250MS ROUNDTRIP SLA · NATIONAL ROUTING &amp; IDEMPOTENCY MESH</text>
      <rect x="560" y="-3" width="180" height="24" rx="6" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-opacity="0.3"/>
      <text x="572" y="13" fill="#10b981" font-size="10" font-weight="600">HIGH AVAILABILITY 99.99%</text>
    </g>

    <!-- Main Pipeline Nodes (Horizontal Sequence) -->

    <!-- Node 1: Ingress Edge -->
    <g transform="translate(30, 75)">
      <rect width="130" height="245" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="130" height="26" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="10" y="17" fill="#e2c974" font-weight="700">01. INGRESS</text>
      
      <rect x="10" y="38" width="110" height="46" rx="5" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="16" y="53" fill="#f8fafc" font-weight="600">TLS 1.3 / mTLS</text>
      <text x="16" y="66" fill="#94a3b8" font-size="8">Merchant Ingress</text>
      <text x="16" y="77" fill="#06b6d4" font-size="8">Payload: JSON</text>

      <rect x="10" y="94" width="110" height="52" rx="5" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.08"/>
      <text x="16" y="109" fill="#f8fafc" font-weight="600">Rate Limiter</text>
      <text x="16" y="122" fill="#94a3b8" font-size="8">Token Bucket</text>
      <text x="16" y="134" fill="#38bdf8" font-size="8">P99 &lt; 5ms</text>

      <rect x="10" y="156" width="110" height="74" rx="5" fill="#0b1120" stroke="#e2c974" stroke-opacity="0.3"/>
      <text x="16" y="172" fill="#e2c974" font-weight="600">Idempotency</text>
      <text x="16" y="186" fill="#94a3b8" font-size="8">Redis SETNX</text>
      <text x="16" y="198" fill="#94a3b8" font-size="8">Key: UUIDv4</text>
      <text x="16" y="211" fill="#10b981" font-size="8">TTL: 86,400s</text>
      <text x="16" y="222" fill="#cbd5e1" font-size="7">Budget: 25ms</text>
    </g>

    <!-- Conduit 1 -> 2 -->
    <path d="M 160 140 L 180 140" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#fa-arrow-cyan-sw)"/>

    <!-- Node 2: Security & HSM Vault -->
    <g transform="translate(185, 75)">
      <rect width="130" height="245" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="130" height="26" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="10" y="17" fill="#e2c974" font-weight="700">02. SECURITY</text>
      
      <rect x="10" y="38" width="110" height="52" rx="5" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="16" y="53" fill="#f8fafc" font-weight="600">Card Vault</text>
      <text x="16" y="66" fill="#94a3b8" font-size="8">PAN Tokenization</text>
      <text x="16" y="78" fill="#06b6d4" font-size="8">Zero-SAD Storage</text>

      <rect x="10" y="100" width="110" height="60" rx="5" fill="#0b1120" stroke="#e2c974" stroke-opacity="0.3"/>
      <text x="16" y="116" fill="#e2c974" font-weight="600">Hardware HSM</text>
      <text x="16" y="130" fill="#94a3b8" font-size="8">PIN Block Encrypt</text>
      <text x="16" y="142" fill="#94a3b8" font-size="8">Zone Master Key</text>
      <text x="16" y="153" fill="#cbd5e1" font-size="7">ANSI X9.8</text>

      <rect x="10" y="170" width="110" height="60" rx="5" fill="#0b1120" stroke="#38bdf8" stroke-opacity="0.3"/>
      <text x="16" y="186" fill="#38bdf8" font-weight="600">Risk Engine</text>
      <text x="16" y="199" fill="#94a3b8" font-size="8">Sub-15ms ML Vector</text>
      <text x="16" y="211" fill="#10b981" font-size="8">3DS 2.0 Shift</text>
      <text x="16" y="222" fill="#cbd5e1" font-size="7">Budget: 35ms</text>
    </g>

    <!-- Conduit 2 -> 3 -->
    <path d="M 315 140 L 335 140" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#fa-arrow-cyan-sw)"/>

    <!-- Node 3: Serializer & Bitmap Engine -->
    <g transform="translate(340, 75)">
      <rect width="135" height="245" rx="8" fill="#111827" fill-opacity="0.8" stroke="#06b6d4" stroke-opacity="0.4"/>
      <rect width="135" height="26" rx="8" fill="url(#fa-switch-cyan-glow)"/>
      <text x="10" y="17" fill="#38bdf8" font-weight="700">03. ISO 8583 BITMAP</text>
      
      <rect x="10" y="38" width="115" height="48" rx="5" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.08"/>
      <text x="16" y="53" fill="#f8fafc" font-weight="600">MTI Dispatch</text>
      <text x="16" y="66" fill="#94a3b8" font-size="8">0100 Auth Request</text>
      <text x="16" y="78" fill="#06b6d4" font-size="8">0200 Purchase Exec</text>

      <rect x="10" y="96" width="115" height="74" rx="5" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="16" y="112" fill="#06b6d4" font-weight="600">Field Packing</text>
      <text x="16" y="125" fill="#94a3b8" font-size="8">F3: ProcCode 000000</text>
      <text x="16" y="137" fill="#94a3b8" font-size="8">F4: Amount Zero-Pad</text>
      <text x="16" y="149" fill="#94a3b8" font-size="8">F11: STAN Trace</text>
      <text x="16" y="161" fill="#cbd5e1" font-size="8">F41/F42: Terminal ID</text>

      <rect x="10" y="180" width="115" height="50" rx="5" fill="#0b1120" stroke="#e2c974" stroke-opacity="0.3"/>
      <text x="16" y="196" fill="#e2c974" font-weight="600">Timeout Guard</text>
      <text x="16" y="209" fill="#94a3b8" font-size="8">15s Read Threshold</text>
      <text x="16" y="221" fill="#f43f5e" font-size="8">Auto 0400 Reversal</text>
    </g>

    <!-- Conduit 3 -> 4 -->
    <path d="M 475 140 L 495 140" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#fa-arrow-cyan-sw)"/>

    <!-- Node 4: Switch Core & Bank Network -->
    <g transform="translate(500, 75)">
      <rect width="130" height="245" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="130" height="26" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="10" y="17" fill="#e2c974" font-weight="700">04. CLEARING</text>
      
      <rect x="10" y="38" width="110" height="52" rx="5" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="16" y="53" fill="#f8fafc" font-weight="600">APN / IPsec</text>
      <text x="16" y="66" fill="#94a3b8" font-size="8">Dedicated Tunnel</text>
      <text x="16" y="78" fill="#06b6d4" font-size="8">Direct Host-to-Host</text>

      <rect x="10" y="100" width="110" height="60" rx="5" fill="#0b1120" stroke="#38bdf8" stroke-opacity="0.3"/>
      <text x="16" y="116" fill="#38bdf8" font-weight="600">Shaparak / Scheme</text>
      <text x="16" y="129" fill="#94a3b8" font-size="8">Central Switch</text>
      <text x="16" y="141" fill="#94a3b8" font-size="8">Card Acquirer</text>
      <text x="16" y="152" fill="#cbd5e1" font-size="7">Budget: 140ms</text>

      <rect x="10" y="170" width="110" height="60" rx="5" fill="#0b1120" stroke="#10b981" stroke-opacity="0.3"/>
      <text x="16" y="186" fill="#10b981" font-weight="600">Issuing Bank</text>
      <text x="16" y="199" fill="#94a3b8" font-size="8">Core Banking Host</text>
      <text x="16" y="211" fill="#94a3b8" font-size="8">Account Balance</text>
      <text x="16" y="222" fill="#10b981" font-size="8">0210 Auth Approved</text>
    </g>

    <!-- Conduit 4 -> 5 -->
    <path d="M 630 140 L 650 140" fill="none" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#fa-arrow-cyan-sw)"/>

    <!-- Node 5: Settlement & Egress -->
    <g transform="translate(655, 75)">
      <rect width="115" height="245" rx="8" fill="#111827" fill-opacity="0.8" stroke="#ffffff" stroke-opacity="0.1"/>
      <rect width="115" height="26" rx="8" fill="#ffffff" fill-opacity="0.03"/>
      <text x="10" y="17" fill="#e2c974" font-weight="700">05. SETTLE</text>
      
      <rect x="10" y="38" width="95" height="52" rx="5" fill="#0b1120" stroke="#10b981" stroke-opacity="0.3"/>
      <text x="15" y="53" fill="#10b981" font-weight="600">Double-Entry</text>
      <text x="15" y="66" fill="#94a3b8" font-size="8">Append Fact</text>
      <text x="15" y="78" fill="#cbd5e1" font-size="8">ScyllaDB Log</text>

      <rect x="10" y="100" width="95" height="60" rx="5" fill="#0b1120" stroke="#06b6d4" stroke-opacity="0.3"/>
      <text x="15" y="116" fill="#06b6d4" font-weight="600">Paya / Satna</text>
      <text x="15" y="129" fill="#94a3b8" font-size="8">Batch Settlement</text>
      <text x="15" y="141" fill="#94a3b8" font-size="8">T+1 Clearing</text>
      <text x="15" y="152" fill="#cbd5e1" font-size="7">Budget: 35ms</text>

      <rect x="10" y="170" width="95" height="60" rx="5" fill="#0b1120" stroke="#ffffff" stroke-opacity="0.08"/>
      <text x="15" y="186" fill="#f8fafc" font-weight="600">Egress Pack</text>
      <text x="15" y="199" fill="#94a3b8" font-size="8">JSON Response</text>
      <text x="15" y="211" fill="#10b981" font-size="8">HTTP 200 OK</text>
      <text x="15" y="222" fill="#cbd5e1" font-size="7">Budget: 15ms</text>
    </g>

    <!-- Bottom Latency Budget Timeline Bar -->
    <g transform="translate(30, 340)">
      <rect width="740" height="28" rx="6" fill="#111827" stroke="#ffffff" stroke-opacity="0.1"/>
      
      <!-- Segment 1: Ingress (25ms) -->
      <rect x="0" y="0" width="74" height="28" rx="6" fill="#06b6d4" fill-opacity="0.15"/>
      <text x="8" y="18" fill="#38bdf8" font-size="8" font-weight="600">Ingress 25ms</text>
      
      <!-- Segment 2: Risk/Lock (35ms) -->
      <rect x="74" y="0" width="103" height="28" fill="#e2c974" fill-opacity="0.15"/>
      <text x="82" y="18" fill="#e2c974" font-size="8" font-weight="600">Risk/Lock 35ms</text>
      
      <!-- Segment 3: Host Auth (140ms) -->
      <rect x="177" y="0" width="414" height="28" fill="#38bdf8" fill-opacity="0.2"/>
      <text x="320" y="18" fill="#f8fafc" font-size="9" font-weight="700">Bank Host Authorization: 140ms</text>
      
      <!-- Segment 4: Settle Commit (35ms) -->
      <rect x="591" y="0" width="104" height="28" fill="#10b981" fill-opacity="0.15"/>
      <text x="599" y="18" fill="#10b981" font-size="8" font-weight="600">DB Settle 35ms</text>
      
      <!-- Segment 5: Egress (15ms) -->
      <rect x="695" y="0" width="45" height="28" rx="6" fill="#ffffff" fill-opacity="0.1"/>
      <text x="700" y="18" fill="#cbd5e1" font-size="8" font-weight="600">15ms</text>
    </g>

    <!-- Footer Summary -->
    <g transform="translate(30, 385)">
      <text x="0" y="5" fill="#94a3b8" font-size="9">TOTAL ROUNDTRIP LATENCY BUDGET: 250 MS SLA</text>
      <text x="495" y="5" fill="#06b6d4" font-size="9" font-weight="600">DETERMINISTIC ISO 8583 BITMAP ROUTING</text>
    </g>
  </svg>
</div>

---

## ۰۵. حالت‌های خرابی و تاب‌آوری عملیاتی

- **پایان مهلت پاسخ میزبان بانکی:** اگر بانک پذیرنده بالادست ظرف ۱۵ ثانیه پاسخ ندهد، سوئیچ به‌صورت خودکار پیام برگشت ISO 8583 با شناسه نوع پیام MTI 0400 تولید می‌کند تا رفع مسدودی وجه کارت کاربر را تضمین کند.
- **مدیریت عمر قفل:** عمر قفل توزیع‌شده Redis باید از طولانی‌ترین بازه تلاش مجدد بانکی، یعنی ۸۶٬۴۰۰ ثانیه، بیشتر باشد تا تلاش‌های تکراری دیرهنگام را پوشش دهد.
