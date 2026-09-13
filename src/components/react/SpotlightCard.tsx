import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { BorderBeam } from 'border-beam';
import type { ReactNode, MouseEvent } from 'react';

export default function SpotlightCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(124, 58, 237, 0.18), transparent 65%)`;

  return (
    <BorderBeam size="pulse-inner" colorVariant="ocean" theme="dark" strength={0.6}>
      <div
        onMouseMove={handleMouseMove}
        className={`relative overflow-hidden glass rounded-2xl p-6 group ${className}`}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </BorderBeam>
  );
}
