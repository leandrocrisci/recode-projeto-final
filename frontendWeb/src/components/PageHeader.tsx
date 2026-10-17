import type { ReactNode } from 'react';
import { makeStyles, tokens, Title2, Text } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
  },
  // Coluna vertical: título em cima, subtítulo embaixo (Title2 e Text são <span>
  // por padrão e ficariam na mesma linha dentro de um <div> simples).
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  },
});

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Botões da direita. Aceita `false`, então `isAdmin && <Button/>` funciona direto. */
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const s = useStyles();
  return (
    <div className={s.root}>
      <div className={s.titleBlock}>
        <Title2 as="h1">{title}</Title2>
        {subtitle && <Text size={200} className={s.subtitle}>{subtitle}</Text>}
      </div>
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  );
}
