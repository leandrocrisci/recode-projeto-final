import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Text,
  Title3,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Play24Filled } from '@fluentui/react-icons';
// Desenho gerado a partir do workflow. Para atualizar a página, substitua este arquivo pelo fluxo exportado do n8n.
import fluxo from './n8n-fluxo.json';

// URL do Webhook do n8n (use /webhook-test/... no modo teste, /webhook/... com o workflow ativo)
const DEFAULT_WEBHOOK = 'http://localhost:5678/webhook/gerar-escolas';

type Status = 'idle' | 'running' | 'done' | 'error' | 'skipped';

interface NodeDef {
  id: string;
  label: string;
  sub: string;
  icon: string;
  /** tempo estimado da etapa (ms), usado só na animação enquanto a chamada real está em andamento */
  ms: number;
}

interface Pendencia {
  id: number;
  nome: string;
  falta: string[];
  nova: boolean;
}

interface Validacao {
  totalEscolas: number;
  existePendencia: boolean;
  pendencias: Pendencia[];
}

interface Reparo {
  executado: boolean;
  escolasReparadas: number;
  registrosCriados: { enderecos: number; avaliacoes: number; alunos: number };
  restantes: Pendencia[];
}

interface Resultado {
  escolasCriadas?: number;
  enderecosCriados?: number;
  avaliacoesCriadas?: number;
  cursosCriados?: number;
  avaliacoesCursoCriadas?: number;
  professoresCriados?: number;
  validacao?: Validacao;
  reparo?: Reparo;
  alunosCriados?: number;
  segundos: string;
}

interface WorkflowJson {
  name: string;
  nodes: { name: string; type: string; parameters?: { method?: string } }[];
  connections: Record<string, Record<string, ({ node: string }[] | null)[]>>;
}

const WORKFLOW = fluxo as unknown as WorkflowJson;

function descrever(n: WorkflowJson['nodes'][number], temModelo: boolean): NodeDef {
  const tipo = n.type.split('.').pop() ?? n.type;
  const metodo = (n.parameters?.method ?? 'GET').toUpperCase();
  const def: NodeDef = { id: n.name, label: n.name, sub: tipo, icon: '▫️', ms: 400 };
  switch (tipo) {
    case 'webhook':
      return { ...def, icon: '🔗', sub: 'Webhook (POST)', ms: 300 };
    case 'manualTrigger':
      return { ...def, icon: '▶️', sub: 'Disparo manual', ms: 300 };
    case 'set':
      return { ...def, icon: '⚙️', sub: 'Set (variáveis)', ms: 300 };
    case 'if':
      return { ...def, icon: '❓', sub: 'IF (sim → reparo)', ms: 300 };
    case 'chainLlm':
      return {
        ...def,
        icon: '✨',
        label: n.name.includes('Reparo') ? 'Gemini (reparo)' : 'Gemini',
        sub: temModelo ? 'LLM Chain + Gemini' : 'LLM Chain',
        ms: 8000,
      };
    case 'code':
      return { ...def, icon: '🧩', sub: 'Code', ms: 400 };
    case 'httpRequest':
      return { ...def, icon: metodo === 'GET' ? '📥' : '📤', sub: `HTTP ${metodo}`, ms: metodo === 'GET' ? 1000 : 2500 };
    default:
      return def;
  }
}

// Segue o fluxo principal (primeira saída de cada nó, ou seja, o "sim" do IF) a partir do Webhook
function derivarEtapas(wf: WorkflowJson): NodeDef[] {
  const porNome = new Map(wf.nodes.map((n) => [n.name, n] as const));
  const comModelo = new Set<string>();
  Object.values(wf.connections).forEach((tipos) =>
    (tipos['ai_languageModel'] ?? []).forEach((saida) => (saida ?? []).forEach((c) => comModelo.add(c.node)))
  );
  const inicio =
    wf.nodes.find((n) => n.type.endsWith('.webhook')) ?? wf.nodes.find((n) => n.type.endsWith('.manualTrigger'));
  const etapas: NodeDef[] = [];
  const visto = new Set<string>();
  let atual: string | undefined = inicio?.name;
  while (atual && !visto.has(atual)) {
    visto.add(atual);
    const n = porNome.get(atual);
    if (!n) break;
    etapas.push(descrever(n, comModelo.has(n.name)));
    atual = wf.connections[atual]?.main?.[0]?.[0]?.node;
  }
  if (etapas.length > 0) etapas[etapas.length - 1].ms = 0; // última etapa: aguarda a resposta real
  return etapas;
}

const NODES: NodeDef[] = derivarEtapas(WORKFLOW);

// Etapas depois do IF que só rodam quando a validação encontra pendências (aparecem esmaecidas quando puladas)
const ETAPAS_REPARO: Set<string> = (() => {
  const ifNome = WORKFLOW.nodes.find((n) => n.type.endsWith('.if'))?.name;
  const i = NODES.findIndex((n) => n.id === ifNome);
  return new Set(i >= 0 ? NODES.slice(i + 1, -1).map((n) => n.id) : []);
})();

const W = 160;
const H = 68;
const GAP = 34;
const PER_ROW = 6;
const VIEW_H = 40 + (Math.ceil(NODES.length / PER_ROW) - 1) * 150 + H + 30;

// quebra o nome em até duas linhas para caber no nó
function quebrar(label: string, max = 16): string[] {
  if (label.length <= max) return [label];
  const i = label.lastIndexOf(' ', max);
  const a = i > 0 ? label.slice(0, i) : label.slice(0, max);
  const b = (i > 0 ? label.slice(i + 1) : label.slice(max)).slice(0, max);
  return [a, b];
}

const pos = (i: number): { x: number; y: number } => ({
  x: 35 + (i % PER_ROW) * (W + GAP),
  y: 40 + Math.floor(i / PER_ROW) * 150,
});

const COLORS: Record<'running' | 'done' | 'error', string> = {
  running: '#0f6cbd',
  done: '#107c10',
  error: '#c50f1f',
};

const useStyles = makeStyles({
  page: { display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' },
  controls: { display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' },
  url: { flexGrow: 1, minWidth: '280px' },
  canvas: { padding: '8px', overflowX: 'auto' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' },
  stat: { padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statNumber: { fontSize: '28px', fontWeight: 600, color: tokens.colorBrandForeground1 },
});

const CSS = `
@keyframes n8nPulse { 0%,100% { filter: drop-shadow(0 0 0 rgba(15,108,189,0)); } 50% { filter: drop-shadow(0 0 8px rgba(15,108,189,.8)); } }
@keyframes n8nFlow { to { stroke-dashoffset: -24; } }
.n8n-running { animation: n8nPulse 1.2s ease-in-out infinite; }
.n8n-edge-active { stroke-dasharray: 6 6; animation: n8nFlow .6s linear infinite; }
`;

function edgePath(i: number): string {
  const a = pos(i);
  const b = pos(i + 1);
  if (a.y === b.y) {
    return `M ${a.x + W} ${a.y + H / 2} L ${b.x - 4} ${b.y + H / 2}`;
  }
  const x1 = a.x + W / 2;
  const x2 = b.x + W / 2;
  return `M ${x1} ${a.y + H} C ${x1} ${a.y + H + 45}, ${x2} ${b.y - 45}, ${x2} ${b.y - 4}`;
}

export default function N8N() {
  const styles = useStyles();
  const [url, setUrl] = useState<string>(DEFAULT_WEBHOOK);
  const [status, setStatus] = useState<Status[]>(() => NODES.map(() => 'idle'));
  const [running, setRunning] = useState<boolean>(false);
  const [result, setResult] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const setNode = (i: number, s: Status) =>
    setStatus((prev) => prev.map((v, k) => (k === i ? s : v)));

  // Avança o desenho nó a nó; fica em "Criar Aluno" até a resposta real chegar
  const animate = (i: number) => {
    setNode(i, 'running');
    if (NODES[i].ms === 0) return;
    timers.current.push(
      setTimeout(() => {
        setNode(i, 'done');
        animate(i + 1);
      }, NODES[i].ms)
    );
  };

  const run = async () => {
    clearTimers();
    setError(null);
    setResult(null);
    setStatus(NODES.map(() => 'idle'));
    setRunning(true);
    const t0 = Date.now();
    animate(0);

    const ctrl = new AbortController();
    const abortTimer = setTimeout(() => ctrl.abort(), 10 * 60 * 1000);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`O n8n respondeu HTTP ${res.status}`);
      const data = (await res.json()) as Omit<Resultado, 'segundos'>;
      clearTimers();
      setStatus(NODES.map((n) => (ETAPAS_REPARO.has(n.id) && !data.validacao?.existePendencia ? 'skipped' : 'done')));
      setResult({ ...data, segundos: ((Date.now() - t0) / 1000).toFixed(1) });
    } catch (e) {
      const err = e as Error;
      clearTimers();
      setStatus((prev) => {
        const i = prev.findIndex((s) => s === 'running');
        return prev.map((s, k) => (k === i ? 'error' : s));
      });
      setError(
        err.name === 'AbortError'
          ? 'Tempo esgotado (10 min).'
          : `${err.message}. Verifique a URL do webhook, se o workflow está ativo (ou em modo teste) e o CORS do nó Webhook.`
      );
    } finally {
      clearTimeout(abortTimer);
      setRunning(false);
    }
  };

  const edgeState = (i: number): 'idle' | 'active' | 'done' => {
    if (status[i] === 'done' && status[i + 1] === 'done') return 'done';
    if (status[i] === 'done' && status[i + 1] === 'running') return 'active';
    return 'idle';
  };

  const stats: [string, number | undefined][] = result
    ? [
        ['Escolas', result.escolasCriadas],
        ['Endereços', result.enderecosCriados],
        ['Avaliações', result.avaliacoesCriadas],
        ['Cursos', result.cursosCriados],
        ['Aval. Cursos', result.avaliacoesCursoCriadas],
        ['Professores', result.professoresCriados],
        ['Alunos', result.alunosCriados],
      ]
    : [];

  return (
    <div className={styles.page}>
      <Title3>N8N — Gerar escolas com Gemini</Title3>
      <Text>
        Dispara o workflow no n8n: lê as escolas, pede ao Gemini novas escolas (com endereço, avaliação, curso,
        alunos e professores), grava tudo pela API e valida o resultado, completando o que ficar faltando.
      </Text>

      <div className={styles.controls}>
        <Field label="URL do Webhook" className={styles.url}>
          <Input value={url} onChange={(_, d) => setUrl(d.value)} disabled={running} />
        </Field>
        <Button appearance="primary" icon={<Play24Filled />} onClick={run} disabled={running || !url}>
          {running ? 'Executando...' : 'Executar workflow'}
        </Button>
      </div>

      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}

      <Card className={styles.canvas}>
        <svg viewBox={`0 0 1200 ${VIEW_H}`} width="100%" style={{ minWidth: 900 }} role="img" aria-label="Desenho do workflow n8n">
          <style>{CSS}</style>
          <defs>
            {(['idle', 'active', 'done'] as const).map((s) => (
              <marker
                key={s}
                id={`arrow-${s}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path
                  d="M 0 0 L 10 5 L 0 10 z"
                  style={{
                    fill: s === 'active' ? COLORS.running : s === 'done' ? COLORS.done : tokens.colorNeutralStroke1,
                  }}
                />
              </marker>
            ))}
          </defs>

          {NODES.slice(0, -1).map((_, i) => {
            const s = edgeState(i);
            return (
              <path
                key={`e${i}`}
                d={edgePath(i)}
                fill="none"
                strokeWidth="2.5"
                className={s === 'active' ? 'n8n-edge-active' : undefined}
                markerEnd={`url(#arrow-${s})`}
                style={{
                  stroke: s === 'active' ? COLORS.running : s === 'done' ? COLORS.done : tokens.colorNeutralStroke1,
                }}
              />
            );
          })}

          {NODES.map((n, i) => {
            const { x, y } = pos(i);
            const s = status[i];
            const border = s === 'idle' || s === 'skipped' ? tokens.colorNeutralStroke1 : COLORS[s];
            return (
              <g key={n.id} className={s === 'running' ? 'n8n-running' : undefined} style={{ opacity: s === 'skipped' ? 0.45 : 1 }}>
                <title>{n.id}</title>
                <rect
                  x={x}
                  y={y}
                  width={W}
                  height={H}
                  rx="10"
                  strokeWidth="2.5"
                  style={{ fill: tokens.colorNeutralBackground1, stroke: border }}
                />
                <text x={x + 12} y={y + 40} fontSize="22">
                  {n.icon}
                </text>
                {quebrar(n.label).map((linha, k, todas) => (
                  <text
                    key={k}
                    x={x + 44}
                    y={y + (todas.length === 1 ? 30 : 24 + k * 13)}
                    fontSize="12"
                    fontWeight="600"
                    style={{ fill: tokens.colorNeutralForeground1 }}
                  >
                    {linha}
                  </text>
                ))}
                <text
                  x={x + 44}
                  y={y + (quebrar(n.label).length === 1 ? 48 : 56)}
                  fontSize="9.5"
                  style={{ fill: tokens.colorNeutralForeground3 }}
                >
                  {n.sub}
                </text>
                {(s === 'done' || s === 'error') && (
                  <g>
                    <circle cx={x + W - 4} cy={y + 4} r="9" style={{ fill: COLORS[s] }} />
                    <text x={x + W - 4} y={y + 8} fontSize="11" textAnchor="middle" fill="#fff">
                      {s === 'done' ? '✓' : '✕'}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        <Text size={200}>
          Fluxo “{WORKFLOW.name}” · {NODES.length} etapas
        </Text>
      </Card>

      {result && (
        <>
          <MessageBar intent="success">
            <MessageBarBody>Workflow concluído em {result.segundos}s.</MessageBarBody>
          </MessageBar>
          {result.validacao &&
            (result.validacao.existePendencia ? (
              <MessageBar intent="warning">
                <MessageBarBody>
                  Validação final: {result.validacao.pendencias.length} de {result.validacao.totalEscolas} escolas
                  com cadastro incompleto.
                  <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                    {result.validacao.pendencias.slice(0, 10).map((p) => (
                      <li key={p.id}>
                        {p.nome} — falta: {p.falta.join(', ')}
                        {p.nova ? ' (criada agora)' : ''}
                      </li>
                    ))}
                  </ul>
                  {result.validacao.pendencias.length > 10 &&
                    `e mais ${result.validacao.pendencias.length - 10} escola(s).`}
                </MessageBarBody>
              </MessageBar>
            ) : (
              <MessageBar intent="success">
                <MessageBarBody>
                  Validação final: as {result.validacao.totalEscolas} escolas têm endereço, aluno e avaliação de
                  qualidade.
                </MessageBarBody>
              </MessageBar>
            ))}
          {result.reparo?.executado && (
            <MessageBar intent={result.reparo.restantes.length > 0 ? 'warning' : 'success'}>
              <MessageBarBody>
                Reparo com Gemini: {result.reparo.escolasReparadas} escola(s) completada(s) (
                {result.reparo.registrosCriados.enderecos} endereços, {result.reparo.registrosCriados.avaliacoes}{' '}
                avaliações, {result.reparo.registrosCriados.alunos} alunos).
                {result.reparo.restantes.length > 0 &&
                  ` Ainda incompletas: ${result.reparo.restantes.length}. Execute novamente para continuar.`}
              </MessageBarBody>
            </MessageBar>
          )}
          <div className={styles.stats}>
            {stats.map(([label, value]) => (
              <Card key={label} className={styles.stat}>
                <span className={styles.statNumber}>{value ?? '—'}</span>
                <Text>{label}</Text>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
