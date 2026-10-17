import { useEffect, useState } from 'react';
import { tokens } from '@fluentui/react-components';

/** Tons dos gráficos. Só tokens do Fluent, então acompanham o tema claro e escuro. */
export type ChartTone = 'brand' | 'brandSoft' | 'muted' | 'success' | 'warning' | 'danger';

export const TONE_FILL: Record<ChartTone, string> = {
  brand: tokens.colorBrandBackground,
  brandSoft: tokens.colorBrandStroke1,
  muted: tokens.colorNeutralStroke1,
  success: tokens.colorPaletteGreenBackground3,
  warning: tokens.colorPaletteYellowBackground3,
  danger: tokens.colorPaletteRedBackground3,
};

/**
 * Vira true um frame depois da montagem. Os gráficos usam isso para animar de 0
 * até o valor final (a transição CSS é desligada em prefers-reduced-motion).
 */
export function useReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready;
}
