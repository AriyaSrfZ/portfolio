import { useEffect, useState } from 'react';

export type ActiveEnvironment = 'core' | 'switch' | 'recon' | 'incidents';

export default function BackgroundController() {
  const [activeEnv, setActiveEnv] = useState<ActiveEnvironment>('core');
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    // 1. Mouse move tracker for interactive telemetry gradient
    const handleMouseMove = (e: MouseEvent) => {
      const x = Math.round((e.clientX / window.innerWidth) * 100);
      const y = Math.round((e.clientY / window.innerHeight) * 100);
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Custom event listener from HUD tabs
    const handleEnvChange = (e: Event) => {
      const customEvent = e as CustomEvent<ActiveEnvironment>;
      if (customEvent.detail) {
        setActiveEnv(customEvent.detail);
      }
    };
    window.addEventListener('ambient-env-change', handleEnvChange);

    // 3. Intersection Observer for seamless scroll-triggered atmosphere morphing
    const sections: { id: string; env: ActiveEnvironment }[] = [
      { id: 'overview', env: 'core' },
      { id: 'blueprints', env: 'core' },
      { id: 'payment-settlement', env: 'core' },
      { id: 'fraud-forensics', env: 'switch' },
      { id: 'payment-switch', env: 'switch' },
      { id: 'sms-gateway', env: 'switch' },
      { id: 'reconciliation-engine', env: 'recon' },
      { id: 'data-pipeline', env: 'recon' },
      { id: 'incident-dossiers', env: 'incidents' },
      { id: 'lifecycle', env: 'incidents' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const match = sections.find((s) => s.id === entry.target.id);
            if (match) {
              setActiveEnv(match.env);
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.25, 0.5],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('ambient-env-change', handleEnvChange);
      observer.disconnect();
    };
  }, []);

  const getBgColor = () => {
    switch (activeEnv) {
      case 'core':
        return '#07080a'; // Pure obsidian
      case 'switch':
        return '#0b0e14'; // Deep carbon ink
      case 'recon':
        return '#101114'; // Dense graphite
      case 'incidents':
        return '#0e0e10'; // Industrial matte dark gray
      default:
        return '#07080a';
    }
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden bg-transparent"
    >
      {/* Tab 1: Isometric Blueprint Grid Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeEnv === 'core' ? 'opacity-100' : 'opacity-0'
        } grid-blueprint-16`}
      />

      {/* Tab 2: Telemetry Gradient Layer that shifts with mouse */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeEnv === 'switch' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, rgba(148, 163, 184, 0.08) 0%, rgba(11, 14, 20, 0) 70%)`,
        }}
      />

      {/* Tab 3: Warm Muted Copper Edge Reflection Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeEnv === 'recon' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(217, 119, 6, 0.06) 0%, rgba(16, 17, 20, 0) 70%)',
        }}
      />

      {/* Tab 4: Authentic Terminal Scanlines Micro-Texture Layer */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          activeEnv === 'incidents' ? 'opacity-40' : 'opacity-0'
        } terminal-scanlines`}
      />
    </div>
  );
}
