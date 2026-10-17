import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { TONE_FILL, useReady } from './shared';
import type { ChartTone } from './shared';

interface RingChartProps {
  /** Percentual de 0 a 100 que o arco preenche. */
  value: number;
  /** Texto no centro do anel (ex.: "96,1%"). */
  display: string;
  label: string;
  sublabel?: string;
  tone?: ChartTone;
  size?: number;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center', maxWidth: '190px' },
  track: { fill: 'none', stroke: tokens.colorNeutralBackground3, strokeWidth: '10px' },
  arc: {
    fill: 'none',
    strokeWidth: '10px',
    strokeLinecap: 'round',
    transitionProperty: 'stroke-dashoffset',
    transitionDuration: '900ms',
    transitionTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  center: { fill: tokens.colorNeutralForeground1, fontSize: '19px', fontWeight: tokens.fontWeightBold },
  label: { fontWeight: tokens.fontWeightSemibold },
  sublabel: { color: tokens.colorNeutralForeground3 },
});

export function RingChart({ value, display, label, sublabel, tone = 'brand', size = 150 }: RingChartProps) {
  const s = useStyles();
  const ready = useReady();
  const pct = Math.min(100, Math.max(0, value));
  const offset = CIRCUMFERENCE * (1 - (ready ? pct : 0) / 100);

  return (
    <div className={s.root}>
      <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${label}: ${display}`}>
        <circle cx={50} cy={50} r={RADIUS} className={s.track} />
        <circle
          cx={50}
          cy={50}
          r={RADIUS}
          className={s.arc}
          transform="rotate(-90 50 50)"
          style={{ stroke: TONE_FILL[tone], strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
        />
        <text x={50} y={50} textAnchor="middle" dominantBaseline="central" className={s.center}>{display}</text>
      </svg>
      <Text size={300} className={s.label}>{label}</Text>
      {sublabel && <Text size={200} className={s.sublabel}>{sublabel}</Text>}
    </div>
  );
}
