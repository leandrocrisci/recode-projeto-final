import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { TONE_FILL, useReady } from './shared';
import type { ChartTone } from './shared';

export interface HBarItem {
  /** Chave estável da linha. Use quando dois rótulos podem se repetir. */
  id?: string | number;
  label: string;
  /** Linha de apoio sob o rótulo (ex.: "3 de 5 escolas avaliadas"). */
  detail?: string;
  value: number;
  /** Texto exibido à direita (ex.: "84,5%"). Se omitido, usa o valor. */
  display?: string;
  tone?: ChartTone;
}

export interface HBarGroup {
  title?: string;
  items: HBarItem[];
}

interface HBarChartProps {
  groups: HBarGroup[];
  /** Valor que corresponde a 100% da largura da barra. Padrão: 100. */
  max?: number;
  /** Linha vertical de referência, como a meta do PNE. */
  marker?: { value: number; label: string };
  /** Resumo em texto para leitores de tela. */
  ariaLabel: string;
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: '18px' },
  group: { display: 'flex', flexDirection: 'column', gap: '8px' },
  groupTitle: { color: tokens.colorNeutralForeground2, fontWeight: tokens.fontWeightSemibold },
  row: {
    display: 'grid',
    gridTemplateColumns: 'minmax(92px, 34%) 1fr 56px',
    alignItems: 'center',
    gap: '10px',
  },
  labelCell: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  label: { color: tokens.colorNeutralForeground2, lineHeight: tokens.lineHeightBase200 },
  detail: { color: tokens.colorNeutralForeground3, lineHeight: tokens.lineHeightBase100 },
  track: {
    position: 'relative',
    height: '12px',
    borderRadius: '6px',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  fill: {
    height: '100%',
    borderRadius: '6px',
    transitionProperty: 'width',
    transitionDuration: '700ms',
    transitionTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  value: { textAlign: 'right', fontWeight: tokens.fontWeightSemibold, fontVariantNumeric: 'tabular-nums' },
  markerLine: {
    position: 'absolute',
    top: '-3px',
    bottom: '-3px',
    width: '2px',
    backgroundColor: tokens.colorNeutralForeground1,
    opacity: 0.7,
  },
  legend: { display: 'flex', alignItems: 'center', gap: '8px', color: tokens.colorNeutralForeground3 },
  legendSample: { width: '2px', height: '14px', backgroundColor: tokens.colorNeutralForeground1, opacity: 0.7 },
});

export function HBarChart({ groups, max = 100, marker, ariaLabel }: HBarChartProps) {
  const s = useStyles();
  const ready = useReady();
  const pct = (v: number) => Math.min(100, Math.max(0, (v / max) * 100));

  return (
    <div className={s.root} role="img" aria-label={ariaLabel}>
      {marker && (
        <div className={s.legend}>
          <span className={s.legendSample} />
          <Text size={200}>{marker.label}</Text>
        </div>
      )}
      {groups.map((g, gi) => (
        <div key={g.title ?? gi} className={s.group}>
          {g.title && <Text size={200} className={s.groupTitle}>{g.title}</Text>}
          {g.items.map(item => (
            <div key={item.id ?? item.label} className={s.row}>
              <div className={s.labelCell}>
                <Text size={200} className={s.label}>{item.label}</Text>
                {item.detail && <Text size={100} className={s.detail}>{item.detail}</Text>}
              </div>
              <div className={s.track}>
                <div
                  className={s.fill}
                  style={{
                    width: ready ? `${pct(item.value)}%` : '0%',
                    backgroundColor: TONE_FILL[item.tone ?? 'brand'],
                  }}
                />
                {marker && <span className={s.markerLine} style={{ left: `${pct(marker.value)}%` }} />}
              </div>
              <Text size={200} className={s.value}>{item.display ?? item.value}</Text>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
