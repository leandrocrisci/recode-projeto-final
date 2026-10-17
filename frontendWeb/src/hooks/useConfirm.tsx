import { useCallback, useRef, useState } from 'react';
import {
  makeStyles, tokens, Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  danger: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': { backgroundColor: tokens.colorPaletteRedForeground1, color: tokens.colorNeutralForegroundOnBrand },
    ':hover:active': { backgroundColor: tokens.colorPaletteRedForeground1, color: tokens.colorNeutralForegroundOnBrand },
  },
});

interface Opcoes {
  titulo?: string;
  /** Texto do botão de confirmação. Padrão: "Excluir". */
  confirmarTexto?: string;
}

/**
 * Substitui o window.confirm() por um diálogo do Fluent.
 *
 *   const { confirmar, dialog } = useConfirm();
 *   if (!(await confirmar('Deseja excluir este item?'))) return;
 *   ...
 *   return (<div>... {dialog}</div>);
 */
export function useConfirm() {
  const s = useStyles();
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [opcoes, setOpcoes] = useState<Opcoes>({});
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const confirmar = useCallback((msg: string, op: Opcoes = {}) => {
    return new Promise<boolean>(resolve => {
      resolver.current = resolve;
      setMensagem(msg);
      setOpcoes(op);
      setAberto(true);
    });
  }, []);

  const responder = (ok: boolean) => {
    resolver.current?.(ok);
    resolver.current = null;
    setAberto(false); // a mensagem fica no estado, então não pisca vazia durante a animação
  };

  const dialog = (
    <Dialog open={aberto} onOpenChange={(_, d) => { if (!d.open) responder(false); }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>{opcoes.titulo ?? 'Confirmar exclusão'}</DialogTitle>
          <DialogContent>{mensagem}</DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => responder(false)}>Cancelar</Button>
            <Button appearance="primary" className={s.danger} onClick={() => responder(true)}>
              {opcoes.confirmarTexto ?? 'Excluir'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );

  return { confirmar, dialog };
}
