import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

const navLinks = [
  { href: `${import.meta.env.BASE_URL}#expertise`, label: 'Expertise' },
  { href: `${import.meta.env.BASE_URL}#diagrams`, label: 'Diagrams' },
  { href: `${import.meta.env.BASE_URL}#work`, label: 'Case Studies' },
  { href: `${import.meta.env.BASE_URL}concepts`, label: 'Concepts' },
  { href: `${import.meta.env.BASE_URL}about`, label: 'About' },
  { href: `${import.meta.env.BASE_URL}#book`, label: 'Book a Call' },
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
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-3xl"
      animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <a href={import.meta.env.BASE_URL} className="font-semibold tracking-tight text-(--color-text)">
          Ariya Sarrafzadeh<span className="text-gradient">.</span>
        </a>
        <ul className="hidden sm:flex items-center gap-6 text-sm text-(--color-text-muted)">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-(--color-text) transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#book" className="sm:hidden text-sm px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
          Book
        </a>
      </nav>
    </motion.header>
  );
}
