import { makeStyles, tokens } from '@fluentui/react-components';
import { Star24Filled, Star24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: { display: 'inline-flex', alignItems: 'center', gap: '2px' },
  on: { color: tokens.colorPaletteYellowBackground3 },
  off: { color: tokens.colorNeutralStroke1 },
});

interface StarsProps {
  value: number;
  max?: number;
  /** Tamanho de cada estrela em px. */
  size?: number;
}

/** Estrelas cheias e vazias de verdade (o texto ★☆ dentro de um Badge parecia tudo preenchido). */
export function Stars({ value, max = 5, size = 16 }: StarsProps) {
  const s = useStyles();
  const cheias = Math.round(value);
  return (
    <span className={s.root} role="img" aria-label={`${value} de ${max}`}>
      {Array.from({ length: max }, (_, i) =>
        i < cheias
          ? <Star24Filled key={i} className={s.on} style={{ fontSize: size }} />
          : <Star24Regular key={i} className={s.off} style={{ fontSize: size }} />,
      )}
    </span>
  );
}
