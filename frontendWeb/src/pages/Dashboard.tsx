import { useMemo, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow, Circle } from '@vis.gl/react-google-maps';
import { Spinner, Text, Badge, makeStyles, tokens, Button, MessageBar, MessageBarBody } from '@fluentui/react-components';
import { Building24Regular, VehicleBus24Regular, MyLocation24Regular, Star24Regular, Clock24Regular, People24Regular } from '@fluentui/react-icons';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import { temCoordenadas } from '../utils/agregarEscolas';
import type { EscolaGeo } from '../utils/agregarEscolas';

const useStyles = makeStyles({
  container: { display: 'flex', width: '100%', height: 'calc(100vh - 64px)', fontFamily: 'sans-serif' },
  mapBox: { flex: 1, height: '100%' },
  sidebar: { width: '350px', borderLeft: `1px solid ${tokens.colorNeutralStroke1}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', clear: 'both' },
  infoWindowWrap: { padding: '4px', maxWidth: '240px' },
  customPanel: { display: 'block', padding: '12px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, height: 'auto', minHeight: 'fit-content' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: tokens.colorNeutralForeground1, display: 'block', marginBottom: '6px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, paddingBottom: '4px' }
});

const BRASILIA_CENTER = { lat: -14.235004, lng: -51.92528 };

export default function Dashboard() {
  const s = useStyles();
  const { escolas, loading, error } = useEscolasAgregadas();
  const escolasNoMapa = useMemo(() => escolas.filter(temCoordenadas), [escolas]);
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

  const getNotaColor = (nota: string) => {
    if (nota === 'Sem avaliação') return 'informative';
    const val = parseFloat(nota);
    if (val >= 4.0) return 'success';
    if (val >= 2.5) return 'warning';
    return 'danger';
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
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
                    <Badge appearance="outline">{escolaSelecionada.tipo}</Badge>
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
              
              <Button appearance="secondary" size="small" style={{ marginTop: '4px' }} onClick={handleClosePanel}>
                Fechar Painel
              </Button>
            </>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '40px', color: tokens.colorNeutralForeground3, padding: '12px' }}>
              <Building24Regular style={{ fontSize: '40px', marginBottom: '12px', color: tokens.colorNeutralStroke1 }} />
              <Text size={200} style={{ display: 'block', lineHeight: '20px' }}>
                Clique em um marcador no mapa para auditar os indicadores socioespaciais, de mobilidade e a nota de qualidade da instituição.
              </Text>
            </div>
          )}
        </div>

      </div>
    </APIProvider>
  );
}
