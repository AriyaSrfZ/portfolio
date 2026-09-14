import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function AuroraBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen items-center justify-start overflow-hidden bg-[#05060a]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Cyan / Slate Glow */}
        <motion.div
          className="absolute -top-10 left-1/4 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, 40, -30, 0],
            y: [0, 30, 50, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Deep Emerald / Teal Glow */}
        <motion.div
          className="absolute top-1/4 -right-10 w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #0d9488 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
          animate={{
            x: [0, -40, 20, 0],
            y: [0, -30, -50, 0],
            scale: [1, 1.05, 1.15, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
