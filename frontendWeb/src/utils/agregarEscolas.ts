import type { Aluno, AvaliacaoQualidade, EnderecoEscola, Escola } from '../types';

export const SEM_AVALIACAO = 'Sem avaliação';

export interface EstatisticasEscola {
  totalAlunos: number;
  alunosRurais: number;
  alunosUrbanos: number;
  percentualRural: string;
  distanciaMedia: string;
  distanciaMaxima: string;
  raioMaximoMetros: number;
  tempoMedio: number;
  usamOnibus: number;
  /** Texto pronto para exibir: "4.5" ou "Sem avaliação". */
  notaQualidadeMedia: string;
  /** Valor numérico para cálculos e KPIs; null quando não há avaliações. */
  notaMedia: number | null;
}

export interface EscolaAgregada extends Escola {
  latitude: number | null;
  longitude: number | null;
  cidade?: string;
  estado?: string;
  enderecoFormatado: string;
  estatisticas: EstatisticasEscola;
}

export type EscolaGeo = EscolaAgregada & { latitude: number; longitude: number };

/** Escolas sem endereço geocodificado ficam fora do mapa. */
export const temCoordenadas = (e: EscolaAgregada): e is EscolaGeo =>
  e.latitude !== null && e.longitude !== null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function paraNumero(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function agruparPorEscola<T>(itens: T[], escolaIdDe: (i: T) => number | undefined): Map<number, T[]> {
  const mapa = new Map<number, T[]>();
  for (const item of itens) {
    const id = escolaIdDe(item);
    if (id === undefined || id === null) continue;
    const lista = mapa.get(id);
    if (lista) lista.push(item); else mapa.set(id, [item]);
  }
  return mapa;
}

function formatarEndereco(end?: EnderecoEscola): string {
  if (!end) return 'Endereço não cadastrado';
  if (end.formattedAddress) return end.formattedAddress;
  const rua = [end.logradouro, end.numero].filter(Boolean).join(', ');
  const cidade = [end.cidade, end.estado].filter(Boolean).join('/');
  return [rua, cidade].filter(Boolean).join(' - ') || 'Endereço não cadastrado';
}

function calcularEstatisticas(alunos: Aluno[], notas: number[]): EstatisticasEscola {
  const total = alunos.length;
  const area = (a: Aluno) => String(a.area).toLowerCase();
  const rurais = alunos.filter(a => area(a) === 'rural').length;
  const urbanos = alunos.filter(a => area(a) === 'urbana').length;

  const distancias = alunos.map(a => a.distanciaEscola || 0);
  const somaDistancia = distancias.reduce((acc, d) => acc + d, 0);
  const maxKm = distancias.length > 0 ? Math.max(...distancias) : 0;

  const somaTempo = alunos.reduce((acc, a) => acc + (a.tempoDeslocamentoMinutos || 0), 0);
  const notaMedia = notas.length > 0 ? notas.reduce((acc, n) => acc + n, 0) / notas.length : null;

  return {
    totalAlunos: total,
    alunosRurais: rurais,
    alunosUrbanos: urbanos,
    percentualRural: total > 0 ? ((rurais / total) * 100).toFixed(1) : '0.0',
    distanciaMedia: total > 0 ? (somaDistancia / total).toFixed(2) : '0.00',
    distanciaMaxima: maxKm.toFixed(2),
    raioMaximoMetros: maxKm * 1000,
    tempoMedio: total > 0 ? Math.round(somaTempo / total) : 0,
    usamOnibus: alunos.filter(a => a.tipoTransporte === 'transporte_escolar').length,
    notaQualidadeMedia: notaMedia === null ? SEM_AVALIACAO : notaMedia.toFixed(1),
    notaMedia,
  };
}

// ── Função principal ──────────────────────────────────────────────────────────

/**
 * Cruza escolas, alunos, endereços e avaliações de qualidade.
 * Uma passada para agrupar (Map) em vez de um find/filter por escola.
 */
export function agregarEscolas(
  escolas: Escola[],
  alunos: Aluno[],
  enderecos: EnderecoEscola[],
  avaliacoes: AvaliacaoQualidade[],
): EscolaAgregada[] {
  const alunosPorEscola = agruparPorEscola(alunos, a => a.escola?.id ?? a.escolaId);
  const notasPorEscola = agruparPorEscola(avaliacoes, av => av.escola?.id);

  const enderecoPorEscola = new Map<number, EnderecoEscola>();
  for (const end of enderecos) {
    const id = end.escola?.id ?? end.escolaId;
    if (id !== undefined && !enderecoPorEscola.has(id)) enderecoPorEscola.set(id, end);
  }

  return escolas.map(esc => {
    const end = enderecoPorEscola.get(esc.id);
    const notas = (notasPorEscola.get(esc.id) ?? []).map(av => av.nota);
    return {
      ...esc,
      latitude: paraNumero(end?.latitude),
      longitude: paraNumero(end?.longitude),
      cidade: end?.cidade ?? 'Não informado',
      estado: end?.estado ?? 'Não informado',
      enderecoFormatado: formatarEndereco(end),
      estatisticas: calcularEstatisticas(alunosPorEscola.get(esc.id) ?? [], notas),
    };
  });
}

// ── KPIs globais (faixa de indicadores do Dashboard) ──────────────────────────

export interface KpisGlobais {
  totalEscolas: number;
  escolasNoMapa: number;
  totalAlunos: number;
  alunosRurais: number;
  percentualRural: string;
  /** Média das notas médias das escolas avaliadas; null se nenhuma foi avaliada. */
  notaMediaGeral: number | null;
  escolasAvaliadas: number;
}

export function calcularKpis(escolas: EscolaAgregada[]): KpisGlobais {
  const totalAlunos = escolas.reduce((acc, e) => acc + e.estatisticas.totalAlunos, 0);
  const alunosRurais = escolas.reduce((acc, e) => acc + e.estatisticas.alunosRurais, 0);
  const notas = escolas
    .map(e => e.estatisticas.notaMedia)
    .filter((n): n is number => n !== null);

  return {
    totalEscolas: escolas.length,
    escolasNoMapa: escolas.filter(temCoordenadas).length,
    totalAlunos,
    alunosRurais,
    percentualRural: totalAlunos > 0 ? ((alunosRurais / totalAlunos) * 100).toFixed(1) : '0.0',
    notaMediaGeral: notas.length > 0 ? notas.reduce((acc, n) => acc + n, 0) / notas.length : null,
    escolasAvaliadas: notas.length,
  };
}
