import { useState, useMemo } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Title2, Card, CardHeader, Tooltip     
} from '@fluentui/react-components';
import {
  Search24Regular, Building24Regular, VehicleBus24Regular,
  MyLocation24Regular, People24Regular, ArrowClockwise24Regular
} from '@fluentui/react-icons';
import { PageHeader } from '../components/PageHeader';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import type { EscolaAgregada } from '../utils/agregarEscolas';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  kpiGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' },
  kpiCard: { flex: '1 1 220px', padding: '16px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  contentLayout: { display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' },
  mainContent: { flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '10px 14px', borderRadius: tokens.borderRadiusMedium },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  sidebar: { width: '350px', minWidth: '320px', border: `1px solid ${tokens.colorNeutralStroke1}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' },
});

export default function RelatorioDashboard() {
  const s = useStyles();
  const { escolas: escolasAgregadas, loading, error, reload: loadDados } = useEscolasAgregadas();
  const [escolaSelecionadaId, setEscolaSelecionadaId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const tiposDisponiveis = useMemo(
    () => Array.from(new Set<string>(escolasAgregadas.map(e => e.tipo).filter(Boolean)))
      .sort((a: string, b: string) => a.localeCompare(b, 'pt-BR')),
    [escolasAgregadas]
  );

  const filtrados = useMemo(() => escolasAgregadas.filter(e => {
    const q = busca.toLowerCase();
    const matchBusca = e.nome.toLowerCase().includes(q) || e.enderecoFormatado.toLowerCase().includes(q);
    const matchTipo = filtroTipo === 'todos' || e.tipo === filtroTipo;
    return matchBusca && matchTipo;
  }), [escolasAgregadas, busca, filtroTipo]);

  // Guarda só o id e deriva o objeto da lista: depois de "Atualizar", o painel lateral mostra os dados novos.
  const escolaSelecionada = useMemo(
    () => escolasAgregadas.find(e => e.id === escolaSelecionadaId) ?? null,
    [escolasAgregadas, escolaSelecionadaId]
  );

  const kpisGlobais = useMemo(() => {
    const totalEscolas = escolasAgregadas.length;
    const totalAlunos = escolasAgregadas.reduce((acc, e) => acc + e.estatisticas.totalAlunos, 0);
    const totalTransporte = escolasAgregadas.reduce((acc, e) => acc + e.estatisticas.usamOnibus, 0);
    const escolasComAlunos = escolasAgregadas.filter(e => e.estatisticas.totalAlunos > 0);
    const somaDistancias = escolasComAlunos.reduce((acc, e) => acc + parseFloat(e.estatisticas.distanciaMedia), 0);
    const distanciaMediaGlobal = escolasComAlunos.length > 0 ? (somaDistancias / escolasComAlunos.length).toFixed(2) : '0.00';
    return { totalEscolas, totalAlunos, totalTransporte, distanciaMediaGlobal };
  }, [escolasAgregadas]);
  const columns = [
    createTableColumn<EscolaAgregada>({
      columnId: 'nome',
      renderHeaderCell: () => 'Instituição de Ensino',
      renderCell: e => <TableCellLayout><Text weight="semibold">{e.nome}</Text></TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'tipo',
      renderHeaderCell: () => 'Tipo',
      renderCell: e => <TableCellLayout><Badge appearance="outline">{e.tipo}</Badge></TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'alunos',
      renderHeaderCell: () => 'Qtd Alunos',
      renderCell: e => <TableCellLayout>{e.estatisticas.totalAlunos} un.</TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'distancia',
      renderHeaderCell: () => 'Distância Média',
      renderCell: e => <TableCellLayout>{e.estatisticas.distanciaMedia} km</TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'acoes',
      renderHeaderCell: () => 'Ações',
      renderCell: e => (
        <TableCellLayout>
      <Tooltip content="Ver Indicadores Detalhados" relationship="label">
        <Button 
          icon={<Search24Regular/>} 
          appearance="subtle" 
          size="medium" 
          onClick={() => setEscolaSelecionadaId(e.id)}
        />
      </Tooltip>
    </TableCellLayout>
      )
    })
  ];

  if (loading && escolasAgregadas.length === 0) return <Spinner label="Consolidando dados socioespaciais..." style={{ padding: '40px' }} />;

  return (
    <div className={s.page}>
      <PageHeader
        title="📊 Relatório Gerencial e Socioespacial"
        subtitle="Dados consolidados de infraestrutura e mobilidade estudantil"
        actions={<Button
            appearance="outline"
            icon={loading ? <Spinner size="tiny" /> : <ArrowClockwise24Regular />}
            disabled={loading}
            onClick={() => loadDados()}
          >
            Atualizar
          </Button>}
      />

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      <div className={s.kpiGrid}>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Total de Escolas</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <Building24Regular style={{ color: tokens.colorBrandForeground1 }} />
            <Text size={600} weight="bold">{kpisGlobais.totalEscolas}</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Total de Alunos</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <People24Regular style={{ color: tokens.colorBrandForeground1 }} />
            <Text size={600} weight="bold">{kpisGlobais.totalAlunos}</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Distância Média Global</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <MyLocation24Regular style={{ color: tokens.colorBrandForeground1 }} />
            <Text size={600} weight="bold">{kpisGlobais.distanciaMediaGlobal} km</Text>
          </div>
        </div>
        <div className={s.kpiCard}>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Uso de Transporte Escolar</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <VehicleBus24Regular style={{ color: tokens.colorBrandForeground1 }} />
            <Text size={600} weight="bold">{kpisGlobais.totalTransporte}</Text>
          </div>
        </div>
      </div>

      <div className={s.contentLayout}>
        <div className={s.mainContent}>
          <div className={s.filterBar}>
            <Input
              contentBefore={<Search24Regular />}
              placeholder="Filtrar por escola..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ minWidth: '240px', flex: 1 }}
            />
            <Select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              {tiposDisponiveis.map(tp => <option key={tp} value={tp}>{tp}</option>)}
            </Select>
          </div>

          <div className={s.tableWrap}>
            <DataGrid items={filtrados} columns={columns} resizableColumns>
              <DataGridHeader>
                <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
              </DataGridHeader>
              <DataGridBody<EscolaAgregada>>
                {({ item, rowId }) => (
                  <DataGridRow<EscolaAgregada> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
            {filtrados.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                Nenhuma escola encontrada para os filtros atuais.
              </div>
            )}
          </div>
        </div>

        <div className={s.sidebar}>
          {escolaSelecionada ? (
            <>
              <div>
                <Title2>{escolaSelecionada.nome}</Title2>
                <Text size={200} italic style={{ color: tokens.colorNeutralForeground3, display: 'block', marginTop: '4px' }}>
                  {escolaSelecionada.enderecoFormatado}
                </Text>
              </div>

              <Card>
                <CardHeader header={<Text weight="semibold">Perfil Demográfico</Text>} />
                <div className={s.statRow}>
                  <People24Regular />
                  <Text>Alunos Vinculados: <b>{escolaSelecionada.estatisticas.totalAlunos}</b></Text>
                </div>
                <div style={{ paddingLeft: '32px' }}>
                  <Text size={200} style={{ display: 'block' }}>Urbana: {escolaSelecionada.estatisticas.alunosUrbanos}</Text>
                  <Text size={200} style={{ display: 'block' }}>Rural: {escolaSelecionada.estatisticas.alunosRurais} ({escolaSelecionada.estatisticas.percentualRural}%)</Text>
                </div>
              </Card>

              <Card>
                <CardHeader header={<Text weight="semibold">Mobilidade e Tempo</Text>} />
                <div className={s.statRow}>
                  <MyLocation24Regular />
                  <Text>Distância Média: <b>{escolaSelecionada.estatisticas.distanciaMedia} km</b></Text>
                </div>
                <div className={s.statRow}>
                  <VehicleBus24Regular />
                  <Text>Tempo Médio de Trajeto: <b>{escolaSelecionada.estatisticas.tempoMedio} min</b></Text>
                </div>
              </Card>

              <Card>
                <CardHeader header={<Text weight="semibold">Logística de Transporte</Text>} />
                <div className={s.statRow}>
                  <VehicleBus24Regular />
                  <Text>Uso de Transporte Público: <b>{escolaSelecionada.estatisticas.usamOnibus}</b></Text>
                </div>
              </Card>
              
              <Button appearance="secondary" onClick={() => setEscolaSelecionadaId(null)}>Fechar</Button>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '40px', color: tokens.colorNeutralForeground3 }}>
              <Building24Regular style={{ fontSize: '48px', marginBottom: '16px' }} />
              <Text size={300} style={{ display: 'block' }}>Selecione uma instituição para auditar os indicadores demográficos e logísticos detalhados.</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
