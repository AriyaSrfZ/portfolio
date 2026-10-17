import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { stats } from '../data/stats';

export interface TelemetryMetrics {
  tps: number;
  peakTps: number;
  driftPercent: number;
  failoverLatencyMs: number;
  fraudLoopSlaMs: number;
  reconParityPercent: number;
  activeNodes: number;
  packetCount: number;
  status: 'nominal' | 'warning' | 'critical';
  lastUpdated: string;
}

export interface TelemetryStreamState {
  metrics: TelemetryMetrics;
  isConnected: boolean;
  isStreaming: boolean;
  error: string | null;
  toggleStream: () => void;
  reconnect: () => void;
}

export function useTelemetryStream(autoStart: boolean = true): TelemetryStreamState {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isStreaming, setIsStreaming] = useState<boolean>(autoStart);
  const [error, setError] = useState<string | null>(null);

  const initialMetrics: TelemetryMetrics = useMemo(() => ({
    tps: 48920,
    peakTps: 52400,
    driftPercent: 0.00,
    failoverLatencyMs: 12.4,
    fraudLoopSlaMs: 28.5,
    reconParityPercent: 100.0,
    activeNodes: 16,
    packetCount: 18459203,
    status: 'nominal',
    lastUpdated: new Date().toISOString()
  }), []);

  const [metrics, setMetrics] = useState<TelemetryMetrics>(initialMetrics);
  const reconnectAttemptsRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateMetrics = useCallback(() => {
    setMetrics((prev) => {
      // Jitter metrics within strictly nominal bounds to simulate high-frequency banking telemetry
      const deltaTps = Math.floor((Math.random() - 0.48) * 800);
      const nextTps = Math.min(54000, Math.max(46000, prev.tps + deltaTps));
      const nextPackets = prev.packetCount + Math.floor(nextTps / 20);
      const nextLatency = Number((12.0 + Math.random() * 2.2).toFixed(1));
      const nextFraudSla = Number((27.5 + Math.random() * 2.8).toFixed(1));

      return {
        ...prev,
        tps: nextTps,
        peakTps: Math.max(prev.peakTps, nextTps),
        failoverLatencyMs: nextLatency,
        fraudLoopSlaMs: nextFraudSla,
        packetCount: nextPackets,
        status: nextLatency > 20 ? 'warning' : 'nominal',
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  const reconnect = useCallback(() => {
    setIsConnected(false);
    setError('Reconnecting to telemetry mesh...');
    reconnectAttemptsRef.current += 1;

    const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 8000);
    setTimeout(() => {
      setIsConnected(true);
      setError(null);
      setIsStreaming(true);
      reconnectAttemptsRef.current = 0;
    }, delay);
  }, []);

  const toggleStream = useCallback(() => {
    setIsStreaming((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isStreaming || !isConnected) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(updateMetrics, 1500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStreaming, isConnected, updateMetrics]);

  return {
    metrics,
    isConnected,
    isStreaming,
    error,
    toggleStream,
    reconnect
  };
}
