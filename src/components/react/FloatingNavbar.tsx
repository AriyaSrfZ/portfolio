import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL 
  : `${import.meta.env.BASE_URL}/`;

const inPageAnchors = [
  { href: `${baseUrl}#payment-settlement`, label: '01 // Settlements' },
  { href: `${baseUrl}#fraud-forensics`, label: '02 // Fraud Risk' },
  { href: `${baseUrl}#sms-gateway`, label: '03 // SMS Switch' },
];

const whitepaperDossiers = [
  { 
    spec: 'SPEC 01', 
    title: 'Payment Switch & Ledgers', 
    desc: 'ISO 8583, Redis locks & double-entry',
    href: `${baseUrl}whitepapers/payment-gateway.html` 
  },
  { 
    spec: 'SPEC 02', 
    title: 'Forensic Fraud Mitigation', 
    desc: 'Edge telemetry, 3DS 2.0 & ML vectors',
    href: `${baseUrl}whitepapers/fraud-tracing.html` 
  },
  { 
    spec: 'SPEC 03', 
    title: 'Web3 & Crypto State Machines', 
    desc: 'EVM opcode compute & rollup proofs',
    href: `${baseUrl}whitepapers/web3-infrastructure.html` 
  },
  { 
    spec: 'SPEC 04', 
    title: 'Telecom & SMS Infrastructure', 
    desc: 'Aggregators, SMPP 3.4 & RCS/MMS blocks',
    href: `${baseUrl}whitepapers/sms-infrastructure.html` 
  },
  { 
    spec: 'AI SPEC', 
    title: 'Agentic Workflows Architecture', 
    desc: 'Cognitive loops & DAG state machines',
    href: `${baseUrl}whitepaper.html` 
  },
];

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - lastY;
    if (current < 60) {
      setVisible(true);
    } else if (diff > 5) {
      setVisible(false);
      setDropdownOpen(false);
    } else if (diff < -5) {
      setVisible(true);
    }
    setLastY(current);
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1500px] font-['IBM_Plex_Mono',monospace]"
      animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      <nav className="relative bg-[#141210] border-2 border-[#5c6650] px-5 py-2.5 flex items-center justify-between shadow-2xl rugged-hatch">
        <span className="absolute -top-[4px] -left-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -top-[4px] -right-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -bottom-[4px] -left-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />
        <span className="absolute -bottom-[4px] -right-[4px] w-[7px] h-[7px] bg-[#141210] border border-[#c4562e] pointer-events-none" />

        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#c9a15a] animate-pulse" />
          <a href={baseUrl} className="font-bold text-xs sm:text-sm tracking-wider text-[#e8e2d5] uppercase hover:text-[#c9a15a] transition-colors">
            ARIYA SARRAFZADEH<span className="text-[#c4562e]">.</span>
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-wider text-[#a8a196]">
          {inPageAnchors.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#c9a15a] transition-colors py-1 focus-visible:outline-1 focus-visible:outline-[#c9a15a]"
            >
              {item.label}
            </a>
          ))}

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 border border-[#5c6650] hover:border-[#c4562e] hover:text-[#e8e2d5] text-[#c9a15a] font-bold text-xs uppercase transition-colors"
            >
              <span>Whitepapers [5]</span>
              <span className="text-[10px]">{dropdownOpen ? '▲' : '▼'}</span>
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full mt-2 w-96 bg-[#1c1916] border-2 border-[#5c6650] shadow-2xl p-2 z-50 rugged-hatch"
                >
                  <div className="px-3 py-1.5 border-b border-[#5c6650] mb-2 flex justify-between items-center text-[10px] text-[#a8a196] uppercase">
                    <span className="text-[#c4562e] font-bold">Engineering Dossiers</span>
                    <a href={`${baseUrl}whitepapers/`} className="text-[#c9a15a] hover:underline font-bold">
                      Open Hub &rarr;
                    </a>
                  </div>

                  <div className="space-y-1">
                    {whitepaperDossiers.map((doc) => (
                      <a
                        key={doc.href}
                        href={doc.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block p-2.5 bg-[#141210] border border-[#5c6650]/60 hover:border-[#c4562e] hover:bg-[#1c1916] transition group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-[#c9a15a] uppercase">{doc.spec}</span>
                          <span className="text-[10px] text-[#5c6650] group-hover:text-[#c4562e] transition">&rarr;</span>
                        </div>
                        <div className="text-xs font-bold text-[#e8e2d5] uppercase mt-0.5">{doc.title}</div>
                        <div className="text-[10px] text-[#a8a196] mt-1">{doc.desc}</div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a 
            href={`${baseUrl}#book`} 
            className="hover:text-[#e8e2d5] text-[#a8a196] transition-colors"
          >
            05 // Contact
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`${baseUrl}#book`}
            className="px-3 py-1.5 bg-[#c4562e] text-[#141210] font-bold text-xs uppercase tracking-wider hover:brightness-90 transition"
          >
            Dispatch Audit
          </a>
        </div>
      </nav>
    </motion.header>
  );
}