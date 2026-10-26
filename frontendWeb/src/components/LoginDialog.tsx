import React, { useState } from 'react';
import { isAxiosError } from 'axios';
import {
  Button, Field, Input, MessageBar, MessageBarBody, Spinner, Text,
} from '@fluentui/react-components';
import { AppDialog } from './AppDialog';
import { useFormStyles } from './FormUtils';
import { useAuth } from '../context/AuthContext';

function mensagemDeLogin(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar à API. Aguarde alguns segundos e tente novamente.';
    }
    if (error.response.status === 401) return 'E-mail ou senha inválidos.';
    if (error.response.status === 400) return 'Informe o e-mail e a senha.';
    return `Erro ao entrar (HTTP ${error.response.status}). Tente novamente.`;
  }
  return 'Erro inesperado ao entrar.';
}

/** Modal de login. Credenciais vão para POST /api/auth/login e voltam como JWS. */
export default function LoginDialog() {
  const styles = useFormStyles();
  const { loginAberto, motivoLogin, login, fecharLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  const fechar = () => {
    setSenha('');
    setErro('');
    setEntrando(false);
    fecharLogin();
  };

  const enviar = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro('');
    setEntrando(true);
    try {
      await login(email.trim(), senha);
      setSenha('');
    } catch (error) {
      setErro(mensagemDeLogin(error));
    } finally {
      setEntrando(false);
    }
  };

  return (
    <AppDialog open={loginAberto} title="Entrar como professor" onClose={fechar}>
      {motivoLogin && (
        <MessageBar intent="warning" style={{ marginBottom: '12px' }}>
          <MessageBarBody>{motivoLogin}</MessageBarBody>
        </MessageBar>
      )}
      {erro && (
        <MessageBar intent="error" style={{ marginBottom: '12px' }}>
          <MessageBarBody>{erro}</MessageBarBody>
        </MessageBar>
      )}
      <form onSubmit={enviar}>
        <div className={styles.formGrid}>
          <Text style={{ gridColumn: '1 / -1' }}>
            Acesso disponível para professores com senha cadastrada.
          </Text>
          <Field label="E-mail *" required style={{ gridColumn: '1 / -1' }}>
            <Input
              required
              type="email"
              size="large"
              autoComplete="username"
              value={email}
              onChange={event => setEmail(event.target.value)}
            />
          </Field>
          <Field label="Senha *" required style={{ gridColumn: '1 / -1' }}>
            <Input
              required
              type="password"
              size="large"
              autoComplete="current-password"
              value={senha}
              onChange={event => setSenha(event.target.value)}
            />
          </Field>
        </div>
        <div className={styles.actions}>
          <Button type="button" appearance="secondary" onClick={fechar}>Cancelar</Button>
          <Button appearance="primary" type="submit" disabled={entrando || !email || !senha}>
            {entrando ? <Spinner size="tiny" /> : 'Entrar'}
          </Button>
        </div>
      </form>
    </AppDialog>
  );
}
