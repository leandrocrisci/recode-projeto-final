import { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Button, Link, Spinner, Text, makeStyles, tokens } from '@fluentui/react-components';
import { Dismiss24Regular, Eye24Regular } from '@fluentui/react-icons';

// Até quantos metros do ponto da escola procurar uma imagem do Street View.
const RAIO_BUSCA_METROS = 100;

const useStyles = makeStyles({
  raiz: { flexShrink: 0 }, // nunca encolhe nem se sobrepõe aos painéis de indicadores
  titulo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  caixa: {
    position: 'relative', width: '100%', height: '200px', overflow: 'hidden',
    borderRadius: tokens.borderRadiusMedium, border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground3,
  },
  panorama: { position: 'absolute', inset: 0 },
  aviso: {
    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '8px', padding: '16px', textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  rodape: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '6px' },
});

// Direção (0–360°, 0 = norte) de um ponto até outro, para a câmera já olhar para a escola.
function calcularDirecao(de: { lat: number; lng: number }, para: { lat: number; lng: number }) {
  const rad = Math.PI / 180;
  const dLng = (para.lng - de.lng) * rad;
  const lat1 = de.lat * rad;
  const lat2 = para.lat * rad;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) / rad) + 360) % 360;
}

type Estado = 'carregando' | 'ok' | 'sem-cobertura' | 'erro';

interface PainelProps {
  latitude: number;
  longitude: number;
  nome: string;
  onFechar: () => void;
}

interface Props {
  latitude: number;
  longitude: number;
  nome: string;
  aberto: boolean;
  onAlternar: (aberto: boolean) => void;
}

/**
 * Street View interativo da escola. Precisa estar dentro do <APIProvider>.
 * Use com key={escola.id} para recriar o panorama ao trocar de escola.
 * Fechado, não carrega nada (e não gera cobrança de panorama); só mostra o botão para abrir.
 */
export default function StreetViewEscola({ aberto, onAlternar, ...local }: Props) {
  if (!aberto) {
    return (
      <Button
        appearance="outline"
        icon={<Eye24Regular />}
        onClick={() => onAlternar(true)}
        style={{ alignSelf: 'flex-start', flexShrink: 0 }}
      >
        Mostrar Street View
      </Button>
    );
  }
  return <PainelStreetView {...local} onFechar={() => onAlternar(false)} />;
}

function PainelStreetView({ latitude, longitude, nome, onFechar }: PainelProps) {
  const s = useStyles();
  const streetView = useMapsLibrary('streetView');
  const containerRef = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<Estado>('carregando');

  useEffect(() => {
    if (!streetView || !containerRef.current) return;
    let ativo = true;
    const escola = { lat: latitude, lng: longitude };

    const panorama = new streetView.StreetViewPanorama(containerRef.current, {
      visible: false,
      addressControl: false,
      enableCloseButton: false,
      fullscreenControl: true,
      zoomControl: true,
      panControl: true,
      linksControl: true,
      motionTracking: false,
      motionTrackingControl: false,
    });

    new streetView.StreetViewService()
      .getPanorama({
        location: escola,
        radius: RAIO_BUSCA_METROS,
        preference: streetView.StreetViewPreference.NEAREST,
        source: streetView.StreetViewSource.OUTDOOR, // só imagens de rua, sem interiores
      })
      .then(({ data }) => {
        if (!ativo) return;
        const local = data.location;
        if (!local?.pano) { setEstado('sem-cobertura'); return; }
        const ponto = local.latLng;
        const direcao = ponto ? calcularDirecao({ lat: ponto.lat(), lng: ponto.lng() }, escola) : 0;
        panorama.setPano(local.pano);
        panorama.setPov({ heading: direcao, pitch: 5 });
        panorama.setVisible(true);
        setEstado('ok');
      })
      .catch((e: { code?: string }) => {
        if (ativo) setEstado(e?.code === 'ZERO_RESULTS' ? 'sem-cobertura' : 'erro');
      });

    return () => {
      ativo = false;
      panorama.setVisible(false);
    };
  }, [streetView, latitude, longitude]);

  const linkMaps = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;

  return (
    <div className={s.raiz}>
      <div className={s.titulo}>
        <Text weight="semibold" size={300}>Vista da rua (Street View)</Text>
        <Button
          appearance="subtle"
          size="small"
          icon={<Dismiss24Regular />}
          onClick={onFechar}
          aria-label="Fechar o Street View"
        >
          Fechar
        </Button>
      </div>

      <div className={s.caixa}>
        <div
          ref={containerRef}
          className={s.panorama}
          role="region"
          aria-label={`Street View de ${nome}. Arraste ou use as setas do teclado para girar e andar.`}
        />
        {estado === 'carregando' && (
          <div className={s.aviso} role="status">
            <Spinner size="small" label="Carregando a vista da rua..." />
          </div>
        )}
        {estado === 'sem-cobertura' && (
          <div className={s.aviso} role="status">
            <Text>Não há imagens do Street View perto deste endereço.</Text>
          </div>
        )}
        {estado === 'erro' && (
          <div className={s.aviso} role="alert">
            <Text>Não foi possível carregar o Street View. Confira a chave do Google Maps.</Text>
          </div>
        )}
      </div>

      <div className={s.rodape}>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          Arraste para girar. Setas do teclado também funcionam.
        </Text>
        <Link href={linkMaps} target="_blank" rel="noopener noreferrer">
          Abrir no Google Maps
        </Link>
      </div>
    </div>
  );
}
