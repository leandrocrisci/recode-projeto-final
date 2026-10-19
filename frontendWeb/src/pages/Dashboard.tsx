import { useMemo, useRef, useState } from 'react';
import { APIProvider, AdvancedMarker, ColorScheme, Map, InfoWindow, Circle } from '@vis.gl/react-google-maps';
import { Spinner, Text, Badge, makeStyles, tokens, Button, Input, MessageBar, MessageBarBody, FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Building24Regular, VehicleBus24Regular, MyLocation24Regular, Star24Regular, Clock24Regular, People24Regular, Location24Regular, Search24Regular, ArrowLeft24Regular } from '@fluentui/react-icons';
import { KpiCard } from '../components/KpiCard';
import { useTheme } from '../context/ThemeContext';
import { corTipoEscola } from '../utils/tipoEscola';
import type { KpiTone } from '../components/KpiCard';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import { calcularKpis, SEM_AVALIACAO, temCoordenadas } from '../utils/agregarEscolas';
import type { EscolaGeo } from '../utils/agregarEscolas';

// Altura da Navbar (components/Navbar.tsx). O Dashboard ocupa o resto da tela.
const NAVBAR_HEIGHT = 56;

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', width: '100%', height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    // Celular: a página rola normalmente em vez de travar na altura da tela
    '@media (max-width: 768px)': { height: 'auto', minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)` } },
  kpiStrip: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '12px', padding: '12px 16px', backgroundColor: tokens.colorNeutralBackground2, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    '@media (max-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', padding: '8px' } },
  container: { display: 'flex', flex: 1, minHeight: 0, width: '100%',
    // Celular: o painel lateral desce para baixo do mapa
    '@media (max-width: 768px)': { flexDirection: 'column', flex: 'none' } },
  mapBox: { flex: 1, height: '100%',
    '@media (max-width: 768px)': { flex: 'none', height: '55vh', minHeight: '300px' } },
  sidebar: { flexShrink: 0, width: '350px', borderLeft: `1px solid ${tokens.colorNeutralStroke1}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 768px)': { width: '100%', boxSizing: 'border-box', borderLeft: 'none', borderTop: `1px solid ${tokens.colorNeutralStroke1}`, overflowY: 'visible' } },
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
  panelTitle: { fontSize: '13px', fontWeight: '600', color: tokens.colorNeutralForeground1, display: 'block', marginBottom: '6px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, paddingBottom: '4px' },
  // Texto só para leitores de tela: invisível na tela, mas lido em voz alta
  srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 },
});

const BRASILIA_CENTER = { lat: -14.235004, lng: -51.92528 };

// O AdvancedMarker exige um Map ID. 'DEMO_MAP_ID' serve para desenvolvimento;
// em produção crie um Map ID no Google Cloud e defina VITE_GOOGLE_MAP_ID no .env.local.
const MAP_ID = import.meta.env.VITE_GOOGLE_MAP_ID || 'DEMO_MAP_ID';

// Faixas de nota (escala 1–5): >= 4 boa, >= 2,5 atenção, abaixo disso crítica.
const faixaNota = (n: number | null) =>
  n === null ? 'informative' : n >= 4 ? 'success' : n >= 2.5 ? 'warning' : 'danger';

const toneDaFaixa = (f: ReturnType<typeof faixaNota>): KpiTone => (f === 'informative' ? 'neutral' : f);

const rotuloNota = (nota: string) => (nota === SEM_AVALIACAO ? 'Sem avaliação' : `★ ${nota}`);

// Frase completa da nota para leitores de tela (a estrela e a cor sozinhas não dizem nada)
const descreverNota = (nota: string) => {
  if (nota === SEM_AVALIACAO) return 'Escola ainda sem avaliação de qualidade';
  const n = parseFloat(nota);
  const faixa = n >= 4 ? 'boa' : n >= 2.5 ? 'requer atenção' : 'crítica';
  return `Nota de qualidade ${nota.replace('.', ',')} de 5, ${faixa}`;
};

export default function Dashboard() {
  const s = useStyles();
  const { escolas, loading, error } = useEscolasAgregadas();
  const { isDark } = useTheme();
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
  const painelRef = useRef<HTMLDivElement>(null);
  
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
    // No celular o painel fica abaixo do mapa: rola até ele só quando a escolha veio da lista
    if (window.matchMedia('(max-width: 768px)').matches && painelRef.current && window.scrollY > painelRef.current.offsetTop - 100) {
      setTimeout(() => painelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    
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
        <section className={s.kpiStrip} aria-label="Resumo geral das escolas">
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
        </section>

        <div className={s.container}>
        
          {/* Caixa do Mapa controlada pelos estados reativos de zoom e centro */}
          <div className={s.mapBox} role="region" aria-label={`Mapa com ${escolasNoMapa.length} escolas. Cada marcador abre os indicadores da escola`}>
            <Map 
              mapId={MAP_ID} 
              colorScheme={isDark ? ColorScheme.DARK : ColorScheme.LIGHT} 
              center={mapCenter} 
              zoom={mapZoom}
              onCenterChanged={(e) => setMapCenter(e.detail.center)}
              onZoomChanged={(e) => setMapZoom(e.detail.zoom)}
            >
              {escolasNoMapa.map((escola) => (
                <AdvancedMarker
                  key={escola.id}
                  position={{ lat: Number(escola.latitude), lng: Number(escola.longitude) }}
                  onClick={() => handleMarkerClick(escola)} // Dispara o novo gerenciador de foco e afastamento
                  // O título vira o nome do marcador para leitores de tela e teclado
                  title={`${escola.nome}, ${escola.tipo}. ${descreverNota(escola.estatisticas.notaQualidadeMedia)}. ${escola.estatisticas.totalAlunos} alunos`}
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
                  {/* O balão do InfoWindow é do Google e fica branco mesmo no mapa escuro. Os tokens do Fluent seguem
                      o tema do app (texto branco no escuro), então o conteúdo usa sempre o tema claro para ser legível. */}
                  <FluentProvider theme={webLightTheme} style={{ background: 'transparent' }}>
                    <div className={s.infoWindowWrap}>
                      <Text weight="bold" size={300}>{escolaSelecionada.nome}</Text>
                      <br />
                      <Text size={200}>{escolaSelecionada.enderecoFormatado}</Text>
                      <br />
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
                        <Badge appearance="tint" color={corTipoEscola(escolaSelecionada.tipo)}>{escolaSelecionada.tipo}</Badge>
                        <Badge appearance="filled" color={getNotaColor(escolaSelecionada.estatisticas.notaQualidadeMedia)}>
                          <span aria-hidden="true">{rotuloNota(escolaSelecionada.estatisticas.notaQualidadeMedia)}</span>
                          <span className={s.srOnly}>{descreverNota(escolaSelecionada.estatisticas.notaQualidadeMedia)}</span>
                        </Badge>
                      </div>
                    </div>
                  </FluentProvider>
                </InfoWindow>
              )}
            </Map>
          </div>

          {/* Barra Lateral Direita */}
          <aside className={s.sidebar} ref={painelRef} aria-label={escolaSelecionada ? `Indicadores de ${escolaSelecionada.nome}` : 'Lista de escolas'}>
            {/* Avisa o leitor de tela quando a escola escolhida muda */}
            <span className={s.srOnly} role="status" aria-live="polite">
              {escolaSelecionada ? `Mostrando indicadores de ${escolaSelecionada.nome}` : ''}
            </span>
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
                      <span aria-hidden="true">
                        {escolaSelecionada.estatisticas.notaQualidadeMedia} {escolaSelecionada.estatisticas.notaQualidadeMedia !== SEM_AVALIACAO ? '/ 5.0' : ''}
                      </span>
                      <span className={s.srOnly}>{descreverNota(escolaSelecionada.estatisticas.notaQualidadeMedia)}</span>
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
                  aria-label="Buscar escola por nome ou endereço"
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                />

                <span className={s.srOnly} role="status" aria-live="polite">
                  {`${listaFiltrada.length} escola${listaFiltrada.length !== 1 ? 's' : ''} encontrada${listaFiltrada.length !== 1 ? 's' : ''}`}
                </span>
                <div className={s.escolaList}>
                  {listaFiltrada.map(e => (
                    <button key={e.id} type="button" className={s.escolaItem} onClick={() => handleMarkerClick(e)}>
                      <span className={s.escolaNome}>{e.nome}</span>
                      <span className={s.escolaMeta}>
                        <Badge appearance="tint" size="small" color={corTipoEscola(e.tipo)}>{e.tipo}</Badge>
                        <Badge appearance="filled" size="small" color={getNotaColor(e.estatisticas.notaQualidadeMedia)}>
                          <span aria-hidden="true">{rotuloNota(e.estatisticas.notaQualidadeMedia)}</span>
                          <span className={s.srOnly}>{descreverNota(e.estatisticas.notaQualidadeMedia)}</span>
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
          </aside>

        </div>
      </div>
    </APIProvider>
  );
}
