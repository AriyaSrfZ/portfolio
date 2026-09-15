import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL 
  : `${import.meta.env.BASE_URL}/`;

const navLinks = [
  { href: `${baseUrl}#expertise`, label: 'Expertise' },
  { href: `${baseUrl}#diagrams`, label: 'Diagrams' },
  { href: `${baseUrl}#work`, label: 'Case Studies' },
  { href: `${baseUrl}whitepapers`, label: 'Whitepapers' },
  { href: `${baseUrl}concepts`, label: 'Concepts' },
  { href: `${baseUrl}about`, label: 'About' },
  { href: `${baseUrl}#book`, label: 'Contact' },
];

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - lastY;
    if (current < 80) {
      setVisible(true);
    } else if (diff > 4) {
      setVisible(false);
    } else if (diff < -4) {
      setVisible(true);
    }
    setLastY(current);
  });

  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-4xl font-['IBM_Plex_Mono',monospace]"
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <nav className="relative bg-[var(--rugged-bg-nav)] border border-[var(--rugged-olive-border)] px-5 py-3 flex items-center justify-between shadow-2xl rugged-hatch">
        {/* Corner Rivets */}
        <span className="absolute -top-[3px] -left-[3px] w-[6px] h-[6px] bg-[var(--rugged-bg-nav)] border border-[var(--rugged-olive-border)] pointer-events-none" />
        <span className="absolute -top-[3px] -right-[3px] w-[6px] h-[6px] bg-[var(--rugged-bg-nav)] border border-[var(--rugged-olive-border)] pointer-events-none" />
        <span className="absolute -bottom-[3px] -left-[3px] w-[6px] h-[6px] bg-[var(--rugged-bg-nav)] border border-[var(--rugged-olive-border)] pointer-events-none" />
        <span className="absolute -bottom-[3px] -right-[3px] w-[6px] h-[6px] bg-[var(--rugged-bg-nav)] border border-[var(--rugged-olive-border)] pointer-events-none" />

        <a href={baseUrl} className="font-bold tracking-tight text-[var(--rugged-paper)] text-sm uppercase">
          Ariya Sarrafzadeh<span className="text-[var(--rugged-rust)]">.</span>
        </a>

        <ul className="hidden md:flex items-center gap-5 text-xs uppercase tracking-wider text-[var(--rugged-muted)]">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a 
                href={link.href} 
                className="hover:text-[var(--rugged-brass)] transition-colors focus-visible:outline-1 focus-visible:outline-[var(--rugged-brass)]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a 
          href={`${baseUrl}#book`} 
          className="md:hidden text-xs uppercase font-bold px-3 py-1 bg-[var(--rugged-rust)] text-[var(--rugged-bg-nav)] tracking-wider"
        >
          Contact
        </a>
      </nav>
    </motion.header>
  );
}