import os

def generate_svg_1():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 380" width="100%" height="100%" fill="none">
  <defs>
    <pattern id="grid-p1" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="chartGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
    </linearGradient>
    <linearGradient id="goldGrad1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e2c974"/>
      <stop offset="100%" stop-color="#fbbf24"/>
    </linearGradient>
    <style>
      text { font-family: 'IBM Plex Mono', -apple-system, monospace; user-select: none; }
      .mono { font-family: 'IBM Plex Mono', monospace; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="740" height="380" fill="#0b1120" rx="12"/>
  <rect width="740" height="380" fill="url(#grid-p1)" rx="12"/>
  <rect x="0.5" y="0.5" width="739" height="379" stroke="#334155" stroke-width="1" rx="12"/>
  <rect x="8" y="8" width="724" height="364" stroke="#334155" stroke-width="0.5" stroke-opacity="0.4" rx="8"/>

  <!-- Tactical Corner Crosshairs -->
  <path d="M 4 14 L 4 4 L 14 4" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 4 L 736 4 L 736 14" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 4 366 L 4 376 L 14 376" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 376 L 736 376 L 736 366" stroke="#e2c974" stroke-width="1.5" fill="none"/>

  <!-- Telemetry Header Bar -->
  <line x1="8" y1="36" x2="732" y2="36" stroke="#334155" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="18" y="16" width="6" height="6" fill="#06b6d4" rx="2"/>
  <text x="32" y="23" fill="#06b6d4" font-size="9" font-weight="700" letter-spacing="1.2">SPEC-ID: 8409-AS · 01 · PAYMENT SETTLEMENT SWITCH</text>
  <text x="430" y="23" fill="#94a3b8" font-size="8" letter-spacing="0.5">EVENT-DRIVEN LEDGER INVARIANTS</text>
  <rect x="620" y="13" width="102" height="17" fill="#111827" stroke="#334155" stroke-width="1" rx="4"/>
  <rect x="626" y="18" width="6" height="6" fill="#10b981" rx="2"/>
  <text x="638" y="24" fill="#10b981" font-size="7.5" font-weight="700" letter-spacing="0.5">SLA: &lt;50MS CLEAR</text>

  <!-- ================= MODULE 01: gRPC API INGRESS ================= -->
  <g id="mod-grpc">
    <rect x="24" y="48" width="144" height="142" fill="#111827" stroke="#06b6d4" stroke-width="1.5" rx="6"/>
    <rect x="24" y="48" width="144" height="22" fill="#06b6d4" rx="6"/>
    <text x="96" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">01 · INGRESS</text>
    <text x="96" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">gRPC API INGRESS</text>
    <text x="96" y="103" fill="#06b6d4" font-size="8" font-weight="700" text-anchor="middle">Port :8443 / TLS 1.3</text>
    <line x1="36" y1="112" x2="156" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="96" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">mTLS Mutual Auth</text>
    <text x="96" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Protobuf Serialization</text>
    <text x="96" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Burst Buffer: 50K TPS</text>
    <rect x="36" y="163" width="120" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="96" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">NONCE: VERIFIED</text>
  </g>

  <!-- Conduit 1 -> 2 -->
  <path d="M 168 119 L 202 119" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="204,119 194,114 194,124" fill="#06b6d4"/>
  <text x="186" y="111" fill="#06b6d4" font-size="7" font-weight="700" text-anchor="middle">CLAIM</text>

  <!-- ================= MODULE 02: REDIS SETNX LOCK ================= -->
  <g id="mod-redis">
    <rect x="204" y="48" width="150" height="142" fill="#111827" stroke="#e2c974" stroke-width="1.5" rx="6"/>
    <rect x="204" y="48" width="150" height="22" fill="#e2c974" rx="6"/>
    <text x="279" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">02 · MUTEX GUARD</text>
    <text x="279" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">REDIS SETNX LOCK</text>
    <text x="279" y="103" fill="#e2c974" font-size="8" font-weight="700" text-anchor="middle">TTL: 86,400s (24HR)</text>
    <line x1="216" y1="112" x2="342" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="279" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">O(1) Concurrency Lock</text>
    <text x="279" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Replay Window Shield</text>
    <text x="279" y="154" fill="#f8fafc" font-size="7.5" text-anchor="middle">Sentinel Cluster Quorum</text>
    <rect x="216" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="279" y="175" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">STATE: ACQUIRED</text>
  </g>

  <!-- Conduit 2 -> 3 -->
  <path d="M 354 119 L 388 119" stroke="#e2c974" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="390,119 380,114 380,124" fill="#e2c974"/>
  <text x="372" y="111" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">BITMAP</text>

  <!-- ================= MODULE 03: ISO 8583 HOST ROUTER ================= -->
  <g id="mod-iso">
    <rect x="390" y="48" width="150" height="142" fill="#111827" stroke="#334155" stroke-width="1.5" rx="6"/>
    <rect x="390" y="48" width="150" height="22" fill="#1e293b" rx="6"/>
    <text x="465" y="63" fill="#10b981" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">03 · HOST ROUTER</text>
    <text x="465" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">ISO 8583 ROUTER</text>
    <text x="465" y="103" fill="#10b981" font-size="8" font-weight="700" text-anchor="middle">H2H Switch Engine</text>
    <line x1="402" y1="112" x2="528" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="465" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">128-Bit Binary Bitmaps</text>
    <text x="465" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">MTI 0200 / 0210 / 0420</text>
    <text x="465" y="154" fill="#06b6d4" font-size="7.5" text-anchor="middle">Auto-Reverse on Timeout</text>
    <rect x="402" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="465" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">DISPATCH: ACTIVE</text>
  </g>

  <!-- Conduit 3 -> 4 -->
  <path d="M 540 119 L 574 119" stroke="#334155" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="576,119 566,114 566,124" fill="#334155"/>
  <text x="558" y="111" fill="#334155" font-size="7" font-weight="700" text-anchor="middle">REPLAY</text>

  <!-- ================= MODULE 04: SCYLLADB LEDGER ================= -->
  <g id="mod-ledger">
    <rect x="576" y="48" width="140" height="142" fill="#111827" stroke="#06b6d4" stroke-width="1.5" rx="6"/>
    <rect x="576" y="48" width="140" height="22" fill="#06b6d4" rx="6"/>
    <text x="646" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">04 · AUDIT LEDGER</text>
    <text x="646" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">SCYLLADB LEDGER</text>
    <text x="646" y="103" fill="#06b6d4" font-size="8" font-weight="700" text-anchor="middle">Double-Entry ACID</text>
    <line x1="588" y1="112" x2="704" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="646" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Append-Only Event Log</text>
    <text x="646" y="140" fill="#f8fafc" font-size="7.5" text-anchor="middle">Zero UPDATE Statements</text>
    <text x="646" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Partition: Account + Date</text>
    <rect x="588" y="163" width="116" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="646" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">BALANCE: IMMUTABLE</text>
  </g>

  <!-- ================= MATHEMATICAL DATA GRAPH (y=202 to 318) ================= -->
  <g id="data-graph-1">
    <rect x="24" y="202" width="692" height="116" fill="#111827" stroke="#334155" stroke-width="1" rx="8"/>
    
    <!-- Graph Header -->
    <text x="40" y="220" fill="#06b6d4" font-size="8" font-weight="700" letter-spacing="1">TELEMETRY: REAL-TIME SETTLEMENT LATENCY &amp; CONCURRENCY PROFILE</text>
    <text x="470" y="220" fill="#94a3b8" font-size="7.5">AVG: <tspan fill="#f8fafc" font-weight="700">12.4ms</tspan> · P99: <tspan fill="#e2c974" font-weight="700">38.6ms</tspan> · PEAK: <tspan fill="#06b6d4" font-weight="700">48.9K TPS</tspan></text>
    <line x1="24" y1="228" x2="716" y2="228" stroke="#334155" stroke-width="0.5"/>

    <!-- Graph Axis & Horizontal Guide Lines -->
    <line x1="44" y1="242" x2="696" y2="242" stroke="#ef4444" stroke-width="0.75" stroke-dasharray="4 4" stroke-opacity="0.7"/>
    <text x="698" y="244" fill="#ef4444" font-size="6.5" font-weight="700">50ms SLA CEILING</text>

    <line x1="44" y1="265" x2="696" y2="265" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="267" fill="#64748b" font-size="6.5">25ms</text>

    <line x1="44" y1="288" x2="696" y2="288" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="290" fill="#64748b" font-size="6.5">10ms</text>

    <line x1="44" y1="304" x2="696" y2="304" stroke="#334155" stroke-width="0.75"/>

    <!-- Shaded Mathematical Area Fill -->
    <path d="M 44 304 
             L 44 290 
             C 80 286, 120 272, 160 276 
             C 200 280, 230 252, 270 249 
             C 310 246, 350 268, 390 262 
             C 430 256, 460 236, 500 240 
             C 540 244, 570 260, 610 254 
             C 640 248, 670 272, 696 264 
             L 696 304 Z" 
          fill="url(#chartGrad1)"/>

    <!-- Main Mathematical Curve -->
    <path d="M 44 290 
             C 80 286, 120 272, 160 276 
             C 200 280, 230 252, 270 249 
             C 310 246, 350 268, 390 262 
             C 430 256, 460 236, 500 240 
             C 540 244, 570 260, 610 254 
             C 640 248, 670 272, 696 264" 
          stroke="#06b6d4" stroke-width="2" fill="none"/>

    <!-- Secondary Metric Line: Throughput Sparkline (Gold) -->
    <path d="M 44 298 
             C 90 295, 130 285, 170 280 
             C 210 275, 250 258, 270 255 
             C 320 250, 360 265, 410 260 
             C 450 255, 480 245, 500 244 
             C 550 242, 620 258, 696 252" 
          stroke="#e2c974" stroke-width="1.2" stroke-dasharray="3 2" fill="none"/>

    <!-- Peak Callout Point 1 -->
    <circle cx="270" cy="249" r="4" fill="#e2c974"/>
    <circle cx="270" cy="249" r="7" stroke="#e2c974" stroke-width="0.75" stroke-opacity="0.5" fill="none"/>
    <rect x="235" y="233" width="70" height="12" fill="#0b1120" stroke="#e2c974" stroke-width="0.75" rx="3"/>
    <text x="270" y="241" fill="#e2c974" font-size="6.5" font-weight="700" text-anchor="middle">PEAK 48.9K TPS</text>

    <!-- Peak Callout Point 2 (Latency Peak) -->
    <circle cx="500" cy="240" r="4" fill="#06b6d4"/>
    <circle cx="500" cy="240" r="7" stroke="#06b6d4" stroke-width="0.75" stroke-opacity="0.5" fill="none"/>
    <rect x="468" y="226" width="64" height="12" fill="#0b1120" stroke="#06b6d4" stroke-width="0.75" rx="3"/>
    <text x="500" y="234" fill="#06b6d4" font-size="6.5" font-weight="700" text-anchor="middle">P99: 38.6ms</text>

    <!-- Legend -->
    <line x1="44" y1="311" x2="56" y2="311" stroke="#06b6d4" stroke-width="2"/>
    <text x="60" y="313" fill="#94a3b8" font-size="6.5">Settlement Latency (ms)</text>
    <line x1="164" y1="311" x2="176" y2="311" stroke="#e2c974" stroke-width="1.2" stroke-dasharray="3 2"/>
    <text x="180" y="313" fill="#94a3b8" font-size="6.5">Throughput Rate (TPS)</text>
    <circle cx="280" cy="311" r="2.5" fill="#10b981"/>
    <text x="286" y="313" fill="#10b981" font-size="6.5">Zero Double-Settlement Drift</text>
  </g>

  <!-- ================= INVARIANT TELEMETRY FOOTER ================= -->
  <rect x="24" y="328" width="692" height="40" fill="#111827" stroke="#334155" stroke-width="1" rx="6"/>
  <rect x="24" y="328" width="4" height="40" fill="#06b6d4" rx="2"/>
  <text x="36" y="343" fill="#06b6d4" font-size="7.5" font-weight="700" letter-spacing="0.8">ARCHITECTURAL INVARIANT:</text>
  <text x="172" y="343" fill="#f8fafc" font-size="7.5">REQUEST STATE != SETTLEMENT FACT. ZERO DOUBLE-SETTLEMENT ACROSS 86,400s REPLAY WINDOWS.</text>
  <text x="36" y="358" fill="#94a3b8" font-size="7">FAILURE MODE MITIGATION: AUTOMATIC 0420 REVERSE COMMIT POSTED AS NEW LEDGER ROW UPON TIMEOUT. NO STATE DRIFT.</text>
</svg>'''

def generate_svg_2():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 380" width="100%" height="100%" fill="none">
  <defs>
    <pattern id="grid-p2" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="chartGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
    </linearGradient>
    <style>
      text { font-family: 'IBM Plex Mono', -apple-system, monospace; user-select: none; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="740" height="380" fill="#0b1120" rx="12"/>
  <rect width="740" height="380" fill="url(#grid-p2)" rx="12"/>
  <rect x="0.5" y="0.5" width="739" height="379" stroke="#334155" stroke-width="1" rx="12"/>
  <rect x="8" y="8" width="724" height="364" stroke="#334155" stroke-width="0.5" stroke-opacity="0.4" rx="8"/>

  <!-- Tactical Corner Crosshairs -->
  <path d="M 4 14 L 4 4 L 14 4" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 4 L 736 4 L 736 14" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 4 366 L 4 376 L 14 376" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 376 L 736 376 L 736 366" stroke="#e2c974" stroke-width="1.5" fill="none"/>

  <!-- Telemetry Header Bar -->
  <line x1="8" y1="36" x2="732" y2="36" stroke="#334155" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="18" y="16" width="6" height="6" fill="#06b6d4" rx="2"/>
  <text x="32" y="23" fill="#06b6d4" font-size="9" font-weight="700" letter-spacing="1.2">SPEC-ID: 8409-AS · 02 · FORENSIC EDGE FRAUD &amp; GRAPH TRACING</text>
  <text x="440" y="23" fill="#94a3b8" font-size="8" letter-spacing="0.5">REAL-TIME BEHAVIORAL VECTORS</text>
  <rect x="620" y="13" width="102" height="17" fill="#111827" stroke="#334155" stroke-width="1" rx="4"/>
  <rect x="626" y="18" width="6" height="6" fill="#10b981" rx="2"/>
  <text x="638" y="24" fill="#10b981" font-size="7.5" font-weight="700" letter-spacing="0.5">LOOP: &lt;15MS SLA</text>

  <!-- ================= MODULE 01: EDGE TELEMETRY ================= -->
  <g id="mod-telemetry">
    <rect x="24" y="48" width="144" height="142" fill="#111827" stroke="#06b6d4" stroke-width="1.5" rx="6"/>
    <rect x="24" y="48" width="144" height="22" fill="#06b6d4" rx="6"/>
    <text x="96" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">01 · EDGE SENSORS</text>
    <text x="96" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">CLIENT TELEMETRY</text>
    <text x="96" y="103" fill="#06b6d4" font-size="8" font-weight="700" text-anchor="middle">Entropy Hash / WebGL</text>
    <line x1="36" y1="112" x2="156" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="96" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Canvas Fingerprint</text>
    <text x="96" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Keystroke Dynamics</text>
    <text x="96" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">IP Cluster Velocity</text>
    <rect x="36" y="163" width="120" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="96" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">ENTROPY: 0.94 VALID</text>
  </g>

  <!-- Conduit 1 -> 2 -->
  <path d="M 168 119 L 202 119" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="204,119 194,114 194,124" fill="#06b6d4"/>
  <text x="186" y="111" fill="#06b6d4" font-size="7" font-weight="700" text-anchor="middle">TENSOR</text>

  <!-- ================= MODULE 02: RISK MATRIX ================= -->
  <g id="mod-vector">
    <rect x="204" y="48" width="150" height="142" fill="#111827" stroke="#e2c974" stroke-width="1.5" rx="6"/>
    <rect x="204" y="48" width="150" height="22" fill="#e2c974" rx="6"/>
    <text x="279" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">02 · SCORING ENGINE</text>
    <text x="279" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">VECTOR SCORER</text>
    <text x="279" y="103" fill="#e2c974" font-size="8" font-weight="700" text-anchor="middle">Vector [0.00 - 1.00]</text>
    <line x1="216" y1="112" x2="342" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="279" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Bayesian Threat Engine</text>
    <text x="279" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Behavior Anomaly Scorer</text>
    <text x="279" y="154" fill="#f8fafc" font-size="7.5" text-anchor="middle">Execution Time: 4.2ms</text>
    <rect x="216" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="279" y="175" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">SCORE: 0.18 NORMAL</text>
  </g>

  <!-- Conduit 2 -> 3 -->
  <path d="M 354 119 L 388 119" stroke="#e2c974" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="390,119 380,114 380,124" fill="#e2c974"/>
  <text x="372" y="111" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">ROUTING</text>

  <!-- ================= MODULE 03: 3DS 2.0 PROTOCOL ================= -->
  <g id="mod-3ds">
    <rect x="390" y="48" width="150" height="142" fill="#111827" stroke="#10b981" stroke-width="1.5" rx="6"/>
    <rect x="390" y="48" width="150" height="22" fill="#10b981" rx="6"/>
    <text x="465" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">03 · AUTH GATEWAY</text>
    <text x="465" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">3DS 2.0 GATEWAY</text>
    <text x="465" y="103" fill="#10b981" font-size="8" font-weight="700" text-anchor="middle">Liability Shift Engine</text>
    <line x1="402" y1="112" x2="528" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="465" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Frictionless (&lt;0.30)</text>
    <text x="465" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Biometric (0.30-0.75)</text>
    <text x="465" y="154" fill="#06b6d4" font-size="7.5" text-anchor="middle">Issuer ACS Direct Trunk</text>
    <rect x="402" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="465" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">GATE: PASSED [0.18]</text>
  </g>

  <!-- Conduit 3 -> 4 -->
  <path d="M 540 119 L 574 119" stroke="#334155" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="576,119 566,114 566,124" fill="#334155"/>
  <text x="558" y="111" fill="#334155" font-size="7" font-weight="700" text-anchor="middle">GRAPH</text>

  <!-- ================= MODULE 04: NEO4J FORENSIC GRAPH ================= -->
  <g id="mod-graph">
    <rect x="576" y="48" width="140" height="142" fill="#111827" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <rect x="576" y="48" width="140" height="22" fill="#38bdf8" rx="6"/>
    <text x="646" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">04 · FORENSICS</text>
    <text x="646" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">NEO4J CLUSTER</text>
    <text x="646" y="103" fill="#38bdf8" font-size="8" font-weight="700" text-anchor="middle">Temporal Graph Hop</text>
    <line x1="588" y1="112" x2="704" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="646" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Recursive Fund Tracing</text>
    <text x="646" y="140" fill="#f8fafc" font-size="7.5" text-anchor="middle">40+ Service Topology</text>
    <text x="646" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Syndicate Quarantine</text>
    <rect x="588" y="163" width="116" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="646" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">ISOLATION: READY</text>
  </g>

  <!-- ================= MATHEMATICAL DATA GRAPH (y=202 to 318) ================= -->
  <g id="data-graph-2">
    <rect x="24" y="202" width="692" height="116" fill="#111827" stroke="#334155" stroke-width="1" rx="8"/>
    
    <!-- Graph Header -->
    <text x="40" y="220" fill="#10b981" font-size="8" font-weight="700" letter-spacing="1">DISTRIBUTION: REAL-TIME TRANSACTION RISK DENSITY &amp; 15MS BUDGET</text>
    <text x="480" y="220" fill="#94a3b8" font-size="7.5">INGRESS: <tspan fill="#f8fafc" font-weight="700">1.8ms</tspan> · LOOKUP: <tspan fill="#f8fafc" font-weight="700">4.1ms</tspan> · MODEL: <tspan fill="#10b981" font-weight="700">4.8ms</tspan> · TOTAL: <tspan fill="#e2c974" font-weight="700">10.7ms</tspan></text>
    <line x1="24" y1="228" x2="716" y2="228" stroke="#334155" stroke-width="0.5"/>

    <!-- Three Risk Zones Shading -->
    <!-- Zone 1: Frictionless (0 to 0.30) -->
    <rect x="44" y="232" width="220" height="72" fill="#10b981" fill-opacity="0.08"/>
    <text x="154" y="244" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">FRICTIONLESS PASS (&lt;0.30) · 94.2%</text>

    <!-- Zone 2: 3DS 2.0 Challenge (0.30 to 0.75) -->
    <rect x="264" y="232" width="260" height="72" fill="#e2c974" fill-opacity="0.08"/>
    <text x="394" y="244" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">3DS 2.0 STEP-UP (0.30 - 0.75) · 5.3%</text>

    <!-- Zone 3: Quarantine (>0.75) -->
    <rect x="524" y="232" width="172" height="72" fill="#06b6d4" fill-opacity="0.08"/>
    <text x="610" y="244" fill="#06b6d4" font-size="7" font-weight="700" text-anchor="middle">NEO4J QUARANTINE (&gt;0.75) · 0.5%</text>

    <!-- Baseline & Guides -->
    <line x1="44" y1="304" x2="696" y2="304" stroke="#334155" stroke-width="0.75"/>
    <line x1="264" y1="232" x2="264" y2="304" stroke="#e2c974" stroke-width="0.75" stroke-dasharray="3 3"/>
    <line x1="524" y1="232" x2="524" y2="304" stroke="#06b6d4" stroke-width="0.75" stroke-dasharray="3 3"/>

    <!-- Mathematical Gaussian Bell Curve Area -->
    <path d="M 44 304 
             L 44 300 
             C 90 300, 130 260, 170 248 
             C 210 236, 240 252, 280 274 
             C 340 300, 420 302, 500 303 
             C 580 304, 650 304, 696 304 Z" 
          fill="url(#chartGrad2)"/>

    <!-- Smooth Mathematical Curve Line -->
    <path d="M 44 300 
             C 90 300, 130 260, 170 248 
             C 210 236, 240 252, 280 274 
             C 340 300, 420 302, 500 303 
             C 580 304, 650 304, 696 304" 
          stroke="#10b981" stroke-width="2" fill="none"/>

    <!-- Current Transaction Point (Score 0.18) -->
    <circle cx="170" cy="248" r="4.5" fill="#10b981"/>
    <circle cx="170" cy="248" r="8" stroke="#10b981" stroke-width="0.75" stroke-opacity="0.6" fill="none"/>
    <rect x="130" y="258" width="80" height="12" fill="#0b1120" stroke="#10b981" stroke-width="0.75" rx="3"/>
    <text x="170" y="266" fill="#10b981" font-size="6.5" font-weight="700" text-anchor="middle">ACTIVE: SCORE 0.18</text>

    <!-- Execution Timeline Bar (Bottom) -->
    <text x="44" y="313" fill="#94a3b8" font-size="6.5">EXECUTION TIMELINE (10.7ms of 15ms SLA):</text>
    <rect x="220" y="308" width="30" height="5" fill="#06b6d4" rx="1"/>
    <rect x="252" y="308" width="60" height="5" fill="#e2c974" rx="1"/>
    <rect x="314" y="308" width="70" height="5" fill="#10b981" rx="1"/>
    <rect x="386" y="308" width="64" height="5" fill="#334155" rx="1"/>
    <text x="456" y="313" fill="#10b981" font-size="6.5" font-weight="700">PASS (MARGIN: 4.3ms)</text>
  </g>

  <!-- ================= INVARIANT TELEMETRY FOOTER ================= -->
  <rect x="24" y="328" width="692" height="40" fill="#111827" stroke="#334155" stroke-width="1" rx="6"/>
  <rect x="24" y="328" width="4" height="40" fill="#10b981" rx="2"/>
  <text x="36" y="343" fill="#10b981" font-size="7.5" font-weight="700" letter-spacing="0.8">ARCHITECTURAL INVARIANT:</text>
  <text x="172" y="343" fill="#f8fafc" font-size="7.5">RISK EVALUATION LOOP SLA &lt; 15MS. FORENSIC EVIDENCE COURT-ADMISSIBLE UNDER SECTION 30.</text>
  <text x="36" y="358" fill="#94a3b8" font-size="7">FAILURE MODE MITIGATION: GRAPH-ISOLATED SYNDICATE QUARANTINE BLOCKS 100% DISTRIBUTED TAKEOVER DRIFT.</text>
</svg>'''

def generate_svg_3():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 380" width="100%" height="100%" fill="none">
  <defs>
    <pattern id="grid-p3" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="chartGrad3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0.0"/>
    </linearGradient>
    <style>
      text { font-family: 'IBM Plex Mono', -apple-system, monospace; user-select: none; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="740" height="380" fill="#0b1120" rx="12"/>
  <rect width="740" height="380" fill="url(#grid-p3)" rx="12"/>
  <rect x="0.5" y="0.5" width="739" height="379" stroke="#334155" stroke-width="1" rx="12"/>
  <rect x="8" y="8" width="724" height="364" stroke="#334155" stroke-width="0.5" stroke-opacity="0.4" rx="8"/>

  <!-- Tactical Corner Crosshairs -->
  <path d="M 4 14 L 4 4 L 14 4" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 4 L 736 4 L 736 14" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 4 366 L 4 376 L 14 376" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 376 L 736 376 L 736 366" stroke="#e2c974" stroke-width="1.5" fill="none"/>

  <!-- Telemetry Header Bar -->
  <line x1="8" y1="36" x2="732" y2="36" stroke="#334155" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="18" y="16" width="6" height="6" fill="#06b6d4" rx="2"/>
  <text x="32" y="23" fill="#06b6d4" font-size="9" font-weight="700" letter-spacing="1.2">SPEC-ID: 8409-AS · 03 · NATIONAL TELECOM SMS ROUTING HUB</text>
  <text x="440" y="23" fill="#94a3b8" font-size="8" letter-spacing="0.5">SMPP 3.4 / CARRIER CONDUITS</text>
  <rect x="620" y="13" width="102" height="17" fill="#111827" stroke="#334155" stroke-width="1" rx="4"/>
  <rect x="626" y="18" width="6" height="6" fill="#10b981" rx="2"/>
  <text x="638" y="24" fill="#10b981" font-size="7.5" font-weight="700" letter-spacing="0.5">BURST: 50K TPS</text>

  <!-- ================= MODULE 01: QUEUE INGRESS PARTITIONS ================= -->
  <g id="mod-queue">
    <rect x="24" y="48" width="140" height="142" fill="#111827" stroke="#06b6d4" stroke-width="1.5" rx="6"/>
    <rect x="24" y="48" width="140" height="22" fill="#06b6d4" rx="6"/>
    <text x="94" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">01 · INGRESS QUEUE</text>
    <text x="94" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">QUEUE PARTITION</text>
    <text x="94" y="103" fill="#06b6d4" font-size="8" font-weight="700" text-anchor="middle">Priority Layer Split</text>
    <line x1="36" y1="112" x2="152" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="94" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Isolated Banking OTP</text>
    <text x="94" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Bulk Marketing Throttle</text>
    <text x="94" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Zero Priority Bleed</text>
    <rect x="36" y="163" width="116" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="94" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">QUEUE: ISOLATED</text>
  </g>

  <!-- Conduit 1 -> 2 -->
  <path d="M 164 119 L 198 119" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="200,119 190,114 190,124" fill="#06b6d4"/>
  <text x="182" y="111" fill="#06b6d4" font-size="7" font-weight="700" text-anchor="middle">PDU</text>

  <!-- ================= MODULE 02: SMPP WINDOW CONTROLLER ================= -->
  <g id="mod-smpp">
    <rect x="200" y="48" width="154" height="142" fill="#111827" stroke="#e2c974" stroke-width="1.5" rx="6"/>
    <rect x="200" y="48" width="154" height="22" fill="#e2c974" rx="6"/>
    <text x="277" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">02 · SLIDING WINDOW</text>
    <text x="277" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">SMPP 3.4 ENGINE</text>
    <text x="277" y="103" fill="#e2c974" font-size="8" font-weight="700" text-anchor="middle">Window: 16 - 64 PDU</text>
    <line x1="212" y1="112" x2="342" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="277" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Dynamic Throttle Control</text>
    <text x="277" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">TCP Keep-Alive Keepers</text>
    <text x="277" y="154" fill="#f8fafc" font-size="7.5" text-anchor="middle">In-Flight Buffer Pool</text>
    <rect x="212" y="163" width="130" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="277" y="175" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">WINDOW: 48 PDU ACTIVE</text>
  </g>

  <!-- Conduit 2 -> 3 -->
  <path d="M 354 119 L 388 119" stroke="#e2c974" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="390,119 380,114 380,124" fill="#e2c974"/>
  <text x="372" y="111" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">HLR</text>

  <!-- ================= MODULE 03: TELECOM GUARD ================= -->
  <g id="mod-guard">
    <rect x="390" y="48" width="150" height="142" fill="#111827" stroke="#10b981" stroke-width="1.5" rx="6"/>
    <rect x="390" y="48" width="150" height="22" fill="#10b981" rx="6"/>
    <text x="465" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">03 · DND &amp; HLR</text>
    <text x="465" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">TELECOM GUARD</text>
    <text x="465" y="103" fill="#10b981" font-size="8" font-weight="700" text-anchor="middle">Pre-Billing Scrub</text>
    <line x1="402" y1="112" x2="528" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="465" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Real-Time HLR Validation</text>
    <text x="465" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">*800# DND Blacklist</text>
    <text x="465" y="154" fill="#06b6d4" font-size="7.5" text-anchor="middle">UCS-2 70-Char Slicer</text>
    <rect x="402" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="465" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">SCRUB: 100% CLEAN</text>
  </g>

  <!-- Conduit 3 -> 4 -->
  <path d="M 540 119 L 574 119" stroke="#334155" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="576,119 566,114 566,124" fill="#334155"/>
  <text x="558" y="111" fill="#334155" font-size="7" font-weight="700" text-anchor="middle">TRUNK</text>

  <!-- ================= MODULE 04: OPERATOR GATEWAY ================= -->
  <g id="mod-carrier">
    <rect x="576" y="48" width="140" height="142" fill="#111827" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <rect x="576" y="48" width="140" height="22" fill="#38bdf8" rx="6"/>
    <text x="646" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">04 · CARRIERS</text>
    <text x="646" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">OPERATOR GATEWAY</text>
    <text x="646" y="103" fill="#38bdf8" font-size="8" font-weight="700" text-anchor="middle">MCI / MTN / Rightel</text>
    <line x1="588" y1="112" x2="704" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="646" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Prefix Load Balancing</text>
    <text x="646" y="140" fill="#f8fafc" font-size="7.5" text-anchor="middle">Asynchronous DLR Loop</text>
    <text x="646" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">1B+ Yearly Deliveries</text>
    <rect x="588" y="163" width="116" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="646" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">TRUNKS: ACTIVE</text>
  </g>

  <!-- ================= MATHEMATICAL DATA GRAPH (y=202 to 318) ================= -->
  <g id="data-graph-3">
    <rect x="24" y="202" width="692" height="116" fill="#111827" stroke="#334155" stroke-width="1" rx="8"/>
    
    <!-- Graph Header -->
    <text x="40" y="220" fill="#06b6d4" font-size="8" font-weight="700" letter-spacing="1">THROUGHPUT: CARRIER MESSAGE RATE &amp; QUEUE LATENCY (50,000 PEAK TPS)</text>
    <text x="460" y="220" fill="#94a3b8" font-size="7.5">OTP LATENCY: <tspan fill="#10b981" font-weight="700">&lt;450ms</tspan> · PEAK: <tspan fill="#06b6d4" font-weight="700">52.4K TPS</tspan> · DELIVERED: <tspan fill="#e2c974" font-weight="700">99.8%</tspan></text>
    <line x1="24" y1="228" x2="716" y2="228" stroke="#334155" stroke-width="0.5"/>

    <!-- Grid Horizontal Lines -->
    <line x1="44" y1="242" x2="696" y2="242" stroke="#334155" stroke-width="0.5" stroke-dasharray="3 3"/>
    <text x="698" y="244" fill="#64748b" font-size="6.5">50K TPS</text>

    <line x1="44" y1="265" x2="696" y2="265" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="267" fill="#64748b" font-size="6.5">25K TPS</text>

    <line x1="44" y1="288" x2="696" y2="288" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="290" fill="#64748b" font-size="6.5">10K TPS</text>

    <line x1="44" y1="304" x2="696" y2="304" stroke="#334155" stroke-width="0.75"/>

    <!-- High-Throughput Burst Area Fill -->
    <path d="M 44 304 
             L 44 290 
             C 100 290, 150 255, 210 248 
             C 270 241, 310 216, 370 212 
             C 430 208, 470 252, 530 250 
             C 590 248, 640 236, 696 230 
             L 696 304 Z" 
          fill="url(#chartGrad3)"/>

    <!-- High-Throughput Burst Line -->
    <path d="M 44 290 
             C 100 290, 150 255, 210 248 
             C 270 241, 310 216, 370 212 
             C 430 208, 470 252, 530 250 
             C 590 248, 640 236, 696 230" 
          stroke="#06b6d4" stroke-width="2" fill="none"/>

    <!-- Ultra-Flat OTP Latency Line (Emerald Flat Line) -->
    <path d="M 44 294 L 696 294" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 2"/>

    <!-- Peak Throughput Callout Point -->
    <circle cx="370" cy="212" r="4" fill="#06b6d4"/>
    <circle cx="370" cy="212" r="7" stroke="#06b6d4" stroke-width="0.75" stroke-opacity="0.6" fill="none"/>
    <rect x="330" y="218" width="80" height="12" fill="#0b1120" stroke="#06b6d4" stroke-width="0.75" rx="3"/>
    <text x="370" y="226" fill="#06b6d4" font-size="6.5" font-weight="700" text-anchor="middle">PEAK 52,400 TPS</text>

    <!-- Legend -->
    <line x1="44" y1="311" x2="56" y2="311" stroke="#06b6d4" stroke-width="2"/>
    <text x="60" y="313" fill="#94a3b8" font-size="6.5">Campaign Volume Throughput</text>
    <line x1="190" y1="311" x2="202" y2="311" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4 2"/>
    <text x="206" y="313" fill="#10b981" font-size="6.5">Isolated Banking OTP Latency (&lt;450ms)</text>
    <circle cx="380" cy="311" r="2.5" fill="#e2c974"/>
    <text x="386" y="313" fill="#e2c974" font-size="6.5">SMPP Dynamic Window Tune (64 Sessions)</text>
  </g>

  <!-- ================= INVARIANT TELEMETRY FOOTER ================= -->
  <rect x="24" y="328" width="692" height="40" fill="#111827" stroke="#334155" stroke-width="1" rx="6"/>
  <rect x="24" y="328" width="4" height="40" fill="#06b6d4" rx="2"/>
  <text x="36" y="343" fill="#06b6d4" font-size="7.5" font-weight="700" letter-spacing="0.8">ARCHITECTURAL INVARIANT:</text>
  <text x="172" y="343" fill="#f8fafc" font-size="7.5">CRITICAL BANKING OTP MUST NEVER SHARE SLIDING WINDOW BUFFERS WITH BULK ADVERTISING.</text>
  <text x="36" y="358" fill="#94a3b8" font-size="7">FAILURE MODE MITIGATION: AUTOMATIC SMPP THROTTLE SHEDDING &amp; CARRIER PREFIX BALANCING PREVENTS OPERATOR TIMEOUT.</text>
</svg>'''

def generate_svg_4():
    return '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 380" width="100%" height="100%" fill="none">
  <defs>
    <pattern id="grid-p4" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" stroke-width="0.5" stroke-opacity="0.6"/>
    </pattern>
    <linearGradient id="chartGrad4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e2c974" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e2c974" stop-opacity="0.0"/>
    </linearGradient>
    <style>
      text { font-family: 'IBM Plex Mono', -apple-system, monospace; user-select: none; }
    </style>
  </defs>

  <!-- Background Canvas -->
  <rect width="740" height="380" fill="#0b1120" rx="12"/>
  <rect width="740" height="380" fill="url(#grid-p4)" rx="12"/>
  <rect x="0.5" y="0.5" width="739" height="379" stroke="#334155" stroke-width="1" rx="12"/>
  <rect x="8" y="8" width="724" height="364" stroke="#334155" stroke-width="0.5" stroke-opacity="0.4" rx="8"/>

  <!-- Tactical Corner Crosshairs -->
  <path d="M 4 14 L 4 4 L 14 4" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 4 L 736 4 L 736 14" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 4 366 L 4 376 L 14 376" stroke="#e2c974" stroke-width="1.5" fill="none"/>
  <path d="M 726 376 L 736 376 L 736 366" stroke="#e2c974" stroke-width="1.5" fill="none"/>

  <!-- Telemetry Header Bar -->
  <line x1="8" y1="36" x2="732" y2="36" stroke="#334155" stroke-width="1" stroke-opacity="0.6"/>
  <rect x="18" y="16" width="6" height="6" fill="#06b6d4" rx="2"/>
  <text x="32" y="23" fill="#06b6d4" font-size="9" font-weight="700" letter-spacing="1.2">SPEC-ID: 8409-AS · 04 · SMART DB v1 DATA PIPELINE</text>
  <text x="440" y="23" fill="#94a3b8" font-size="8" letter-spacing="0.5">100M CONTACT CONSOLIDATION</text>
  <rect x="620" y="13" width="102" height="17" fill="#111827" stroke="#334155" stroke-width="1" rx="4"/>
  <rect x="626" y="18" width="6" height="6" fill="#10b981" rx="2"/>
  <text x="638" y="24" fill="#10b981" font-size="7.5" font-weight="700" letter-spacing="0.5">SCALE: 100M RECS</text>

  <!-- ================= MODULE 01: RAW INGESTION ================= -->
  <g id="mod-raw">
    <rect x="24" y="48" width="144" height="142" fill="#111827" stroke="#06b6d4" stroke-width="1.5" rx="6"/>
    <rect x="24" y="48" width="144" height="22" fill="#06b6d4" rx="6"/>
    <text x="96" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">01 · RAW INGESTION</text>
    <text x="96" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">UNSTRUCTURED DUMPS</text>
    <text x="96" y="103" fill="#06b6d4" font-size="8" font-weight="700" text-anchor="middle">94.7M Sparse Rows</text>
    <line x1="36" y1="112" x2="156" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="96" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Operator TSV/CSV Dumps</text>
    <text x="96" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Inconsistent Schema Map</text>
    <text x="96" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Phonetic Variations</text>
    <rect x="36" y="163" width="120" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="96" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">INGEST: COMPLETE</text>
  </g>

  <!-- Conduit 1 -> 2 -->
  <path d="M 168 119 L 202 119" stroke="#06b6d4" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="204,119 194,114 194,124" fill="#06b6d4"/>
  <text x="186" y="111" fill="#06b6d4" font-size="7" font-weight="700" text-anchor="middle">STREAM</text>

  <!-- ================= MODULE 02: NORMALIZATION ================= -->
  <g id="mod-clean">
    <rect x="204" y="48" width="150" height="142" fill="#111827" stroke="#e2c974" stroke-width="1.5" rx="6"/>
    <rect x="204" y="48" width="150" height="22" fill="#e2c974" rx="6"/>
    <text x="279" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">02 · NORMALIZATION</text>
    <text x="279" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">DETERMINISTIC CLEANER</text>
    <text x="279" y="103" fill="#e2c974" font-size="8" font-weight="700" text-anchor="middle">Persian Text &amp; Phonetics</text>
    <line x1="216" y1="112" x2="342" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="279" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">Arabic/Persian Char Fix</text>
    <text x="279" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">Phonetic Blocking Hash</text>
    <text x="279" y="154" fill="#f8fafc" font-size="7.5" text-anchor="middle">Entity Deduplication</text>
    <rect x="216" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="279" y="175" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">ACCURACY: 70% MATCH</text>
  </g>

  <!-- Conduit 2 -> 3 -->
  <path d="M 354 119 L 388 119" stroke="#e2c974" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="390,119 380,114 380,124" fill="#e2c974"/>
  <text x="372" y="111" fill="#e2c974" font-size="7" font-weight="700" text-anchor="middle">PARQUET</text>

  <!-- ================= MODULE 03: DUCKDB VECTOR STORE ================= -->
  <g id="mod-duckdb">
    <rect x="390" y="48" width="150" height="142" fill="#111827" stroke="#10b981" stroke-width="1.5" rx="6"/>
    <rect x="390" y="48" width="150" height="22" fill="#10b981" rx="6"/>
    <text x="465" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">03 · COLUMNAR ENGINE</text>
    <text x="465" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">DUCKDB VECTOR STORE</text>
    <text x="465" y="103" fill="#10b981" font-size="8" font-weight="700" text-anchor="middle">Snappy Compressed</text>
    <line x1="402" y1="112" x2="528" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="465" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">In-Memory Execution</text>
    <text x="465" y="140" fill="#94a3b8" font-size="7.5" text-anchor="middle">70% Disk Space Savings</text>
    <text x="465" y="154" fill="#06b6d4" font-size="7.5" text-anchor="middle">Zero RDBMS Bottlenecks</text>
    <rect x="402" y="163" width="126" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="465" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">STORE: OPTIMIZED</text>
  </g>

  <!-- Conduit 3 -> 4 -->
  <path d="M 540 119 L 574 119" stroke="#334155" stroke-width="2" stroke-dasharray="4 2"/>
  <polygon points="576,119 566,114 566,124" fill="#334155"/>
  <text x="558" y="111" fill="#334155" font-size="7" font-weight="700" text-anchor="middle">INDEX</text>

  <!-- ================= MODULE 04: ELASTICSEARCH HUB ================= -->
  <g id="mod-elastic">
    <rect x="576" y="48" width="140" height="142" fill="#111827" stroke="#38bdf8" stroke-width="1.5" rx="6"/>
    <rect x="576" y="48" width="140" height="22" fill="#38bdf8" rx="6"/>
    <text x="646" y="63" fill="#0b1120" font-size="8.5" font-weight="700" text-anchor="middle" letter-spacing="1">04 · SEARCH HUB</text>
    <text x="646" y="88" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">ELASTICSEARCH CLUSTER</text>
    <text x="646" y="103" fill="#38bdf8" font-size="8" font-weight="700" text-anchor="middle">Distributed Lucene</text>
    <line x1="588" y1="112" x2="704" y2="112" stroke="#334155" stroke-width="0.8" stroke-dasharray="2 2"/>
    <text x="646" y="126" fill="#94a3b8" font-size="7.5" text-anchor="middle">100M Attribute Queries</text>
    <text x="646" y="140" fill="#f8fafc" font-size="7.5" text-anchor="middle">Sub-25ms Response SLA</text>
    <text x="646" y="154" fill="#e2c974" font-size="7.5" text-anchor="middle">Dedicated Gateway Auth</text>
    <rect x="588" y="163" width="116" height="18" fill="#0b1120" stroke="#334155" stroke-width="1" rx="4"/>
    <text x="646" y="175" fill="#10b981" font-size="7" font-weight="700" text-anchor="middle">STATUS: SERVING</text>
  </g>

  <!-- ================= MATHEMATICAL DATA GRAPH (y=202 to 318) ================= -->
  <g id="data-graph-4">
    <rect x="24" y="202" width="692" height="116" fill="#111827" stroke="#334155" stroke-width="1" rx="8"/>
    
    <!-- Graph Header -->
    <text x="40" y="220" fill="#e2c974" font-size="8" font-weight="700" letter-spacing="1">COMPACTION: DATASET REDUCTION STEPS &amp; PREDICTION ACCURACY CURVE</text>
    <text x="460" y="220" fill="#94a3b8" font-size="7.5">RAW: <tspan fill="#f8fafc" font-weight="700">180GB</tspan> → SNAPPY: <tspan fill="#10b981" font-weight="700">54GB (-70%)</tspan> · ACCURACY: <tspan fill="#06b6d4" font-weight="700">70.4%</tspan></text>
    <line x1="24" y1="228" x2="716" y2="228" stroke="#334155" stroke-width="0.5"/>

    <!-- Grid Horizontal Lines -->
    <line x1="44" y1="242" x2="696" y2="242" stroke="#334155" stroke-width="0.5" stroke-dasharray="3 3"/>
    <text x="698" y="244" fill="#64748b" font-size="6.5">180 GB</text>

    <line x1="44" y1="265" x2="696" y2="265" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="267" fill="#64748b" font-size="6.5">100 GB</text>

    <line x1="44" y1="288" x2="696" y2="288" stroke="#334155" stroke-width="0.5" stroke-dasharray="2 2"/>
    <text x="698" y="290" fill="#64748b" font-size="6.5">50 GB</text>

    <line x1="44" y1="304" x2="696" y2="304" stroke="#334155" stroke-width="0.75"/>

    <!-- Step Down Waterfall Compaction Area -->
    <path d="M 44 304 
             L 44 242 
             L 220 242 
             L 220 268 
             L 430 268 
             L 430 288 
             L 696 288 
             L 696 304 Z" 
          fill="url(#chartGrad4)"/>

    <path d="M 44 242 
             L 220 242 
             L 220 268 
             L 430 268 
             L 430 288 
             L 696 288" 
          stroke="#e2c974" stroke-width="2" fill="none"/>

    <!-- Prediction Accuracy Curve (Rising Cyan Curve) -->
    <path d="M 44 300 
             C 120 295, 200 280, 280 260 
             C 360 242, 480 234, 696 232" 
          stroke="#06b6d4" stroke-width="2" fill="none"/>

    <!-- Accuracy Callout Point -->
    <circle cx="600" cy="233" r="4" fill="#06b6d4"/>
    <circle cx="600" cy="233" r="7" stroke="#06b6d4" stroke-width="0.75" stroke-opacity="0.6" fill="none"/>
    <rect x="540" y="238" width="120" height="12" fill="#0b1120" stroke="#06b6d4" stroke-width="0.75" rx="3"/>
    <text x="600" y="246" fill="#06b6d4" font-size="6.5" font-weight="700" text-anchor="middle">PRE-KYC ACCURACY: 70.4%</text>

    <!-- Compaction Callout Point -->
    <circle cx="430" cy="288" r="4" fill="#10b981"/>
    <rect x="375" y="272" width="110" height="12" fill="#0b1120" stroke="#10b981" stroke-width="0.75" rx="3"/>
    <text x="430" y="280" fill="#10b981" font-size="6.5" font-weight="700" text-anchor="middle">54GB PARQUET (-70%)</text>

    <!-- Legend -->
    <line x1="44" y1="311" x2="56" y2="311" stroke="#e2c974" stroke-width="2"/>
    <text x="60" y="313" fill="#94a3b8" font-size="6.5">Storage Footprint (180GB → 54GB)</text>
    <line x1="220" y1="311" x2="232" y2="311" stroke="#06b6d4" stroke-width="2"/>
    <text x="236" y="313" fill="#06b6d4" font-size="6.5">Predictive Behavior Match Accuracy (70.4%)</text>
    <circle cx="430" cy="311" r="2.5" fill="#10b981"/>
    <text x="436" y="313" fill="#10b981" font-size="6.5">Snappy In-Memory Compaction</text>
  </g>

  <!-- ================= INVARIANT TELEMETRY FOOTER ================= -->
  <rect x="24" y="328" width="692" height="40" fill="#111827" stroke="#334155" stroke-width="1" rx="6"/>
  <rect x="24" y="328" width="4" height="40" fill="#06b6d4" rx="2"/>
  <text x="36" y="343" fill="#06b6d4" font-size="7.5" font-weight="700" letter-spacing="0.8">ARCHITECTURAL INVARIANT:</text>
  <text x="172" y="343" fill="#f8fafc" font-size="7.5">ZERO PRODUCTION RDBMS DEGRADATION DURING PETABYTE MULTI-ATTRIBUTE AGGREGATIONS.</text>
  <text x="36" y="358" fill="#94a3b8" font-size="7">FAILURE MODE MITIGATION: READ PATH AIR-GAPPED VIA REPLICATED DUCKDB &amp; ELASTICSEARCH CLUSTER WITH LOCAL CACHE.</text>
</svg>'''

if __name__ == '__main__':
    os.makedirs('public/diagrams', exist_ok=True)
    
    # Write to placeholder files as well as semantic filenames
    with open('public/diagrams/placeholder-1.svg', 'w') as f:
        f.write(generate_svg_1())
    with open('public/diagrams/placeholder-2.svg', 'w') as f:
        f.write(generate_svg_2())
    with open('public/diagrams/placeholder-3.svg', 'w') as f:
        f.write(generate_svg_3())
    with open('public/diagrams/placeholder-4.svg', 'w') as f:
        f.write(generate_svg_4())

    with open('public/diagrams/payment-switch-architecture.svg', 'w') as f:
        f.write(generate_svg_1())
    with open('public/diagrams/fraud-tracing-architecture.svg', 'w') as f:
        f.write(generate_svg_2())
    with open('public/diagrams/sms-routing-architecture.svg', 'w') as f:
        f.write(generate_svg_3())
    with open('public/diagrams/data-pipeline-architecture.svg', 'w') as f:
        f.write(generate_svg_4())
        
    print("All 4 comprehensive SVG graphs generated successfully!")
