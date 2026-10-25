import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { UserRole } from '../types';
import { loginApi, registerUnauthorizedHandler } from '../services/api';
import { limparSessao, lerSessao, salvarSessao } from '../services/sessao';
import type { Sessao } from '../services/sessao';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  role: UserRole;
  isAdmin: boolean;
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  loginAberto: boolean;
  motivoLogin: string;
  abrirLogin: (motivo?: string) => void;
  fecharLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: 'user',
  isAdmin: false,
  usuario: null,
  login: async () => {},
  logout: () => {},
  loginAberto: false,
  motivoLogin: '',
  abrirLogin: () => {},
  fecharLogin: () => {},
});

const MAX_TIMEOUT_MS = 2_000_000_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(() => lerSessao());
  const [loginAberto, setLoginAberto] = useState(false);
  const [motivoLogin, setMotivoLogin] = useState('');
  const temSessaoRef = useRef(false);

  useEffect(() => {
    temSessaoRef.current = sessao !== null;
  }, [sessao]);

  const abrirLogin = useCallback((motivo = '') => {
    setMotivoLogin(motivo);
    setLoginAberto(true);
  }, []);

  const fecharLogin = useCallback(() => {
    setLoginAberto(false);
    setMotivoLogin('');
  }, []);

  const logout = useCallback(() => {
    limparSessao();
    setSessao(null);
  }, []);

  const encerrar = useCallback((motivo?: string) => {
    limparSessao();
    setSessao(null);
    if (motivo) abrirLogin(motivo);
  }, [abrirLogin]);

  const login = useCallback(async (email: string, senha: string) => {
    const { data } = await loginApi(email, senha);
    const novaSessao: Sessao = {
      token: data.token,
      expiraEm: Date.now() + data.expiraEmSegundos * 1000,
      id: data.id,
      nome: data.nome,
      email: data.email,
    };
    salvarSessao(novaSessao);
    setSessao(novaSessao);
    setLoginAberto(false);
    setMotivoLogin('');
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      encerrar(temSessaoRef.current
        ? 'Sua sessão expirou. Entre novamente.'
        : 'Esta ação exige login de professor.');
    });
    return () => registerUnauthorizedHandler(() => {});
  }, [encerrar]);

  useEffect(() => {
    if (!sessao) return;
    const timeout = Math.min(Math.max(sessao.expiraEm - Date.now(), 0), MAX_TIMEOUT_MS);
    const timer = window.setTimeout(
      () => encerrar('Sua sessão expirou. Entre novamente.'),
      timeout,
    );
    return () => window.clearTimeout(timer);
  }, [sessao, encerrar]);

  const value = useMemo<AuthContextType>(() => ({
    role: sessao ? 'admin' : 'user',
    isAdmin: sessao !== null,
    usuario: sessao ? { id: sessao.id, nome: sessao.nome, email: sessao.email } : null,
    login,
    logout,
    loginAberto,
    motivoLogin,
    abrirLogin,
    fecharLogin,
  }), [sessao, login, logout, loginAberto, motivoLogin, abrirLogin, fecharLogin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
