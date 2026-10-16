import { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Spinner, Text, Badge, makeStyles, tokens, Button } from '@fluentui/react-components'; // <-- INCLUÍDO O BUTTON AQUI
import { Building24Regular, VehicleBus24Regular, MyLocation24Regular, Star24Regular, Clock24Regular, People24Regular } from '@fluentui/react-icons';
import axios from 'axios';

const useStyles = makeStyles({
  container: { display: 'flex', width: '100%', height: 'calc(100vh - 64px)', fontFamily: 'sans-serif' },
  mapBox: { flex: 1, height: '100%' },
  sidebar: { width: '350px', borderLeft: `1px solid ${tokens.colorNeutralStroke1}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', backgroundColor: tokens.colorNeutralBackground1 },
  statRow: { display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', clear: 'both' },
  infoWindowWrap: { padding: '4px', maxWidth: '240px' },
  customPanel: { display: 'block', padding: '12px', border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, height: 'auto', minHeight: 'fit-content' },
  panelTitle: { fontSize: '13px', fontWeight: '600', color: tokens.colorNeutralForeground1, display: 'block', marginBottom: '6px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, paddingBottom: '4px' }
});

interface Estatisticas {
  totalAlunos: number;
  alunosRurais: number;
  alunosUrbanos: number;
  percentualRural: string;
  distanciaMedia: string;
  tempoMedio: number;
  usamOnibus: number;
  notaQualidadeMedia: string;
}

interface EscolaAgregada {
  id: number;
  nome: string;
  tipo: string;
  latitude: number;
  longitude: number;
  enderecoFormatado: string;
  estatisticas: Estatisticas;
}

export default function Dashboard() {
  const s = useStyles();
  const [loading, setLoading] = useState(true);
  const [escolasAgregadas, setEscolasAgregadas] = useState<EscolaAgregada[]>([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState<EscolaAgregada | null>(null);

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8090/api/escolas'),
      axios.get('http://localhost:8090/api/alunos'),
      axios.get('http://localhost:8090/api/enderecos-escolas'),
      axios.get('http://localhost:8090/api/avaliacoes-qualidade')
    ]).then(([resEscolas, resAlunos, resEnderecos, resAvaliacoes]) => {
      const escolas = resEscolas.data || [];
      const alunos = resAlunos.data || [];
      const enderecos = resEnderecos.data || [];
      const avaliacoes = resAvaliacoes.data || [];

      const dadosCompilados = escolas.map((esc: any) => {
        const end = enderecos.find((e: any) => e.escola?.id === esc.id || e.escolaId === esc.id);
        const alunosDaEscola = alunos.filter((a: any) => a.escola?.id === esc.id || a.escolaId === esc.id);
        
        const avaliacoesDaEscola = avaliacoes.filter((av: any) => av.escola?.id === esc.id);
        const somaNotas = avaliacoesDaEscola.reduce((acc: number, curr: any) => acc + curr.nota, 0);
        const notaQualidadeMedia = avaliacoesDaEscola.length > 0 
          ? (somaNotas / avaliacoesDaEscola.length).toFixed(1) 
          : 'Sem avaliação';

        const lat = end?.latitude ? parseFloat(end.latitude) : null;
        const lng = end?.longitude ? parseFloat(end.longitude) : null;

        const totalAlunos = alunosDaEscola.length;
        const alunosRurais = alunosDaEscola.filter((a: any) => String(a.area).toLowerCase() === 'rural').length;
        const alunosUrbanos = alunosDaEscola.filter((a: any) => String(a.area).toLowerCase() === 'urbana').length;
        
        const somaDistancia = alunosDaEscola.reduce((acc: number, curr: any) => acc + (curr.distanciaEscola || 0), 0);
        const distanciaMedia = totalAlunos > 0 ? (somaDistancia / totalAlunos).toFixed(2) : '0.00';

        const somaTempo = alunosDaEscola.reduce((acc: number, curr: any) => acc + (curr.tempoDeslocamentoMinutos || 0), 0);
        const tempoMedio = totalAlunos > 0 ? Math.round(somaTempo / totalAlunos) : 0;

        const usamOnibus = alunosDaEscola.filter((a: any) => a.tipoTransporte === 'transporte_escolar').length;

        return {
          ...esc,
          latitude: lat,
          longitude: lng,
          enderecoFormatado: end?.formattedAddress || `${end?.logradouro || ''}, ${end?.numero || ''} - ${end?.cidade || ''}/${end?.estado || ''}`,
          estatisticas: {
            totalAlunos,
            alunosRurais,
            alunosUrbanos,
            percentualRural: totalAlunos > 0 ? ((alunosRurais / totalAlunos) * 100).toFixed(1) : '0.0',
            distanciaMedia,
            tempoMedio,
            usamOnibus,
            notaQualidadeMedia
          }
        };
      }).filter((e: any) => e.latitude !== null && e.longitude !== null && !isNaN(e.latitude) && !isNaN(e.longitude)); 

      setEscolasAgregadas(dadosCompilados);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner label="Gerando mapa de desempenho nacional..." style={{ padding: '40px' }} />;
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
        
        {/* Caixa do Mapa */}
        <div className={s.mapBox}>
          <Map defaultCenter={{ lat: -14.235004, lng: -51.92528 }} defaultZoom={4}>
            {escolasAgregadas.map((escola) => (
              <Marker
                key={escola.id}
                position={{ lat: Number(escola.latitude), lng: Number(escola.longitude) }}
                onClick={() => setEscolaSelecionada(escola)}
                title={escola.nome}
              />
            ))}

            {escolaSelecionada && (
              <InfoWindow
                position={{ lat: escolaSelecionada.latitude, lng: escolaSelecionada.longitude }}
                onCloseClick={() => setEscolaSelecionada(null)}
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
              
              {/* Painel 1: Índice de Qualidade */}
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

              {/* Painel 2: Perfil Demográfico */}
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

              {/* Painel 3: Deslocamento Espacial */}
              <div className={s.customPanel}>
                <span className={s.panelTitle}>Indicadores de Deslocamento Espacial</span>
                <div className={s.statRow}>
                  <MyLocation24Regular style={{ flexShrink: 0 }} />
                  <Text size={200} style={{ whiteSpace: 'normal' }}>
                    Distância média residencial: <b>{escolaSelecionada.estatisticas.distanciaMedia} km</b>
                  </Text>
                </div>
                <div className={s.statRow}>
                  <Clock24Regular style={{ flexShrink: 0 }} />
                  <Text size={200} style={{ whiteSpace: 'normal' }}>
                    Tempo médio de trajeto: <b>{escolaSelecionada.estatisticas.tempoMedio} minutos</b>
                  </Text>
                </div>
              </div>

              {/* Painel 4: Transporte Coletivo */}
              <div className={s.customPanel}>
                <span className={s.panelTitle}>Logística de Transporte Coletivo</span>
                <div className={s.statRow}>
                  <VehicleBus24Regular style={{ flexShrink: 0 }} />
                  <Text size={200} style={{ whiteSpace: 'normal' }}>
                    Dependentes de ônibus escolar: <b>{escolaSelecionada.estatisticas.usamOnibus}</b>
                  </Text>
                </div>
              </div>
              
              <Button appearance="secondary" size="small" style={{ marginTop: '4px' }} onClick={() => setEscolaSelecionada(null)}>
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
