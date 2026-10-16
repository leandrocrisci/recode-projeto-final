import { useEffect, useState, useMemo } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Title2, Card, CardHeader, Tooltip     
} from '@fluentui/react-components';
import {
  Search24Regular, Building24Regular, VehicleBus24Regular,
  MyLocation24Regular, People24Regular
} from '@fluentui/react-icons';
import axios from 'axios';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  kpiGrid: { display: 'flex', gap: '16px', flexWrap: 'wrap', width: '100%' },
  kpiCard: { flex: '1 1 220px', padding: '16px', backgroundColor: tokens.colorNeutralBackground1, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium },
  contentLayout: { display: 'flex', gap: '20px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' },
  mainContent: { flex: 1, minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '10px 14px', borderRadius: tokens.borderRadiusMedium },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  sidebar: { width: '350px', minWidth: '320px', border: `1px solid ${tokens.colorNeutralStroke1}`, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' },
});

interface Estatisticas {
  totalAlunos: number;
  alunosRurais: number;
  alunosUrbanos: number;
  percentualRural: string;
  distanciaMedia: string;
  tempoMedio: number;
  usamOnibus: number;
}

interface EscolaAgregada {
  id: number;
  nome: string;
  tipo: string;
  enderecoFormatado: string;
  estatisticas: Estatisticas;
}

export default function RelatorioDashboard() {
  const s = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [escolasAgregadas, setEscolasAgregadas] = useState<EscolaAgregada[]>([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState<EscolaAgregada | null>(null);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const loadDados = () => {
    setLoading(true);
    setError('');
    Promise.all([
      axios.get('http://localhost:8090/api/escolas'),
      axios.get('http://localhost:8090/api/alunos'),
      axios.get('http://localhost:8090/api/enderecos-escolas')
    ]).then(([resEscolas, resAlunos, resEnderecos]) => {
      const escolas = resEscolas.data || [];
      const alunos = resAlunos.data || [];
      const enderecos = resEnderecos.data || [];

      const dadosCompilados = escolas.map((esc: any) => {
        const end = enderecos.find((e: any) => e.escola?.id === esc.id || e.escolaId === esc.id);
        const alunosDaEscola = alunos.filter((a: any) => a.escola?.id === esc.id || a.escolaId === esc.id);

        const totalAlunos = alunosDaEscola.length;
        const alunosRurais = alunosDaEscola.filter((a: any) => String(a.area).toLowerCase() === 'rural').length;
        const alunosUrbanos = alunosDaEscola.filter((a: any) => String(a.area).toLowerCase() === 'urbana').length;
        
        const somaDistancia = alunosDaEscola.reduce((acc: number, curr: any) => acc + (curr.distanciaEscola || 0), 0);
        const distanciaMedia = totalAlunos > 0 ? (somaDistancia / totalAlunos).toFixed(2) : '0.00';

        const somaTempo = alunosDaEscola.reduce((acc: number, curr: any) => acc + (curr.tempoDeslocamentoMinutos || 0), 0);
        const tempoMedio = totalAlunos > 0 ? Math.round(somaTempo / totalAlunos) : 0;

        const usamOnibus = alunosDaEscola.filter((a: any) => a.tipoTransporte === 'transporte_escolar').length;

        return {
          id: esc.id,
          nome: esc.nome,
          tipo: esc.tipo,
          enderecoFormatado: end?.formattedAddress || `${end?.logradouro || ''}, ${end?.numero || ''} - ${end?.cidade || ''}/${end?.estado || ''}`,
          estatisticas: {
            totalAlunos,
            alunosRurais,
            alunosUrbanos,
            percentualRural: totalAlunos > 0 ? ((alunosRurais / totalAlunos) * 100).toFixed(1) : '0.0',
            distanciaMedia,
            tempoMedio,
            usamOnibus
          }
        };
      });

      setEscolasAgregadas(dadosCompilados);
    }).catch(err => {
      console.error(err);
      setError('Erro ao carregar ou cruzar dados dos endpoints.');
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => { loadDados(); }, []);

  const filtrados = useMemo(() => escolasAgregadas.filter(e => {
    const matchBusca = e.nome.toLowerCase().includes(busca.toLowerCase()) || e.enderecoFormatado.toLowerCase().includes(busca.toLowerCase());
    const matchTipo = filtroTipo === 'todos' || e.tipo.toLowerCase() === filtroTipo.toLowerCase();
    return matchBusca && matchTipo;
  }), [escolasAgregadas, busca, filtroTipo]);

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
          onClick={() => setEscolaSelecionada(e)} 
        />
      </Tooltip>
    </TableCellLayout>
      )
    })
  ];

  if (loading) return <Spinner label="Consolidando dados socioespaciais..." style={{ padding: '40px' }} />;

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div>
          <Title2>📊 Relatório Gerencial e Socioespacial</Title2>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3, display: 'block', marginTop: '4px' }}>
            Dados consolidados de infraestrutura e mobilidade estudantil
          </Text>
        </div>
        <Button appearance="outline" onClick={loadDados}>Atualizar</Button>
      </div>

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
              <option value="publica">Pública</option>
              <option value="privada">Privada</option>
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
              
              <Button appearance="secondary" onClick={() => setEscolaSelecionada(null)}>Fechar</Button>
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
