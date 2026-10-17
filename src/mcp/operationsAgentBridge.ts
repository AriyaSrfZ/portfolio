import type { TelemetryMetrics } from '../hooks/useTelemetryStream';
import type { DashboardViewId } from '../hooks/useActiveView';
import type { ViewportBounds } from '../hooks/useViewportBounds';

export interface AgenticConsoleBridge {
  get_ui_state: () => {
    activeView: DashboardViewId;
    locale: 'en' | 'fa';
    viewport: {
      width: number;
      height: number;
      aspectRatio: number;
      isDesktop: boolean;
      isMobile: boolean;
    };
    isTransitioning: boolean;
    streamingActive: boolean;
  };
  set_active_tab: (tabId: DashboardViewId) => {
    success: boolean;
    currentView: DashboardViewId;
    timestamp: string;
  };
  get_telemetry_metrics: () => TelemetryMetrics;
  run_accessibility_audit: (targetSelector?: string) => {
    passed: boolean;
    violations: number;
    auditedElements: number;
    checkedAt: string;
    details: string[];
  };
}

// Relative luminance and contrast ratio calculations based on WCAG 2.1 specs
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function parseColor(colorStr: string): [number, number, number] | null {
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
  }
  return null;
}

export function registerAgenticBridge(
  getActiveView: () => DashboardViewId,
  setActiveView: (view: DashboardViewId) => void,
  getMetrics: () => TelemetryMetrics,
  getViewport: () => ViewportBounds,
  isTransitioning: () => boolean,
  isStreaming: () => boolean,
  locale: 'en' | 'fa'
): void {
  if (typeof window === 'undefined') return;

  const bridge: AgenticConsoleBridge = {
    get_ui_state: () => {
      const vp = getViewport();
      return {
        activeView: getActiveView(),
        locale,
        viewport: {
          width: vp.width,
          height: vp.height,
          aspectRatio: vp.aspectRatio,
          isDesktop: vp.isDesktop,
          isMobile: vp.isMobile
        },
        isTransitioning: isTransitioning(),
        streamingActive: isStreaming()
      };
    },

    set_active_tab: (tabId: DashboardViewId) => {
      setActiveView(tabId);
      return {
        success: true,
        currentView: tabId,
        timestamp: new Date().toISOString()
      };
    },

    get_telemetry_metrics: () => {
      return getMetrics();
    },

    run_accessibility_audit: (targetSelector: string = '#operations-workstation') => {
      const root = document.querySelector(targetSelector) || document.body;
      const elements = root.querySelectorAll('*');
      let violations = 0;
      let auditedElements = 0;
      const details: string[] = [];

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const text = htmlEl.textContent?.trim();
        if (text && text.length > 0 && htmlEl.children.length === 0) {
          auditedElements++;
          const style = window.getComputedStyle(htmlEl);
          const fg = parseColor(style.color);
          const bg = parseColor(style.backgroundColor);

          // Check basic alt tags on images
          if (htmlEl.tagName === 'IMG' && !htmlEl.getAttribute('alt')) {
            violations++;
            details.push(`IMG missing alt text: ${htmlEl.getAttribute('src') || 'unknown'}`);
          }

          if (fg && bg && bg[0] !== 0 && bg[1] !== 0 && bg[2] !== 0) {
            const l1 = getLuminance(fg[0], fg[1], fg[2]);
            const l2 = getLuminance(bg[0], bg[1], bg[2]);
            const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

            // WCAG AA requirement for normal text is 4.5:1
            if (ratio < 4.5 && style.fontSize && parseFloat(style.fontSize) < 18) {
              violations++;
              details.push(`Low contrast (${ratio.toFixed(2)}:1) on <${htmlEl.tagName.toLowerCase()}> "${text.slice(0, 20)}..."`);
            }
          }
        }
      });

      return {
        passed: violations === 0,
        violations,
        auditedElements,
        checkedAt: new Date().toISOString(),
        details: details.slice(0, 10)
      };
    }
  };

  (window as any).__AGENTIC_CONSOLE__ = bridge;
}
