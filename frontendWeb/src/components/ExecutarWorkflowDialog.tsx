import React, { useState } from 'react';
import { Button, Field, Input, Spinner, MessageBar, MessageBarBody, Text } from '@fluentui/react-components';
import { AppDialog } from './AppDialog';
import { useFormStyles } from './FormUtils';
import { executarWorkflow } from '../services/n8n';

interface Props {
  open: boolean;
  onClose: () => void;
  /** URL de produção do webhook, ex.: https://recode-n8n.onrender.com/webhook/gerar-escolas */
  url: string;
  /** Recebe a resposta do workflow (o resumo do último nó) */
  onSucesso?: (resultado: unknown) => void;
}

export function ExecutarWorkflowDialog({ open, onClose, url, onSucesso }: Props) {
  const fs = useFormStyles();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const fechar = () => {
    setSenha('');       // nunca deixa a senha na memória da tela
    setErro('');
    setLoading(false);
    onClose();
  };

  const enviar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const resultado = await executarWorkflow(url, usuario, senha);
      onSucesso?.(resultado);
      fechar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao executar o workflow.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppDialog open={open} title="Executar workflow no n8n" onClose={fechar}>
      <Text size={200} style={{ display: 'block', marginBottom: '12px' }}>
        Informe o usuário e a senha cadastrados no webhook do n8n. A execução pode levar alguns minutos.
      </Text>
      {erro && (
        <MessageBar intent="error" style={{ marginBottom: '12px' }}>
          <MessageBarBody>{erro}</MessageBarBody>
        </MessageBar>
      )}
      <form onSubmit={enviar}>
        <div className={fs.formGrid}>
          <Field label="Usuário *" required style={{ gridColumn: '1 / -1' }}>
            <Input required autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} disabled={loading} />
          </Field>
          <Field label="Senha *" required style={{ gridColumn: '1 / -1' }}>
            <Input required type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} disabled={loading} />
          </Field>
        </div>
        <div className={fs.actions}>
          <Button appearance="secondary" onClick={fechar} disabled={loading}>Cancelar</Button>
          <Button appearance="primary" type="submit" disabled={loading || !usuario || !senha}>
            {loading ? <Spinner size="tiny" label="Executando..." /> : 'Executar'}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
