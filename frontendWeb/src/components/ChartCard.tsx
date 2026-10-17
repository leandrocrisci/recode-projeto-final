import type { ReactNode } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: 0,
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow2,
  },
  header: { display: 'flex', flexDirection: 'column', gap: '2px' },
  title: { fontWeight: tokens.fontWeightSemibold },
  muted: { color: tokens.colorNeutralForeground3 },
});

interface ChartCardProps {
  title: string;
  subtitle?: string;
  /** Ex.: "UNESCO/UIS, 2024". Aparece como rodapé discreto. */
  source?: string;
  /** Observação logo abaixo do gráfico. */
  note?: string;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, source, note, children }: ChartCardProps) {
  const s = useStyles();
  return (
    <section className={s.card}>
      <div className={s.header}>
        <Text size={400} className={s.title}>{title}</Text>
        {subtitle && <Text size={200} className={s.muted}>{subtitle}</Text>}
      </div>
      {children}
      {note && <Text size={200} className={s.muted}>{note}</Text>}
      {source && <Text size={100} className={s.muted}>Fonte: {source}</Text>}
    </section>
  );
}
