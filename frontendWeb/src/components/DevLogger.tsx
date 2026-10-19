import { useState, useMemo, useRef } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Badge, Title2, Card, CardHeader, Tooltip,
  TabList, Tab, Link
} from '@fluentui/react-components';
import {
  Search24Regular, Delete24Regular, ArrowDownload24Regular,
  ErrorCircle24Regular, CheckmarkCircle24Regular,
  Shield24Regular, Code24Regular, Clock24Regular, Info24Regular,
  Globe24Regular, DataTrending24Regular, Warning24Regular
} from '@fluentui/react-icons';
import { useLogs } from '../context/LogContext';
import type { LogEntry, LogLevel } from '../context/LogContext';
import { PageHeader } from './PageHeader';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  kpiGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' },
  kpiCard: { flex: '1 1 200px', padding: '16px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  contentLayout: { display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' },
  mainContent: { flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '10px 14px', borderRadius: tokens.borderRadiusMedium },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  sidebar: { width: '380px', minWidth: '320px', border: `1px solid ${tokens.colorNeutralStroke1}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  chart: { display: 'flex', alignItems: 'flex-end', gap: '10px', minHeight: '170px', overflowX: 'auto', padding: '12px 4px 4px' },
  chartItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', minWidth: '52px', height: '145px' },
  chartBar: { width: '24px', minHeight: '4px', borderRadius: `${tokens.borderRadiusSmall} ${tokens.borderRadiusSmall} 0 0`, backgroundColor: tokens.colorBrandBackground },
  insight: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: tokens.colorNeutralBackground2, borderRadius: tokens.borderRadiusMedium },
  emptyState: { padding: '24px', textAlign: 'center', color: tokens.colorNeutralForeground3 },
  // O Button do Fluent não tem prop color="danger": o vermelho vem deste estilo.
  danger: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': { backgroundColor: tokens.colorPaletteRedForeground1, color: tokens.colorNeutralForegroundOnBrand },
    ':hover:active': { backgroundColor: tokens.colorPaletteRedForeground1, color: tokens.colorNeutralForegroundOnBrand },
    ':disabled': { backgroundColor: tokens.colorNeutralBackgroundDisabled, color: tokens.colorNeutralForegroundDisabled },
  },
  codeBox: { margin: '4px 0', padding: '12px', backgroundColor: tokens.colorNeutralBackground1Hover, border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, fontSize: '11px', color: tokens.colorNeutralForeground2, fontFamily: 'Consolas, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: '220px', overflowY: 'auto' }
});

type FilterLevel = LogLevel | 'all';
type ActiveTab = 'network' | 'console';

function fmtTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR') + '.' + d.getMilliseconds().toString().padStart(3, '0');
}

function diagnoseError(log: LogEntry | undefined): { title: string; explanation: string; search: string } {
  const message = `${log?.message ?? ''} ${log?.detail ?? ''}`.toLowerCase();
  if (message.includes('cors') || message.includes('access-control')) {
    return {
      title: 'Possível bloqueio de CORS',
      explanation: 'A API pode não estar permitindo a origem do frontend ou a requisição OPTIONS de preflight.',
      search: 'Microsoft Learn CORS ASP.NET browser access control',
    };
  }
  if (message.includes('network error') || message.includes('failed to fetch') || message.includes('load failed')) {
    return {
      title: 'Falha de rede ou serviço indisponível',
      explanation: 'Confira conectividade, URL da API, disponibilidade do serviço e erros de TLS no navegador.',
      search: 'Microsoft Learn troubleshoot network connectivity browser',
    };
  }
  if (message.includes('chunk') || message.includes('loading module')) {
    return {
      title: 'Falha ao carregar um módulo da aplicação',
      explanation: 'Pode haver cache de uma versão antiga após deploy ou um arquivo de build ausente no servidor.',
      search: 'Microsoft Learn troubleshoot JavaScript application deployment cache',
    };
  }
  if (message.includes('500') || message.includes('internal server error')) {
    return {
      title: 'Erro interno no servidor',
      explanation: 'A requisição chegou à API, mas o backend falhou. Correlacione este horário com os logs do serviço e do banco.',
      search: 'Microsoft Learn troubleshoot HTTP 500 web application',
    };
  }
  if (message.includes('typeerror') || message.includes('undefined') || message.includes('null')) {
    return {
      title: 'Possível erro de estado ou dado inesperado',
      explanation: 'Inspecione o stack trace e valide os dados recebidos antes de acessá-los no componente.',
      search: 'Microsoft Learn JavaScript debug runtime errors',
    };
  }
  return {
    title: 'Inspecione a mensagem e o stack trace',
    explanation: 'A sugestão é local e baseada em padrões comuns; use o horário e o detalhe técnico para localizar a causa.',
    search: 'Microsoft Learn troubleshoot JavaScript application errors',
  };
}

const BADGE_COLOR: Record<LogLevel, 'success' | 'warning' | 'danger' | 'informative'> = {
  info: 'informative', success: 'success', warn: 'warning', error: 'danger'
};

const METHOD_COLOR = (method: string): string => {
  const colors: Record<string, string> = { GET: '#16a34a', POST: '#2563eb', PUT: '#d97706', DELETE: '#dc2626' };
  return colors[method] || tokens.colorNeutralForeground1;
};

export default function GerenciamentoEventos() {
  const s = useStyles();
  const { logs, clearLogs } = useLogs();
  const [activeTab, setActiveTab] = useState<ActiveTab>('network');
  const [logSelecionado, setLogSelecionado] = useState<LogEntry | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<FilterLevel>('all');
  const bodyRef = useRef<HTMLDivElement>(null);

  const networkLogs = useMemo(
    () => logs.filter(log => log.source === 'network' && (log.status !== undefined || log.durationMs !== undefined)),
    [logs],
  );
  const consoleLogs = useMemo(
    () => logs.filter(log => log.source === 'runtime' || log.source === 'audit' || log.source === 'console'),
    [logs],
  );
  const visibleLogs = activeTab === 'network' ? networkLogs : consoleLogs;

  const filtrados = useMemo(() => {
    return visibleLogs.filter(l => {
      const matchNivel = filtroNivel === 'all' || l.level === filtroNivel;
      const q = busca.toLowerCase();
      return matchNivel && (!busca || l.message.toLowerCase().includes(q) || (l.url ?? '').toLowerCase().includes(q) || (l.method ?? '').toLowerCase().includes(q) || (l.detail ?? '').toLowerCase().includes(q));
    });
  }, [visibleLogs, busca, filtroNivel]);

  const networkMetrics = useMemo(() => {
    const durations = networkLogs
      .map(log => log.durationMs)
      .filter((duration): duration is number => duration !== undefined)
      .sort((a, b) => a - b);
    const average = durations.length ? Math.round(durations.reduce((sum, duration) => sum + duration, 0) / durations.length) : 0;
    const p95 = durations.length ? durations[Math.ceil(durations.length * 0.95) - 1] : 0;
    const errors = networkLogs.filter(log => log.level === 'error').length;
    const chartLogs = networkLogs
      .filter(log => log.durationMs !== undefined)
      .slice(0, 10)
      .reverse();
    return {
      requests: networkLogs.length,
      errors,
      success: networkLogs.filter(log => log.level === 'success').length,
      average,
      p95,
      chartLogs,
    };
  }, [networkLogs]);

  const consoleMetrics = useMemo(() => ({
    runtimeErrors: consoleLogs.filter(log => (log.source === 'runtime' || log.source === 'console') && log.level === 'error').length,
    audits: consoleLogs.filter(log => log.source === 'audit').length,
    warnings: consoleLogs.filter(log => (log.source === 'console' || log.source === 'runtime') && log.level === 'warn').length,
  }), [consoleLogs]);

  const newestRuntimeError = consoleLogs.find(log => (log.source === 'runtime' || log.source === 'console') && log.level === 'error');
  const diagnosis = diagnoseError(newestRuntimeError);

  const exportarLogs = () => {
    const blob = new Blob([JSON.stringify(filtrados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventos-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const networkColumns = [
    createTableColumn<LogEntry>({
      columnId: 'timestamp',
      renderHeaderCell: () => 'Horário',
      renderCell: l => <TableCellLayout style={{ fontFamily: 'Consolas, monospace' }}>{fmtTimestamp(l.ts)}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'metodo',
      renderHeaderCell: () => 'Método',
      renderCell: l => <TableCellLayout>{l.method ? <span style={{ fontWeight: 'bold', color: METHOD_COLOR(l.method) }}>{l.method}</span> : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: l => <TableCellLayout>{l.status !== undefined ? <span style={{ fontWeight: 'bold', color: l.status < 300 ? '#16a34a' : l.status < 500 ? '#d97706' : '#dc2626' }}>{l.status}</span> : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'mensagem',
      renderHeaderCell: () => 'Mensagem de Evento',
      renderCell: l => <TableCellLayout><Badge appearance="filled" color={BADGE_COLOR[l.level]} size="small" style={{ marginRight: '6px' }}>{l.level.toUpperCase()}</Badge><Text style={{ wordBreak: 'break-word' }}>{l.message}</Text></TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'duracao',
      renderHeaderCell: () => 'Latência',
      renderCell: l => <TableCellLayout>{l.durationMs !== undefined ? `${l.durationMs}ms` : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'acoes',
      renderHeaderCell: () => '',
      renderCell: l => <TableCellLayout><Tooltip content="Inspecionar Payload" relationship="label"><Button size="small" appearance="subtle" icon={<Search24Regular />} onClick={() => setLogSelecionado(l)} /></Tooltip></TableCellLayout>
    })
  ];

  const consoleColumns = [
    createTableColumn<LogEntry>({
      columnId: 'timestamp',
      renderHeaderCell: () => 'Horário',
      renderCell: log => <TableCellLayout style={{ fontFamily: 'Consolas, monospace' }}>{fmtTimestamp(log.ts)}</TableCellLayout>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'source',
      renderHeaderCell: () => 'Origem',
      renderCell: log => <TableCellLayout>{log.source === 'audit' ? 'Auditoria' : log.source === 'console' ? 'Console' : 'JavaScript'}</TableCellLayout>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'level',
      renderHeaderCell: () => 'Nível',
      renderCell: log => <TableCellLayout><Badge appearance="filled" color={BADGE_COLOR[log.level]} size="small">{log.level.toUpperCase()}</Badge></TableCellLayout>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'message',
      renderHeaderCell: () => 'Exceção / Evento',
      renderCell: log => <TableCellLayout><Text style={{ wordBreak: 'break-word' }}>{log.message}</Text></TableCellLayout>,
    }),
    createTableColumn<LogEntry>({
      columnId: 'details',
      renderHeaderCell: () => '',
      renderCell: log => <TableCellLayout><Tooltip content="Inspecionar detalhe e stack trace" relationship="label"><Button size="small" appearance="subtle" icon={<Search24Regular />} onClick={() => setLogSelecionado(log)} /></Tooltip></TableCellLayout>,
    }),
  ];

  return (
    <div className={s.page}>
      <PageHeader
        title="🛡️ Central de Eventos e Auditoria"
        subtitle="Monitoramento de tráfego HTTP e logs de execução do sistema em tempo real"
        actions={
          <>
            <Button icon={<ArrowDownload24Regular />} appearance="outline" onClick={exportarLogs} disabled={filtrados.length === 0}>
              Exportar
            </Button>
            <Button
              icon={<Delete24Regular />}
              appearance="primary"
              className={s.danger}
              disabled={logs.length === 0}
              onClick={() => { clearLogs(); setLogSelecionado(null); }}
            >
              Limpar Logs
            </Button>
          </>
        }
      />

      <TabList selectedValue={activeTab} onTabSelect={(_, data) => {
        setActiveTab(data.value as ActiveTab);
        setLogSelecionado(null);
        setBusca('');
        setFiltroNivel('all');
      }}>
        <TabList>
          <Tab value="network" icon={<Globe24Regular />}>Tráfego e Rede</Tab>
          <Tab value="console" icon={<Code24Regular />}>Logs do Console</Tab>
        </TabList>
      </TabList>

      {activeTab === 'network' && (
        <>
        <div className={s.kpiGrid}>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Respostas HTTP observadas</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Shield24Regular style={{ color: tokens.colorBrandForeground1 }} />
            <Text size={600} weight="bold">{networkMetrics.requests}</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Falhas de rede/API</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <ErrorCircle24Regular style={{ color: tokens.colorPaletteRedForeground1 }} />
            <Text size={600} weight="bold" style={{ color: tokens.colorPaletteRedForeground1 }}>{networkMetrics.errors}</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Latência média / p95</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <DataTrending24Regular style={{ color: tokens.colorPaletteYellowForeground1 }} />
            <Text size={400} weight="bold" style={{ color: tokens.colorPaletteYellowForeground1 }}>{networkMetrics.average} / {networkMetrics.p95} ms</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Respostas bem-sucedidas</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <CheckmarkCircle24Regular style={{ color: tokens.colorPaletteGreenForeground1 }} />
            <Text size={600} weight="bold" style={{ color: tokens.colorPaletteGreenForeground1 }}>{networkMetrics.success}</Text>
          </div>
        </div>
        </div>
        <Card>
          <CardHeader header={<Text weight="semibold">Latência das respostas recentes</Text>} description={<Text size={200}>Até 10 respostas desta sessão (ms)</Text>} />
          {networkMetrics.chartLogs.length ? (
            <div className={s.chart} role="img" aria-label="Gráfico de barras com a latência das últimas respostas">
              {networkMetrics.chartLogs.map(log => {
                const value = log.durationMs ?? 0;
                const max = Math.max(...networkMetrics.chartLogs.map(item => item.durationMs ?? 0), 1);
                const height = Math.max(6, Math.round((value / max) * 112));
                return (
                  <div key={log.id} className={s.chartItem} title={`${log.method ?? 'HTTP'} ${log.url ?? ''}: ${value} ms`}>
                    <Text size={100}>{value} ms</Text>
                    <div className={s.chartBar} style={{ height: `${height}px` }} />
                    <Text size={100}>{log.method ?? 'HTTP'}</Text>
                  </div>
                );
              })}
            </div>
          ) : <Text size={200} style={{ display: 'block', padding: '16px', color: tokens.colorNeutralForeground3 }}>As métricas aparecem depois que a aplicação registrar respostas da API.</Text>}
        </Card>
        </>
      )}
      {activeTab === 'console' && (
        <>
          <div className={s.kpiGrid}>
            <div className={s.kpiCard}><Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Erros do Console / exceções</Text><Text size={600} weight="bold">{consoleMetrics.runtimeErrors}</Text></div>
            <div className={s.kpiCard}><Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Eventos de auditoria</Text><Text size={600} weight="bold">{consoleMetrics.audits}</Text></div>
            <div className={s.kpiCard}><Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Avisos de execução</Text><Warning24Regular style={{ color: tokens.colorPaletteYellowForeground1 }} /><Text size={600} weight="bold">{consoleMetrics.warnings}</Text></div>
          </div>
          <Card className={s.insight}>
            <Text weight="semibold">Diagnóstico assistido (local)</Text>
            <Text size={200}>
              {newestRuntimeError
                ? `${diagnosis.title}: ${diagnosis.explanation}`
                : 'Quando ocorrer uma exceção JavaScript ou rejeição não tratada, sugestões aparecerão aqui.'}
            </Text>
            <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>
              A análise usa regras locais; nenhuma mensagem ou dado da aplicação é enviado a um modelo externo.
            </Text>
            <Link
              href={`https://learn.microsoft.com/search/?terms=${encodeURIComponent(diagnosis.search)}`}
              target="_blank"
              rel="noreferrer"
            >
              Pesquisar orientação no Microsoft Learn
            </Link>
          </Card>
        </>
      )}

      <div className={s.contentLayout}>
        <div className={s.mainContent}>
          <div className={s.filterBar}>
            <Input contentBefore={<Search24Regular />} placeholder={activeTab === 'network' ? 'Filtrar por mensagem, rota ou verbo HTTP...' : 'Filtrar por mensagem ou stack trace...'} value={busca} onChange={e => setBusca(e.target.value)} style={{ minWidth: '260px', flex: 1 }} />
            <Select value={filtroNivel} onChange={e => setFiltroNivel(e.target.value as FilterLevel)}>
              <option value="all">Todos os Níveis</option>
              <option value="error">Erros (ERROR)</option>
              <option value="warn">Avisos (WARN)</option>
              <option value="success">Sucesso (SUCCESS)</option>
              <option value="info">Informação (INFO)</option>
            </Select>
          </div>

          <div ref={bodyRef} className={s.tableWrap}>
            {filtrados.length === 0 ? (
              <div className={s.emptyState}>
                <Text>
                  {activeTab === 'console'
                    ? 'Nenhum log capturado nesta sessão. Esta aba registra chamadas a console.error/console.warn, erros JavaScript e rejeições não tratadas ocorridos depois que a aplicação iniciou.'
                    : 'Nenhuma resposta de rede corresponde aos filtros atuais.'}
                </Text>
              </div>
            ) : (
            <DataGrid
              items={filtrados}
              columns={activeTab === 'network' ? networkColumns : consoleColumns}
              resizableColumns
              columnSizingOptions={activeTab === 'network'
                ? { timestamp: { defaultWidth: 125, minWidth: 125 }, metodo: { defaultWidth: 80, minWidth: 80 }, status: { defaultWidth: 70, minWidth: 70 }, duracao: { defaultWidth: 90, minWidth: 90 }, acoes: { defaultWidth: 48, minWidth: 48 }, mensagem: { minWidth: 250 } }
                : { timestamp: { defaultWidth: 125, minWidth: 125 }, source: { defaultWidth: 100, minWidth: 100 }, level: { defaultWidth: 90, minWidth: 90 }, message: { minWidth: 300 } }
              }
            >
              <DataGridHeader>
                <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
              </DataGridHeader>
              <DataGridBody<LogEntry>>
                {({ item, rowId }) => (
                  <DataGridRow<LogEntry> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
            )}
          </div>
        </div>

        <div className={s.sidebar}>
          {logSelecionado ? (
            <>
              <div>
                <Title2 style={{ color: tokens.colorBrandForeground1 }}>Detalhamento Técnico</Title2>
                <Text size={200} style={{ display: 'block', marginTop: '4px', color: tokens.colorNeutralForeground3 }}>
                  {logSelecionado.source === 'network' ? 'Metadados e corpo completo do payload da requisição' : 'Detalhes do erro de execução ou evento de auditoria'}
                </Text>
              </div>
              <Card>
                <CardHeader header={<Text weight="semibold">{logSelecionado.source === 'network' ? 'Identificação da Requisição' : 'Identificação do Evento'}</Text>} />
                <div className={s.statRow}>
                  <Clock24Regular />
                  <Text>Timestamp: <b>{new Date(logSelecionado.ts).toLocaleString('pt-BR')}</b></Text>
                </div>
                {logSelecionado.url && (
                  <div style={{ padding: '4px 0' }}>
                    <Text size={200} style={{ display: 'block', color: tokens.colorNeutralForeground3 }}>URL do Endpoint:</Text>
                    <Text size={200} style={{ fontFamily: 'Consolas, monospace', wordBreak: 'break-all' }}><b>{logSelecionado.url}</b></Text>
                  </div>
                )}
              </Card>
              <Card>
                <CardHeader header={<Text weight="semibold">Payload / Detalhe Técnico</Text>} />
                <div className={s.statRow}>
                  <Code24Regular />
                  <Text>Corpo da Resposta ou Stacktrace:</Text>
                </div>
                {logSelecionado.detail ? <pre className={s.codeBox}>{logSelecionado.detail}</pre> : <Text size={200} italic style={{ color: tokens.colorNeutralForeground4 }}>Nenhum detalhe ou payload anexado a este evento.</Text>}
              </Card>
              {logSelecionado.source === 'network' && (
                <Card>
                  <CardHeader header={<Text weight="semibold">Métricas de Performance</Text>} />
                  <div className={s.statRow}>
                    <Info24Regular />
                    <Text>Duração total da requisição: <b>{logSelecionado.durationMs ?? 0} ms</b></Text>
                  </div>
                  {logSelecionado.status !== undefined && <Text>Status HTTP: <b>{logSelecionado.status}</b></Text>}
                </Card>
              )}
              <Button appearance="secondary" onClick={() => setLogSelecionado(null)}>Fechar Detalhes</Button>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '60px', color: tokens.colorNeutralForeground3, padding: '20px' }}>
              <Code24Regular style={{ fontSize: '48px', marginBottom: '16px', color: tokens.colorNeutralStroke1 }} />
              <br />
              <Text size={300}>Selecione uma linha de evento ou log na tabela lateral para inspecionar os cabeçalhos HTTP, stacktraces e objetos JSON.</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
