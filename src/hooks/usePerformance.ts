import { useEffect, useRef } from 'react';
import { performanceMonitor } from '../utils/performance';

/**
 * Hook to measure component render performance
 */
export function usePerformance(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    
    if (import.meta.env.DEV) {
      const measureName = `${componentName}:render:${renderCount.current}`;
      performanceMonitor.startMeasure(measureName);
      
      return () => {
        performanceMonitor.endMeasure(measureName);
      };
    }
  });
}

/**
 * Hook to measure async operations
 */
export function useMeasureAsync() {
  return async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
    if (import.meta.env.DEV) {
      performanceMonitor.startMeasure(name);
    }
    
    try {
      const result = await operation();
      return result;
    } finally {
      if (import.meta.env.DEV) {
        performanceMonitor.endMeasure(name);
      }
    }
  };
}
