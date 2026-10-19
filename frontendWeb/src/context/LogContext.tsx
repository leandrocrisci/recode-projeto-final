import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { iniciarCapturaConsole } from '../services/consoleCapture';

// ── Tipos ────────────────────────────────────────────────────────────────────

export type LogLevel = 'info' | 'success' | 'warn' | 'error';
export type LogSource = 'network' | 'audit' | 'console' | 'runtime';

export interface LogEntry {
  id: number;
  ts: number;          // Date.now()
  level: LogLevel;
  source?: LogSource;
  method?: string;     // GET, POST, PUT, DELETE
  url?: string;
  status?: number;
  durationMs?: number;
  message: string;
  detail?: string;     // JSON payload / response body
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, 'id' | 'ts'>) => void;
  clearLogs: () => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const LogContext = createContext<LogContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});

const MAX_LOGS = 200;

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const counter = useRef(0);

  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'ts'>) => {
    counter.current += 1;
    const full: LogEntry = { ...entry, id: counter.current, ts: Date.now() };
    setLogs(prev => {
      const next = [full, ...prev];
      return next.length > MAX_LOGS ? next.slice(0, MAX_LOGS) : next;
    });
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  // Espelha aqui o console do navegador (log, info, warn, error) e os erros não tratados.
  // useLayoutEffect para começar antes dos efeitos das páginas (as primeiras chamadas à API).
  useLayoutEffect(() => iniciarCapturaConsole(addLog), [addLog]);

  return (
    <LogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export const useLogs = () => useContext(LogContext);
