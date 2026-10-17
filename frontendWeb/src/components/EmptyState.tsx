import type { ReactNode } from 'react';
import { makeStyles, tokens, Text } from '@fluentui/react-components';
import { DocumentBulletList24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '40px 16px',
    textAlign: 'center',
  },
  icon: { fontSize: '32px', color: tokens.colorNeutralStroke1 },
  text: { color: tokens.colorNeutralForeground3 },
});

interface EmptyStateProps {
  message: string;
  /** Ícone opcional; o padrão é uma lista. */
  icon?: ReactNode;
}

/** Mensagem padrão para tabelas sem registros. */
export function EmptyState({ message, icon }: EmptyStateProps) {
  const s = useStyles();
  return (
    <div className={s.root} role="status">
      {icon ?? <DocumentBulletList24Regular className={s.icon} />}
      <Text size={300} className={s.text}>{message}</Text>
    </div>
  );
}
