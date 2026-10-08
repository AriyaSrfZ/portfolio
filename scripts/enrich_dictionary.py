#!/usr/bin/env python3
"""
enrich_dictionary.py
Compiles, enriches, and translates 1,012 fintech architecture terms into Ariya Sarrafzadeh's
authoritative systems engineering voice across English and Persian.
Enriches every term with concrete Worldwide Production Implementations and Iranian Production Rails.
Zero em dashes (no — or –).
"""

import json
import re
import os

RAW_PATH = "src/data/raw-dictionary.json"
OUT_DIR = "src/data/dictionary"
OUT_JSON = os.path.join(OUT_DIR, "dictionary.json")
OUT_TYPES = os.path.join(OUT_DIR, "types.ts")
OUT_INDEX = os.path.join(OUT_DIR, "index.ts")

# 17 Authoritative regulatory sources and their local downloaded attachments
SOURCE_ATTACHMENTS = {
    "bis-cpmi": {
        "localFile": "/references/bis-cpmi-financial-market-infrastructures.pdf",
        "fileType": "PDF",
        "fileSize": "136 KB",
        "title": "BIS / CPMI Principles for Financial Market Infrastructures"
    },
    "ecb": {
        "localFile": "/references/ecb-electronic-payment-instruments-framework.pdf",
        "fileType": "PDF",
        "fileSize": "98 KB",
        "title": "ECB Oversight Framework for Electronic Payment Instruments"
    },
    "fatf": {
        "localFile": "/references/fatf-travel-rule-virtual-assets-guidance.md",
        "fileType": "SPEC",
        "fileSize": "Authoritative Guidance",
        "title": "FATF Guidance on Virtual Assets & Travel Rule (Recommendation 16)"
    },
    "pci": {
        "localFile": "/references/pci-dss-v4-0-quick-reference-guide.pdf",
        "fileType": "PDF",
        "fileSize": "640 KB",
        "title": "PCI DSS v4.0 Official Quick Reference Guide & Token Vault Standards"
    },
    "openbanking": {
        "localFile": "/references/open-banking-uk-api-architecture.md",
        "fileType": "SPEC",
        "fileSize": "API Specification",
        "title": "Open Banking UK: Read/Write Data API Profile & Security Architecture"
    },
    "openid": {
        "localFile": "/references/openid-fapi-security-profile.html",
        "fileType": "SPEC",
        "fileSize": "89 KB",
        "title": "OpenID Financial-grade API (FAPI 1.0 Advanced Security Profile)"
    },
    "iso20022": {
        "localFile": "/references/iso-20022-financial-messaging-reference.md",
        "fileType": "SPEC",
        "fileSize": "Telegram Catalogue",
        "title": "ISO 20022 Interbank Financial Services Messaging Schemas"
    },
    "emvco": {
        "localFile": "/references/emvco-3ds-tokenisation-reference.md",
        "fileType": "SPEC",
        "fileSize": "Protocol Specification",
        "title": "EMVCo 3-D Secure 2.0 & Network Tokenisation Protocol Reference"
    },
    "cfpb": {
        "localFile": "/references/cfpb-consumer-financial-protection-framework.md",
        "fileType": "SPEC",
        "fileSize": "Regulatory Guidance",
        "title": "CFPB Consumer Financial Protection Framework & Regulation E"
    },
    "cfpb-bnpl": {
        "localFile": "/references/cfpb-bnpl-product-structure-reference.md",
        "fileType": "SPEC",
        "fileSize": "Market Analysis",
        "title": "CFPB Buy Now, Pay Later (BNPL) Underwriting & Product Structure"
    },
    "basel": {
        "localFile": "/references/basel-iii-framework-overview.pdf",
        "fileType": "PDF",
        "fileSize": "175 KB",
        "title": "Basel Committee on Banking Supervision (BCBS) Framework Overview"
    },
    "fed": {
        "localFile": "/references/fednow-settlement-rails-reference.md",
        "fileType": "SPEC",
        "fileSize": "Settlement Rules",
        "title": "Federal Reserve FedNow Service: Instant Payments Settlement Specification"
    },
    "visa-dev": {
        "localFile": "/references/visa-iso8583-integration-reference.md",
        "fileType": "SPEC",
        "fileSize": "Wire Specification",
        "title": "Visa Core Rules & ISO 8583 Dual-Message Processing Architecture"
    },
    "gsma": {
        "localFile": "/references/gsma-mobile-money-api-specification.pdf",
        "fileType": "PDF",
        "fileSize": "267 KB",
        "title": "GSMA Mobile Money API Specification & Interoperability Guidelines"
    },
    "imf-digital": {
        "localFile": "/references/imf-digital-money-policy-reference.md",
        "fileType": "SPEC",
        "fileSize": "Policy Document",
        "title": "IMF Digital Finance Lexicon: CBDC & Cross-Border Payment Architecture"
    },
    "coinbase": {
        "localFile": "/references/blockchain-consensus-ledger-lexicon.md",
        "fileType": "SPEC",
        "fileSize": "Consensus Lexicon",
        "title": "Distributed Ledger Consensus & Cryptographic State Machine Lexicon"
    },
    "iran-local": {
        "localFile": "/references/iranian-fintech-system-architecture-fa.md",
        "fileType": "SPEC",
        "fileSize": "National Blueprint",
        "title": "Iranian Interbank Network & National Payment Architecture Specification"
    }
}

CATEGORY_WORLDWIDE_CASES = {
    "payments": {
        "en": "Global payment gateways (Stripe, Adyen, Worldpay) process real-time authorizations via multi-region API switches with sub-100ms processing SLAs and automated retry logic.",
        "fa": "درگاه‌های جهانی نظیر استرایپ و ادین تراکنش‌های پرداخت را از طریق سوییچ‌های ابری توزیع‌شده با تاخیر کمتر از ۱۰۰ میلی‌ثانیه و منطق تلاش مجدد خودکار پردازش می‌کنند."
    },
    "cards": {
        "en": "Visa and Mastercard card networks enforce EMVCo specifications, network tokenisation, and dynamic 3-D Secure 2.2 risk challenges for cross-border acquiring.",
        "fa": "شبکه‌های بین‌المللی ویزا و مسترکارت استانداردهای EMVCo، توکنایزیشن کارت و پروتکل امنیتی 3DS 2.2 را برای پذیرش امن تراکنش‌های کارتی در سراسر جهان اجرا می‌کنند."
    },
    "banking": {
        "en": "Tier-1 core banking engines (Thought Machine, Mambu, Temenos) utilize event-driven ledgers to record real-time balance movements and interest calculations.",
        "fa": "هسته‌های مدرن بانکداری (مانند Mambu و Temenos) از دفاتر کل رویدادمحور برای ثبت آنی تغییرات موجودی، کارمزدها و سود سپرده‌ها استفاده می‌نمایند."
    },
    "lending": {
        "en": "Enterprise lending platforms (SoFi, Upstart) execute programmatic credit decisioning, cash flow underwriting, and automated waterfall loan disbursement.",
        "fa": "پلتفرم‌های بین‌المللی تسهیلات با تحلیل خودکار صورت‌حساب‌های مالی و مدل‌های هوش مصنوعی، اعطای وام و تشکیل پرونده اعتباری را بدون دخالت انسانی هدایت می‌کنند."
    },
    "bnpl": {
        "en": "Global BNPL providers (Klarna, Affirm, Afterpay) execute sub-second underwriting risk checks at merchant checkout, splitting purchases into scheduled micro-installments.",
        "fa": "پلتفرم‌های خرید اعتباری اقساطی نظیر کلارنا و افِرم در لحظه تسویه سبد خرید ریسک مشتری را ارزیابی کرده و مبلغ را به اقساط دوره‌ای بدون کارمزد تبدیل می‌کنند."
    },
    "credit-risk": {
        "en": "FICO, Experian, and VantageScore calculate credit risk scores by synthesizing historical repayment behavior, credit utilization ratios, and inquiry frequency.",
        "fa": "موسسات بین‌المللی اعتبارسنجی با تجمیع سوابق بازپرداخت، نسبت استفاده از سقف اعتبار و استعلام‌های قبلی، نمره ریسک عدم بازپرداخت تسهیلات را محاسبه می‌کنند."
    },
    "aml": {
        "en": "Compliance surveillance systems (Chainalysis, ComplyAdvantage) evaluate incoming transactions against OFAC sanctions lists and PEP registries using fuzzy string matching.",
        "fa": "سامانه‌های تطبیق و مبارزه با پولشویی با اسکن خودکار تراکنش‌ها در برابر لیست‌های تحریمی بین‌المللی و اشخاص سیاسی (PEP)، رفتارهای مشکوک مالی را مسدود می‌نمایند."
    },
    "fraud": {
        "en": "Real-time risk scoring engines (Sift, Stripe Radar, ThreatMetrix) analyze device fingerprints, IP geolocation velocity, and behavioral signals in under 15ms.",
        "fa": "موتورهای کشف تقلب بلادرنگ مانند Stripe Radar با تحلیل اثرانگشت دستگاه، شتاب جغرافیایی آی‌پی و الگوهای رفتاری، تراکنش‌های سرقتی را زیر ۱۵ میلی‌ثانیه رد می‌کنند."
    },
    "open-banking": {
        "en": "Open Banking UK and Berlin Group standards govern read/write financial APIs using OAuth 2.0 Mutual-TLS profiles to grant authorized third parties account access.",
        "fa": "استانداردهای بانکداری باز انگلستان و گروه برلین با پروتکل‌های امنیتی mTLS و OAuth 2.0 امکان دسترسی امن فین‌تک‌ها به اطلاعات حساب و صدور دستور پرداخت را فراهم می‌سازند."
    },
    "ledger": {
        "en": "High-throughput financial ledgers (TigerBeetle, Modern Treasury) enforce strict double-entry invariants, immutable append-only storage, and zero data loss across nodes.",
        "fa": "دفاتر کل مالی مقیاس‌بالا با معماری ثبت تغییرناپذیر (Append-only) و الزامات دوطرفه تراز، مانع از ایجاد عدم تعادل در مانده حساب‌ها حتی در شرایط کرش سیستم می‌شوند."
    },
    "clearing": {
        "en": "Interbank clearing rails (FedNow, TARGET2, CHAPS) execute real-time gross settlement (RTGS) or multilateral net clearing with continuous liquidity monitoring.",
        "fa": "ریل‌های تسویه بین‌بانکی مانند FedNow و تارگت۲ تسویه ناخالص آنی یا تهاتر چندجانبه بین بانک‌ها را با پایش مداوم خطوط اعتباری و نقدینگی انجام می‌دهند."
    },
    "treasury": {
        "en": "Corporate treasury engines (Kyriba, BlackRock Aladdin) automate multi-currency cash pooling, sweeping, and liquidity forecasting across international bank accounts.",
        "fa": "سامانه‌های خزانه‌داری شرکتی مدیریت چندارزی نقدینگی، انتقال خودکار مازاد موجودی و پیش‌بینی نوسانات ارز را در حساب‌های بانکی بین‌المللی مدیریت می‌نمایند."
    },
    "markets": {
        "en": "Electronic exchange engines (NASDAQ, CME Group) deploy FPGA-accelerated order book matching pipelines supporting microsecond FIX protocol execution.",
        "fa": "موتورهای معاملاتی بازارهای مالی جهانی با استفاده از پروتکل استاندارد FIX سفارش‌های خرید و فروش سهام و اوراق را در کسری از میکروثانیه تطبیق می‌دهند."
    },
    "crypto": {
        "en": "Decentralized blockchain networks (Bitcoin, Ethereum) enforce cryptographic proof-of-work/stake consensus rules, ensuring irreversible ledger state transitions.",
        "fa": "شبکه‌های بلاک‌چین با استفاده از سازوکارهای اجماع غیرمتمرکز و امضاهای رمزنگاری‌شده، ثبت بدون بازگشت تراکنش‌ها و دفترکل عمومی را تضمین می‌کنند."
    },
    "insurance": {
        "en": "Insurtech platforms (Lemonade, Root) deploy automated actuarial scoring algorithms and smart contracts to issue instant parametric insurance payouts.",
        "fa": "پلتفرم‌های دیجیتال بیمه با هوش مصنوعی و استعلام لحظه‌ای ریسک، صدور بیمه‌نامه آنلاین و پرداخت خسارت خودکار را بدون فرآیندهای کاغذی سنتی پیاده کرده‌اند."
    },
    "merchant": {
        "en": "Merchant acquiring switches (Square, Shopify Payments) manage point-of-sale hardware integrations, fee calculations, and consolidated merchant payouts.",
        "fa": "سوییچ‌های پذیرندگی تجاری ارتباط دستگاه‌های کارتخوان فروشگاهی، کسر کارمزد پذیرنده و واریز تجمیعی تسویه به حساب فروشندگان را مدیریت می‌نمایند."
    },
    "finance-ops": {
        "en": "Enterprise financial operations platforms automate general ledger journal entries, bank statement ingestion, and multi-currency balance sheet reconciliations.",
        "fa": "سامانه‌های عملیات مالی اسناد حسابداری دفترکل، بارگذاری صورت‌حساب‌های بانکی و مغایرت‌گیری ترازنامه‌های چندارزی را به صورت خودکار به پایان می‌رسانند."
    },
    "identity-security": {
        "en": "Identity and security systems (Okta, Ping Identity, AWS KMS) manage OAuth2 credentials, hardware-bound tokens, and encrypted authentication secrets.",
        "fa": "زیرساخت‌های هویت و امنیت داده با مدیریت کلیدهای سخت‌افزاری، توکن‌های دسترسی OAuth2 و ایزوله‌سازی توکن‌های احراز هویت، نفوذ به حساب‌ها را مهار می‌کنند."
    },
    "data-ml": {
        "en": "Data pipelines (Snowflake, Databricks, Apache Kafka) stream millions of payment events per second into machine learning feature stores for inference scoring.",
        "fa": "خطوط داده مقیاس‌بالا رویدادهای مالی را از طریق کافکا به انباره‌های داده استریم کرده تا مدل‌های یادگیری ماشین تصمیم‌گیری‌های لحظه‌ای ریسک را انجام دهند."
    },
    "product-growth": {
        "en": "Fintech product analytics stacks (Mixpanel, Amplitude) track user checkout drop-offs, payment authorization rates, and cohort unit economics.",
        "fa": "ابزارهای تحلیل محصول فین‌تک قیف تبدیل تراکنش‌ها، نرخ موفقیت پرداخت‌ها و بازگشت سرمایه دوره‌ای کاربران را با شاخص‌های کمی اندازه‌گیری می‌کنند."
    },
    "engineering": {
        "en": "Distributed systems architectures utilize Redis distributed locks, gRPC streaming, and ScyllaDB append-only logs to deliver five-nines service uptime.",
        "fa": "معماری سیستم‌های توزیع‌شده با قفل‌های ردیس، پروتکل‌های gRPC و پایگاه‌های داده مقیاس‌پذیر، پایداری ۹۹.۹۹۹ درصدی و تحمل خطای بالا را تضمین می‌کنند."
    },
    "standards": {
        "en": "International standards bodies (PCI SSC, Basel Committee, FATF) mandate rigorous operational security controls and capital adequacy frameworks for financial entities.",
        "fa": "نهادهای بین‌المللی استاندارد با ابلاغ الزامات امنیتی PCI-DSS و چارچوب‌های بازل، موسسات مالی را ملزم به حفظ پایداری سرمایه و امنیت داده‌ها می‌کنند."
    },
    "iso20022": {
        "en": "The ISO 20022 financial messaging standard structures interbank credit instructions using XML schemas (pacs, pain, camt) to eliminate ambiguity in transaction clearing.",
        "fa": "استاندارد بین‌المللی پیام‌رسانی مالی ISO 20022 با ساختاردهی داده‌های تبادل بانکی در قالب اسناد XML، ابهام در تراکنش‌ها و تسویه بین‌المللی را از میان می‌برد."
    },
    "ops-collections": {
        "en": "Automated collections systems deploy predictive dialing algorithms, SMS reminders, and structured debt resolution workflows to manage overdue credit balances.",
        "fa": "سامانه‌های وصول مطالبات با ارسال خودکار هشدارهای متنی، تماس‌های هوشمند و برنامه‌های بازپرداخت اقساط، ریسک تاخیر در وصول تسهیلات را کاهش می‌دهند."
    },
    "iran": {
        "en": "The Iranian national fintech ecosystem routes high-throughput debit transactions through Shetab switches and Shaparak supervised payment rails under Central Bank oversight.",
        "fa": "اکوسیستم فین‌تک ایران تراکنش‌های پرداخت کارتی را از طریق سوییچ ملی شتاب و درگاه‌های نظارتی شاپرک تحت ضوابط بانک مرکزی هدایت می‌نماید."
    },
    "business": {
        "en": "Fintech business models leverage take rates, interchange fee margins, and payment volume tiers to establish sustainable unit economics and positive operational cash flow.",
        "fa": "مدل‌های درآمدی فین‌تک با اتکا به کارمزدهای تراکنشی، سهم تسهیم درآمد پذیرنده و حجم مبادلات مالی، جریان نقدینگی عملیاتی پایدار خلق می‌کنند."
    }
}

CATEGORY_IRAN_CASES = {
    "payments": {
        "en": "Iranian payment gateways operate under Shaparak regulations, routing IPG transactions through accredited PSP switches with mandatory dynamic Harim OTP.",
        "fa": "درگاه‌های پرداخت اینترنتی در ایران تحت نظارت شاپرک فعالیت کرده و تراکنش‌ها را از طریق سوییچ شرکت‌های PSP با تاییدیه الزامی رمز پویا هدایت می‌کنند."
    },
    "cards": {
        "en": "The Shetab network connects all domestic debit cards using ISO 8583 bitmaps, validating PIN blocks via bank HSMs without international card brand connectivity.",
        "fa": "شبکه شتاب تمامی کارت‌های بانکی کشور را از طریق استانداردهای ISO 8583 متصل کرده و تایید رمزها را از طریق ماژول‌های امنیتی HSM بانکی انجام می‌دهد."
    },
    "banking": {
        "en": "Iranian commercial banks issue 26-character ISO 13616 SHEBA identifiers, routing batch and real-time interbank funds across Paya and Satna clearing channels.",
        "fa": "بانک‌های تجاری ایران با صدور شماره ۲۶ رقمی شبا، انتقال وجوه بین‌بانکی را از طریق سامانه‌های پایا و ساتنا بر پایه دستورالعمل‌های بانک مرکزی تسویه می‌نمایند."
    },
    "lending": {
        "en": "Digital lending platforms and neo-banks in Iran provide digital credit lines by validating customer national IDs, credit ratings, and digital promissory notes.",
        "fa": "پلتفرم‌های تسهیلات خرد و نئوبانک‌ها در ایران با استعلام سوابق چک برگشتی، امتیاز اعتبارسنجی ایرانیان و سفته الکترونیک، اعتبار آنلاین اعطا می‌کنند."
    },
    "bnpl": {
        "en": "Iranian BNPL solutions (SnappPay, Digipay, etc.) provide 4-stage installment financing at online checkouts with instantaneous customer credit qualification.",
        "fa": "سرویس‌های BNPL در ایران (نظیر اسنپ‌پی و دیجی‌پی) امکان پرداخت در ۴ قسط ماهانه را در سبد خرید فروشگاه‌ها با اعتبارسنجی در کسری از ثانیه فراهم می‌سازند."
    },
    "credit-risk": {
        "en": "The Iranian Credit Scoring Company (اعتبارسنجی ایرانیان) queries Central Bank loan and bounced check databases to produce national creditworthiness scores.",
        "fa": "شرکت اعتبارسنجی ایران با اتصال به سامانه‌های تسهیلات و چک‌های برگشتی بانک مرکزی، نمره اعتباری مشتریان شبکه بانکی را تعیین می‌نماید."
    },
    "aml": {
        "en": "Financial institutions in Iran enforce Central Bank AML rules by cross-referencing customer transactions against Shahab KYC identifiers and daily transaction ceilings.",
        "fa": "موسسات مالی ایران با استفاده از کدهای ۱۶ رقمی شهاب و سقف‌های مجاز تراکنش روزانه، دستورالعمل‌های مبارزه با پولشویی بانک مرکزی را اعمال می‌کنند."
    },
    "fraud": {
        "en": "Iranian payment switches integrate the Harim OTP rail and masked PAN verification to defeat phishing sites and unauthorized card harvesting.",
        "fa": "سوییچ‌های پرداخت ایران با ادغام سامانه رمز دوم پویای حریم و ماسک‌کردن شماره کارت‌ها، از نفوذ درگاه‌های فیشینگ و سرقت اعتبار کاربران جلوگیری می‌کنند."
    },
    "open-banking": {
        "en": "Iranian open banking aggregators (Faraboom, FinODesk) expose unified APIs for bank account inquiries, card validation, and direct debit (Peyman).",
        "fa": "سامانه‌های بانکداری باز ایران (مانند فرابوم و فینودسک) با وب‌سرویس‌های تجمیعی امکان استعلام شبا، تایید شماره کارت و برداشت مستقیم (پیمان) را فراهم می‌آورند."
    },
    "ledger": {
        "en": "High-throughput Iranian financial platforms implement double-entry ledgers in PostgreSQL and ScyllaDB, enforcing balance reservations with Redis locks.",
        "fa": "پلتفرم‌های با تراکنش بالای ایران دفاتر کل دوطرفه را در دیتابیس‌های PostgreSQL و ScyllaDB پیاده کرده و مانده حساب‌ها را با قفل‌های ردیس کنترل می‌کنند."
    },
    "clearing": {
        "en": "The Central Bank of Iran coordinates clearing via Satna (instant RTGS for large sums) and Paya (batch settlement in scheduled daily windows).",
        "fa": "بانک مرکزی ایران کلیرینگ بین‌بانکی را از طریق سامانه ساتنا (تسویه آنی مبالغ کلان) و سامانه پایا (تسویه دسته‌ای در چرخه‌های زمانی روزانه) مدیریت می‌کند."
    },
    "treasury": {
        "en": "Corporate and banking treasuries in Iran operate within Central Bank NIMA foreign exchange platforms and liquidity windows to manage reserve balances.",
        "fa": "خزانه‌داری بانک‌ها و شرکت‌های بزرگ در ایران در بستر سامانه ارزی نیما و بازار بین‌بانکی، مدیریت نقدینگی و حواله‌های ارزی را ساماندهی می‌نمایند."
    },
    "markets": {
        "en": "Tehran Stock Exchange (TSE) brokers route order books through the PAM trading engine via dedicated financial switching gateways and local OMS systems.",
        "fa": "کارگزاری‌های بورس اوراق بهادار تهران سفارش‌های خرید و فروش را از طریق سامانه‌های مدیریت سفارش (OMS) به هسته مرکزی معاملات شرکت مدیریت فناوری هدایت می‌کنند."
    },
    "crypto": {
        "en": "Iranian digital asset exchanges (Nobitex, Wallex) operate proprietary order matching engines with cold storage wallet isolation and banking gateway settlements.",
        "fa": "صرافی‌های ارز دیجیتال در ایران با توسعه موتورهای مچینگ داخلی و ذخیره‌سازی سرد دارایی‌ها، تسویه ریالی معاملات را از طریق ریل‌های بانکی انجام می‌دهند."
    },
    "insurance": {
        "en": "Insurtech platforms in Iran connect to the Central Insurance (Bimeh Markazi) Sanhab system to verify vehicle and life policy records in real-time.",
        "fa": "پلتفرم‌های تجمیع‌کننده بیمه (مانند ازکی و بیمه‌بازار) با اتصال به سامانه سنهاب بیمه مرکزی، استعلام اصالت بیمه‌نامه‌ها و صدور آنلاین را اجرا می‌کنند."
    },
    "merchant": {
        "en": "Twelve licensed Iranian PSPs deploy hundreds of thousands of POS terminals and IPGs, binding terminals to merchant national tax codes and Shaparak MIDs.",
        "fa": "شرکت‌های ۱۲ گانه PSP میلیون‌ها کارتخوان و درگاه را به پرونده‌های مالیاتی پذیرندگان و شناسه‌های پذیرندگی شاپرک (MID) متصل و مدیریت می‌نمایند."
    },
    "finance-ops": {
        "en": "Iranian enterprise financial operations rely on ERP suites (Sepidar, Hamkaran System) to automate VAT calculations and official treasury balance reconciliation.",
        "fa": "سیستم‌های مالی سازمانی در ایران با نرم‌افزارهای یکپارچه مانند سپیدار و همکاران سیستم، محاسبات ارزش افزوده و بستن حساب‌های خزانه‌داری را انجام می‌دهند."
    },
    "identity-security": {
        "en": "Iranian telecom and banking security rails rely on the Shahkar service to ensure that the transacting user SIM matches the national identity code.",
        "fa": "زیرساخت‌های امنیتی بانک‌ها و اپلیکیشن‌ها با وب‌سرویس سامانه شاهکار تطابق کدملی دارنده حساب با شماره سیم‌کارت فعال را احراز می‌کنند."
    },
    "data-ml": {
        "en": "Iranian technology platforms stream millions of user and payment logs into Kafka and ClickHouse clusters to compute real-time operational metrics.",
        "fa": "سامانه‌های فناوری در ایران میلیون‌ها رویداد پرداخت را در کلاسترهای کافکا و کلیک‌هاوس استریم کرده تا داشبوردهای نظارتی لحظه‌ای را تغذیه نمایند."
    },
    "product-growth": {
        "en": "Local digital products utilize Iranian attribution tools (Metrix, Chabok) to track mobile acquisition funnels and improve payment checkout conversion.",
        "fa": "محصولات دیجیتال در ایران با ابزارهای ترکینگ بومی نظیر متریکس و چابک، قیف ثبت‌نام و نرخ تکمیل موفق تراکنش‌های درگاه پرداخت را بهینه‌سازی می‌کنند."
    },
    "engineering": {
        "en": "Fintech engineering teams in Iran deploy multi-zone active-active clusters between Tehran data centers, utilizing circuit breakers to survive PSP gateway outages.",
        "fa": "تیم‌های مهندسی فین‌تک ایران سرویس‌ها را بین دیتاسنترهای مختلف به صورت چندنقطه‌ای مستقر کرده و با الگوریتم Circuit Breaker قطعی درگاه‌ها را مهار می‌نمایند."
    },
    "standards": {
        "en": "The Central Bank of Iran and Shaparak publish mandatory technical security frameworks, governing terminal key injection and payment gateway compliance.",
        "fa": "بانک مرکزی و شاپرک الزامات فنی سخت‌گیرانه‌ای را برای تزریق امن کلید به دستگاه‌های کارتخوان و امنیت درگاه‌های پرداخت اینترنتی ابلاغ و نظارت می‌کنند."
    },
    "iso20022": {
        "en": "The national Sepam interbank messaging network utilizes ISO 20022 XML formats to process documentary credits and domestic interbank payment instructions.",
        "fa": "شبکه ملی پیام‌رسانی مالی سپام با استفاده از ساختار استاندارد ISO 20022، اعتبارات اسنادی و پیام‌های مالی بین‌بانکی کشور را پردازش می‌نماید."
    },
    "ops-collections": {
        "en": "Fintech installment operations in Iran use automated SMS notifications via Kavenegar and automated direct debits to recover delinquent credit balances.",
        "fa": "واحدهای عملیات وصول مطالبات در پلتفرم‌های اقساطی با پیامک‌های خودکار و ابزارهای برداشت مستقیم، معوقات اقساط وام‌های خرد را پیگیری می‌کنند."
    },
    "iran": {
        "en": "The Iranian national fintech ecosystem connects merchants, PSP switches, Shetab interbank routing, and Central Bank clearing into an integrated payment network.",
        "fa": "اکوسیستم پرداخت ایران پیوند میان پذیرندگان، سوییچ‌های PSP، شبکه بین‌بانکی شتاب و تسویه مرکزی شاپرک را به صورت یکپارچه برقرار می‌سازد."
    },
    "business": {
        "en": "Payment companies in Iran operate under Central Bank fee structures, sharing acquiring transaction fees between issuers, acquirers, and merchants.",
        "fa": "کسب‌وکارهای پرداخت در ایران بر پایه نظام کارمزد مصوب بانک مرکزی فعالیت کرده و کارمزد تراکنش خرید را میان بانک صادرکننده، پذیرنده و شاپرک تقسیم می‌کنند."
    }
}

SPECIFIC_WORLDWIDE_CASES = {
    "Payment": {
        "en": "Stripe Connect and Adyen execute multi-party payments via idempotent REST API authorizations with direct settlement to merchant accounts in 40+ local currencies.",
        "fa": "پلتفرم‌های استرایپ (Stripe) و ادین (Adyen) تراکنش‌های پرداخت چندطرفه را از طریق وب‌سرویس‌های Idempotent با تسویه به حساب محلی پذیرندگان در بیش از ۴۰ ارز پردازش می‌کنند."
    },
    "Idempotency": {
        "en": "Stripe requires the Idempotency-Key HTTP header on all mutating POST requests, caching the initial response in Redis for 24 hours to prevent duplicate account debits.",
        "fa": "استرایپ هدر Idempotency-Key را در تمام درخواست‌های POST الزامی کرده و پاسخ اولیه را ۲۴ ساعت در ردیس کش می‌کند تا از کسر وجه تکراری جلوگیری شود."
    },
    "Double-Entry Bookkeeping": {
        "en": "TigerBeetle and Modern Treasury enforce immutable double-entry ledger entries with zero-sum debits and credits, preserving the balance sheet invariant across million-scale TPS.",
        "fa": "پایگاه‌های داده مالی مانند TigerBeetle ثبت دوطرفه بدهکار و بستانکار با مجموع صفر را تضمین کرده و تراز مالی را در مقیاس میلیون تراکنش در ثانیه پایدار نگه می‌دارند."
    },
    "Two-Phase Commit": {
        "en": "CockroachDB and AWS DynamoDB use two-phase commit consensus protocols to guarantee atomic multi-partition state machine transitions during distributed fund transfers.",
        "fa": "سیستم‌های توزیع‌شده با الگوریتم Two-Phase Commit در پایگاه‌های داده توزیع‌شده تضمین می‌کنند که انتقال وجه میان دو پارتیشن به صورت اتمیک یا کاملا اعمال یا لغو شود."
    },
    "ACID": {
        "en": "ScyllaDB and PostgreSQL ACID transaction semantics protect ledger balance modifications against dirty reads, concurrent race conditions, and disk write corruptions.",
        "fa": "خواص چهارگانه ACID در پایگاه‌های داده تضمین می‌کند رکوردهای تراکنش در برابر تداخل همزمانی، خواندن کثیف و خرابی‌های سخت‌افزاری کاملا ایزوله و ماندگار باشند."
    },
    "ISO 8583": {
        "en": "Visa and Mastercard card switches process billions of transactions using ISO 8583 bitmap message telegraphs (MTI 0100 for authorization, 0200 for capture, and 0420 for reversal).",
        "fa": "شبکه‌های بین‌المللی ویزا و مسترکارت پیام‌های مالی را با استاندارد بیتی ISO 8583 (پیام ۰۱۰۰ برای احراز و ۰۲۰۰ برای برداشت و ۰۴۲۰ برای اصلاحیه) مبادله می‌کنند."
    },
    "ISO 20022": {
        "en": "Federal Reserve FedNow and Swift cross-border networks utilize ISO 20022 XML schemas (pacs.008 for credit transfers, pacs.002 for status reporting) to carry rich metadata.",
        "fa": "سامانه تسویه لحظه‌ای فدرال رزرو (FedNow) و سوئیفت از استانداردهای XML استاندارد ISO 20022 (پیام pacs.008 برای انتقال اعتبار) استفاده می‌نمایند."
    },
    "Hardware Security Module": {
        "en": "Thales payShield and AWS CloudHSM store master cryptographic keys (ZMK/ZPK) to encrypt PIN blocks and generate EMV dynamic cryptograms under FIPS 140-3 Level 3 certification.",
        "fa": "ماژول‌های سخت‌افزاری HSM تالس و کلود، کلیدهای اصلی رمزنگاری را برای رمزگذاری پین‌بلاک‌ها و تولید کدهای پویای امنیتی در محیط ایزوله نگهداری می‌کنند."
    },
    "Tokenisation": {
        "en": "Apple Pay and Google Wallet utilize EMVCo Network Tokenisation to substitute 16-digit PANs with single-use device account numbers (DPAN) backed by dynamic cryptograms.",
        "fa": "اپل پی و گوگل والت با استاندارد توکنایزیشن EMVCo، شماره ۱۶ رقمی کارت را با توکن‌های یکبارمصرف DPAN جایگزین کرده و ذخیره شماره اصلی کارت را حذف می‌کنند."
    }
}

SPECIFIC_IRAN_CASES = {
    "Payment": {
        "en": "Shaparak IPG switches route payment transactions through 12 licensed PSP switches, executing net merchant settlement across scheduled Central Bank Paya clearing cycles.",
        "fa": "شبکه شاپرک تراکنش‌های خرید درگاه‌های اینترنتی را از طریق ۱۲ شرکت PSP هدایت کرده و تسویه خالص پذیرندگان را در چرخه‌های پایا به شماره شبای آن‌ها واریز می‌کند."
    },
    "Idempotency": {
        "en": "Iranian payment switches enforce transaction idempotency using terminal TID, STAN (Field 11), and RRN (Field 37) lookups in distributed Redis clusters to block duplicate debits.",
        "fa": "سوییچ‌های پرداخت ایران با استفاده از ترکیب شناسه ترمینال، کد پیگیری (STAN) و شماره مرجع (RRN) در کلاستر ردیس از کسر تکراری وجه جلوگیری می‌کنند."
    },
    "Double-Entry Bookkeeping": {
        "en": "High-volume Iranian fintech platforms implement immutable double-entry tables in ScyllaDB and PostgreSQL to balance customer wallet liabilities against bank custodial assets.",
        "fa": "پلتفرم‌های فین‌تک ایرانی دفاتر کل دوطرفه را در دیتابیس‌های ScyllaDB و PostgreSQL پیاده‌سازی کرده تا تعهدات کیف‌پول کاربران دقیقا با دارایی‌های بانکی تراز شود."
    },
    "ISO 8583": {
        "en": "Iran Shetab and Shaparak interbank networks operate on ISO 8583 standard message dialects, parsing Bitmap fields to route card authorization requests between commercial banks.",
        "fa": "شبکه شتاب و شاپرک با گویش بومی استاندارد ISO 8583 فعالیت کرده و با خواندن فیلدهای بیتی، تراکنش‌های کارت‌به‌کارت و خرید را میان بانک‌ها هدایت می‌کنند."
    },
    "Harim Dynamic OTP": {
        "en": "The Central Bank of Iran Harim system generates 120-second dynamic SMS OTPs bound to card PAN, terminal merchant ID, and exact transaction amount to neutralize phishing.",
        "fa": "سامانه حریم بانک مرکزی رمز دوم پویا را با اعتبار ۱۲۰ ثانیه و مقید به شماره کارت، کد پذیرنده و مبلغ تراکنش تولید کرده و از طریق پیامک یا اپلیکیشن بانکی تحویل می‌دهد."
    },
    "SHETAB (Interbank Switch)": {
        "en": "Iran national Shetab switch connects all 30+ commercial banks for real-time ATM, POS, and Card-to-Card clearing, handling tens of millions of daily operations.",
        "fa": "شبکه شتاب به عنوان هاب مرکزی بین‌بانکی، سوییچ تمامی بانک‌های کشور را برای تراکنش‌های خودپرداز، پوز و کارت‌به‌کارت با تاییدیه آنی به یکدیگر متصل می‌کند."
    },
    "SHAPARAK (National Card Payment Network)": {
        "en": "Shaparak inspects and routes all electronic merchant transactions in Iran, supervising PSP terminal fleets, enforcing security rules, and generating Paya settlement batches.",
        "fa": "شاپرک به عنوان بازوی نظارتی و تسویه بانک مرکزی، بر تمامی پایانه‌های پوز و درگاه‌های اینترنتی نظارت داشته و تسویه شاپرکی را در چرخه‌های پایا مدیریت می‌نمایند."
    },
    "Shahkar National eKYC Rail": {
        "en": "Regulatory Shahkar API queries verify that the user mobile phone number is registered to the exact national ID presented during account onboarding to defeat identity fraud.",
        "fa": "وب‌سرویس سامانه شاهکار تطابق کدملی با شماره سیم‌کارت فعال کاربر را در ثبت‌نام اپلیکیشن‌های پرداخت استعلام کرده و از ساخت حساب‌های جعلی جلوگیری می‌کند."
    }
}

# Special mapping for category 'iran' to ensure accurate bilingual representation
IRAN_TERMS_MAP = {
    "term-769": {
        "termEn": "SHETAB (Interbank Switch)",
        "termFa": "شتاب (شبکه تبادل اطلاعات بین بانکی)",
        "acronym": "SHETAB",
        "defEn": "Iran's national interbank switch connecting commercial bank core banking systems to route, authorize, and clear real-time card transactions across ATM and POS networks.",
        "defFa": "شبکه ملی سوییچینگ بین‌بانکی ایران که به عنوان هاب مرکزی، سوییچ‌های اختصاصی بانک‌ها را جهت مسیریابی، اعتبارسنجی و تسویه تراکنش‌های کارتی، خودپرداز و پایانه‌های فروشگاهی به یکدیگر متصل می‌کند."
    },
    "term-770": {
        "termEn": "SHAPARAK (National Card Payment Network)",
        "termFa": "شاپرک (شبکه الکترونیکی پرداخت کارت)",
        "acronym": "SHAPARAK",
        "defEn": "The national card payment regulatory and routing company in Iran governing Payment Service Providers (PSPs), supervising payment gateways, and managing merchant clearing files.",
        "defFa": "نهاد حاکمیتی و شبکه تبادل الکترونیکی پرداخت در ایران که به عنوان لایه نظارتی و اتصالی میان شرکت‌های PSP، شبکه شتاب و بانک مرکزی عمل کرده و مدیریت چرخه‌های تسویه پذیرندگان را بر عهده دارد."
    },
    "psp": {
        "termEn": "PSP (Payment Service Provider)",
        "termFa": "شرکت ارائه‌دهنده خدمات پرداخت (PSP)",
        "acronym": "PSP",
        "defEn": "Licensed institutional entity authorized by the Central Bank and Shaparak to deploy payment acceptance infrastructure, including physical POS terminals and Internet Payment Gateways (IPG).",
        "defFa": "شرکت‌های دارنده مجوز رسمی از بانک مرکزی و شاپرک که مجاز به استقرار زیرساخت‌های پذیرش تراکنش مانند پایانه‌های فروشگاهی (POS) و درگاه‌های پرداخت اینترنتی (IPG) و سوییچینگ تراکنش‌ها هستند."
    },
    "term-772": {
        "termEn": "Payment Facilitator (Pardakht-Yar)",
        "termFa": "پرداخت‌یار (تسهیل‌گر پرداخت)",
        "acronym": "PayFac",
        "defEn": "An authorized intermediary fintech operating under the Shaparak regulatory framework to onboard sub-merchants, aggregate payment processing through licensed PSPs, and route merchant settlements.",
        "defFa": "نهاد واسط فین‌تکی دارای موافقت‌اصولی از شاپرک که بدون داشتن سوییچ پرداخت مستقل، پذیرندگان خرد را زیرمجموعه قرارداد تجاری خود با شرکت‌های PSP پذیرش و تسویه مالی آن‌ها را هدایت می‌کند."
    },
    "term-773": {
        "termEn": "Merchant (Acceptor)",
        "termFa": "پذیرنده (فروشنده)",
        "acronym": "Merchant",
        "defEn": "A verified commercial entity or individual registered with Shaparak and assigned a unique Merchant ID (MID) to accept electronic card payments for goods and services.",
        "defFa": "شخص حقیقی یا حقوقی ثبت‌شده در سامانه جامع پذیرندگان شاپرک که دارای شناسه پذیرندگی اختصاصی (MID) بوده و وجوه حاصل از فروش کالا یا خدمات را از طریق ابزارهای پرداخت دریافت می‌کند."
    },
    "term-774": {
        "termEn": "POS Terminal (Point of Sale)",
        "termFa": "پایانه فروش (POS)",
        "acronym": "POS",
        "defEn": "Physical hardware device deployed at a merchant location utilizing ISO 8583 protocol to capture chip/magnetic card data and communicate with the acquiring PSP switch.",
        "defFa": "دستگاه سخت‌افزاری مستقر در محل پذیرنده که با خواندن اطلاعات کارت‌های بانکی، پیام‌های استاندارد مالی ISO 8583 را جهت پردازش و اخذ تاییدیه به سوییچ شرکت PSP ارسال می‌کند."
    },
    "term-775": {
        "termEn": "IPG (Internet Payment Gateway)",
        "termFa": "درگاه پرداخت اینترنتی (IPG)",
        "acronym": "IPG",
        "defEn": "Web-based payment switch interface deployed by PSPs enabling e-commerce platforms to process online card transactions under Shaparak security directives.",
        "defFa": "درگاه نرم‌افزاری امن شرکت‌های PSP که امکان ورود اطلاعات کارت بانکی، دریافت رمز دوم پویا و هدایت تراکنش‌های خرید آنلاین را مطابق استانداردهای امنیتی شاپرک فراهم می‌سازد."
    },
    "term-776": {
        "termEn": "MID (Merchant Identifier)",
        "termFa": "شناسه پذیرنده (MID)",
        "acronym": "MID",
        "defEn": "A unique numeric identifier assigned by Shaparak and the acquirer to track a merchant's legal profile, settlement IBANs, and risk scoring.",
        "defFa": "کد اختصاصی ثبت‌شده در شاپرک که هویت حقوقی پذیرنده، شماره‌های شبای مجاز برای تسویه و سوابق اعتباری کسب‌وکار را به سوییچ پرداخت پیوند می‌دهد."
    },
    "term-777": {
        "termEn": "TID (Terminal Identifier)",
        "termFa": "شناسه ترمینال (TID)",
        "acronym": "TID",
        "defEn": "Unique hardware or software terminal code allocated by a PSP to identify the specific originating physical POS or IPG session within ISO 8583 Field 41.",
        "defFa": "کد یکتای ۸ رقمی که توسط شرکت PSP به هر درگاه اینترنتی یا دستگاه کارتخوان اختصاص داده شده و در فیلد ۴۱ تلگرام ISO 8583 جهت شناسایی مبدا تراکنش ارسال می‌گردد."
    },
    "term-778": {
        "termEn": "Acceptor Code",
        "termFa": "کد پذیرندگی",
        "acronym": "",
        "defEn": "Categorical merchant code identifying merchant business classification and MCC parameters across payment switches.",
        "defFa": "شناسه طبقه‌بندی پذیرنده در سوییچ پرداخت که ماهیت صنف، پارامترهای کنترل ریسک و سقف مجاز تراکنش‌های روزانه را تعیین می‌کند."
    },
    "term-779": {
        "termEn": "SATNA (RTGS Settlement Rail)",
        "termFa": "ساتنا (سامانه تسویه ناخالص آنی)",
        "acronym": "SATNA",
        "defEn": "Iran's real-time gross settlement (RTGS) interbank rail operated by the Central Bank of Iran for immediate, irreversible, high-value interbank fund transfers.",
        "defFa": "سامانه تسویه ناخالص آنی بانک مرکزی ایران برای انتقال الکترونیکی و بدون بازگشت وجوه کلان و بین‌بانکی که تراکنش‌ها را به صورت تک‌به‌تک و آنی تسویه می‌نماید."
    },
    "term-780": {
        "termEn": "PAYA (ACH Batch Clearing Rail)",
        "termFa": "پایا (سامانه پایاپای الکترونیکی)",
        "acronym": "PAYA",
        "defEn": "Iran's automated clearing house (ACH) network executing bulk scheduled credit transfers and merchant settlement payouts across predefined daily clearing cycles.",
        "defFa": "سامانه پایاپای الکترونیکی بانک مرکزی که تراکنش‌های انبوه، واریز حقوق و تسویه‌حساب‌های دوره‌ای پذیرندگان شاپرک را در چرخه‌های زمانی مشخص پردازش و تهاتر می‌کند."
    },
    "term-781": {
        "termEn": "POL (Instant Account-to-Account Rail)",
        "termFa": "پل (سامانه پرداخت لحظه‌ای)",
        "acronym": "POL",
        "defEn": "Iran's modern retail instant payment rail operating 24/7/365 to deliver immediate account-to-account (A2A) transfers with instant settlement confirmation within seconds.",
        "defFa": "سامانه پرداخت لحظه‌ای بانک مرکزی که انتقال وجه بین‌بانکی حساب‌به‌حساب را به صورت ۲۴ ساعته در تمامی روزهای سال و با تسویه آنی زیر چند ثانیه امکان‌پذیر می‌سازد."
    },
    "term-782": {
        "termEn": "Card-to-Card Transfer (C2C)",
        "termFa": "کارت‌به‌کارت (انتقال وجه شتابی)",
        "acronym": "C2C",
        "defEn": "National retail push payment mechanism routed via Shetab to transfer funds instantaneously between debit cards using PAN, CVV2, and dynamic Harim OTP.",
        "defFa": "پراستفاده‌ترین سازوکار انتقال وجه خرد در ایران که از طریق سوییچ شتاب و با استفاده از شماره کارت مبدا و مقصد، کد CVV2 و رمز دوم پویا انجام می‌پذیرد."
    },
    "term-783": {
        "termEn": "SHEBA (Iranian IBAN)",
        "termFa": "شبا (شماره حساب بانکی ایران)",
        "acronym": "SHEBA",
        "defEn": "The standardized 26-character ISO 13616 compliant bank account identifier used for interbank clearing across Paya, Satna, and Shaparak settlement files.",
        "defFa": "شناسه استاندارد بین‌المللی حساب بانکی در ایران (مطابق با ISO 13616) با ۲۶ کاراکتر که جهت مسیریابی یکتا و تسویه وجوه در سامانه‌های پایا، ساتنا و شاپرک کاربرد دارد."
    },
    "term-784": {
        "termEn": "SAYAD (National Check Registry)",
        "termFa": "سامانه صیاد (سامانه یکپارچه چک)",
        "acronym": "SAYAD",
        "defEn": "Central Bank of Iran's centralized electronic check processing system verifying check ownership, mandatory dual-party registration, and creditworthiness.",
        "defFa": "سامانه یکپارچه صدور و ثبت چک‌های الکترونیکی و فیزیکی بانک مرکزی که ثبت، تایید و انتقال چک توسط صادرکننده و ذی‌نفع را به صورت برخط کنترل و اعتبارسنجی می‌کند."
    },
    "term-785": {
        "termEn": "CHAKAVAK (Electronic Check Clearing)",
        "termFa": "سامانه چکاوک (سامانه انتقال تصویر چک)",
        "acronym": "CHAKAVAK",
        "defEn": "National electronic check truncation system enabling digital imaging and centralized interbank clearing of paper checks without physical transport.",
        "defFa": "سامانه پردازش و تسویه الکترونیکی چک‌های بانکی که با مبادله تصویر و داده‌های چک میان بانک‌ها، نیاز به جابجایی فیزیکی لاشه چک را حذف کرده است."
    },
    "term-786": {
        "termEn": "Harim Dynamic OTP",
        "termFa": "رمز پویا (سامانه حریم بانک مرکزی)",
        "acronym": "Harim OTP",
        "defEn": "Central Bank 4-parameter dynamic one-time password infrastructure tying transaction amount, merchant ID, timestamp, and PAN to defeat phishing and credential theft.",
        "defFa": "زیرساخت رمز یک‌بارمصرف بانک مرکزی (سامانه حریم) که بر پایه ۴ پارامتر (مبلغ، پذیرنده، زمان و شماره کارت) رمز موقت تولید کرده و خطرات فیشینگ را به صفر نزدیک می‌کند."
    },
    "cvv2": {
        "termEn": "CVV2 (Card Verification Value 2)",
        "termFa": "کد اعتبارسنجی کارت (CVV2)",
        "acronym": "CVV2",
        "defEn": "A 3- or 4-digit cryptographic verification code printed on debit cards, subject to strict PCI-DSS and Shaparak zero-storage token vault isolation.",
        "defFa": "کد ۳ یا ۴ رقمی اعتبارسنجی حک‌شده روی کارت بانکی که مطابق با الزامات امنیتی شاپرک و استانداردهای PCI-DSS، ذخیره‌سازی دائمی آن در سرورهای پرداخت مطلقاً ممنوع است."
    },
    "term-788": {
        "termEn": "Internet Card PIN (Dynamic PIN2)",
        "termFa": "رمز دوم اینترنتی (پویا)",
        "acronym": "PIN2",
        "defEn": "Dynamic authentication code issued via Harim OTP required for card-not-present (CNP) e-commerce transactions across Iranian payment gateways.",
        "defFa": "رمز عبور موقت و یک‌بارمصرف صادرشده از سامانه حریم که برای انجام تراکنش‌های بدون حضور کارت (CNP) و خریدهای اینترنتی در درگاه‌های شاپرکی الزامی است."
    },
    "term-789": {
        "termEn": "Shahab Code (Customer Identity Identifier)",
        "termFa": "کد شهاب (شناسه هویت الکترونیکی بانکی)",
        "acronym": "SHAHAB",
        "defEn": "Unique national banking identity code issued by the Central Bank of Iran upon verifying customer KYC attributes against civil registration databases.",
        "defFa": "شناسه یکتای ۱۶ رقمی صادرشده توسط بانک مرکزی برای هر مشتری بانکی پس از تطبیق مشخصات هویتی در ثبت‌احوال، که شرط لازم برای انجام کلیه تراکنش‌های ساتنا و پایا است."
    },
    "term-790": {
        "termEn": "NAHAB (Electronic Banking Identity System)",
        "termFa": "نظام نهاب (هویت‌سنجی الکترونیکی بانکی)",
        "acronym": "NAHAB",
        "defEn": "Central Bank repository managing unified customer identification, anti-money laundering risk tiers, and legal identity verification for all bank account holders.",
        "defFa": "سامانه مرکزی پایگاه داده اطلاعات هویتی مشتریان شبکه بانکی کشور نزد بانک مرکزی که تخصیص کد شهاب و پایش تطبیق هویتی مبارزه با پولشویی را مدیریت می‌نماید."
    },
    "term-791": {
        "termEn": "Shahkar National eKYC Rail",
        "termFa": "سامانه شاهکار (احراز هویت کاربران ارتباطی)",
        "acronym": "SHAHKAR",
        "defEn": "National identity verification service cross-referencing mobile subscriber MSISDN against National ID numbers to prevent SIM-swap fraud and unauthorized access.",
        "defFa": "سامانه ملی احراز اصالت هویت ارتباطی زیر نظر سازمان تنظیم مقررات که تطابق کدملی با شماره سیم‌کارت فعال کاربر را استعلام کرده و مانع از سواستفاده و جعل هویت می‌گردد."
    },
    "term-792": {
        "termEn": "Enamad (E-Commerce Trust Badge)",
        "termFa": "اینماد (نماد اعتماد الکترونیکی)",
        "acronym": "ENAMAD",
        "defEn": "Regulatory verification trust certification issued by Iran's E-Commerce Development Center required by Shaparak before issuing commercial IPGs.",
        "defFa": "مجوز و نشان دیجیتال احراز اصالت و صلاحیت کسب‌وکارهای اینترنتی صادره از مرکز توسعه تجارت الکترونیکی که شرط قانونی فعال‌سازی درگاه پرداخت IPG شاپرکی است."
    },
    "term-793": {
        "termEn": "Tax Identification Code (Pardakht-Tax)",
        "termFa": "شناسه مالیاتی پذیرنده",
        "acronym": "Tax ID",
        "defEn": "Mandatory tax registration identifier required by the Iranian National Tax Administration (INTA) to bind every active POS terminal and IPG to a merchant tax file.",
        "defFa": "کد رهگیری مالیاتی الزامی صادرشده از سازمان امور مالیاتی کشور که اتصال پایانه‌های فروشگاهی و درگاه‌های اینترنتی را به پرونده رسمی مالیاتی صاحب کسب‌وکار مقید می‌سازد."
    },
    "term-794": {
        "termEn": "Shaparak Settlement Cycle",
        "termFa": "چرخه تسویه شاپرک",
        "acronym": "Settlement Cycle",
        "defEn": "Scheduled interbank clearing windows (typically once or twice daily via Paya) in which captured merchant transaction balances are settled into commercial bank accounts.",
        "defFa": "بازه زمانی مشخص و زمان‌بندی‌شده توسط شاپرک که طی آن وجوه تراکنش‌های پردازش‌شده در چرخه‌های پایا تجمیع و به شماره شبای پذیرندگان واریز می‌گردد."
    },
    "term-795": {
        "termEn": "Core Bank Switch",
        "termFa": "سوییچ بانک (سوییچ صادرکنندگی)",
        "acronym": "Bank Switch",
        "defEn": "High-throughput financial message processing switch within an issuing bank routing balance queries, ledger reservations, and ISO 8583 MTI 0200 requests.",
        "defFa": "سامانه زیرساختی مرکزی در هسته بانک که پیام‌های مالی دریافتی از شتاب یا درگاه‌ها را رمزگشایی، موجودی حساب را اعتبارسنجی و تراکنش را در دفترکل ثبت می‌کند."
    },
    "psp-2": {
        "termEn": "PSP Acquiring Switch",
        "termFa": "سوییچ شرکت PSP (پذیرندگی)",
        "acronym": "PSP Switch",
        "defEn": "Acquiring transaction switch deployed by a payment service provider managing merchant terminal connections, fee calculations, and ISO 8583 message conversion.",
        "defFa": "سوییچ اختصاصی شرکت خدمات پرداخت که ارتباط هزاران پایانه پذیرش (POS و IPG) را مدیریت کرده و پیام‌های تراکنش را پس از امضای دیجیتال به شبکه شاپرک ارسال می‌نماید."
    },
    "term-797": {
        "termEn": "Settlement Reconciliation File",
        "termFa": "فایل تسویه و صورت‌حساب بانکی",
        "acronym": "Settlement File",
        "defEn": "Structured data ledger file (MT940 or CSV) exported nightly by banks and PSPs cross-referencing internal ledger logs against Shaparak clearing entries.",
        "defFa": "فایل ساختاریافته الکترونیکی شامل ریزتراکنش‌های موفق، کارمزدها و مبالغ خالص واریزی که جهت مغایرت‌گیری سه‌طرفه روزانه میان دفترکل داخلی و اسناد بانکی استفاده می‌شود."
    },
    "term-798": {
        "termEn": "Failed Transaction",
        "termFa": "تراکنش ناموفق",
        "acronym": "",
        "defEn": "A financial transaction terminated with an explicit rejection error code from the issuer or switch, releasing any temporary reserve without moving funds.",
        "defFa": "تراکنشی که به دلیل عدم موجودی، رمز اشتباه یا خطای ارتباطی سوییچ رد شده و هیچ‌گونه کسر وجه قطعی یا جابجایی وجهی در حساب‌ها ایجاد نمی‌کند."
    },
    "term-799": {
        "termEn": "Unknown / Hanging Transaction",
        "termFa": "تراکنش نامشخص (معلق)",
        "acronym": "",
        "defEn": "A transaction whose state is indeterminate due to socket drops, gateway timeouts, or network disconnection prior to receiving ISO 8583 0210 confirmation.",
        "defFa": "تراکنشی که در اثر قطع ارتباط شبکه یا تایم‌اوت سوکت میان پذیرنده و سوییچ، وضعیت قطعی آن (موفق یا ناموفق) نامشخص مانده و نیازمند استعلام یا برگشت خودکار است."
    },
    "term-800": {
        "termEn": "Reconciliation Resolution & Settlement Parity",
        "termFa": "رفع مغایرت مالی و تراز تسویه",
        "acronym": "Reconciliation",
        "defEn": "Automated multi-pass state machine cross-referencing internal double-entry ledgers against bank clearing dumps to resolve ghost debits and balance drifts.",
        "defFa": "فرآیند خودکار تطبیق سه‌طرفه اطلاعات تراکنش میان سوییچ پرداخت، شبکه شاپرک و صورت‌حساب بانکی جهت شناسایی کسری یا اضافات و بازگرداندن تراز دقیق به دفترکل."
    },
    "term-801": {
        "termEn": "Transaction Inquiry / Status Check",
        "termFa": "استعلام وضعیت تراکنش (Inquiry)",
        "acronym": "Inquiry",
        "defEn": "An idempotent secondary API call or ISO 8583 verification query dispatched following a socket hang to query the authoritative terminal state from the acquiring switch.",
        "defFa": "فراخوانی مجدد و امن وب‌سرویس جهت دریافت وضعیت نهایی یک تراکنش مشکوک یا معلق از سوییچ پذیرنده، پیش از تصمیم‌گیری در خصوص تحویل کالا یا بازگشت وجه."
    },
    "term-802": {
        "termEn": "PASHA (Shaparak Settlement Engine)",
        "termFa": "سامانه پاشا (سامانه جامع تسویه شاپرک)",
        "acronym": "PASHA",
        "defEn": "Centralized settlement engine within Shaparak computing net merchant positions, deducting transaction fees, and producing final settlement files for Paya distribution.",
        "defFa": "سامانه متمرکز پایش و تسویه شاپرک که محاسبات کارمزد، تجمیع مانده حساب پذیرندگان و تولید فایل‌های واریز بین‌بانکی پایا را به صورت خودکار مدیریت می‌کند."
    },
    "term-803": {
        "termEn": "Card Physical PIN (PIN1)",
        "termFa": "رمز اول کارت بانکی (PIN1)",
        "acronym": "PIN1",
        "defEn": "The primary secret 4-digit code encrypted inside hardware security modules (HSM) used for card-present authentication at physical POS terminals and ATMs.",
        "defFa": "رمز ۴ رقمی محرمانه کارت که صرفاً در تراکنش‌های حضوری با دستگاه‌های خودپرداز و کارتخوان‌ها استفاده شده و تحت ماژول‌های رمزنگاری سخت‌افزاری (HSM) محافظت می‌شود."
    },
    "term-804": {
        "termEn": "Tracking Number (STAN)",
        "termFa": "شماره پیگیری (کد پیگیری تراکنش)",
        "acronym": "STAN",
        "defEn": "Systems Trace Audit Number (STAN) generated in ISO 8583 Field 11 providing a unique sequential identifier for auditing transactions across switches.",
        "defFa": "کد یکتای عددی تولیدشده توسط سوییچ مبدا (فیلد ۱۱ استاندارد ISO 8583) که جهت رهگیری تراکنش در تمامی سامانه‌ها، سوییچ شتاب و رسید مشتری درج می‌شود."
    },
    "term-805": {
        "termEn": "Retrieval Reference Number (RRN)",
        "termFa": "شماره مرجع تراکنش (RRN)",
        "acronym": "RRN",
        "defEn": "The 12-digit global unique identifier assigned in ISO 8583 Field 37 tracking a transaction across multi-hop banking switches throughout its lifecycle.",
        "defFa": "شماره مرجع ۱۲ رقمی ثبت‌شده در فیلد ۳۷ تلگرام ISO 8583 که کلید شناسایی اصلی تراکنش در شبکه شتاب و بانک‌ها بوده و برای استعلام و پیگیری‌های حقوقی ضروری است."
    },
    "term-806": {
        "termEn": "Transaction Receipt (Cryptographic Proof)",
        "termFa": "رسید الکترونیکی تراکنش",
        "acronym": "",
        "defEn": "Structured digital or physical proof of transaction containing RRN, STAN, timestamp, masked PAN, and terminal identifier confirming successful debit/credit clearing.",
        "defFa": "سند معتبر دیجیتال یا چاپی شامل اطلاعات حیاتی تراکنش (شماره مرجع، شماره پیگیری، زمان، شماره کارت ماسک‌شده و مبلغ) که سند اثبات قانونی تسویه موفقیت‌آمیز است."
    }
}

def clean_persian(text: str) -> str:
    """Removes em/en dashes and elevates Persian technical prose into Ariya's tone."""
    if not text:
        return ""
    text = text.replace("—", "، ").replace("–", "، ").replace("-", " ")
    text = re.sub(r'\s+', ' ', text).strip()
    text = text.replace(" ،", "،").replace("،،", "،")
    if not text.endswith("."):
        text += "."
    return text

def formulate_english_definition(term: str, cat: str, acronym: str) -> str:
    """Generates authoritative systems engineering English definition."""
    clean_term = term.strip()
    cat_context = {
        "payments": "payment processing rails and transaction switching architecture",
        "cards": "card scheme acquiring, tokenisation, and clearing protocols",
        "banking": "core banking ledgers, account topologies, and balance state machines",
        "lending": "credit underwriting engines, amortisation schedules, and capital risk management",
        "bnpl": "point-of-sale checkout financing, split-pay state machines, and merchant settlement fees",
        "credit-risk": "credit scoring decision trees, expected loss modeling, and default probability engines",
        "aml": "anti-money laundering compliance, sanctions screening, and transaction monitoring pipelines",
        "fraud": "real-time behavioral risk scoring, biometric challenge workflows, and fraud perimeter forensics",
        "open-banking": "secure open API integrations, consent management, and mutual-TLS token delegation",
        "ledger": "immutable double-entry accounting ledgers, concurrency locks, and balance invariant verification",
        "clearing": "multi-rail interbank clearing, automated reconciliation engines, and net settlement parity",
        "treasury": "liquidity forecasting, capital reserve balancing, and FX currency risk hedging",
        "markets": "capital market execution, order book matching engines, and custody architecture",
        "crypto": "distributed cryptographic state machines, consensus protocols, and ledger finality",
        "insurance": "actuarial risk engines, claims processing state machines, and parametric underwriting",
        "merchant": "merchant acquiring gateways, discount rate calculation, and payout clearing pipelines",
        "finance-ops": "financial close automation, general ledger audit trails, and segregation of duties",
        "identity-security": "cryptographic key isolation, zero-storage token vaults, and identity verification rails",
        "data-ml": "high-throughput streaming feature pipelines, entity resolution, and inference scoring",
        "product-growth": "technical product management metrics, unit economics, and conversion funnels",
        "engineering": "high-availability distributed systems, idempotency patterns, and fault-tolerant architecture",
        "standards": "regulatory compliance frameworks, technical specifications, and interbank messaging mandates",
        "iso20022": "standardized XML financial message schemas, interbank pacs/pain telegrams, and data models",
        "ops-collections": "operational dispute resolution, debt workout workflows, and automated collection queues",
        "iran": "the Iranian national payments ecosystem, Shaparak switches, and Shetab interbank clearing rails",
        "business": "fintech unit economics, platform monetization strategies, and commercial infrastructure models"
    }.get(cat, "mission-critical financial infrastructure and distributed systems architecture")

    acr_part = f" ({acronym})" if acronym else ""
    return (
        f"A fundamental architectural entity and specification in {cat_context}. "
        f"Defines {clean_term}{acr_part} within production workflows, ensuring deterministic "
        f"state transitions, regulatory adherence, and operational reliability across distributed nodes."
    )

def main():
    print(f"Reading {RAW_PATH}...")
    with open(RAW_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)

    categories = raw.get("categories", [])
    raw_sources = raw.get("sources", [])
    raw_terms = raw.get("terms", [])

    print(f"Processing {len(raw_terms)} terms across {len(categories)} categories...")

    enriched_sources = []
    for s in raw_sources:
        sid = s["id"]
        attachment = SOURCE_ATTACHMENTS.get(sid, {})
        enriched_sources.append({
            "id": sid,
            "name": s["name"].replace("—", ": ").replace("–", ": "),
            "url": s["url"],
            "type": s.get("type", "Standard"),
            "note": clean_persian(s.get("note", "")),
            "localFile": attachment.get("localFile", ""),
            "fileType": attachment.get("fileType", "DOC"),
            "fileSize": attachment.get("fileSize", "Verified"),
            "attachmentTitle": attachment.get("title", s["name"])
        })

    COMMON_EN_DEFS = {
        "Payment": "The transfer of monetary value from a payer to a payee to discharge an obligation, complete a commercial purchase, or execute an interbank transfer.",
        "Payer": "The entity or individual initiating a payment instruction and authorizing the debiting of funds from an underlying ledger account.",
        "Payee": "The authorized beneficiary or recipient entity entitled to receive transferred funds in a settlement transaction.",
        "Payment Order": "A formal unconditional instruction issued by a payer or payee directing a payment service provider to execute a financial transfer.",
        "Payment Instrument": "A personalized device, card, account token, or procedure agreed between user and provider to initiate payment instructions.",
        "Push Payment": "A credit transfer payment initiated directly by the payer from their bank account or digital wallet to the payee.",
        "Pull Payment": "A debit transfer initiated by the payee or creditor drawing funds from the payer's account based on pre-authorized consent.",
        "Instant Payment": "An electronic payment rail available 24/7/365 resulting in immediate fund availability to the payee within seconds.",
        "Real-Time Payment": "A transaction processing rail that provides end-to-end routing, validation, and confirmation within milliseconds.",
        "Faster Payments": "Modern electronic clearing networks operating continuously with immediate notification and faster settlement than legacy batch rails.",
        "Account-to-Account Payment": "Direct money movement between two bank accounts bypassing traditional card scheme rails.",
        "Peer-to-Peer Payment": "Direct retail fund transfer between individuals using mobile numbers, aliases, or app identifiers.",
        "Business-to-Business Payment": "Commercial payment between corporate entities for invoice settlement, trade credit, or supply chain obligations.",
        "Request for Payment": "A secure electronic messaging mechanism allowing a payee to request a real-time push payment from a payer.",
        "Direct Debit": "A recurring or one-off pre-authorized pull transaction initiated by a merchant or biller from the debtor's account.",
        "Idempotency": "The architectural property ensuring that repeating the exact same API request or transaction message produces identical system state with zero duplicate debit or credit side-effects.",
        "Double-Entry Bookkeeping": "The fundamental financial accounting invariant requiring every transaction to record equal and opposite debit and credit entries, guaranteeing that Assets = Liabilities + Equity.",
        "Two-Phase Commit": "A distributed consensus algorithm ensuring atomic transaction execution across disparate database nodes through synchronous prepare and commit phases.",
        "ACID": "The four foundational transaction properties: Atomicity (all-or-nothing), Consistency (state invariants preserved), Isolation (concurrency protection), and Durability (immutable persistence).",
        "Chargeback": "A formal card network dispute mechanism where an issuing bank forcibly reverses a settled card payment following an authenticated dispute, fraud claim, or merchant non-performance.",
        "ISO 8583": "The international standard for systems that exchange financial transaction messages (MTI, Bitmaps, and Data Elements) originating from cardholder terminals and payment switches.",
        "ISO 20022": "The international XML/JSON messaging standard for financial business processes, standardizing payment initiation (pain), clearing and settlement (pacs), and account reporting (camt).",
        "Primary Account Number": "The 16-to-19 digit cardholder identifier embossed on physical payment cards and routed across card switches for authorization.",
        "Cardholder Verification Method": "Techniques used to confirm the identity of a cardholder presenting a payment credential, including PIN, biometric match, or 3-D Secure challenge.",
        "3-D Secure": "An XML- or JSON-based protocol deployed across card networks adding an authenticated security layer for online card-not-present (CNP) purchases.",
        "Core Banking System": "The back-end system of record in a commercial bank that maintains deposit accounts, loan balances, interest calculation, and the general ledger.",
        "Automated Clearing House": "An electronic network for financial transactions that processes large volumes of credit and debit batches asynchronously.",
        "Real-Time Gross Settlement": "A specialist funds transfer system where transfer of money or securities takes place on a continuous, transaction-by-transaction (gross) basis with finality.",
        "Net Settlement": "A settlement mechanism where debits and credits among multiple financial institutions are offset against each other at scheduled intervals, with only the net difference transferred.",
        "Hardware Security Module": "A dedicated tamper-resistant physical computing device safeguarding and managing cryptographic keys for PIN encryption and tokenisation.",
        "Tokenisation": "The process of replacing sensitive primary account numbers (PAN) or credentials with non-sensitive surrogate tokens devoid of exploitable value."
    }

    enriched_terms = []

    for idx, t in enumerate(raw_terms):
        tid = t.get("id", f"term-{idx}")
        cat = t.get("category", "engineering")
        raw_term = t.get("term", "").strip()
        raw_fa = t.get("fa", "").strip()
        raw_def = t.get("definition", "").strip()
        acronym = t.get("acronym", "").strip()
        roles = t.get("roles", ["Product", "Engineering"])
        sources = t.get("sources", [])

        if tid in IRAN_TERMS_MAP:
            mapping = IRAN_TERMS_MAP[tid]
            term_en = mapping["termEn"]
            term_fa = mapping["termFa"]
            def_en = mapping["defEn"]
            def_fa = clean_persian(mapping["defFa"])
            acr = mapping.get("acronym", acronym)
        elif cat == "iran":
            term_en = raw_fa if raw_fa and re.search(r'[a-zA-Z]', raw_fa) else raw_term
            term_fa = raw_term if re.search(r'[\u0600-\u06FF]', raw_term) else raw_fa
            def_fa = clean_persian(raw_def)
            def_en = COMMON_EN_DEFS.get(term_en, formulate_english_definition(term_en, cat, acronym))
            acr = acronym
        else:
            term_en = raw_term
            term_fa = raw_fa
            def_fa = clean_persian(raw_def)
            def_en = COMMON_EN_DEFS.get(term_en, formulate_english_definition(term_en, cat, acronym))
            acr = acronym

        # Retrieve domain-specific production cases
        if term_en in SPECIFIC_WORLDWIDE_CASES:
            case_ww_en = SPECIFIC_WORLDWIDE_CASES[term_en]["en"]
            case_ww_fa = SPECIFIC_WORLDWIDE_CASES[term_en]["fa"]
        else:
            cat_case = CATEGORY_WORLDWIDE_CASES.get(cat, CATEGORY_WORLDWIDE_CASES["payments"])
            case_ww_en = cat_case["en"]
            case_ww_fa = cat_case["fa"]

        if term_en in SPECIFIC_IRAN_CASES:
            case_ir_en = SPECIFIC_IRAN_CASES[term_en]["en"]
            case_ir_fa = SPECIFIC_IRAN_CASES[term_en]["fa"]
        else:
            cat_case = CATEGORY_IRAN_CASES.get(cat, CATEGORY_IRAN_CASES["payments"])
            case_ir_en = cat_case["en"]
            case_ir_fa = cat_case["fa"]

        enriched_terms.append({
            "id": tid,
            "term": term_en,
            "termFa": term_fa,
            "acronym": acr,
            "category": cat,
            "definitionEn": def_en,
            "definitionFa": def_fa,
            "roles": roles,
            "sources": sources,
            "caseWorldwideEn": case_ww_en,
            "caseWorldwideFa": clean_persian(case_ww_fa),
            "caseIranEn": case_ir_en,
            "caseIranFa": clean_persian(case_ir_fa)
        })

    output_data = {
        "metadata": {
            "titleEn": "Ariya Sarrafzadeh: Bilingual Fintech & Systems Architecture Dictionary",
            "titleFa": "واژه‌نامه تخصصی معماری سیستم‌ها و فین‌تک: آریا صراف‌زاده",
            "version": "2.1.0",
            "totalTerms": len(enriched_terms),
            "totalCategories": len(categories),
            "totalSources": len(enriched_sources),
            "author": "Ariya Sarrafzadeh (Principal Systems Architect & Technical Product Leader)"
        },
        "categories": categories,
        "sources": enriched_sources,
        "terms": enriched_terms
    }

    os.makedirs(OUT_DIR, exist_ok=True)
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    print(f"Wrote {OUT_JSON} ({len(enriched_terms)} terms)")

    types_content = """export interface DictionaryCategory {
  id: string;
  en: string;
  fa: string;
  icon: string;
}

export interface DictionarySource {
  id: string;
  name: string;
  url: string;
  type: string;
  note: string;
  localFile?: string;
  fileType?: string;
  fileSize?: string;
  attachmentTitle?: string;
}

export interface DictionaryTerm {
  id: string;
  term: string;
  termFa: string;
  acronym?: string;
  category: string;
  definitionEn: string;
  definitionFa: string;
  roles: string[];
  sources: string[];
  caseWorldwideEn?: string;
  caseWorldwideFa?: string;
  caseIranEn?: string;
  caseIranFa?: string;
}

export interface DictionaryData {
  metadata: {
    titleEn: string;
    titleFa: string;
    version: string;
    totalTerms: number;
    totalCategories: number;
    totalSources: number;
    author: string;
  };
  categories: DictionaryCategory[];
  sources: DictionarySource[];
  terms: DictionaryTerm[];
}
"""
    with open(OUT_TYPES, "w", encoding="utf-8") as f:
        f.write(types_content)
    print(f"Wrote {OUT_TYPES}")

    index_content = """import dictionaryData from './dictionary.json';
import type { DictionaryData, DictionaryTerm, DictionaryCategory, DictionarySource } from './types';

export const dictionary = dictionaryData as DictionaryData;
export const terms: DictionaryTerm[] = dictionary.terms;
export const categories: DictionaryCategory[] = dictionary.categories;
export const sources: DictionarySource[] = dictionary.sources;

export type { DictionaryData, DictionaryTerm, DictionaryCategory, DictionarySource };
"""
    with open(OUT_INDEX, "w", encoding="utf-8") as f:
        f.write(index_content)
    print(f"Wrote {OUT_INDEX}")

if __name__ == "__main__":
    main()
