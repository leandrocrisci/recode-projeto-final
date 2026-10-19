import type { LogEntry, LogLevel, LogSource } from '../context/LogContext';

type AddLog = (entry: Omit<LogEntry, 'id' | 'ts'>) => void;
type MetodoConsole = 'log' | 'info' | 'warn' | 'error';
type ConsoleLike = Record<MetodoConsole, (...args: unknown[]) => void>;

interface JanelaLike {
  addEventListener(tipo: 'error', fn: (ev: ErrorEvent) => void): void;
  addEventListener(tipo: 'unhandledrejection', fn: (ev: PromiseRejectionEvent) => void): void;
  removeEventListener(tipo: 'error', fn: (ev: ErrorEvent) => void): void;
  removeEventListener(tipo: 'unhandledrejection', fn: (ev: PromiseRejectionEvent) => void): void;
}

const NIVEL: Record<MetodoConsole, LogLevel> = { log: 'info', info: 'info', warn: 'warn', error: 'error' };

/** Ruído de ferramentas de desenvolvimento que não ajuda na auditoria. */
const IGNORAR = [/^\[vite\]/i, /Download the React DevTools/i];

const LIMITE_POR_SEGUNDO = 30;
const REPETIDO_EM_MS = 500;
const MAX_MENSAGEM = 300;
const MAX_DETALHE = 4000;

// ── Formatação ────────────────────────────────────────────────────────────────

const truncar = (texto: string, max: number) => (texto.length > max ? texto.slice(0, max - 1) + '…' : texto);

function jsonSeguro(valor: unknown): string {
  const vistos = new WeakSet<object>();
  try {
    return JSON.stringify(valor, (_, v) => {
      if (typeof v === 'object' && v !== null) {
        if (vistos.has(v)) return '[circular]';
        vistos.add(v);
      }
      return typeof v === 'bigint' ? v.toString() : v;
    }) ?? String(valor);
  } catch {
    return '[objeto não serializável]';
  }
}

function formatarArg(a: unknown): string {
  if (typeof a === 'string') return a;
  if (a instanceof Error) return `${a.name}: ${a.message}`;
  if (typeof a === 'object' && a !== null) return jsonSeguro(a);
  return String(a);
}

/** Aplica %s, %d, %i, %f, %o, %O, %j e %c, como o console faz (o React usa esse formato nos avisos). */
function aplicarFormato(args: unknown[]): string {
  if (typeof args[0] !== 'string' || !args[0].includes('%')) return args.map(formatarArg).join(' ');
  let i = 1;
  const base = args[0].replace(/%[sdifoOjc%]/g, m => {
    if (m === '%%') return '%';
    if (i >= args.length) return m;
    const v = args[i++];
    if (m === '%c') return '';
    if (m === '%d' || m === '%i') return String(Math.trunc(Number(v)));
    if (m === '%f') return String(Number(v));
    return formatarArg(v);
  });
  return [base, ...args.slice(i).map(formatarArg)].join(' ');
}

const ehErroAxios = (a: unknown) =>
  typeof a === 'object' && a !== null && (a as { isAxiosError?: boolean }).isAxiosError === true;

function montarDetalhe(texto: string, args: unknown[]): string {
  const pilhas = args.filter((a): a is Error => a instanceof Error).map(e => e.stack).filter(Boolean) as string[];
  return truncar([texto, ...pilhas].join('\n\n'), MAX_DETALHE);
}

// ── Captura ───────────────────────────────────────────────────────────────────

/**
 * Espelha no log da aplicação o que aparece no console do navegador (log, info, warn e error)
 * e os erros não tratados (window.onerror e promises rejeitadas). O console continua funcionando
 * normalmente. Devolve a função que desfaz a captura.
 *
 * Proteções: erros do Axios não são duplicados (o interceptor já os registra), mensagens iguais em
 * sequência são ignoradas e há um teto de mensagens por segundo, para um aviso repetido a cada
 * renderização nunca virar um laço infinito.
 */
export function iniciarCapturaConsole(
  addLog: AddLog,
  alvo: ConsoleLike = console as unknown as ConsoleLike,
  janela: JanelaLike | undefined = typeof window !== 'undefined' ? window : undefined,
): () => void {
  let recentes: number[] = [];
  let avisouLimite = false;
  let ultimo = { chave: '', em: 0 };

  const enviar = (entrada: Omit<LogEntry, 'id' | 'ts'>) => {
    // Adia para fora de qualquer renderização em andamento (o React proíbe atualizar estado durante o render).
    queueMicrotask(() => {
      try { addLog(entrada); } catch { /* o log nunca pode quebrar a aplicação */ }
    });
  };

  const registrar = (nivel: LogLevel, mensagem: string, detalhe: string, source: LogSource = 'console') => {
    const agora = Date.now();
    const chave = `${nivel}|${mensagem}`;
    if (chave === ultimo.chave && agora - ultimo.em < REPETIDO_EM_MS) return;
    ultimo = { chave, em: agora };

    recentes = recentes.filter(t => agora - t < 1000);
    if (recentes.length >= LIMITE_POR_SEGUNDO) {
      if (!avisouLimite) {
        avisouLimite = true;
        enviar({ source: 'console', level: 'warn', message: 'Captura do console limitada: muitas mensagens por segundo.' });
      }
      return;
    }
    avisouLimite = false;
    recentes.push(agora);
    enviar({ source, level: nivel, message: truncar(mensagem, MAX_MENSAGEM), detail: detalhe });
  };

  const originais = {} as ConsoleLike;
  (Object.keys(NIVEL) as MetodoConsole[]).forEach(metodo => {
    originais[metodo] = alvo[metodo];
    alvo[metodo] = (...args: unknown[]) => {
      originais[metodo].apply(alvo, args); // o console segue funcionando como sempre
      try {
        if (args.some(ehErroAxios)) return;
        const texto = aplicarFormato(args);
        if (IGNORAR.some(r => r.test(texto))) return;
        const primeiraLinha = texto.split('\n')[0];
        registrar(NIVEL[metodo], `console.${metodo} — ${primeiraLinha}`, montarDetalhe(texto, args));
      } catch { /* a captura nunca atrapalha o console */ }
    };
  });

  const aoErro = (ev: { message?: string; error?: unknown; filename?: string; lineno?: number }) => {
    const msg = ev.message || (ev.error ? formatarArg(ev.error) : 'Erro desconhecido');
    const onde = ev.filename ? ` (${ev.filename}${ev.lineno ? ':' + ev.lineno : ''})` : '';
    registrar('error', `Erro não tratado — ${msg}${onde}`, montarDetalhe(`${msg}${onde}`, [ev.error]), 'runtime');
  };
  const aoRejeitar = (ev: { reason?: unknown }) => {
    if (ehErroAxios(ev.reason)) return;
    const msg = formatarArg(ev.reason ?? 'sem motivo informado');
    registrar('error', `Promise rejeitada — ${msg}`, montarDetalhe(msg, [ev.reason]), 'runtime');
  };
  janela?.addEventListener('error', aoErro);
  janela?.addEventListener('unhandledrejection', aoRejeitar);

  return () => {
    (Object.keys(NIVEL) as MetodoConsole[]).forEach(metodo => { alvo[metodo] = originais[metodo]; });
    janela?.removeEventListener('error', aoErro);
    janela?.removeEventListener('unhandledrejection', aoRejeitar);
  };
}
