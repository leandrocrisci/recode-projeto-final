export interface Sessao {
  token: string;
  expiraEm: number;
  id: number;
  nome: string;
  email: string;
}

const STORAGE_KEY = 'recode.sessao';
let cache: Sessao | null = null;

export function lerSessao(): Sessao | null {
  let sessao = cache;
  if (!sessao) {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      sessao = stored ? JSON.parse(stored) as Sessao : null;
    } catch {
      sessao = null;
    }
  }
  if (!sessao || !sessao.token || typeof sessao.expiraEm !== 'number' || sessao.expiraEm <= Date.now()) {
    limparSessao();
    return null;
  }
  cache = sessao;
  return sessao;
}

export function salvarSessao(sessao: Sessao) {
  cache = sessao;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessao));
  } catch {
    cache = sessao;
  }
}

export function limparSessao() {
  cache = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    cache = null;
  }
}
