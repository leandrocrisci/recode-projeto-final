import type { ReactNode } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

export type KpiTone = 'brand' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE_COLOR: Record<KpiTone, string> = {
  brand: tokens.colorBrandForeground1,
  success: tokens.colorPaletteGreenForeground1,
  warning: tokens.colorPaletteYellowForeground1,
  danger: tokens.colorPaletteRedForeground1,
  neutral: tokens.colorNeutralForeground3,
};

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
    padding: '12px 16px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  valueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  muted: {
    color: tokens.colorNeutralForeground3,
  },
});

interface KpiCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  /** Linha de apoio abaixo do número (ex.: "3 de 27 escolas avaliadas"). */
  hint?: string;
  tone?: KpiTone;
}

export function KpiCard({ label, value, icon, hint, tone = 'brand' }: KpiCardProps) {
  const s = useStyles();
  const color = TONE_COLOR[tone];
  return (
    <div className={s.card}>
      <Text size={200} className={s.muted}>{label}</Text>
      <div className={s.valueRow} style={{ color }}>
        {icon}
        <Text size={600} weight="bold" style={{ color }}>{value}</Text>
      </div>
      {hint && <Text size={200} className={s.muted}>{hint}</Text>}
    </div>
  );
}
