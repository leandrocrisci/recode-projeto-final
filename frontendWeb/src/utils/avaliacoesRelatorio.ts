import type { AvaliacaoCurso, Curso } from '../types';
import type { EscolaAgregada } from './agregarEscolas';

// ── Faixas de nota (as mesmas do resto do sistema) ────────────────────────────

export type FaixaNota = 'success' | 'warning' | 'danger' | 'muted';

/** Escala de 1 a 5 (qualidade das escolas): >= 4 boa, >= 2,5 atenção, abaixo disso crítica. */
export const faixaNota5 = (n: number | null): FaixaNota =>
  n === null ? 'muted' : n >= 4 ? 'success' : n >= 2.5 ? 'warning' : 'danger';

/** Escala de 0 a 10 (cursos): >= 7 boa, >= 5 atenção, abaixo disso crítica. */
export const faixaNota10 = (n: number | null): FaixaNota =>
  n === null ? 'muted' : n >= 7 ? 'success' : n >= 5 ? 'warning' : 'danger';

// ── Regiões do Brasil ─────────────────────────────────────────────────────────

export const REGIOES = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'] as const;
export const NAO_INFORMADO = 'Não informado';
/** Abaixo disso, a média de uma região é pouco confiável e recebe um aviso. */
export const AMOSTRA_MINIMA = 3;

const ESTADOS: Array<[sigla: string, nome: string, regiao: string]> = [
  ['AC', 'Acre', 'Norte'], ['AP', 'Amapá', 'Norte'], ['AM', 'Amazonas', 'Norte'], ['PA', 'Pará', 'Norte'],
  ['RO', 'Rondônia', 'Norte'], ['RR', 'Roraima', 'Norte'], ['TO', 'Tocantins', 'Norte'],
  ['AL', 'Alagoas', 'Nordeste'], ['BA', 'Bahia', 'Nordeste'], ['CE', 'Ceará', 'Nordeste'], ['MA', 'Maranhão', 'Nordeste'],
  ['PB', 'Paraíba', 'Nordeste'], ['PE', 'Pernambuco', 'Nordeste'], ['PI', 'Piauí', 'Nordeste'],
  ['RN', 'Rio Grande do Norte', 'Nordeste'], ['SE', 'Sergipe', 'Nordeste'],
  ['DF', 'Distrito Federal', 'Centro-Oeste'], ['GO', 'Goiás', 'Centro-Oeste'], ['MT', 'Mato Grosso', 'Centro-Oeste'],
  ['MS', 'Mato Grosso do Sul', 'Centro-Oeste'],
  ['ES', 'Espírito Santo', 'Sudeste'], ['MG', 'Minas Gerais', 'Sudeste'], ['RJ', 'Rio de Janeiro', 'Sudeste'],
  ['SP', 'São Paulo', 'Sudeste'],
  ['PR', 'Paraná', 'Sul'], ['RS', 'Rio Grande do Sul', 'Sul'], ['SC', 'Santa Catarina', 'Sul'],
];

const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const REGIAO_POR_ESTADO = new Map<string, string>();
for (const [sigla, nome, regiao] of ESTADOS) {
  REGIAO_POR_ESTADO.set(normalizar(sigla), regiao);
  REGIAO_POR_ESTADO.set(normalizar(nome), regiao);
}

/** Aceita sigla ou nome, com ou sem acento. Tudo que não for reconhecido vira "Não informado". */
export function obterRegiao(estado?: string | null): string {
  if (!estado) return NAO_INFORMADO;
  return REGIAO_POR_ESTADO.get(normalizar(estado)) ?? NAO_INFORMADO;
}

// ── Média das escolas por região ──────────────────────────────────────────────

export interface LinhaRegiao {
  regiao: string;
  /** Média das notas médias das escolas avaliadas; null se nenhuma foi avaliada. */
  media: number | null;
  escolasAvaliadas: number;
  escolasTotal: number;
}

/** Sempre devolve as cinco regiões (com ou sem dados). "Não informado" só aparece se houver escola nele. */
export function mediaPorRegiao(escolas: EscolaAgregada[]): LinhaRegiao[] {
  const acc = new Map<string, { soma: number; avaliadas: number; total: number }>();
  for (const r of REGIOES) acc.set(r, { soma: 0, avaliadas: 0, total: 0 });

  for (const e of escolas) {
    const regiao = obterRegiao(e.estado);
    const a = acc.get(regiao) ?? { soma: 0, avaliadas: 0, total: 0 };
    a.total += 1;
    if (e.estatisticas.notaMedia !== null) {
      a.soma += e.estatisticas.notaMedia;
      a.avaliadas += 1;
    }
    acc.set(regiao, a);
  }

  return Array.from(acc.entries())
    .map(([regiao, a]): LinhaRegiao => ({
      regiao,
      media: a.avaliadas > 0 ? a.soma / a.avaliadas : null,
      escolasAvaliadas: a.avaliadas,
      escolasTotal: a.total,
    }))
    .filter(l => l.regiao !== NAO_INFORMADO || l.escolasTotal > 0)
    .sort((a, b) => (b.media ?? -1) - (a.media ?? -1) || a.regiao.localeCompare(b.regiao, 'pt-BR'));
}

export function detalheRegiao(l: LinhaRegiao): string {
  if (l.escolasTotal === 0) return 'Nenhuma escola no filtro atual';
  const escolas = l.escolasTotal === 1 ? 'escola' : 'escolas';
  if (l.escolasAvaliadas === 0) return `Sem avaliações · ${l.escolasTotal} ${escolas}`;
  const base = `${l.escolasAvaliadas} de ${l.escolasTotal} ${l.escolasTotal === 1 ? 'escola avaliada' : 'escolas avaliadas'}`;
  return l.escolasAvaliadas < AMOSTRA_MINIMA ? `${base} · amostra pequena` : base;
}

/** Média geral das escolas avaliadas (linha de referência do gráfico). */
export function mediaGeralEscolas(escolas: EscolaAgregada[]): number | null {
  const notas = escolas.map(e => e.estatisticas.notaMedia).filter((n): n is number => n !== null);
  return notas.length > 0 ? notas.reduce((acc, n) => acc + n, 0) / notas.length : null;
}

// ── Média das avaliações por curso ────────────────────────────────────────────

export type OrdemCursos = 'melhores' | 'piores';

export interface LinhaCurso {
  id: number;
  /** Texto principal do gráfico. Se vários cursos têm o mesmo nome, vira o nome da escola. */
  rotulo: string;
  detalhe: string;
  media: number;
  avaliacoes: number;
}

export interface ResultadoCursos {
  linhas: LinhaCurso[];
  /** Média de todas as avaliações consideradas; null se não houver nenhuma. */
  mediaGeral: number | null;
  totalAvaliacoes: number;
}

function notaValida(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

const textoAvaliacoes = (n: number) => `${n} ${n === 1 ? 'avaliação' : 'avaliações'}`;

/**
 * Agrupa as avaliações por curso, só para as escolas informadas (o filtro da tela).
 * Avaliações sem nota são ignoradas, em vez de contarem como zero.
 */
export function mediaPorCurso(
  avaliacoes: AvaliacaoCurso[],
  cursos: Curso[],
  escolas: EscolaAgregada[],
): ResultadoCursos {
  const idsEscolas = new Set(escolas.map(e => e.id));
  const cursoPorId = new Map<number, Curso>();
  for (const c of cursos) {
    if (c.escola && idsEscolas.has(c.escola.id)) cursoPorId.set(c.id, c);
  }

  const acc = new Map<number, { curso: Curso; soma: number; n: number }>();
  let somaGeral = 0;
  let totalAvaliacoes = 0;

  for (const av of avaliacoes) {
    const id = av.curso?.id;
    if (id === undefined) continue;
    const curso = cursoPorId.get(id);
    const nota = notaValida(av.nota);
    if (!curso || nota === null) continue;
    const a = acc.get(id) ?? { curso, soma: 0, n: 0 };
    a.soma += nota;
    a.n += 1;
    acc.set(id, a);
    somaGeral += nota;
    totalAvaliacoes += 1;
  }

  // Vários cursos com o mesmo nome (ex.: "Avaliação Geral de Desempenho" em cada escola) só se
  // distinguem pela escola: ela passa a ser o rótulo e o nome do curso vai para o detalhe.
  const contagemNomes = new Map<string, number>();
  for (const { curso } of acc.values()) contagemNomes.set(curso.nome, (contagemNomes.get(curso.nome) ?? 0) + 1);

  const linhas = Array.from(acc.values()).map(({ curso, soma, n }): LinhaCurso => {
    const escola = curso.escola?.nome;
    const nomeRepetido = (contagemNomes.get(curso.nome) ?? 0) > 1 && !!escola;
    return {
      id: curso.id,
      rotulo: nomeRepetido ? escola! : curso.nome,
      detalhe: [nomeRepetido ? curso.nome : escola, textoAvaliacoes(n)].filter(Boolean).join(' · '),
      media: soma / n,
      avaliacoes: n,
    };
  });

  return { linhas, mediaGeral: totalAvaliacoes > 0 ? somaGeral / totalAvaliacoes : null, totalAvaliacoes };
}

export function ordenarCursos(linhas: LinhaCurso[], ordem: OrdemCursos): LinhaCurso[] {
  const sinal = ordem === 'melhores' ? -1 : 1;
  return [...linhas].sort((a, b) => sinal * (a.media - b.media) || a.rotulo.localeCompare(b.rotulo, 'pt-BR'));
}
