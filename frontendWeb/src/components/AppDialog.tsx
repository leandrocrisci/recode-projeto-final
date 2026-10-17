import type { ReactNode } from 'react';
import {
  Dialog, DialogSurface, DialogTitle, DialogBody,
  DialogTrigger, Button, makeStyles,
} from '@fluentui/react-components';
import { Dismiss24Regular } from '@fluentui/react-icons';

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

const useStyles = makeStyles({
  surface: {
    maxWidth: '600px',
    width: '90vw',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '8px 0 16px',
    overflowY: 'auto',
    maxHeight: '70vh',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export function AppDialog({ open, title, onClose, children, maxWidth }: Props) {
  const s = useStyles();
  return (
    <Dialog open={open} onOpenChange={(_, d) => { if (!d.open) onClose(); }}>
      <DialogSurface className={s.surface} style={maxWidth ? { maxWidth } : undefined}>
        <DialogTitle
          action={
            <DialogTrigger action="close">
              <Button appearance="subtle" icon={<Dismiss24Regular />} onClick={onClose} />
            </DialogTrigger>
          }
        >
          {title}
        </DialogTitle>
        <DialogBody className={s.body}>
          {children}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
