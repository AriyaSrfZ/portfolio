import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function AuroraBackground({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-[90vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 60, -20, 0],
            y: [0, 40, 80, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-[65vw] h-[65vw] max-w-[750px] max-h-[750px] rounded-full opacity-55"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, -50, 30, 0],
            y: [0, -30, -60, 0],
            scale: [1, 1.1, 1.2, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full opacity-45"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
            filter: 'blur(65px)',
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
