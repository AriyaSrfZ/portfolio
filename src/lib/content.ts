export type Locale = "en" | "fa";

export const LIVE_SITE = "https://ariya-sarrafzadeh.ir";
export const LINKEDIN = "https://www.linkedin.com/in/ariya-sarrafzadeh/";
export const EMAIL = "ariasg2002@gmail.com";
export const CAL_URL = "https://cal.com/ariya-sarrafzadeh/15min";

export type DomainSlug = "payments" | "fraud" | "sms" | "contacts";
export type PaperSlug =
  | "payment-gateway"
  | "fraud-tracing"
  | "sms-infrastructure"
  | "web3-infrastructure";

export const domains: DomainSlug[] = [
  "payments",
  "fraud",
  "sms",
  "contacts",
];

export const papers: {
  slug: PaperSlug;
  dossier: string;
  href:
    | "/papers/payment-gateway"
    | "/papers/fraud-tracing"
    | "/papers/sms-infrastructure"
    | "/papers/web3-infrastructure";
}[] = [
  {
    slug: "payment-gateway",
    dossier: "01",
    href: "/papers/payment-gateway",
  },
  {
    slug: "fraud-tracing",
    dossier: "02",
    href: "/papers/fraud-tracing",
  },
  {
    slug: "sms-infrastructure",
    dossier: "04",
    href: "/papers/sms-infrastructure",
  },
  {
    slug: "web3-infrastructure",
    dossier: "03",
    href: "/papers/web3-infrastructure",
  },
];

type DomainCopy = {
  kicker: string;
  tab: string;
  title: string;
  problem: string;
  approach: string;
  failure: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  steps: { title: string; sub: string }[];
  paperHref?: string;
  paperLabel: string;
};

type PaperCopy = {
  title: string;
  blurb: string;
};

export type Copy = {
  meta: { title: string; description: string };
  proposal: { label: string; live: string; notes: string };
  nav: {
    work: string;
    papers: string;
    process: string;
    book: string;
    cases: string;
    menu: string;
    close: string;
    skip: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    headline: string;
    lead: string;
    primary: string;
    secondary: string;
  };
  proof: { value: string; label: string }[];
  thesis: {
    kicker: string;
    title: string;
    body: string;
    buyersTitle: string;
    buyers: { title: string; body: string }[];
  };
  systems: {
    kicker: string;
    title: string;
    lead: string;
    failureLabel: string;
    domains: Record<DomainSlug, DomainCopy>;
  };
  papersPage: {
    kicker: string;
    title: string;
    lead: string;
    open: string;
    countNote: string;
    items: Record<PaperSlug, PaperCopy>;
    benchKicker: string;
    benchTitle: string;
    benchLead: string;
  };
  process: {
    kicker: string;
    title: string;
    lead: string;
    steps: { n: string; title: string; body: string }[];
  };
  book: {
    kicker: string;
    title: string;
    lead: string;
    bringTitle: string;
    bring: string[];
    cta: string;
    fallback: string;
  };
  footer: {
    line: string;
    location: string;
    rights: string;
  };
  notes: {
    kicker: string;
    title: string;
    lead: string;
    sections: { title: string; body: string }[];
  };
  dataCleaning: {
    kicker: string;
    title: string;
    lead: string;
    s1Title: string;
    s1Body1: string;
    s1Body2: string;
    s2Title: string;
    s2Lead: string;
    s2Items: { title: string; body: string }[];
    s3Title: string;
    s3Body: string;
    s3Steps: string[];
    fig1Caption: string;
    s4Title: string;
    s4Body: string;
    s4Items: { title: string; body: string }[];
    s5Title: string;
    s5Body: string;
    s5Items: { title: string; body: string }[];
    fig2Alt: string;
    fig2Caption: string;
    s6Title: string;
    s6Body: string;
    s7Title: string;
    s7Body: string;
    s8Title: string;
    s8Body: string;
    fig3Alt: string;
    fig3Caption: string;
    s9Title: string;
    s9Items: string[];
    s9Note: string;
  };
  cases: {
    kicker: string;
    title: string;
    lead: string;
    items: {
      id: string;
      title: string;
      context: string;
      constraint: string;
      path: string;
      outcome: string;
    }[];
  };
};

export const copy: Record<Locale, Copy> = {
  en: {
    meta: {
      title: "Ariya Sarrafzadeh | Enterprise Systems Architecture & Telecommunications",
      description:
        "Technical Product Owner and Systems Architect. Payment switches, national SMS routing, and fraud isolation at production scale.",
    },
    proposal: {
      label: "Design proposal for ariya-sarrafzadeh.ir — interactive study, not the live site.",
      live: "Open live site",
      notes: "Why it changed",
    },
    nav: {
      work: "Systems",
      papers: "Whitepapers",
      cases: "Cases",
      process: "Process",
      book: "Dispatch Audit",
      menu: "Menu",
      close: "Close",
      skip: "Skip to content",
    },
    hero: {
      eyebrow: "IR-TEH",
      name: "Ariya Sarrafzadeh",
      role: "Systems Architect & Infrastructure Engineer · Senior Product Manager",
      headline: "Enterprise Systems Architecture & Telecommunications",
      lead: "Leading engineering work across high-throughput financial switches, national telecommunication routing hubs, and forensic fraud architectures. Systems processing billions of messages a year and multi-million-dollar transaction volumes under isolation constraints. ISO 8583 host-to-host, SMPP 3.4 carrier routing, Redis distributed locking, append-only double-entry ledgers.",
      primary: "Inspect blueprints",
      secondary: "Technical whitepapers",
    },
    proof: [
      { value: "15+", label: "Years in production systems" },
      { value: "1B+", label: "SMS routed per year" },
      { value: "50K", label: "Peak transactions / sec" },
      { value: "<50ms", label: "Settlement path SLA" },
    ],
    thesis: {
      kicker: "Scope",
      title: "Payment, telecom, and fraud systems that already run at national scale.",
      body: "Work sits on Iranian PSP and carrier reality: ISO 8583 host-to-host, SMPP 3.4 sessions into Magfa, Rahyab, MCI and Irancell, append-only ledgers, four reverse paths, and fraud scores that have to decide inside a checkout budget. Promo, prepaid, and bill-pay surfaces get their own residual monitors — not the checkout rules copied over.",
      buyersTitle: "Engagement",
      buyers: [
        {
          title: "Payment processors",
          body: "Idempotency, ISO 8583 routing, and ledgers that survive gateway timeouts without double-settlement.",
        },
        {
          title: "MNOs & aggregators",
          body: "SMPP fabrics across Magfa, Rahyab, MCI, and Irancell — UCS-2 segmentation, prefix bands, DND reality.",
        },
        {
          title: "Risk & product leads",
          body: "Fraud pipelines that keep conversion above 98% while shifting 3DS liability, not a rules graveyard.",
        },
        {
          title: "Campaign operators",
          body: "Contact enrichment that kills dead numbers before they hit the SMSC and the invoice.",
        },
      ],
    },
    systems: {
      kicker: "Production systems",
      title: "Four machines. Four failure modes.",
      lead: "Each domain is a distinct path: settlement facts, fraud scores, SMPP sessions, and contact enrichment upstream of the SMSC.",
      failureLabel: "Failure mode",
      domains: {
        payments: {
          kicker: "01  ·  Settlement",
          tab: "Settlement",
          title: "Event-driven payment settlement",
          problem:
            "Under Iranian PSP and Shaparak constraints, a timeout between gateway and host is not an edge case — it is the default failure mode. Mutable request state sharing a row with settlement facts produces double-settle, partial refund, and orphan captures. Refund paths are not one flow: reverse, partial reverse, chargeback handoff, and manual reconciliation each hit different regulatory and ledger rules.",
          approach:
            "Fact versus state. Every financial transition appends a ledger entry; balance is a replay, not an overwritten field. Ingress terminates TLS 1.3, takes an atomic Redis SETNX lock (86400s), then serialises to ISO 8583 for host-to-host. Refund engines are modelled as explicit state machines so the four real reverse paths cannot invent money under isolation constraints.",
          failure:
            "If the host drops after the response is written but before the fact is committed, replay must rebuild the world from the log. Anything else becomes a reconciliation meeting and a chargeback ratio problem.",
          tags: [
            "Sub-50ms SLA",
            "Redis O(1) idempotency",
            "ISO 8583",
            "Four refund paths",
          ],
          metrics: [
            { label: "Idempotency", value: "SETNX · 86400s" },
            { label: "Edge", value: "mTLS / JSON" },
            { label: "Host", value: "ISO 8583 bitmap" },
          ],
          steps: [
            { title: "API ingress", sub: "TLS 1.3 · mTLS JSON" },
            { title: "Idempotency lock", sub: "Redis SETNX · 86400s" },
            { title: "ISO 8583 host", sub: "Bitmap · H2H switch" },
            { title: "Ledger + reverse", sub: "Append-only · 4 refund paths" },
          ],
          paperHref: "/papers/payment-gateway",
          paperLabel: "Open payment dossier",
        },
        fraud: {
          kicker: "02  ·  Risk",
          tab: "Fraud",
          title: "Real-time fraud isolation",
          problem:
            "Cashback, discount, and prepaid product lines (call credit, data packages) are systematically exploited because the happy path was productised and the abuse path was not. Bill-payment flows carry traps almost every provider still ships. Static heuristics catch loud bots and miss coordinated takeovers, promo stacking, and prepaid arbitrage that only shows up in ledger residuals days later.",
          approach:
            "Edge telemetry (device hash, orientation, typing rhythm) scores inside a 15ms budget to a 0.00–1.00 vector. Below 0.30 pass; 0.30–0.75 challenge (3DS 2.0 where liability shift is available); above isolate. Promo and prepaid surfaces get dedicated residual monitors — not the same rules as checkout — so conversion stays above 98% while exploit windows close.",
          failure:
            "A model that cannot explain a hold is a model product will turn off. The graph has to survive the dispute letter and the ops review, not only the live request.",
          tags: [
            "Sub-30ms pipeline",
            "Promo / prepaid residual",
            "<0.5% false positives",
            "Graph tracing",
          ],
          metrics: [
            { label: "Budget", value: "15ms edge" },
            { label: "Pass", value: "< 0.30" },
            { label: "Challenge", value: "0.30 – 0.75" },
          ],
          steps: [
            { title: "Edge telemetry", sub: "Canvas · device hash" },
            { title: "Score + residual", sub: "Checkout · promo · prepaid" },
            { title: "Policy", sub: "Pass / 3DS / isolate" },
            { title: "Forensic graph", sub: "Cluster · dispute trail" },
          ],
          paperHref: "/papers/fraud-tracing",
          paperLabel: "Open fraud dossier",
        },
        sms: {
          kicker: "03  ·  Telecom",
          tab: "SMS",
          title: "National SMS routing switch",
          problem:
            "With RCS and MMS blocked, banking and OTP traffic sits on GSM. Persian UCS-2 is 70 characters a segment (67 concatenated). Naive splitting is a billing event, not a text setting.",
          approach:
            "Stateful SMPP 3.4 sessions into Magfa, Rahyab, MCI, and Irancell. Prefix sharding across 1000/2000/3000/5000/9000 bands, sliding-window throttle, async DLRs, and the *800# DND reality of this market. Capacity claimed: 50K+ TPS burst.",
          failure:
            "A queue that acknowledges before the SMSC does will lie to the bank. Delivery receipts are the source of truth. The switch is a promise tracker.",
          tags: [
            "50K+ TPS",
            "SMPP 3.4",
            "UCS-2 segmentation",
            "*800# DND",
          ],
          metrics: [
            { label: "Encoding", value: "UCS-2 · 70/67" },
            { label: "Bands", value: "1k–9k prefixes" },
            { label: "Carriers", value: "MCI · Irancell" },
          ],
          steps: [
            { title: "Ingress queue", sub: "Kafka / RabbitMQ" },
            { title: "SMPP 3.4 router", sub: "Prefix shard · throttle" },
            { title: "MNO SMSC", sub: "MCI · Irancell direct" },
            { title: "DLR tracker", sub: "Async receipt truth" },
          ],
          paperHref: "/papers/sms-infrastructure",
          paperLabel: "Open SMS dossier",
        },
        contacts: {
          kicker: "04  ·  Data",
          tab: "Contacts",
          title: "National contact enrichment & Persian name resolution",
          problem:
            "Tens of millions of rows, multi-attribute joins, and a row store that collapses before the campaign. Dead numbers still get billed. Persian names arrive with Arabic/Persian letter variants, ZWNJ vs space, inverted order, honorifics and phonetic substitutions.",
          approach:
            "DuckDB on columnar Parquet. PyArrow workers clean, deduplicate and attach operator, province, city and DND before SMPP. Deterministic layers first: character + ZWNJ + honorific normalisation, then phonetic skeleton + sorted-token fingerprint for blocking, then lightweight scoring. Residual pairs only go to embedding models. Storage ~70% smaller; queries an order of magnitude faster.",
          failure:
            "Enrichment after the queue means you pay for a number that will never answer. Linkage belongs upstream of the gateway.",
          tags: [
            "Parquet columnar",
            "DuckDB",
            "Phonetic key",
            "ZWNJ + honorific",
          ],
          metrics: [
            { label: "Store", value: "Parquet · Snappy" },
            { label: "Engine", value: "DuckDB" },
            { label: "Link", value: "Operator · region · DND" },
          ],
          steps: [
            { title: "Raw ingest", sub: "CSV / TSV / tables" },
            { title: "Deterministic clean", sub: "Char · ZWNJ · honorific" },
            { title: "Blocking keys", sub: "Phonetic + sorted fingerprint" },
            { title: "Pre-SMPP gate", sub: "HLR · DND · score" },
          ],
          paperHref: "/data-cleaning",
          paperLabel: "Open name-cleaning blueprint",
        },
      },
    },
    papersPage: {
      kicker: "Specifications",
      title: "High-throughput switches and cryptographic ledgers",
      lead: "Reference specs for payment routing, telecom aggregators, perimeter fraud isolation, and trustless state transitions.",
      open: "Open dossier",
      countNote: "Dossier 01 Payment · 02 Fraud · 03 Web3 · 04 SMS — plus comparative benchmarks.",
      items: {
        "payment-gateway": {
          title: "Payment gateway ecosystem",
          blurb:
            "Transaction lifecycle mechanics, ISO 8583 protocol serializations, Redis distributed locks, Fact vs. State storage patterns, and comparative topology between Shaparak and Stripe. Switch latency budget < 250 ms · Idempotency TTL 86,400 s.",
        },
        "fraud-tracing": {
          title: "Forensic fraud mitigation",
          blurb:
            "Perimeter risk evaluation, heuristic rule filtering, edge-level telemetry, behavioral ML vectors, 3DS 2.0 liability shifts, and chargeback ratio calculations. Edge scoring SLA < 30 ms · Chargeback ceiling 1.0% · False positive cap < 0.5%.",
        },
        "sms-infrastructure": {
          title: "Telecom & SMS infrastructure",
          blurb:
            "National SMPP 3.4 gateway switches, aggregator tiering across Magfa and Rahyab, shortcode prefix taxonomy, DND blacklist filtering, and the architectural fallout of RCS and MMS blocking. Peak national throughput 50,000+ TPS · Persian UCS-2 limit 70/67 chars.",
        },
        "web3-infrastructure": {
          title: "Web3 & crypto infrastructure",
          blurb:
            "Deterministic state machine runtimes, EVM opcode gas calculations, Optimistic versus Zero-Knowledge Layer 2 rollup scaling, cross-chain bridge risks, and TradFi integration models. ZK batch capacity 4,000+ TPS · Challenge window 7 days.",
        },
      },
      benchKicker: "Comparative benchmarks",
      benchTitle: "Throughput capacity & settlement finality",
      benchLead:
        "Peak throughput in TPS and finality latency across traditional card schemes, national switches, telecom routing fabrics, and distributed ledgers — as published on the live suite.",
    },
    process: {
      kicker: "05 // Engagement",
      title: "Architecture review",
      lead: "Bring the failure already on the board. Fifteen minutes is enough to tell whether the work is architecture, operations, or both.",
      steps: [
        {
          n: "01",
          title: "Fifteen minutes",
          body: "You bring the bottleneck: gateway timeout, double-settlement, silent DLR, chargeback spike, or a queue that will not drain. I say whether it is architecture or operations.",
        },
        {
          n: "02",
          title: "Scoped audit",
          body: "Isolation boundary, replay path, SLA, and the specific failure mode. Written against the running system — ISO 8583, SMPP, ledger, or risk pipeline — not a reference model.",
        },
        {
          n: "03",
          title: "Dossier + working session",
          body: "A specification engineering can use. Then a session to walk the cut together.",
        },
      ],
    },
    book: {
      kicker: "05 // Calendar",
      title: "Direct engagement",
      lead: "Architecture assessments, platform audits, and product reviews. Fifteen minutes.",
      bringTitle: "Bring this",
      bring: [
        "The path that breaks: timeout, duplicate, silent DLR, chargeback.",
        "Volume: TPS, daily messages, or settlement window.",
        "What you already tried, in one sentence.",
      ],
      cta: "Open calendar",
      fallback: "Cal.com · no account required.",
    },
    footer: {
      line: "All systems operational",
      location: "Tehran",
      rights: "© 2026 Ariya Sarrafzadeh",
    },
    notes: {
      kicker: "Design notes",
      title: "What was wrong, and what this study changes.",
      lead: "Observed 15 September 2026 against the live Astro site. This is a product critique, not a coat of paint.",
      sections: [
        {
          title: "The costume was doing more work than the proof",
          body: "SPEC-ID, AUTH LEVEL-5, NODE ACTIVE, IR-TEH MESH, scanlines, hatch, and rivets on every panel read as a HUD skin. A director of product selling audits to processors and MNOs needs gravitas, not a classified-ops roleplay. The industrial palette and the protocols are the identity. The theater is not.",
        },
        {
          title: "One typeface, one register, no hierarchy",
          body: "IBM Plex Mono for name, nav, body, tags, and diagrams flattens everything to a log file. Decision-makers scan headlines, then metrics, then a paragraph. This study pairs a serif for the voice with Plex Sans for reading. Mono is reserved for protocol fragments, not sentences.",
        },
        {
          title: "Four systems, one diagram",
          body: "Payment, fraud, SMS, and contacts all used the same three-box SVG with different labels. That tells a reader the drawing is decoration. Each domain now has a four-step path and a named failure mode — timeout/double-settle, unexplained holds, DLR lies, enrichment after enqueue.",
        },
        {
          title: "Information architecture was lying",
          body: "Nav: 01, 02, 03, Whitepapers [5], 05. There is no 04 in the bar. There are four whitepapers, not five. SMS (section 03) links to “Dossier 04”. Contact analytics has no paper. Web3 is a paper with no homepage section. This study counts files, not atmosphere.",
        },
        {
          title: "The offer was buried under the machines",
          body: "“Dispatch Audit” is clever and unclear. The calendar is a 600px embed with no briefing. Buyers need: who this is for, what happens after the call, what to bring. Process is now a three-step sequence; booking is a page with a brief, not a widget dump.",
        },
        {
          title: "Proof is asserted, never situated",
          body: "1B+ SMS, 50K TPS, 15 years — strong if true, weak without a named context. This study does not invent employers or case studies. It keeps the figures, labels them as published, and stops the “TEL: VERIFIED VIA LINKEDIN CREDENTIALS” line, which reduces trust.",
        },
        {
          title: "The site is English-only for a Tehran practice",
          body: "IR-TEH is in the hero. MCI, Irancell, Magfa, Rahyab, Shaparak, *800# are the work. A Persian toggle is not localization theater — it is the other half of the market. Vazirmatn, RTL, and translated voice are first-class here.",
        },
        {
          title: "Mobile was a cropped desktop",
          body: "Floating 96% navbar, long wordmark plus “Dispatch Audit”, diagrams at min-width 700px, calendar min-height 600px. This study is mobile-first: 44px targets, no horizontal overflow, diagrams that stack.",
        },
        {
          title: "What was kept on purpose",
          body: "The rust/olive/paper palette. The dossier idea (a written spec, not a startup landing). The four production systems. Direct links to the live whitepapers. Cal.com. LinkedIn. The refusal to look like a purple SaaS template.",
        },
      ],
    },

    dataCleaning: {
      kicker: "Engineering whitepaper · Data systems",
      title: "Persian contact enrichment and name resolution",
      lead: "Production specification for sanitising, indexing and matching high-volume Persian name and location datasets. Deterministic normalisation first, then blocking keys, lightweight scoring, and residual embedding only where needed — at tens to hundreds of millions of records.",
      s1Title: "1. Introduction and scope",
      s1Body1: "Large Persian-language datasets contain multiple surface forms of the same real-world entity. Person names, organisation titles and place names appear with inconsistent character encodings, optional honorifics, variable compound spacing, phonetic letter substitutions and inverted token order. When these variations exist across independent source systems, exact string matching becomes insufficient.",
      s1Body2: "This blueprint is deliberately layered: inexpensive deterministic transformations execute first, followed by blocking keys that sharply reduce the candidate space, then lightweight string metrics, and only on residual hard pairs more expensive embedding models. The same stages can run in Python (Spark, DuckDB, Pandas), SQL engines, and NoSQL platforms such as Elasticsearch.",
      s2Title: "2. Structural challenges of Persian text at scale",
      s2Lead: "Persian orthography creates several interacting sources of variation that must be addressed before reliable matching is possible.",
      s2Items: [
        {
          title: "Character encoding and script variants",
          body: "The same letter may be represented by different Unicode code points (ي vs ی, ك vs ک). Diacritics and tatweel appear inconsistently. NFC alone does not resolve them; an explicit language-specific mapping is required.",
        },
        {
          title: "Zero-Width Non-Joiner versus space",
          body: "Compound words and certain prefixes/suffixes are conventionally written with ZWNJ (U+200C). In practice the same unit may appear fully joined, space-separated, or correctly joined with ZWNJ. Tokenisation stays unreliable until these forms share one regime.",
        },
        {
          title: "Phonetic letter substitution",
          body: "Modern Iranian Persian has merged several Arabic consonants that remain distinct in writing. The /z/ group (ز ذ ض ظ), /s/ group (س ص ث), /t/ pair (ت ط), /h/ pair (ه ح) and /ɣ~q/ pair (غ ق) are frequently interchanged. A phonetic collapse step is essential for effective blocking.",
        },
        {
          title: "Token order and honorifics",
          body: "Administrative records often store names in inverted order. Titles (دکتر، مهندس، سید، حاج، بانو …) appear as prefixes or free tokens. They must be isolated into metadata or rendered order-invariant before matching.",
        },
        {
          title: "Missing short vowels and homographs",
          body: "Short vowels are almost never written. The four-letter string ملک can be malak, malek, melk or molk. Pure string methods cannot disambiguate; residual cases need external knowledge or contextual models.",
        },
      ],
      s3Title: "3. Pipeline architecture",
      s3Body: "Five sequential stages. Each is independently executable so intermediate results can be materialised, audited and re-processed.",
      s3Steps: [
        "Ingestion and basic validation — schema checks, null handling, source tagging.",
        "Deterministic normalisation — character mapping, diacritic removal, ZWNJ standardisation, honorific isolation.",
        "Blocking-key generation — phonetic skeleton and sorted-token fingerprint.",
        "Candidate generation — records sharing both keys form small comparison groups.",
        "Similarity scoring and decision — rapid token-based metrics first; residual pairs may receive embedding-based scores.",
      ],
      fig1Caption: "Figure 1. End-to-end Persian name cleaning and entity-resolution pipeline. Stages progress from raw ingestion through deterministic normalisation, blocking-key generation, candidate-pair formation and final similarity scoring.",
      s4Title: "4. Deterministic normalisation layers",
      s4Body: "The first transformation layer must be fully deterministic and reversible for audit purposes.",
      s4Items: [
        {
          title: "Character and encoding normalisation",
          body: "Arabic letter forms are mapped to their Persian counterparts. Combining diacritics and tatweel are stripped. This eliminates the most common encoding-induced false negatives.",
        },
        {
          title: "Compound spacing and ZWNJ handling",
          body: "Known verbal prefixes (می، نمی، بی) and common plural/possessive suffixes are rewritten so a consistent ZWNJ (or space, by house style) separates the morpheme from the stem. Remaining runs of whitespace and ZWNJ are collapsed.",
        },
        {
          title: "Honorific and title isolation",
          body: "A controlled dictionary of high-frequency titles is matched. Matched tokens move to a secondary metadata column rather than being deleted. Core personal-name tokens remain available for matching while original title presence is preserved for audit.",
        },
      ],
      s5Title: "5. Blocking keys for candidate generation",
      s5Body: "After normalisation, exact string equality remains too strict. Blocking constructs inexpensive keys that place likely matches into the same partition so expensive pairwise comparison occurs only inside small groups.",
      s5Items: [
        {
          title: "Phonetic skeleton",
          body: "Letters belonging to the same modern Iranian phoneme class collapse to a single representative. Vowels and weak letters are removed; consecutive duplicate consonants are compressed. Orthographic variants that differ only by phonetic substitution land in the same bucket.",
        },
        {
          title: "Sorted token fingerprint",
          body: "The cleaned name is split into tokens, stop-words and single-character tokens are discarded, remaining tokens are sorted alphabetically and concatenated. The key is invariant to the order of given name and family name.",
        },
      ],
      fig2Alt: "Name variation explosion converging to phonetic key and sorted fingerprint",
      fig2Caption: "Figure 2. Multiple observed surface forms of a single identity converge, after normalisation, onto a shared phonetic key and sorted-token fingerprint.",
      s6Title: "6. Scoring residual pairs",
      s6Body: "Inside each blocking bucket the remaining pairs are scored with lightweight string metrics. Token-sort ratio and token-set ratio provide a strong first signal on cleaned Persian text. A weighted edit distance that assigns lower cost to substitutions inside the same phonetic group further improves ranking. Only the highest-ambiguity residual pairs need embedding models — this keeps cost acceptable at scale.",
      s7Title: "7. ParsBERT and residual neural scoring",
      s7Body: "ParsBERT remains the strongest monolingual foundation for Persian tasks that require deep understanding of orthographic variation and compound structure. In production the cross-encoder is reserved for the final ranking stage after aggressive blocking. Bi-encoders scale better when embeddings can be pre-computed. Parameter-efficient fine-tuning (LoRA) recovers nearly the same F1 as full fine-tuning while staying within consumer-GPU budgets.",
      s8Title: "8. Location and city name handling",
      s8Body: "Place names show a more restricted vocabulary than personal names yet still display Arabic/Persian letter variation, optional administrative prefixes and Latin transliterations. Maintain a canonical dictionary of principal cities and provinces with their frequent variants; apply the same character and spacing normalisation; look up the normalised string; unmatched values fall back to phonetic blocking and fuzzy scoring.",
      fig3Alt: "City name normalisation — canonical versus observed dirty forms",
      fig3Caption: "Figure 3. Example of city-name normalisation. Surface variants in Persian, Arabic-influenced and Latin scripts collapse to a single canonical identifier after cleaning.",
      s9Title: "9. Operational considerations and quality gates",
      s9Items: [
        "Materialised intermediate tables — each major stage writes Parquet so any step can be re-run independently.",
        "Quality metrics — track the percentage of records that receive a blocking key, average candidate-bucket size, and similarity-score distribution.",
        "Threshold calibration — decision thresholds are domain-specific (person vs organisation vs location) and should be tuned on a stratified sample.",
        "Auditability — original raw values, intermediate normalised forms and final match decisions are retained.",
        "Dual-script indexing — when Latin transliterations coexist with Persian script, maintain parallel normalised keys that both resolve to the same master entity identifier.",
      ],
      s9Note: "The objective of an enterprise pipeline is to maximise the proportion of records that can be linked automatically with high confidence, while producing a compact, ranked residual set that can be handled by downstream processes or controlled review.",
    },


    cases: {
      kicker: "Evidence · anonymised",
      title: "Four refund paths that had to work under real constraints",
      lead: "Settlement is not a single reverse API. Under gateway timeouts, partial fulfilment, and dispute handoff, product and ledger must agree on four distinct paths. These cases are anonymised patterns from production work — no employer, no account, no regulatory loophole named for abuse.",
      items: [
        {
          id: "R1",
          title: "Full reverse after host timeout",
          context: "Customer charged; host never confirmed capture. Gateway held an open intent past the SLA window.",
          constraint: "Cannot invent a second capture. Cannot leave the customer funded and the merchant unpaid. Idempotency key must survive retry storms.",
          path: "Intent marked failed-open → full reverse posted as a new ledger fact (not an UPDATE) → customer restored → merchant never settled. Replay from log if the reverse ack was lost.",
          outcome: "Zero double-settle in the replay window. Chargeback ratio unaffected because the customer never needed a dispute letter.",
        },
        {
          id: "R2",
          title: "Partial reverse on multi-item orders",
          context: "One line item cancelled after capture; rest of the basket fulfilled. PSP and scheme rules differ on partial vs full reverse.",
          constraint: "Partial reverse amount must match scheme-allowed remainder. Ledger must keep the original capture fact and append a partial reverse fact — never rewrite the capture.",
          path: "Line-level cancel → partial reverse message → append-only residual balance → merchant settlement for fulfilled lines only.",
          outcome: "Residual ledger balanced. No orphan capture. Ops review could explain every rial from facts alone.",
        },
        {
          id: "R3",
          title: "Chargeback handoff",
          context: "Customer disputed after fulfilment. Liability shift depended on whether 3DS completed and whether evidence was retained inside the dispute window.",
          constraint: "Evidence package (auth log, device signal, fulfilment proof) must be exportable on demand. Graph of related sessions must not collapse under volume.",
          path: "Dispute intake → evidence assembly from append-only stores → handoff to scheme → ledger holds a dispute state until terminal outcome.",
          outcome: "Representment possible when evidence held. Silent drops eliminated by making evidence a first-class artifact of the auth path.",
        },
        {
          id: "R4",
          title: "Manual reconciliation batch",
          context: "End-of-day break between switch totals and host totals. Millions of rows; human review cannot be the primary path.",
          constraint: "Breaks must be ranked: amount, age, merchant class, retry count. Manual touch only for residual classes that automation cannot close.",
          path: "Nightly fact diff → ranked residual queue → automated close where rules match → human queue only for the long tail → every close posts a ledger fact.",
          outcome: "Manual verification volume dropped to the residual set. Settlement still closed same day for the automated majority.",
        },
      ],
    },

  },
  fa: {
    meta: {
      title: "آریا صراف‌زاده | معماری سامانه‌های سازمانی و مخابرات",
      description:
        "مالک فنی محصول و مدیر ارشد محصول. سوییچ پرداخت، مسیریابی پیامک ملی، جداسازی تقلب در مقیاس عملیاتی.",
    },
    proposal: {
      label: "پیشنهاد طراحی برای ariya-sarrafzadeh.ir — مطالعه تعاملی، نه سایت زنده",
      live: "مشاهده سایت زنده",
      notes: "چرا عوض شد",
    },
    nav: {
      work: "سامانه‌ها",
      papers: "مقالات فنی",
      cases: "نمونه‌کار",
      process: "همکاری",
      book: "هماهنگی جلسه",
      menu: "فهرست",
      close: "بستن",
      skip: "رفتن به محتوا",
    },
    hero: {
      eyebrow: "تهران",
      name: "آریا صراف‌زاده",
      role: "معمار سامانه و مهندس زیرساخت · مدیر ارشد محصول",
      headline: "معماری سامانه‌های سازمانی و مخابرات",
      lead: "راهبری سوییچ پرداخت پرحجم، هاب مسیریابی پیامک در مقیاس ملی، و معماری کشف تقلب. سامانه‌هایی که میلیاردها پیام در سال و حجم مالی سنگین را با قید جداسازی جلو می‌برند. حوزه کار: ISO 8583 میزبان‌به‌میزبان، SMPP 3.4، قفل توزیع‌شده Redis، دفترکل فقط‌افزودنی.",
      primary: "نقشه‌های فنی",
      secondary: "مقالات فنی",
    },
    proof: [
      { value: "۱۵+", label: "سال در سامانه‌های عملیاتی" },
      { value: "۱B+", label: "پیامک مسیریابی‌شده در سال" },
      { value: "۵۰K", label: "تراکنش در اوج، در ثانیه" },
      { value: "<۵۰ms", label: "SLA مسیر تسویه" },
    ],
    thesis: {
      kicker: "دامنه",
      title: "پرداخت، مخابرات و تقلب؛ سامانه‌هایی که همین حالا در مقیاس ملی کار می‌کنند.",
      body: "کار روی واقعیت شاپرک و اپراتور ایران است: ISO 8583 میزبان‌به‌میزبان، نشست SMPP 3.4 با مگفا و رهیاب و همراه‌اول و ایرانسل، دفتر فقط‌افزودنی، چهار مسیر برگشت، و امتیاز تقلبی که باید داخل مهلت خرید تصمیم بگیرد. سطوح تخفیف، پیش‌پرداخت و پرداخت قبض پایش جدا دارند؛ همان قواعد تسویه روی آن‌ها کپی نمی‌شود.",
      buyersTitle: "همکاری",
      buyers: [
        {
          title: "پردازنده‌های پرداخت",
          body: "Idempotency، مسیریابی ISO 8583، و دفتری که تایم‌اوت درگاه را بدون دوباره‌تسویه تاب می‌آورد — به‌همراه چهار مسیر reverse که زیر قیود واقعی کار می‌کنند.",
        },
        {
          title: "اپراتور و تجمیع‌کننده",
          body: "بافت SMPP روی مگفا، رهیاب، همراه اول و ایرانسل — قطعه‌بندی UCS-2، باند پیش‌شماره، واقعیت *800#.",
        },
        {
          title: "ریسک و محصول",
          body: "خط تقلبی که conversion را بالای ۹۸٪ نگه می‌دارد، residual پرومو و prepaid را می‌بندد، و مسئولیت ۳DS را جابه‌جا می‌کند — نه گورستان قاعده.",
        },
        {
          title: "عملیات کمپین",
          body: "غنی‌سازی مخاطب که شمارهٔ مرده را قبل از SMSC و قبل از فاکتور کنار می‌گذارد.",
        },
      ],
    },
    systems: {
      kicker: "سامانه‌های عملیاتی",
      title: "چهار سامانه. چهار حالت شکست.",
      lead: "هر حوزه مسیر جدا دارد: اسناد تسویه، امتیاز تقلب، نشست SMPP، و غنی‌سازی مخاطب قبل از مرکز پیامک.",
      failureLabel: "حالت شکست",
      domains: {
        payments: {
          kicker: "۰۱  ·  تسویه",
          tab: "تسویه",
          title: "تسویهٔ پرداخت رویدادمحور",
          problem:
            "در محدودیت‌های ارائه‌دهندهٔ خدمات پرداخت و شاپرک، قطع ارتباط زمانی بین درگاه و میزبان حالت خاص نیست — حالت پیش‌فرض شکست است. وقتی حالت درخواست و واقعیت تسویه یک ردیف را شریک شوند، نتیجه دوباره‌تسویه، بازپرداخت ناقص و ثبت یتیم است. مسیر بازپرداخت یکی نیست: برگشت کامل، برگشت جزئی، واگذاری اختلاف، و تطبیق دستی؛ هر کدام قواعد دفتر و نظارتی جدا دارند.",
          approach:
            "واقعیت در برابر حالت. هر گذار مالی یک سند به دفتر می‌افزاید؛ موجودی از بازپخش به‌دست می‌آید نه از بازنویسی فیلد. لبه ارتباط امن TLS ۱٫۳ را تمام می‌کند، قفل اتمی Redis با SETNX (۸۶٬۴۰۰ ثانیه) می‌گیرد، سپس به بیت‌مپ ISO 8583 برای مسیریابی میزبان‌به‌میزبان تبدیل می‌شود. موتور بازپرداخت به‌صورت ماشین حالت صریح مدل می‌شود تا چهار مسیر واقعی برگشت نتوانند زیر قیود جداسازی پول اختراع کنند.",
          failure:
            "اگر میزبان بعد از نوشتن پاسخ و قبل از ثبت قطعی واقعیت قطع شود، بازپخش باید جهان را از لاگ بسازد. غیر از این، جلسهٔ تطبیق و مشکل نسبت بازگشت وجه است.",
          tags: [
            "SLA زیر ۵۰ میلی‌ثانیه",
            "Redis · idempotency",
            "ISO 8583",
            "دفتر فقط‌افزودنی",
          ],
          metrics: [
            { label: "Idempotency", value: "SETNX · ۸۶۴۰۰ث" },
            { label: "لبه", value: "mTLS / JSON" },
            { label: "میزبان", value: "بیت‌مپ ISO 8583" },
          ],
          steps: [
            { title: "ورود درخواست", sub: "TLS ۱٫۳ · mTLS · JSON" },
            { title: "قفل یکتایی", sub: "Redis SETNX · ۸۶۴۰۰ث" },
            { title: "میزبان ISO 8583", sub: "بیت‌مپ · سوییچ مستقیم" },
            { title: "خوشهٔ دفتر", sub: "فقط‌افزودنی · دوطرفه" },
          ],
          paperHref: "/papers/payment-gateway",
          paperLabel: "متن کامل پرونده پرداخت",
        },
        fraud: {
          kicker: "۰۲  ·  ریسک",
          tab: "تقلب",
          title: "جداسازی تقلب در لحظه",
          problem:
            "خطوط بازپرداخت نقدی، تخفیف و محصولات پیش‌پرداخت (اعتبار تماس، بسته اینترنت) به‌طور منظم مورد سوءاستفاده قرار می‌گیرند چون مسیر خوش‌بینانه به محصول تبدیل شده و مسیر سوءاستفاده نه. جریان‌های پرداخت قبض تله‌هایی دارند که تقریباً همهٔ ارائه‌دهندگان هنوز منتشر می‌کنند. قواعد ثابت ربات‌های پر سر و صدا را می‌گیرد و تصاحب هماهنگ حساب، انباشت تخفیف و آربیتراژ پیش‌پرداخت را از دست می‌دهد — چیزهایی که فقط روزها بعد در ماندهٔ دفتر دیده می‌شوند.",
          approach:
            "داده‌های لبه (اثرانگشت دستگاه، جهت، ریتم تایپ) داخل بودجهٔ ۱۵ میلی‌ثانیه به امتیاز ۰٫۰۰ تا ۱٫۰۰ می‌رسند. زیر ۰٫۳۰ عبور؛ ۰٫۳۰ تا ۰٫۷۵ چالش با ۳DS ۲٫۰ جایی که جابه‌جایی مسئولیت ممکن است؛ بالاتر جداسازی. سطوح تخفیف و پیش‌پرداخت پایش ماندهٔ جدا دارند — نه همان قواعد تسویهٔ خرید — تا نرخ تبدیل بالای ۹۸٪ بماند و پنجره‌های سوءاستفاده بسته شود.",
          failure:
            "مدلی که نمی‌تواند یک توقف را توضیح دهد مدلی است که محصول خاموشش می‌کند. گراف باید نامهٔ اختلاف و بازبینی عملیات را تاب بیاورد، نه فقط درخواست زنده را.",
          tags: [
            "خط زیر ۳۰ میلی‌ثانیه",
            "ماندهٔ تخفیف و پیش‌پرداخت",
            "مثبت کاذب زیر ۰٫۵٪",
            "ردیابی گراف",
          ],
          metrics: [
            { label: "بودجه", value: "۱۵ms لبه" },
            { label: "عبور", value: "< ۰٫۳۰" },
            { label: "چالش", value: "۰٫۳۰ – ۰٫۷۵" },
          ],
          steps: [
            { title: "دادهٔ لبه", sub: "اثرانگشت دستگاه" },
            { title: "امتیاز و مانده", sub: "خرید · تخفیف · پیش‌پرداخت" },
            { title: "سیاست", sub: "عبور / ۳DS / جداسازی" },
            { title: "گراف قضایی", sub: "خوشه · مسیر اختلاف" },
          ],
          paperHref: "/papers/fraud-tracing",
          paperLabel: "متن کامل پرونده تقلب",
        },
        sms: {
          kicker: "۰۳  ·  مخابرات",
          tab: "پیامک",
          title: "سوییچ مسیریابی پیامک ملی",
          problem:
            "با مسدود بودن RCS و MMS، ترافیک بانک و رمز یک‌بارمصرف روی شبکهٔ موبایل قدیمی می‌نشیند. متن فارسی با UCS-2 حداکثر ۷۰ نویسه در یک قطعه است (۶۷ در حالت چندقطعه‌ای). قطعه‌بندی ساده‌لوحانه یک رویداد صورتحساب است، نه تنظیم متن.",
          approach:
            "نشست‌های پایدار SMPP 3.4 به مگفا، رهیاب، همراه‌اول و ایرانسل. تقسیم بار روی باندهای پیش‌شماره ۱۰۰۰ تا ۹۰۰۰، کنترل پنجرهٔ لغزان، رسید تحویل ناهمگام، و واقعیت خط *۸۰۰# در این بازار. ظرفیت اعلام‌شده: بیش از ۵۰ هزار تراکنش در ثانیه در اوج.",
          failure:
            "صفی که قبل از مرکز پیامک اپراتور تأیید می‌دهد به بانک دروغ می‌گوید. رسید تحویل منبع حقیقت است. سوییچ ردیاب وعده است.",
          tags: [
            "بیش از ۵۰ هزار TPS",
            "SMPP 3.4",
            "قطعه‌بندی UCS-2",
            "فیلتر *۸۰۰#",
          ],
          metrics: [
            { label: "رمزگذاری", value: "UCS-2 · ۷۰/۶۷" },
            { label: "باندها", value: "۱k–۹k" },
            { label: "اپراتور", value: "همراه‌اول · ایرانسل" },
          ],
          steps: [
            { title: "صف ورود", sub: "Kafka / RabbitMQ" },
            { title: "مسیریاب SMPP 3.4", sub: "تقسیم · پنجره" },
            { title: "مرکز پیامک", sub: "همراه‌اول · ایرانسل" },
            { title: "ردیاب رسید", sub: "حقیقت تحویل" },
          ],
          paperHref: "/papers/sms-infrastructure",
          paperLabel: "متن کامل پرونده پیامک",
        },
        contacts: {
          kicker: "۰۴  ·  داده",
          tab: "مخاطب",
          title: "غنی‌سازی مخاطب ملی و یکسان‌سازی نام فارسی",
          problem:
            "ده‌ها میلیون ردیف، پیوند چندصفتی، و انبار سطری که قبل از کمپین فرو می‌ریزد. شمارهٔ مرده هنوز صورتحساب می‌شود. نام‌های فارسی با گونه‌های عربی و فارسی نویسه، نیم‌فاصله در برابر فاصله، ترتیب معکوس، القاب و جایگزینی حروف هم‌آوا می‌آیند.",
          approach:
            "DuckDB روی فایل‌های ستونی Parquet. کارگران PyArrow پاکسازی، یکتاسازی و اتصال اپراتور، استان، شهر و وضعیت عدم‌مزاحمت را قبل از درگاه پیامک انجام می‌دهند. لایه‌های قطعی اول: نرمال‌سازی نویسه و نیم‌فاصله و القاب، سپس اسکلت آوایی و اثرانگشت توکن مرتب‌شده برای مسدودسازی، سپس امتیاز سبک. فقط جفت‌های باقی‌مانده به مدل معنایی می‌روند. ذخیره حدود ۷۰٪ کمتر؛ استعلام یک مرتبه سریع‌تر.",
          failure:
            "غنی‌سازی بعد از صف یعنی پرداخت برای شماره‌ای که هرگز پاسخ نمی‌دهد. پیوند مالِ بالادست درگاه است.",
          tags: [
            "Parquet ستونی",
            "DuckDB",
            "کلید آوایی",
            "نیم‌فاصله و القاب",
          ],
          metrics: [
            { label: "انبار", value: "Parquet · Snappy" },
            { label: "موتور", value: "DuckDB" },
            { label: "پیوند", value: "اپراتور · منطقه · عدم‌مزاحمت" },
          ],
          steps: [
            { title: "ورود خام", sub: "جدول و فایل" },
            { title: "پاکسازی قطعی", sub: "نویسه · نیم‌فاصله · القاب" },
            { title: "کلید مسدودسازی", sub: "آوایی + اثرانگشت" },
            { title: "پیش از پیامک", sub: "HLR · عدم‌مزاحمت · امتیاز" },
          ],
          paperHref: "/data-cleaning",
          paperLabel: "طرح پاکسازی نام فارسی",
        },
      },
    },
    papersPage: {
      kicker: "مشخصات",
      title: "سوییچ‌های پرحجم و دفترهای رمزنگاری‌شده",
      lead: "مشخصات مرجع مهندسی: مسیریابی پرداخت، مکانیک تجمیع‌کننده مخابرات، جداسازی تقلب در محیط، و گذار حالت بدون اعتماد. برای معماران سامانه و رهبری مهندسی.",
      open: "متن کامل",
      countNote: "پرونده ۰۱ پرداخت · ۰۲ تقلب · ۰۳ Web3 · ۰۴ پیامک — به‌علاوه معیارهای مقایسه‌ای.",
      items: {
        "payment-gateway": {
          title: "اکوسیستم درگاه پرداخت",
          blurb:
            "چرخه تراکنش، سریال‌سازی ISO 8583، قفل‌های توزیع‌شده Redis، الگوی Fact در برابر State، و مقایسه توپولوژی شاپرک و Stripe. بودجه تأخیر سوییچ < ۲۵۰ ms · TTL idempotency ۸۶۴۰۰ ثانیه.",
        },
        "fraud-tracing": {
          title: "کاهش تقلب قضایی",
          blurb:
            "ارزیابی ریسک محیط، فیلتر heuristic، تلهمتری لبه، بردارهای رفتاری ML، جابه‌جایی مسئولیت ۳DS ۲٫۰، و محاسبه نسبت چارجبک. SLA امتیازدهی لبه < ۳۰ ms · سقف چارجبک ۱٫۰٪.",
        },
        "sms-infrastructure": {
          title: "زیرساخت مخابرات و پیامک",
          blurb:
            "سوییچ‌های SMPP 3.4 ملی، لایه‌بندی تجمیع‌کننده مگفا و رهیاب، رده‌بندی پیش‌شماره، فیلتر DND، و پیامد معماری مسدودسازی RCS و MMS. اوج ملی بیش از ۵۰ هزار TPS · محدودیت UCS-2 فارسی ۷۰/۶۷ نویسه.",
        },
        "web3-infrastructure": {
          title: "زیرساخت Web3 و رمزارز",
          blurb:
            "زمان‌اجرای ماشین حالت قطعی، محاسبه گاز opcode در EVM، مقیاس‌پذیری Optimistic در برابر ZK Layer 2، ریسک پل بین زنجیره، و مدل‌های یکپارچه‌سازی TradFi. ظرفیت دسته ZK بیش از ۴۰۰۰ TPS.",
        },
      },
      benchKicker: "معیارهای مقایسه‌ای",
      benchTitle: "ظرفیت throughput و قطعیت تسویه",
      benchLead:
        "اوج TPS و تأخیر قطعیت در طرح‌های کارتی، سوییچ‌های ملی، مسیریابی مخابرات و دفترهای توزیع‌شده — همان‌طور که در مجموعه زنده منتشر شده است.",
    },
    process: {
      kicker: "۰۵ // همکاری",
      title: "بررسی معماری",
      lead: "همان شکستی را بیاورید که الان روی میز است. پانزده دقیقه کافی است تا معلوم شود کار معماری است، عملیات، یا هر دو.",
      steps: [
        {
          n: "01",
          title: "پانزده دقیقه",
          body: "گلوگاه را بیاورید: تایم‌اوت درگاه، دوباره‌تسویه، DLR خاموش، اوج چارجبک، یا صفی که خالی نمی‌شود. می‌گویم معماری است یا عملیات.",
        },
        {
          n: "02",
          title: "ارزیابی محدود",
          body: "مرز جداسازی، مسیر بازپخش، SLA، و همان حالت شکست مشخص. نوشته روی سامانهٔ در حال اجرا — ISO 8583، SMPP، دفتر یا خط ریسک — نه مدل مرجع.",
        },
        {
          n: "03",
          title: "پرونده + جلسهٔ کار",
          body: "مشخصاتی که مهندسی می‌تواند استفاده کند. بعد جلسه‌ای برای راه رفتن روی همان برش.",
        },
      ],
    },
    book: {
      kicker: "۰۵ // تقویم",
      title: "هماهنگی مستقیم",
      lead: "بررسی معماری، ممیزی سکو، مرور محصول. جلسه پانزده دقیقه‌ای.",
      bringTitle: "چه بیاورید",
      bring: [
        "مسیری که می‌شکند: تایم‌اوت، تراکنش تکراری، رسید خاموش، بازگشت وجه.",
        "حجم: TPS، پیام روزانه، یا پنجره تسویه.",
        "آنچه آزموده‌اید، در یک جمله.",
      ],
      cta: "باز کردن تقویم",
      fallback: "Cal.com · ساخت حساب لازم نیست.",
    },
    footer: {
      line: "سامانه‌ها در حال کار",
      location: "تهران",
      rights: "© ۲۰۲۶ آریا صراف‌زاده",
    },
    notes: {
      kicker: "یادداشت طراحی",
      title: "چه ایرادی داشت و این مطالعه چه عوض می‌کند",
      lead: "مشاهده در برابر سایت زنده. نقد محصول است، نه رنگ‌آمیزی.",
      sections: [
        {
          title: "لباس بیشتر از دلیل کار می‌کرد",
          body: "شناسهٔ عملیات، سطح دسترسی و خطوط اسکن روی هر پنل مثل پوستهٔ نمایشگر نظامی خوانده می‌شود. مدیر محصولی که ممیزی به پردازنده و اپراتور می‌فروشد به وقار نیاز دارد، نه نقش‌بازی. پالت صنعتی و پروتکل‌ها هویت‌اند؛ نمایش نیست.",
        },
        {
          title: "یک قلم، یک صدا، بدون سلسله‌مراتب",
          body: "یک قلم تک‌فاصله برای نام، منو، متن و نمودار همه چیز را به فایل لاگ تبدیل می‌کند. اینجا قلم نمایش برای صدا و قلم خوانا برای متن. تک‌فاصله فقط برای قطعات پروتکل، نه جمله.",
        },
        {
          title: "چهار سامانه، یک نمودار",
          body: "پرداخت، تقلب، پیامک و مخاطب همه یک شکل سه‌جعبه‌ای با برچسب عوض‌شده داشتند. حالا هر حوزه مسیر چهارمرحله‌ای و حالت شکست نام‌دار دارد.",
        },
        {
          title: "معماری اطلاعات باید صادق باشد",
          body: "فهرست پرونده‌ها با محتوای واقعی هم‌خوان است. پنجمین بلوک معیار است، نه مقاله.",
        },
        {
          title: "تقویم بدون زمینه دعوت مبهم است",
          body: "نوبت‌دهی بعد از توضیح ترتیب کار می‌آید: گلوگاه، ارزیابی محدود، پرونده.",
        },
        {
          title: "زبان دوم باید بومی باشد",
          body: "فارسی کامل. انگلیسی فقط برای اصطلاحی که معادل دقیق رایج ندارد — مثل ISO 8583 یا SMPP.",
        },
      ],
    },
    dataCleaning: {
      kicker: "مقاله مهندسی · سامانه‌های داده",
      title: "پاکسازی و یکسان‌سازی نام فارسی در مقیاس عملیاتی",
      lead: "مشخصات تولید برای پاکسازی، نمایه‌سازی و تطبیق مجموعه‌های نام و مکان فارسی در حجم بالا. اول نرمال‌سازی قطعی، سپس کلید مسدودسازی، امتیاز سبک، و فقط در صورت نیاز مدل معنایی برای باقی‌مانده.",
      s1Title: "۱. مقدمه و دامنه",
      s1Body1: "مجموعه‌های فارسی بزرگ شکل‌های سطحی متعدد از یک موجودیت واقعی دارند. نام شخص، سازمان و شهر با گونه‌های نویسه، نیم‌فاصله، ترتیب معکوس و القاب می‌آیند. تطبیق خام رشته‌ای هزینهٔ تکراری و اشتباه لینک ایجاد می‌کند.",
      s1Body2: "این طرح خط لولهٔ تولید را توصیف می‌کند: پاکسازی قطعی، کلید مسدودسازی آوایی، امتیاز سبک، و مدل معنایی فقط برای جفت‌های باقی‌مانده.",
      s2Title: "۲. لایه‌های نرمال‌سازی",
      s2Lead: "قبل از هر تطبیق، شکل سطحی باید به شکل کانونی برسد.",
      s2Items: [
        { title: "نویسه و یونیکد", body: "یکسان‌سازی اشکال عربی و فارسی هم‌معنی، حذف اعراب غیرضروری، نرمال‌سازی فاصله." },
        { title: "نیم‌فاصله", body: "جدا کردن یا یکسان کردن نیم‌فاصله و فاصله در پیشوند و پسوند نام." },
        { title: "القاب", body: "جدا کردن و نگهداری القاب (آقا، خانم، دکتر و مانند آن) خارج از کلید تطبیق اصلی." },
      ],
      s3Title: "۳. کلید مسدودسازی",
      s3Body: "مسدودسازی نامزدها را قبل از امتیازدهی گران کم می‌کند.",
      s3Steps: [
        "اسکلت آوایی: ادغام حروف هم‌آوا در فارسی",
        "اثرانگشت توکن مرتب‌شده: ترتیب اجزای نام را خنثی می‌کند",
        "کلید ترکیبی استان و شهر پس از نرمال‌سازی مکان",
      ],
      fig1Caption: "خط لوله از دادهٔ خام تا پیوند با اطمینان بالا",
      s4Title: "۴. امتیازدهی سبک",
      s4Body: "روی جفت‌های داخل بلوک، امتیاز سریع قبل از مدل سنگین.",
      s4Items: [
        { title: "نسبت توکن مرتب", body: "شباهت مجموعهٔ اجزای نام پس از مرتب‌سازی." },
        { title: "ویرایش وزن‌دار", body: "فاصلهٔ ویرایش با وزن بیشتر روی اجزای اصلی نام." },
      ],
      s5Title: "۵. مدل معنایی برای باقی‌مانده",
      s5Body: "فقط جفت‌هایی که امتیاز قطعی نگرفتند به لایهٔ معنایی می‌روند.",
      s5Items: [
        { title: "نمایهٔ فشرده", body: "بردار برای نام و بافت محدود مکان." },
        { title: "آستانهٔ بازبینی", body: "صف رتبه‌بندی‌شده برای بازبینی انسانی کنترل‌شده." },
      ],
      fig2Alt: "گونه‌های نام که به شکل کانونی می‌رسند",
      fig2Caption: "همان شخص، شکل‌های سطحی متفاوت",
      s6Title: "۶. مکان و شهر",
      s6Body: "نام شهر و استان نیز گونه و املای متعدد دارند. همان لایه‌های نرمال‌سازی و مسدودسازی روی مکان اعمال می‌شود تا پیوند مخاطب به منطقه پایدار بماند.",
      s7Title: "۷. یکپارچگی عملیاتی",
      s7Body: "خروجی غنی‌شده قبل از صف پیامک قرار می‌گیرد: وضعیت اپراتور، منطقه، و عدم‌مزاحمت. شمارهٔ مرده یا مسدود نباید به درگاه برسد.",
      s8Title: "۸. معیارهای عملی",
      s8Body: "کاهش حجم ذخیره، افزایش سرعت استعلام، و کاهش هزینهٔ ارسال به شمارهٔ بی‌پاسخ از خروجی‌های قابل اندازه‌گیری این خط لوله‌اند.",
      fig3Alt: "یکسان‌سازی نام شهر",
      fig3Caption: "گونه‌های شهر به شکل کانونی",
      s9Title: "۹. نتیجه",
      s9Items: [
        "نرمال‌سازی قطعی قبل از هر مدل",
        "مسدودسازی آوایی و اثرانگشت برای کاهش نامزد",
        "امتیاز سبک؛ مدل معنایی فقط برای باقی‌مانده",
        "غنی‌سازی بالادست درگاه پیامک",
      ],
      s9Note: "هدف: بیشینهٔ پیوند خودکار با اطمینان بالا و مجموعهٔ باقی‌ماندهٔ فشرده برای بازبینی.",
    },
    cases: {
      kicker: "شواهد · ناشناس",
      title: "چهار مسیر بازپرداخت که باید زیر قیود واقعی کار می‌کردند",
      lead: "تسویه یک رابط معکوس واحد نیست. زیر قطع زمانی درگاه، تحویل جزئی و واگذاری اختلاف، محصول و دفتر باید روی چهار مسیر متمایز توافق کنند. این موارد الگوهای ناشناس از کار تولید هستند — بدون نام کارفرما، حساب یا حفرهٔ نظارتی برای سوءاستفاده.",
      items: [
        {
          id: "R1",
          title: "برگشت کامل پس از قطع زمانی میزبان",
          context: "مشتری شارژ شد؛ میزبان ثبت را تأیید نکرد. درگاه قصد باز را از پنجرهٔ مهلت عبور داد.",
          constraint: "نمی‌توان ثبت دوم ساخت. نمی‌توان موجودی مشتری را برگرداند و پذیرنده را بی‌تسویه گذاشت. کلید یکتایی باید طوفان تلاش مجدد را تاب بیاورد.",
          path: "قصد به‌عنوان بازِ ناموفق علامت می‌خورد → برگشت کامل به‌عنوان سند جدید در دفتر (نه بازنویسی) → مشتری بازگردانده می‌شود → پذیرنده تسویه نمی‌شود. اگر تأیید برگشت گم شد، بازپخش از لاگ.",
          outcome: "در پنجرهٔ بازپخش دوباره‌تسویه صفر. نسبت بازگشت وجه آسیب ندید چون مشتری به نامهٔ اختلاف نیاز پیدا نکرد.",
        },
        {
          id: "R2",
          title: "برگشت جزئی روی سفارش چندقلمی",
          context: "یک قلم پس از ثبت لغو شد؛ بقیه سبد تحویل شد. قواعد ارائه‌دهنده و شبکه برای برگشت جزئی و کامل متفاوت است.",
          constraint: "مبلغ برگشت جزئی باید با باقیماندهٔ مجاز شبکه هم‌خوان باشد. دفتر باید سند اصلی ثبت را نگه دارد و سند برگشت جزئی را اضافه کند — هرگز ثبت را بازنویسی نکند.",
          path: "لغو سطح قلم → پیام برگشت جزئی → ماندهٔ فقط‌افزودنی → تسویهٔ پذیرنده فقط برای اقلام تحویل‌شده.",
          outcome: "دفتر مانده متعادل. ثبت یتیم نبود. بازبینی عملیات می‌توانست هر ریال را فقط از اسناد توضیح دهد.",
        },
        {
          id: "R3",
          title: "واگذاری اختلاف بازگشت وجه",
          context: "مشتری پس از تحویل اختلاف گذاشت. جابه‌جایی مسئولیت به تکمیل ۳DS و نگه‌داشتن مدرک داخل پنجرهٔ اختلاف وابسته بود.",
          constraint: "بستهٔ مدرک (لاگ احراز، سیگنال دستگاه، اثبات تحویل) باید در صورت تقاضا قابل استخراج باشد. گراف نشست‌های مرتبط نباید زیر حجم فرو بریزد.",
          path: "ورود اختلاف → مونتاژ مدرک از انبارهای فقط‌افزودنی → واگذاری به شبکه → دفتر حالت اختلاف را تا نتیجهٔ نهایی نگه می‌دارد.",
          outcome: "در صورت وجود مدرک، دفاع ممکن شد. حذف خاموش با تبدیل مدرک به بخش اصلی مسیر احراز از بین رفت.",
        },
        {
          id: "R4",
          title: "دستهٔ تطبیق دستی",
          context: "اختلاف پایان‌روز بین جمع سوییچ و جمع میزبان. میلیون‌ها ردیف؛ بازبینی انسانی نمی‌تواند مسیر اصلی باشد.",
          constraint: "شکست‌ها باید رتبه‌بندی شوند: مبلغ، سن، کلاس پذیرنده، تعداد تلاش مجدد. لمس دستی فقط برای کلاس‌های باقی‌مانده‌ای که خودکار بسته نمی‌شوند.",
          path: "مقایسهٔ شبانهٔ اسناد → صف باقی‌ماندهٔ رتبه‌بندی‌شده → بستن خودکار جایی که قاعده می‌خورد → صف انسانی فقط برای دم بلند → هر بستن یک سند به دفتر می‌نویسد.",
          outcome: "حجم تأیید دستی به مجموعهٔ باقی‌مانده کاهش یافت. تسویه برای اکثریت خودکار همان روز بسته شد.",
        },
      ],
    },
  },
};

export const publishedBench = [
  { id: "sla", labelEn: "Gateway auth SLA", labelFa: "SLA مجوز درگاه", value: "<250ms", noteEn: "End-to-end authorization", noteFa: "مجوز سر-تا-ته" },
  { id: "sms", labelEn: "National SMS burst", labelFa: "انفجار پیامک ملی", value: "50,000+ TPS", noteEn: "Combined MNO capacity", noteFa: "ظرفیت ترکیبی اپراتور" },
  { id: "cb", labelEn: "Chargeback ceiling", labelFa: "سقف چارجبک", value: "1.0%", noteEn: "Program monitoring limit", noteFa: "حد پایش برنامه" },
  { id: "l2", labelEn: "L2 settlement", labelFa: "تسویه لایه ۲", value: "4,000+ TPS", noteEn: "Off-chain batch proving", noteFa: "اثبات دستهٔ آف‌چین" },
];
