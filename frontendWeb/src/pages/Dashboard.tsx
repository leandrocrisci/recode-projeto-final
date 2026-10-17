import { useMemo, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow, Circle } from '@vis.gl/react-google-maps';
import { Spinner, Text, Badge, makeStyles, tokens, Button, Input, MessageBar, MessageBarBody } from '@fluentui/react-components';
import { Building24Regular, VehicleBus24Regular, MyLocation24Regular, Star24Regular, Clock24Regular, People24Regular, Location24Regular, Search24Regular, ArrowLeft24Regular } from '@fluentui/react-icons';
import { KpiCard } from '../components/KpiCard';
import { corTipoEscola } from '../utils/tipoEscola';
import type { KpiTone } from '../components/KpiCard';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import { calcularKpis, SEM_AVALIACAO, temCoordenadas } from '../utils/agregarEscolas';
import type { EscolaGeo } from '../utils/agregarEscolas';

// Altura da Navbar (components/Navbar.tsx). O Dashboard ocupa o resto da tela.
const NAVBAR_HEIGHT = 56;

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', width: '100%', height: `calc(100vh - ${NAVBAR_HEIGHT}px)` },
  kpiStrip: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', padding: '12px 16px', backgroundColor: tokens.colorNeutralBackground2, borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  container: { display: 'flex', flex: 1, minHeight: 0, width: '100%' },
  mapBox: { flex: 1, height: '100%' },
  sidebar: { flexShrink: 0, width: '350px', borderLeft: `1px solid ${tokens.colorNeutralStroke1}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', clear: 'both' },
  escolaList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  escolaItem: {
    display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', textAlign: 'left',
    padding: '8px 10px', cursor: 'pointer', fontFamily: 'inherit', fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium,
    ':hover': { backgroundColor: tokens.colorNeutralBackground1Hover },
    ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}` },
  },
  escolaNome: { fontWeight: tokens.fontWeightSemibold },
  escolaMeta: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  infoWindowWrap: { padding: '4px', maxWidth: '240px' },
  customPanel: { display: 'block', padding: '12px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, height: 'auto', minHeight: 'fit-content' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: tokens.colorNeutralForeground1, display: 'block', marginBottom: '6px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, paddingBottom: '4px' }
});

const BRASILIA_CENTER = { lat: -14.235004, lng: -51.92528 };

// Faixas de nota (escala 1–5): >= 4 boa, >= 2,5 atenção, abaixo disso crítica.
const faixaNota = (n: number | null) =>
  n === null ? 'informative' : n >= 4 ? 'success' : n >= 2.5 ? 'warning' : 'danger';

const toneDaFaixa = (f: ReturnType<typeof faixaNota>): KpiTone => (f === 'informative' ? 'neutral' : f);

const rotuloNota = (nota: string) => (nota === SEM_AVALIACAO ? 'Sem avaliação' : `★ ${nota}`);

export default function Dashboard() {
  const s = useStyles();
  const { escolas, loading, error } = useEscolasAgregadas();
  const escolasNoMapa = useMemo(() => escolas.filter(temCoordenadas), [escolas]);
  const kpis = useMemo(() => calcularKpis(escolas), [escolas]);
  const semLocalizacao = escolas.length - escolasNoMapa.length;
  const [busca, setBusca] = useState('');
  const listaFiltrada = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return escolasNoMapa
      .filter(e => !q || e.nome.toLowerCase().includes(q) || e.enderecoFormatado.toLowerCase().includes(q))
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
  }, [escolasNoMapa, busca]);
  const [escolaSelecionada, setEscolaSelecionada] = useState<EscolaGeo | null>(null);
  
  // NOVO: Estados de controle dinâmico da câmera do Google Maps
  const [mapCenter, setMapCenter] = useState(BRASILIA_CENTER);
  const [mapZoom, setMapZoom] = useState(4);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (loading) return <Spinner label="Gerando mapa de desempenho nacional..." style={{ padding: '40px' }} />;
  if (error && escolasNoMapa.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>
      </div>
    );
  }
  // NOVO: Função que gerencia o clique e afasta a câmera para abrir o campo de visão da bolha
  const handleMarkerClick = (escola: EscolaGeo) => {
    setEscolaSelecionada(escola);
    
    // Desloca o centro do mapa levemente para baixo (lat - 0.04) para empurrar o InfoWindow para cima
    setMapCenter({
      lat: escola.latitude - 0.04,
      lng: escola.longitude
    });

    // Ajusta o zoom com base no tamanho do raio para garantir que o círculo apareça inteiro
    if (escola.estatisticas.raioMaximoMetros > 15000) {
      setMapZoom(10); // Raio muito grande (cidade/região): afasta bem o mapa
    } else if (escola.estatisticas.raioMaximoMetros > 5000) {
      setMapZoom(12); // Raio médio
    } else {
      setMapZoom(14); // Raio curto (bairro): mantém zoom mais próximo
    }
  };

  const handleClosePanel = () => {
    setEscolaSelecionada(null);
    setMapCenter(BRASILIA_CENTER);
    setMapZoom(4); // Restaura o mapa para a visão macro do Brasil
  };

  const getNotaColor = (nota: string) => faixaNota(nota === SEM_AVALIACAO ? null : parseFloat(nota));

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className={s.root}>
        <div className={s.kpiStrip}>
          <KpiCard
            icon={<Building24Regular />}
            label="Escolas"
            value={kpis.totalEscolas}
            hint={kpis.totalEscolas === 0 ? 'nenhuma cadastrada' : kpis.escolasNoMapa === kpis.totalEscolas ? 'todas localizadas no mapa' : `${kpis.escolasNoMapa} localizadas no mapa`}
          />
          <KpiCard
            icon={<People24Regular />}
            label="Alunos"
            value={kpis.totalAlunos}
            hint="cadastrados no censo"
          />
          <KpiCard
            icon={<Star24Regular />}
            label="Nota média de qualidade"
            value={kpis.notaMediaGeral === null ? '—' : `${kpis.notaMediaGeral.toFixed(1)} / 5`}
            hint={`${kpis.escolasAvaliadas} de ${kpis.totalEscolas} escolas avaliadas`}
            tone={toneDaFaixa(faixaNota(kpis.notaMediaGeral))}
          />
          <KpiCard
            icon={<Location24Regular />}
            label="Alunos em zona rural"
            value={`${kpis.percentualRural}%`}
            hint={`${kpis.alunosRurais} de ${kpis.totalAlunos} alunos`}
          />
        </div>

        <div className={s.container}>
        
          {/* Caixa do Mapa controlada pelos estados reativos de zoom e centro */}
          <div className={s.mapBox}>
            <Map 
              center={mapCenter} 
              zoom={mapZoom}
              onCenterChanged={(e) => setMapCenter(e.detail.center)}
              onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
            >
              {escolasNoMapa.map((escola) => (
                <Marker
                  key={escola.id}
                  position={{ lat: Number(escola.latitude), lng: Number(escola.longitude) }}
                  onClick={() => handleMarkerClick(escola)} // Dispara o novo gerenciador de foco e afastamento
                  title={escola.nome}
                />
              ))}

              {escolaSelecionada && escolaSelecionada.estatisticas.raioMaximoMetros > 0 && (
                <Circle
                  center={{ lat: escolaSelecionada.latitude, lng: escolaSelecionada.longitude }}
                  radius={escolaSelecionada.estatisticas.raioMaximoMetros}
                  fillColor="#facc15"
                  fillOpacity={0.15} // Reduzido ligeiramente para dar mais contraste ao InfoWindow
                  strokeColor="#eab308"
                  strokeOpacity={0.7}
                  strokeWeight={2}
                />
              )}

              {escolaSelecionada && (
                <InfoWindow
                  position={{ lat: escolaSelecionada.latitude, lng: escolaSelecionada.longitude }}
                  onCloseClick={handleClosePanel}
                >
                  <div className={s.infoWindowWrap}>
                    <Text weight="bold" size={300}>{escolaSelecionada.nome}</Text>
                    <br />
                    <Text size={200}>{escolaSelecionada.enderecoFormatado}</Text>
                    <br />
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                      <Badge appearance="tint" color={corTipoEscola(escolaSelecionada.tipo)}>{escolaSelecionada.tipo}</Badge>
                      <Badge appearance="filled" color={getNotaColor(escolaSelecionada.estatisticas.notaQualidadeMedia)}>
                        ★ {escolaSelecionada.estatisticas.notaQualidadeMedia}
                      </Badge>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>

          {/* Barra Lateral Direita */}
          <div className={s.sidebar}>
            {escolaSelecionada ? (
              <>
                <Button appearance="subtle" icon={<ArrowLeft24Regular />} onClick={handleClosePanel} style={{ alignSelf: 'flex-start' }}>
                  Voltar ao panorama
                </Button>
                <div>
                  <Text style={{ fontSize: '18px', fontWeight: '700', display: 'block', lineHeight: '24px', color: tokens.colorNeutralForeground1 }}>
                    {escolaSelecionada.nome}
                  </Text>
                  <Text style={{ fontSize: '12px', fontStyle: 'italic', display: 'block', marginTop: '4px', color: tokens.colorNeutralForeground3 }}>
                    {escolaSelecionada.enderecoFormatado}
                  </Text>
                </div>
              
                <div className={s.customPanel} style={{ borderLeft: `4px solid ${tokens.colorBrandBackground}` }}>
                  <span className={s.panelTitle}>Índice de Qualidade da Instituição</span>
                  <div className={s.statRow}>
                    <Star24Regular style={{ color: tokens.colorPaletteYellowBackground3, flexShrink: 0 }} />
                    <Text size={200}>Avaliação Média: </Text>
                    <Badge appearance="filled" color={getNotaColor(escolaSelecionada.estatisticas.notaQualidadeMedia)}>
                      {escolaSelecionada.estatisticas.notaQualidadeMedia} {escolaSelecionada.estatisticas.notaQualidadeMedia !== 'Sem avaliação' ? '/ 5.0' : ''}
                    </Badge>
                  </div>
                </div>

                <div className={s.customPanel}>
                  <span className={s.panelTitle}>Perfil Demográfico dos Estudantes</span>
                  <div className={s.statRow}>
                    <People24Regular style={{ flexShrink: 0 }} />
                    <Text size={200}>Alunos Vinculados: <b>{escolaSelecionada.estatisticas.totalAlunos}</b></Text>
                  </div>
                  <div style={{ paddingLeft: '34px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <Text size={200}>• Zona Urbana: {escolaSelecionada.estatisticas.alunosUrbanos} alunos</Text>
                    <Text size={200}>• Zona Rural: {escolaSelecionada.estatisticas.alunosRurais} ({escolaSelecionada.estatisticas.percentualRural}%)</Text>
                  </div>
                </div>

                <div className={s.customPanel}>
                  <span className={s.panelTitle}>Indicadores de Deslocamento Espacial</span>
                  <div className={s.statRow}>
                    <MyLocation24Regular style={{ flexShrink: 0 }} />
                    <Text size={200} style={{ whiteSpace: 'normal' }}>
                      Distância média residencial: <b>{escolaSelecionada.estatisticas.distanciaMedia} km</b>
                    </Text>
                  </div>
                  <div className={s.statRow}>
                    <MyLocation24Regular style={{ flexShrink: 0, color: tokens.colorPaletteYellowForeground1 }} />
                    <Text size={200} style={{ whiteSpace: 'normal' }}>
                      Maior distância registrada: <b style={{ color: tokens.colorPaletteYellowForeground1 }}>{escolaSelecionada.estatisticas.distanciaMaxima} km</b>
                    </Text>
                  </div>
                  <div className={s.statRow}>
                    <Clock24Regular style={{ flexShrink: 0 }} />
                    <Text size={200} style={{ whiteSpace: 'normal' }}>
                      Tempo médio de trajeto: <b>{escolaSelecionada.estatisticas.tempoMedio} minutos</b>
                    </Text>
                  </div>
                </div>

                <div className={s.customPanel}>
                  <span className={s.panelTitle}>Logística de Transporte Coletivo</span>
                  <div className={s.statRow}>
                    <VehicleBus24Regular style={{ flexShrink: 0 }} />
                    <Text size={200} style={{ whiteSpace: 'normal' }}>
                      Dependentes de ônibus escolar: <b>{escolaSelecionada.estatisticas.usamOnibus}</b>
                    </Text>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Text style={{ fontSize: '18px', fontWeight: '700', display: 'block', lineHeight: '24px', color: tokens.colorNeutralForeground1 }}>
                    Panorama das escolas
                  </Text>
                  <Text style={{ fontSize: '12px', display: 'block', marginTop: '4px', color: tokens.colorNeutralForeground3 }}>
                    Escolha uma escola na lista ou clique em um marcador do mapa para ver os indicadores.
                  </Text>
                </div>

                <Input
                  contentBefore={<Search24Regular />}
                  placeholder="Buscar escola ou endereço..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />

                <div className={s.escolaList}>
                  {listaFiltrada.map(e => (
                    <button key={e.id} type="button" className={s.escolaItem} onClick={() => handleMarkerClick(e)}>
                      <span className={s.escolaNome}>{e.nome}</span>
                      <span className={s.escolaMeta}>
                        <Badge appearance="tint" size="small" color={corTipoEscola(e.tipo)}>{e.tipo}</Badge>
                        <Badge appearance="filled" size="small" color={getNotaColor(e.estatisticas.notaQualidadeMedia)}>
                          {rotuloNota(e.estatisticas.notaQualidadeMedia)}
                        </Badge>
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                          {e.estatisticas.totalAlunos} aluno{e.estatisticas.totalAlunos !== 1 ? 's' : ''}
                        </Text>
                      </span>
                    </button>
                  ))}
                  {listaFiltrada.length === 0 && (
                    <Text size={200} style={{ color: tokens.colorNeutralForeground3, textAlign: 'center', padding: '12px' }}>
                      Nenhuma escola encontrada.
                    </Text>
                  )}
                </div>

                {semLocalizacao > 0 && (
                  <MessageBar intent="warning">
                    <MessageBarBody>
                      {semLocalizacao} escola{semLocalizacao !== 1 ? 's' : ''} sem localização no mapa. Cadastre o endereço em Endereços.
                    </MessageBarBody>
                  </MessageBar>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </APIProvider>
  );
}
