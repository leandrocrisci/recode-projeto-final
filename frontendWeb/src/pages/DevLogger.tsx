import { useState, useMemo, useRef } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Badge, Title2, Card, CardHeader, Tooltip
} from '@fluentui/react-components';
import {
  Search24Regular, Delete24Regular, ArrowDownload24Regular,
  AlertUrgent24Regular, ErrorCircle24Regular, CheckmarkCircle24Regular,
  Shield24Regular, Code24Regular, Clock24Regular, Info24Regular
} from '@fluentui/react-icons';
import { useLogs } from '../context/LogContext';
import type { LogEntry, LogLevel } from '../context/LogContext';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { cmpNumero, cmpTexto } from '../utils/tableSort';
import { KpiCard } from '../components/KpiCard';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' },
  contentLayout: { display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' },
  mainContent: { flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '10px 14px', borderRadius: tokens.borderRadiusMedium },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  sidebar: { width: '380px', minWidth: '320px', border: `1px solid ${tokens.colorNeutralStroke1}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' },
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

function fmtTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('pt-BR') + '.' + d.getMilliseconds().toString().padStart(3, '0');
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
  const [logSelecionado, setLogSelecionado] = useState<LogEntry | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroNivel, setFiltroNivel] = useState<FilterLevel>('all');
  const bodyRef = useRef<HTMLDivElement>(null);

  const filtrados = useMemo(() => {
    return logs.filter(l => {
      const matchNivel = filtroNivel === 'all' || l.level === filtroNivel;
      const q = busca.toLowerCase();
      return matchNivel && (!busca || l.message.toLowerCase().includes(q) || (l.url ?? '').toLowerCase().includes(q) || (l.method ?? '').toLowerCase().includes(q));
    });
  }, [logs, busca, filtroNivel]);

  const kpis = useMemo(() => {
    const total = logs.length;
    const erros = logs.filter(l => l.level === 'error').length;
    const avisos = logs.filter(l => l.level === 'warn').length;
    const sucesso = logs.filter(l => l.level === 'success').length;
    return { total, erros, avisos, sucesso };
  }, [logs]);

  const exportarLogs = () => {
    const blob = new Blob([JSON.stringify(filtrados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventos-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    createTableColumn<LogEntry>({
      columnId: 'timestamp', compare: (a, b) => cmpNumero(a.ts, b.ts),
      renderHeaderCell: () => 'Horário',
      renderCell: l => <TableCellLayout style={{ fontFamily: 'Consolas, monospace' }}>{fmtTimestamp(l.ts)}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'metodo', compare: (a, b) => cmpTexto(a.method, b.method),
      renderHeaderCell: () => 'Método',
      renderCell: l => <TableCellLayout>{l.method ? <span style={{ fontWeight: 'bold', color: METHOD_COLOR(l.method) }}>{l.method}</span> : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'status', compare: (a, b) => cmpNumero(a.status, b.status),
      renderHeaderCell: () => 'Status',
      renderCell: l => <TableCellLayout>{l.status !== undefined ? <span style={{ fontWeight: 'bold', color: l.status < 300 ? '#16a34a' : l.status < 500 ? '#d97706' : '#dc2626' }}>{l.status}</span> : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'mensagem',
      renderHeaderCell: () => 'Mensagem de Evento',
      renderCell: l => <TableCellLayout><Badge appearance="filled" color={BADGE_COLOR[l.level]} size="small" style={{ marginRight: '6px' }}>{l.level.toUpperCase()}</Badge><Text style={{ wordBreak: 'break-word' }}>{l.message}</Text></TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'duracao', compare: (a, b) => cmpNumero(a.durationMs, b.durationMs),
      renderHeaderCell: () => 'Latência',
      renderCell: l => <TableCellLayout>{l.durationMs !== undefined ? `${l.durationMs}ms` : '—'}</TableCellLayout>
    }),
    createTableColumn<LogEntry>({
      columnId: 'acoes',
      renderHeaderCell: () => '',
      renderCell: l => <TableCellLayout><Tooltip content="Inspecionar Payload" relationship="label"><Button size="small" appearance="subtle" icon={<Search24Regular />} onClick={() => setLogSelecionado(l)} /></Tooltip></TableCellLayout>
    })
  ];

  return (
    <div className={s.page}>
      <PageHeader
        icon={<Shield24Regular />}
        title="Central de Eventos e Auditoria"
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

      <div className={s.kpiGrid}>
        <KpiCard icon={<Shield24Regular />} label="Volume Total de Requisições" value={kpis.total} />
        <KpiCard icon={<ErrorCircle24Regular />} label="Exceções e Erros (5xx / 4xx)" value={kpis.erros} tone={kpis.erros > 0 ? 'danger' : 'neutral'} />
        <KpiCard icon={<AlertUrgent24Regular />} label="Alertas de Infraestrutura" value={kpis.avisos} tone={kpis.avisos > 0 ? 'warning' : 'neutral'} />
        <KpiCard icon={<CheckmarkCircle24Regular />} label="Requisições com Sucesso" value={kpis.sucesso} tone={kpis.sucesso > 0 ? 'success' : 'neutral'} />
      </div>

      <div className={s.contentLayout}>
        <div className={s.mainContent}>
          <div className={s.filterBar}>
            <Input contentBefore={<Search24Regular />} placeholder="Filtrar por mensagem, rota ou verbo HTTP..." value={busca} onChange={e => setBusca(e.target.value)} style={{ minWidth: '260px', flex: 1 }} />
            <Select value={filtroNivel} onChange={e => setFiltroNivel(e.target.value as FilterLevel)}>
              <option value="all">Todos os Níveis</option>
              <option value="error">Erros (ERROR)</option>
              <option value="warn">Avisos (WARN)</option>
              <option value="success">Sucesso (SUCCESS)</option>
              <option value="info">Informação (INFO)</option>
            </Select>
          </div>

          <div ref={bodyRef} className={s.tableWrap}>
            <DataGrid items={filtrados} columns={columns} sortable resizableColumns columnSizingOptions={{ timestamp: { defaultWidth: 125, minWidth: 125 }, metodo: { defaultWidth: 80, minWidth: 80 }, status: { defaultWidth: 70, minWidth: 70 }, duracao: { defaultWidth: 90, minWidth: 90 }, acoes: { defaultWidth: 48, minWidth: 48 }, mensagem: { minWidth: 250 } }}>
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
            {filtrados.length === 0 && (
              <EmptyState message={logs.length === 0 ? 'Nenhum evento registrado ainda. As requisições aparecem aqui assim que a API for chamada.' : 'Nenhum evento corresponde aos filtros.'} />
            )}
          </div>
        </div>

        <div className={s.sidebar}>
          {logSelecionado ? (
            <>
              <div>
                <Title2 style={{ color: tokens.colorBrandForeground1 }}>Detalhamento Técnico</Title2>
                <Text size={200} style={{ display: 'block', marginTop: '4px', color: tokens.colorNeutralForeground3 }}>Metadados e corpo completo do payload da requisição</Text>
              </div>
              <Card>
                <CardHeader header={<Text weight="semibold">Identificação da Requisição</Text>} />
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
              <Card>
                <CardHeader header={<Text weight="semibold">Métricas de Performance</Text>} />
                <div className={s.statRow}>
                  <Info24Regular />
                  <Text>Tempo de Processamento do Banco: <b>{logSelecionado.durationMs ?? 0} ms</b></Text>
                </div>
              </Card>
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
