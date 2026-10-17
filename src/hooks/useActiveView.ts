import { useState, useEffect, useCallback, useTransition } from 'react';

export type DashboardViewId = 
  | 'overview'
  | 'payment-settlement'
  | 'payment-switch'
  | 'fraud-forensics'
  | 'reconciliation-engine'
  | 'incident-dossiers'
  | 'lifecycle'
  | 'book';

export interface ViewTransitionState {
  currentView: DashboardViewId;
  prevView: DashboardViewId | null;
  isTransitioning: boolean;
  setView: (view: DashboardViewId) => void;
  nextView: () => void;
  prevViewNav: () => void;
}

export const DASHBOARD_VIEWS: { id: DashboardViewId; labelEn: string; labelFa: string; code: string }[] = [
  { id: 'overview', labelEn: 'Overview', labelFa: 'نمای کلی', code: '00' },
  { id: 'payment-settlement', labelEn: 'Ledgers & 2PC', labelFa: 'دفاتر کل و تسویه', code: '01' },
  { id: 'payment-switch', labelEn: 'Smart PSP Switch', labelFa: 'سوییچ پرداخت', code: '02' },
  { id: 'fraud-forensics', labelEn: 'Fraud & eKYC', labelFa: 'سامانه ضدتقلب', code: '03' },
  { id: 'reconciliation-engine', labelEn: 'Reconciliation', labelFa: 'مغایرت‌گیری', code: '04' },
  { id: 'incident-dossiers', labelEn: 'Incident Dossiers', labelFa: 'آرشیو بحران‌ها', code: '05' },
  { id: 'lifecycle', labelEn: 'Product Lifecycle', labelFa: 'چرخه حیات محصول', code: '06' },
  { id: 'book', labelEn: 'Architecture Intake', labelFa: 'مشاوره و ارزیابی', code: '07' },
];

export function useActiveView(defaultView: DashboardViewId = 'overview'): ViewTransitionState {
  const [currentView, setCurrentView] = useState<DashboardViewId>(defaultView);
  const [prevView, setPrevView] = useState<DashboardViewId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  // Initialize from URL query param (?view=...) or hash (#...)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseViewFromUrl = (): DashboardViewId => {
      const urlParams = new URLSearchParams(window.location.search);
      const queryView = urlParams.get('view') as DashboardViewId;
      if (queryView && DASHBOARD_VIEWS.some((v) => v.id === queryView)) {
        return queryView;
      }
      const hash = window.location.hash.replace('#', '') as DashboardViewId;
      if (hash && DASHBOARD_VIEWS.some((v) => v.id === hash)) {
        return hash;
      }
      return defaultView;
    };

    const initial = parseViewFromUrl();
    if (initial !== currentView) {
      setCurrentView(initial);
    }

    const handlePopState = () => {
      const next = parseViewFromUrl();
      setCurrentView(next);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultView]);

  const setView = useCallback((targetView: DashboardViewId) => {
    if (targetView === currentView) return;

    setPrevView(currentView);
    setIsTransitioning(true);

    startTransition(() => {
      setCurrentView(targetView);

      // Update URL search query without triggering page reload
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('view', targetView);
        window.history.pushState({}, '', url.toString());
      }
    });

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [currentView]);

  const nextView = useCallback(() => {
    const idx = DASHBOARD_VIEWS.findIndex((v) => v.id === currentView);
    const nextIdx = (idx + 1) % DASHBOARD_VIEWS.length;
    setView(DASHBOARD_VIEWS[nextIdx].id);
  }, [currentView, setView]);

  const prevViewNav = useCallback(() => {
    const idx = DASHBOARD_VIEWS.findIndex((v) => v.id === currentView);
    const prevIdx = (idx - 1 + DASHBOARD_VIEWS.length) % DASHBOARD_VIEWS.length;
    setView(DASHBOARD_VIEWS[prevIdx].id);
  }, [currentView, setView]);

  // Global Hotkey Navigation (Keys 0-7, left/right arrows with Alt)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '7') {
        const num = parseInt(e.key, 10);
        if (num < DASHBOARD_VIEWS.length) {
          e.preventDefault();
          setView(DASHBOARD_VIEWS[num].id);
        }
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        nextView();
      } else if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        prevViewNav();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextView, prevViewNav, setView]);

  return {
    currentView,
    prevView,
    isTransitioning,
    setView,
    nextView,
    prevViewNav
  };
}
