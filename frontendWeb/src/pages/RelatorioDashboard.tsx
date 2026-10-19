import { useEffect, useMemo, useRef, useState } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Title2, Card, CardHeader, Tooltip, TabList, Tab,
} from '@fluentui/react-components';
import {
  Search24Regular, Building24Regular, VehicleBus24Regular,
  MyLocation24Regular, People24Regular, ArrowClockwise24Regular, DataTrending24Regular,
  Star24Regular,
} from '@fluentui/react-icons';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { cmpNumero, cmpTexto } from '../utils/tableSort';
import { KpiCard } from '../components/KpiCard';
import { corTipoEscola } from '../utils/tipoEscola';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import { HBarChart } from '../components/charts/HBarChart';
import type { HBarItem } from '../components/charts/HBarChart';
import {
  faixaNota5, faixaNota10, mediaGeralEscolas, mediaPorCurso, mediaPorRegiao, detalheRegiao, obterRegiao, ordenarCursos,
} from '../utils/avaliacoesRelatorio';
import type { OrdemCursos } from '../utils/avaliacoesRelatorio';
import { getAvaliacoesCursos, getCursos } from '../services/api';
import type { AvaliacaoCurso, Curso } from '../types';
import type { EscolaAgregada } from '../utils/agregarEscolas';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
    '@media (max-width: 768px)': { padding: '12px', gap: '12px' } },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px',
    '@media (max-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' } },
  contentLayout: { display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap',
    '@media (max-width: 768px)': { flexDirection: 'column', alignItems: 'stretch', gap: '12px' } },
  mainContent: { flex: 1, minWidth: 0, flexBasis: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '10px 14px', borderRadius: tokens.borderRadiusMedium },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflowX: 'auto' },
  tableInner: { minWidth: '560px' },
  searchInput: { minWidth: '240px', flex: 1, '@media (max-width: 768px)': { minWidth: 0, width: '100%' } },
  sidebar: { width: '350px', minWidth: '320px', border: `1px solid ${tokens.colorNeutralStroke1}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 768px)': { width: '100%', minWidth: 0, boxSizing: 'border-box', padding: '14px' } },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' },
  chartSection: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  chartCaption: { color: tokens.colorNeutralForeground3 },
  chartTitle: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' },
  tabList: { marginTop: '4px' },
  chartControls: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
});

const LIMITE_CURSOS = 10;

export default function RelatorioDashboard() {
  const s = useStyles();
  const { escolas: escolasAgregadas, loading, error, reload: loadDados } = useEscolasAgregadas();
  const [escolaSelecionadaId, setEscolaSelecionadaId] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [activeTab, setActiveTab] = useState<'regiao' | 'curso' | 'analitico'>('regiao');
  const [avaliacoesCursos, setAvaliacoesCursos] = useState<AvaliacaoCurso[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [erroGraficos, setErroGraficos] = useState('');
  const [recarregarGraficos, setRecarregarGraficos] = useState(0);
  const [ordemCursos, setOrdemCursos] = useState<OrdemCursos>('melhores');
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const detalhesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ativo = true;
    Promise.all([getAvaliacoesCursos(), getCursos()])
      .then(([avaliacoesResponse, cursosResponse]) => {
        if (!ativo) return;
        setErroGraficos('');
        setAvaliacoesCursos(avaliacoesResponse.data ?? []);
        setCursos(cursosResponse.data ?? []);
      })
      .catch((err: unknown) => {
        console.error('Erro ao carregar avaliações dos cursos para o relatório.', err);
        if (ativo) setErroGraficos('Não foi possível carregar as avaliações dos cursos.');
      });
    return () => { ativo = false; };
  }, [recarregarGraficos]);

  const selecionar = (id: number) => {
    setEscolaSelecionadaId(id);
    if (window.matchMedia('(max-width: 768px)').matches) {
      setTimeout(() => detalhesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  };

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

  const escolaSelecionada = useMemo(
    () => escolasAgregadas.find(e => e.id === escolaSelecionadaId) ?? null,
    [escolasAgregadas, escolaSelecionadaId]
  );

  // Regiões: sempre as cinco, com a quantidade de escolas avaliadas (amostra) e a média geral como referência
  const linhasRegiao = useMemo(() => mediaPorRegiao(filtrados), [filtrados]);
  const mediaGeralRegioes = useMemo(() => mediaGeralEscolas(filtrados), [filtrados]);
  const itensRegiao: HBarItem[] = useMemo(() => linhasRegiao.map(l => ({
    id: l.regiao,
    label: l.regiao,
    detail: detalheRegiao(l),
    value: l.media ?? 0,
    display: l.media === null ? '—' : l.media.toFixed(1),
    tone: faixaNota5(l.media),
  })), [linhasRegiao]);
  const resumoRegioes = linhasRegiao
    .map(l => `${l.regiao}: ${l.media === null ? 'sem avaliações' : l.media.toFixed(1)}`)
    .join('; ');

  // Cursos: todos, ordenáveis, com a escola quando o nome do curso se repete
  const cursosAgregados = useMemo(() => mediaPorCurso(avaliacoesCursos, cursos, filtrados), [avaliacoesCursos, cursos, filtrados]);
  const linhasCursos = useMemo(() => ordenarCursos(cursosAgregados.linhas, ordemCursos), [cursosAgregados, ordemCursos]);
  const itensCursos: HBarItem[] = useMemo(
    () => (mostrarTodos ? linhasCursos : linhasCursos.slice(0, LIMITE_CURSOS)).map(c => ({
      id: c.id,
      label: c.rotulo,
      detail: c.detalhe,
      value: c.media,
      display: c.media.toFixed(1),
      tone: faixaNota10(c.media),
    })),
    [linhasCursos, mostrarTodos],
  );

  const kpisGlobais = useMemo(() => {
    const totalEscolas = escolasAgregadas.length;
    const totalAlunos = escolasAgregadas.reduce((acc, e) => acc + e.estatisticas.totalAlunos, 0);
    const totalTransporte = escolasAgregadas.reduce((acc, e) => acc + e.estatisticas.usamOnibus, 0);
    const escolasComAlunos = escolasAgregadas.filter(e => e.estatisticas.totalAlunos > 0);
    const somaDistancias = escolasComAlunos.reduce((acc, e) => acc + parseFloat(e.estatisticas.distanciaMedia), 0);
    const distanciaMediaGlobal = escolasComAlunos.length > 0 ? (somaDistancias / escolasComAlunos.length).toFixed(2) : '0.00';
    const mediaQualidade = escolasAgregadas
      .map(e => e.estatisticas.notaMedia)
      .filter((value): value is number => value !== null);
    const notaMediaGeral = mediaQualidade.length > 0 ? (mediaQualidade.reduce((acc, value) => acc + value, 0) / mediaQualidade.length).toFixed(1) : null;
    return { totalEscolas, totalAlunos, totalTransporte, distanciaMediaGlobal, notaMediaGeral };
  }, [escolasAgregadas]);

  const faixaKpi = faixaNota5(kpisGlobais.notaMediaGeral === null ? null : Number(kpisGlobais.notaMediaGeral));
  const kpiTone = faixaKpi === 'muted' ? 'neutral' : faixaKpi;

  const columns = [
    createTableColumn<EscolaAgregada>({
      columnId: 'nome', compare: (a, b) => cmpTexto(a.nome, b.nome),
      renderHeaderCell: () => 'Instituição de Ensino',
      renderCell: e => <TableCellLayout><Text weight="semibold">{e.nome}</Text></TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'tipo', compare: (a, b) => cmpTexto(a.tipo, b.tipo),
      renderHeaderCell: () => 'Tipo',
      renderCell: e => <TableCellLayout><Badge appearance="tint" color={corTipoEscola(e.tipo)}>{e.tipo}</Badge></TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'alunos', compare: (a, b) => cmpNumero(a.estatisticas.totalAlunos, b.estatisticas.totalAlunos),
      renderHeaderCell: () => 'Qtd Alunos',
      renderCell: e => <TableCellLayout>{e.estatisticas.totalAlunos} un.</TableCellLayout>
    }),
    createTableColumn<EscolaAgregada>({
      columnId: 'distancia', compare: (a, b) => cmpNumero(parseFloat(a.estatisticas.distanciaMedia), parseFloat(b.estatisticas.distanciaMedia)),
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
              icon={<Search24Regular />}
              appearance="subtle"
              size="medium"
              onClick={() => selecionar(e.id)}
              aria-label={`Ver indicadores de ${e.nome}`}
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
        icon={<DataTrending24Regular />}
        title="Relatório Gerencial"
        subtitle="Painel analítico com avaliação por região, desempenho e indicadores escolares"
        actions={<Button
          appearance="outline"
          icon={loading ? <Spinner size="tiny" /> : <ArrowClockwise24Regular />}
          disabled={loading}
          onClick={() => {
            void loadDados();
            setRecarregarGraficos(valor => valor + 1);
          }}
        >
          Atualizar
        </Button>}
      />

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      {erroGraficos && <MessageBar intent="error"><MessageBarBody>{erroGraficos}</MessageBarBody></MessageBar>}

      <div className={s.kpiGrid}>
        <KpiCard icon={<Building24Regular />} label="Total de Escolas" value={kpisGlobais.totalEscolas} hint={`${tiposDisponiveis.length} tipo${tiposDisponiveis.length !== 1 ? 's' : ''} de dependência`} />
        <KpiCard icon={<People24Regular />} label="Total de Alunos" value={kpisGlobais.totalAlunos} hint="vinculados às escolas" />
        <KpiCard icon={<MyLocation24Regular />} label="Distância Média Global" value={`${kpisGlobais.distanciaMediaGlobal} km`} hint="média entre as escolas com alunos" />
        <KpiCard icon={<Star24Regular />} label="Média de Qualidade" value={kpisGlobais.notaMediaGeral ?? '—'} hint="avaliação consolidada por escola" tone={kpiTone} />
      </div>

      <div className={s.contentLayout}>
        <div className={s.mainContent}>
          <div className={s.filterBar}>
            <Input
              contentBefore={<Search24Regular />}
              placeholder="Filtrar por escola..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className={s.searchInput}
            />
            <Select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}>
              <option value="todos">Todos os tipos</option>
              {tiposDisponiveis.map(tp => <option key={tp} value={tp}>{tp}</option>)}
            </Select>
          </div>

          <div className={s.chartSection}>
            <div className={s.chartTitle}>
              <Text weight="semibold" size={500}>Painel analítico</Text>
              <Text size={200} className={s.chartCaption}>
                {filtrados.length} {filtrados.length === 1 ? 'instituição' : 'instituições'} no filtro atual
              </Text>
            </div>
            <TabList className={s.tabList} selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value as 'regiao' | 'curso' | 'analitico')}>
              <Tab value="regiao">Avaliação por Região</Tab>
              <Tab value="curso">Avaliação dos Cursos</Tab>
              <Tab value="analitico">Escolas</Tab>
            </TabList>

            {activeTab === 'regiao' && (
              <>
                <div className={s.chartTitle}>
                  <Text size={300}>Média de avaliação das escolas por região</Text>
                  <Text size={200} className={s.chartCaption}>Escala de 1 a 5 · escolas da seleção atual</Text>
                </div>
                {filtrados.length > 0 ? (
                  <>
                    <HBarChart
                      groups={[{ items: itensRegiao }]}
                      max={5}
                      marker={mediaGeralRegioes === null ? undefined : { value: mediaGeralRegioes, label: `Média geral: ${mediaGeralRegioes.toFixed(1)} / 5` }}
                      ariaLabel={`Média de avaliação por região. ${resumoRegioes}.`}
                    />
                    <Text size={200} className={s.chartCaption}>
                      Cada média é a das notas das escolas avaliadas da região. Regiões com menos de 3 escolas avaliadas têm amostra pequena; leia com cautela.
                    </Text>
                  </>
                ) : (
                  <EmptyState message="Sem avaliação por região para os filtros atuais." />
                )}
              </>
            )}

            {activeTab === 'curso' && (
              <>
                <div className={s.chartTitle}>
                  <Text size={300}>Média das avaliações por curso</Text>
                  <Text size={200} className={s.chartCaption}>
                    Escala de 0 a 10 · {linhasCursos.length} {linhasCursos.length === 1 ? 'curso avaliado' : 'cursos avaliados'}
                  </Text>
                </div>
                {linhasCursos.length > 0 ? (
                  <>
                    <div className={s.chartControls}>
                      <Select value={ordemCursos} onChange={e => setOrdemCursos(e.target.value as OrdemCursos)} aria-label="Ordem dos cursos">
                        <option value="melhores">Maiores notas primeiro</option>
                        <option value="piores">Menores notas primeiro</option>
                      </Select>
                      {linhasCursos.length > LIMITE_CURSOS && (
                        <Button appearance="subtle" onClick={() => setMostrarTodos(v => !v)}>
                          {mostrarTodos ? `Mostrar só ${LIMITE_CURSOS}` : `Mostrar todos (${linhasCursos.length})`}
                        </Button>
                      )}
                    </div>
                    <HBarChart
                      groups={[{ items: itensCursos }]}
                      max={10}
                      marker={cursosAgregados.mediaGeral === null ? undefined : { value: cursosAgregados.mediaGeral, label: `Média geral: ${cursosAgregados.mediaGeral.toFixed(1)} / 10` }}
                      ariaLabel={`Média das avaliações de ${linhasCursos.length} cursos, de 0 a 10.`}
                    />
                  </>
                ) : (
                  <EmptyState message="Sem avaliação de cursos para os filtros atuais." />
                )}
              </>
            )}

            {activeTab === 'analitico' && (
              <div className={s.tableWrap}>
                <DataGrid className={s.tableInner} items={filtrados} columns={columns} sortable resizableColumns>
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
                {filtrados.length === 0 && <EmptyState message="Nenhuma escola encontrada para os filtros atuais." />}
              </div>
            )}
          </div>
        </div>

        {activeTab === 'analitico' && <div className={s.sidebar} ref={detalhesRef}>
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
                <CardHeader header={<Text weight="semibold">Avaliação e Região</Text>} />
                <div className={s.statRow}>
                  <Star24Regular />
                  <Text>
                    Avaliação média:{' '}
                    <b>
                      {escolaSelecionada.estatisticas.notaMedia === null
                        ? 'Sem avaliação'
                        : `${escolaSelecionada.estatisticas.notaQualidadeMedia} / 5`}
                    </b>
                  </Text>
                </div>
                <div className={s.statRow}>
                  <MyLocation24Regular />
                  <Text>Região: <b>{obterRegiao(escolaSelecionada.estado)}</b></Text>
                </div>
                <Text size={200} style={{ paddingLeft: '32px', color: tokens.colorNeutralForeground3 }}>
                  {escolaSelecionada.cidade && escolaSelecionada.estado
                    ? `${escolaSelecionada.cidade} - ${escolaSelecionada.estado}`
                    : 'Localização não informada'}
                </Text>
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
        </div>}
      </div>
    </div>
  );
}
