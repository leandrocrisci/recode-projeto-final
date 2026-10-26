import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

import type { LogEntry } from '../context/LogContext';
import { lerSessao } from './sessao';

// Referência injetada pelo App em DEV — evita dependência circular com React
type AddLogFn = (e: Omit<LogEntry, 'id' | 'ts'>) => void;
let _addLog: AddLogFn | null = null;

export function registerLogger(fn: AddLogFn) {
  _addLog = fn;
}

let _onUnauthorized: (() => void) | null = null;

export function registerUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn;
}

const SECRET_KEYS = new Set(['senha', 'password', 'token']);

function ocultarSegredos(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(ocultarSegredos);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key,
        SECRET_KEYS.has(key.toLowerCase()) ? '***' : ocultarSegredos(item),
      ]),
    );
  }
  return value;
}

function detalheSeguro(data: unknown): string | undefined {
  if (data === undefined || data === null || data === '') return undefined;
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    return JSON.stringify(ocultarSegredos(parsed), null, 2);
  } catch {
    return typeof data === 'string' ? data : String(data);
  }
}

// ── Instância Axios ──────────────────────────────────────────────────────────

const configuredApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8090/api').replace(/\/+$/, '');
const apiBaseUrl = /\/api$/i.test(configuredApiUrl) ? configuredApiUrl : `${configuredApiUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

const isWriteMethod = (method?: string) =>
  ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method?.toUpperCase() ?? '');

// ── Interceptor de requisição ────────────────────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  (config as InternalAxiosRequestConfig & { _t: number })._t = Date.now();

  // JWS no header; a API valida assinatura HS256 e exige ADMIN nas escritas.
  const sessao = lerSessao();
  if (sessao) {
    config.headers.Authorization = `Bearer ${sessao.token}`;
  }

  if (_addLog) {
    const method = config.method?.toUpperCase();
    const url = (config.baseURL ?? '') + (config.url ?? '');
    _addLog({
      level: 'info',
      source: 'network',
      method,
      url,
      message: `→ ${method} ${config.url}`,
      detail: detalheSeguro(config.data),
    });
    if (isWriteMethod(method)) {
      _addLog({
        source: 'audit',
        level: 'info',
        method,
        url,
        message: `Operação de escrita enviada: ${method} ${config.url}`,
      });
    }
  }

  return config;
});

// ── Interceptor de resposta ──────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => {
    if (_addLog) {
      const cfg = response.config as InternalAxiosRequestConfig & { _t?: number };
      const ms = cfg._t ? Date.now() - cfg._t : undefined;
      const url = (cfg.baseURL ?? '') + (cfg.url ?? '');

      _addLog({
        source: 'network',
        level: response.status < 300 ? 'success' : 'warn',
        method: cfg.method?.toUpperCase(),
        url,
        status: response.status,
        durationMs: ms,
        message: `← ${response.status} ${cfg.method?.toUpperCase()} ${cfg.url}`,
        detail: detalheSeguro(response.data),
      });
      if (isWriteMethod(cfg.method)) {
        _addLog({
          source: 'audit',
          level: 'success',
          method: cfg.method?.toUpperCase(),
          url,
          status: response.status,
          message: `Operação de escrita concluída: ${cfg.method?.toUpperCase()} ${cfg.url} (${response.status})`,
        });
      }
    }
    return response;
  },
  (error) => {
    if (_addLog) {
      const cfg = error.config as (InternalAxiosRequestConfig & { _t?: number }) | undefined;
      const ms = cfg?._t ? Date.now() - cfg._t : undefined;
      const url = cfg ? (cfg.baseURL ?? '') + (cfg.url ?? '') : '(unknown)';
      const status = error.response?.status;

      const detail = detalheSeguro(error.response?.data) ?? error.message;

      _addLog({
        source: 'network',
        level: 'error',
        method: cfg?.method?.toUpperCase(),
        url,
        status,
        durationMs: ms,
        message: status
          ? `✗ ${status} ${cfg?.method?.toUpperCase()} ${cfg?.url}`
          : `✗ NETWORK ERROR — ${cfg?.method?.toUpperCase()} ${cfg?.url ?? url}`,
        detail,
      });
      if (isWriteMethod(cfg?.method)) {
        _addLog({
          source: 'audit',
          level: 'error',
          method: cfg?.method?.toUpperCase(),
          url,
          status,
          message: `Falha em operação de escrita: ${cfg?.method?.toUpperCase()} ${cfg?.url ?? url}`,
          detail: status ? `Resposta HTTP ${status}` : error.message,
        });
      }
    }
    const failedUrl = (error.config as InternalAxiosRequestConfig | undefined)?.url ?? '';
    if (error.response?.status === 401 && !failedUrl.includes('/auth/login')) {
      _onUnauthorized?.();
    }
    return Promise.reject(error);
  },
);

// ── Endpoints ────────────────────────────────────────────────────────────────

export interface LoginResposta {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  id: number;
  nome: string;
  email: string;
  role: string;
}

export const loginApi = (email: string, senha: string) =>
  api.post<LoginResposta>('/auth/login', { email, senha });

// ── Escolas ──────────────────────────────────────────────
export const getEscolas = () => api.get('/escolas');
export const createEscola = (data: object) => api.post('/escolas', data);
export const updateEscola = (id: number, data: object) => api.put(`/escolas/${id}`, data);
export const deleteEscola = (id: number) => api.delete(`/escolas/${id}`);

// ── Cursos ───────────────────────────────────────────────
export const getCursos = () => api.get('/cursos');
export const createCurso = (escolaId: number, data: object) => api.post(`/cursos/escola/${escolaId}`, data);
export const updateCurso = (id: number, data: object) => api.put(`/cursos/${id}`, data);
export const deleteCurso = (id: number) => api.delete(`/cursos/${id}`);

// ── Alunos ───────────────────────────────────────────────
export const getAlunos = () => api.get('/alunos');
export const createAluno = (data: object) => api.post('/alunos', data);
export const updateAluno = (id: number, data: object) => api.put(`/alunos/${id}`, data);
export const deleteAluno = (id: number) => api.delete(`/alunos/${id}`);

// ── Produtos ─────────────────────────────────────────────
export const getProdutos = () => api.get('/produtos');
export const createProduto = (data: object) => api.post('/produtos', data);
export const updateProduto = (id: number, data: object) => api.put(`/produtos/${id}`, data);
export const deleteProduto = (id: number) => api.delete(`/produtos/${id}`);

// ==========================================
// CORREÇÃO DAS ROTAS DE AVALIAÇÕES DE CURSOS
// ==========================================

// Ajustado de '/api/avaliacoes-qualidade' para apenas 'avaliacoes-cursos'
export const getAvaliacoesCursos = () => {
  return api.get('/avaliacoes-cursos');
};

export const createAvaliacaoCurso = (cursoId: number, data: { nota: number; observacao: string | null; dataAvaliacao: string | null }) => {
  return api.post(`/avaliacoes-cursos/curso/${cursoId}`, data);
};

export const updateAvaliacaoCurso = (id: number, data: { nota: number; observacao: string | null; dataAvaliacao: string | null }) => {
  return api.put(`/avaliacoes-cursos/${id}`, data);
};

export const deleteAvaliacaoCurso = (id: number) => {
  return api.delete(`/avaliacoes-cursos/${id}`);
};


// ── Avaliações Qualidade ──────────────────────────────────
export const getAvaliacoesQualidade = () => api.get('/avaliacoes-qualidade');
export const createAvaliacaoQualidade = (escolaId: number, data: object) => api.post(`/avaliacoes-qualidade/escola/${escolaId}`, data);
export const updateAvaliacaoQualidade = (id: number, data: object) => api.put(`/avaliacoes-qualidade/${id}`, data);
export const deleteAvaliacaoQualidade = (id: number) => api.delete(`/avaliacoes-qualidade/${id}`);

// ── Endereços Escola ──────────────────────────────────────
export const getEnderecos = () => api.get('/enderecos-escolas');
export const createEndereco = (escolaId: number, data: object) => api.post(`/enderecos-escolas/escola/${escolaId}`, data);
export const updateEndereco = (id: number, data: object) => api.put(`/enderecos-escolas/${id}`, data);
export const deleteEndereco = (id: number) => api.delete(`/enderecos-escolas/${id}`);

// ── Endereços Aluno ───────────────────────────────────────
//export const getEnderecosAlunos = () => api.get('/enderecos-alunos');
//export const createEnderecoAluno = (alunoId: number, data: object) => api.post(`/enderecos-alunos/aluno/${alunoId}`, data);
//export const updateEnderecoAluno = (id: number, data: object) => api.put(`/enderecos-alunos/${id}`, data);
//export const deleteEnderecoAluno = (id: number) => api.delete(`/enderecos-alunos/${id}`);

// ── Professores ──────────────────────────────────────────
export const getProfessores = () => api.get('/professores');
export const getProfessoresByEscola = (escolaId: number) => api.get(`/professores/escola/${escolaId}`);
export const createProfessor = (escolaId: number, data: object) => api.post(`/professores/escola/${escolaId}`, data);
export const updateProfessor = (id: number, data: object) => api.put(`/professores/${id}`, data);
export const deleteProfessor = (id: number) => api.delete(`/professores/${id}`);

// ── Pedidos ───────────────────────────────────────────────
export const getPedidos = () => api.get('/pedidos');
export const getPedidosByEscola = (escolaId: number) => api.get(`/pedidos/escola/${escolaId}`);
export const getPedidosByProfessor = (professorId: number) => api.get(`/pedidos/professor/${professorId}`);
export const createPedido = (escolaId: number, produtoId: number, professorId: number, data: object) =>
  api.post(`/pedidos/escola/${escolaId}/produto/${produtoId}/professor/${professorId}`, data);
export const updatePedido = (id: number, data: object) => api.put(`/pedidos/${id}`, data);
export const deletePedido = (id: number) => api.delete(`/pedidos/${id}`);

// ── Progresso Alunos ─────────────────────────────────────
export const getProgressos = () => api.get('/progressos');
export const createProgresso = (alunoId: number, cursoId: number, data: object) =>
  api.post(`/progressos/aluno/${alunoId}/curso/${cursoId}`, data);
export const updateProgresso = (id: number, data: object) => api.put(`/progressos/${id}`, data);
export const deleteProgresso = (id: number) => api.delete(`/progressos/${id}`);

// ── ViaCEP ────────────────────────────────────────────────
export const buscarCep = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido');
  const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  if (data.erro) throw new Error('CEP não encontrado');
  return data;
};

export default api;
