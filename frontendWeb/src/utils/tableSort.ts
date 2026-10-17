/** Comparadores para a prop `compare` das colunas do DataGrid (ordenação ao clicar no cabeçalho). */

/** Texto: ignora acento e caixa, e ordena "2" antes de "10". Vazios vão para o fim. */
export function cmpTexto(a?: string | null, b?: string | null): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return a.localeCompare(b, 'pt-BR', { sensitivity: 'base', numeric: true });
}

/** Número: valores ausentes contam como 0. */
export function cmpNumero(a?: number | null, b?: number | null): number {
  return (a ?? 0) - (b ?? 0);
}
