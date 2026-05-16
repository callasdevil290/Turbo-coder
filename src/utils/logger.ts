/**
 * Severity-based logger with performance monitoring
 * Development/production aware
 */

import { ErrorSeverity } from '../types/index';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
  stack?: string;
}

const logs: LogEntry[] = [];
const timers = new Map<string, number>();
const MAX_LOGS = 1000;
const isDev = import.meta.env.DEV;

export const logger = {
  debug(category: string, message: string, data?: unknown) {
    log(LogLevel.DEBUG, category, message, data);
  },

  info(category: string, message: string, data?: unknown) {
    log(LogLevel.INFO, category, message, data);
  },

  warn(category: string, message: string, data?: unknown) {
    log(LogLevel.WARN, category, message, data);
  },

  error(category: string, message: string, data?: unknown, stack?: string) {
    log(LogLevel.ERROR, category, message, data, stack);
  },

  time(label: string) {
    timers.set(label, performance.now());
  },

  timeEnd(label: string): number {
    const start = timers.get(label);
    if (!start) {
      logger.warn('logger', `Timer "${label}" not found`);
      return 0;
    }
    
    const duration = performance.now() - start;
    timers.delete(label);
    logger.debug('performance', `${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },

  getLogs(): LogEntry[] {
    return [...logs];
  },

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return logs.filter((log) => log.level === level);
  },

  getLogsByCategory(category: string): LogEntry[] {
    return logs.filter((log) => log.category === category);
  },

  exportJSON(): string {
    return JSON.stringify(logs, null, 2);
  },

  exportCSV(): string {
    if (logs.length === 0) return '';
    
    const headers = ['Timestamp', 'Level', 'Category', 'Message', 'Data'];
    const rows = logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.level,
      log.category,
      log.message,
      typeof log.data === 'object' ? JSON.stringify(log.data) : String(log.data || ''),
    ]);
    
    return [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');
  },

  clear() {
    logs.length = 0;
  },

  mapErrorSeverity(severity: ErrorSeverity): LogLevel {
    switch (severity) {
      case ErrorSeverity.FATAL:
      case ErrorSeverity.COOP_COEP:
      case ErrorSeverity.MOBILE_OOM:
        return LogLevel.ERROR;
      case ErrorSeverity.WARNING:
      case ErrorSeverity.OFFLINE_SYNC:
        return LogLevel.WARN;
      case ErrorSeverity.INFO:
      default:
        return LogLevel.INFO;
    }
  },
};

function log(
  level: LogLevel,
  category: string,
  message: string,
  data?: unknown,
  stack?: string
) {
  const entry: LogEntry = {
    timestamp: Date.now(),
    level,
    category,
    message,
    data,
    stack,
  };

  logs.push(entry);

  // Keep only recent logs in memory
  if (logs.length > MAX_LOGS) {
    logs.splice(0, logs.length - MAX_LOGS);
  }

  // Console output in development
  if (isDev) {
    const prefix = `[${new Date().toISOString()}] [${level}] [${category}]`;
    const style = getConsoleStyle(level);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`%c${prefix}`, style, message, data);
        break;
      case LogLevel.INFO:
        console.info(`%c${prefix}`, style, message, data);
        break;
      case LogLevel.WARN:
        console.warn(`%c${prefix}`, style, message, data);
        break;
      case LogLevel.ERROR:
        console.error(`%c${prefix}`, style, message, data);
        if (stack) console.error(stack);
        break;
    }
  }
}

function getConsoleStyle(level: LogLevel): string {
  switch (level) {
    case LogLevel.DEBUG:
      return 'color: #999; font-weight: bold';
    case LogLevel.INFO:
      return 'color: #00bfff; font-weight: bold';
    case LogLevel.WARN:
      return 'color: #ff9800; font-weight: bold';
    case LogLevel.ERROR:
      return 'color: #f44336; font-weight: bold';
    default:
      return '';
  }
}
