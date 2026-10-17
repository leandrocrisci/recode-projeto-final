import type { BadgeProps } from '@fluentui/react-components';

/**
 * Cor do badge de tipo de escola. Fica fora da família verde, amarelo e vermelho,
 * que nas avaliações significa bom, atenção e crítico.
 */
export function corTipoEscola(tipo?: string): BadgeProps['color'] {
  switch (tipo?.trim().toLowerCase()) {
    case 'estadual':
      return 'brand';
    case 'pública':
    case 'publica':
    case 'municipal':
      return 'informative';
    case 'federal':
    case 'técnica':
    case 'tecnica':
      return 'important';
    default:
      return 'subtle'; // privada e demais
  }
}
