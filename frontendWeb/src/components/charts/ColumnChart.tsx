import { makeStyles, tokens } from '@fluentui/react-components';
import { TONE_FILL, useReady } from './shared';
import type { ChartTone } from './shared';

export interface ColumnItem {
  label: string;
  value: number;
  /** Texto acima da coluna (ex.: "10,6%"). Se omitido, usa o valor. */
  display?: string;
  tone?: ChartTone;
}

interface ColumnChartProps {
  items: ColumnItem[];
  /** Valor que corresponde à altura total da área do gráfico. Padrão: maior valor + 8%. */
  max?: number;
  height?: number;
  /** Resumo em texto para leitores de tela. */
  ariaLabel: string;
}

const W = 560;
const PAD_X = 16;
const PAD_TOP = 30;
const PAD_BOTTOM = 36;

const useStyles = makeStyles({
  svg: { display: 'block', width: '100%', height: 'auto', overflow: 'visible' },
  axis: { stroke: tokens.colorNeutralStroke2, strokeWidth: '1px' },
  bar: {
    transformBox: 'fill-box',
    transformOrigin: 'bottom',
    transitionProperty: 'transform',
    transitionDuration: '700ms',
    transitionTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  value: { fill: tokens.colorNeutralForeground1, fontSize: '14px', fontWeight: tokens.fontWeightSemibold },
  label: { fill: tokens.colorNeutralForeground3, fontSize: '12px' },
});

export function ColumnChart({ items, max, height = 260, ariaLabel }: ColumnChartProps) {
  const s = useStyles();
  const ready = useReady();

  const scaleMax = max ?? Math.max(...items.map(i => i.value)) * 1.08;
  const plotH = height - PAD_TOP - PAD_BOTTOM;
  const baseline = height - PAD_BOTTOM;
  const slot = (W - PAD_X * 2) / items.length;
  const barW = Math.min(72, slot * 0.58);

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className={s.svg} role="img" aria-label={ariaLabel}>
      <line x1={PAD_X} x2={W - PAD_X} y1={baseline} y2={baseline} className={s.axis} />
      {items.map((item, i) => {
        const h = Math.max(2, (item.value / scaleMax) * plotH);
        const x = PAD_X + slot * i + (slot - barW) / 2;
        const y = baseline - h;
        const cx = x + barW / 2;
        return (
          <g key={item.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={6}
              className={s.bar}
              style={{ fill: TONE_FILL[item.tone ?? 'brand'], transform: ready ? 'scaleY(1)' : 'scaleY(0)' }}
            />
            <text x={cx} y={y - 8} textAnchor="middle" className={s.value}>{item.display ?? item.value}</text>
            <text x={cx} y={baseline + 20} textAnchor="middle" className={s.label}>{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
