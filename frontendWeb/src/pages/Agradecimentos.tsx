import { Fragment } from 'react';
import type { ReactNode } from 'react';
import {
  makeStyles, tokens, Text, Button, Link, Title1, Title2, Title3, Body1,
} from '@fluentui/react-components';
import {
  Heart24Regular, ArrowRight24Regular, Building24Regular, StarEmphasis24Regular, Location24Regular,
  Box24Regular, Shield24Regular, Globe24Regular,
} from '@fluentui/react-icons';
import {
  AUTOR, RECODE_URL, CURSO, AGRADECIMENTO, resumoSistema, recursos, fluxo, integracoes, tecnologias, jornada, sinteseProjeto,
} from '../data/agradecimentos';
import type { Recurso } from '../data/agradecimentos';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    width: '100%',
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '24px',
    boxSizing: 'border-box',
  },

  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    padding: '32px',
    borderRadius: tokens.borderRadiusXLarge,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}, ${tokens.colorBrandBackgroundHover})`,
    color: tokens.colorNeutralForegroundOnBrand,
    '::after': {
      content: '""',
      position: 'absolute',
      right: '-90px',
      top: '-90px',
      width: '280px',
      height: '280px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.08)',
      pointerEvents: 'none',
    },
  },
  heroMark: {
    width: '88px',
    height: '88px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadiusXLarge,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#fff',
    fontSize: '44px',
    boxShadow: tokens.shadow8,
  },
  heroBody: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '260px', zIndex: 1 },
  heroKicker: { color: 'rgba(255,255,255,0.85)' },
  heroLead: { color: 'rgba(255,255,255,0.92)', maxWidth: '62ch' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  chip: {
    padding: '2px 10px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    fontSize: tokens.fontSizeBase200,
  },
  heroActions: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
  heroBtn: {
    color: '#fff',
    ':hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.16)' },
    ':hover:active': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.24)' },
  },

  // Seções
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sectionHead: { display: 'flex', flexDirection: 'column', gap: '4px' },
  muted: { color: tokens.colorNeutralForeground3 },
  strong: { fontWeight: tokens.fontWeightSemibold },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '12px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '16px' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
    padding: '16px 18px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow2,
  },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconBubble: {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },

  // Fluxo da arquitetura
  flow: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '8px',
    '@media (max-width: 760px)': { flexDirection: 'column' },
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    minWidth: 0,
    padding: '14px 16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderTop: `3px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusLarge,
  },
  arrow: {
    alignSelf: 'center',
    flexShrink: 0,
    color: tokens.colorNeutralForeground3,
    '@media (max-width: 760px)': { transform: 'rotate(90deg)' },
  },
  integrations: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' },
  tag: {
    padding: '2px 10px',
    borderRadius: '999px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    fontSize: tokens.fontSizeBase200,
  },

  // Tecnologias
  techList: { display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0, listStyle: 'none' },
  techItem: { display: 'flex', flexDirection: 'column', gap: '1px' },

  // Jornada
  topics: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  topic: {
    padding: '1px 8px',
    borderRadius: '999px',
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
  },
  bullets: { display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, paddingLeft: '18px' },
  callout: {
    padding: '14px 18px',
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusMedium,
  },

  // Carta
  letter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '28px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderTop: `4px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow8,
  },
  letterText: { lineHeight: tokens.lineHeightBase400, maxWidth: '72ch' },
  signature: { display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' },
  footer: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

const ICONES_RECURSO: Record<Recurso['id'], ReactNode> = {
  cadastros: <Building24Regular />,
  avaliacoes: <StarEmphasis24Regular />,
  mapa: <Location24Regular />,
  suprimentos: <Box24Regular />,
  auditoria: <Shield24Regular />,
  experiencia: <Globe24Regular />,
};

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  const s = useStyles();
  return (
    <div className={s.sectionHead}>
      <Title2 as="h2">{title}</Title2>
      {subtitle && <Text size={300} className={s.muted}>{subtitle}</Text>}
    </div>
  );
}

export default function Agradecimentos() {
  const s = useStyles();

  const irParaCarta = () => {
    const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('agradecimento')?.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className={s.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={s.heroMark} aria-hidden="true"><Heart24Regular style={{ fontSize: '44px' }} /></div>
        <div className={s.heroBody}>
          <Text size={200} className={s.heroKicker}>Projeto final · Recode · Desenvolvimento de Sistemas III</Text>
          <Title1 as="h1" style={{ color: '#fff' }}>Agradecimentos</Title1>
          <Body1 className={s.heroLead}>
            O resumo do que foi construído, das tecnologias que tornaram isso possível e de quem caminhou junto
            nessa jornada.
          </Body1>
          <div className={s.chips}>
            <span className={s.chip}>Projeto Final · Turma 2</span>
            <span className={s.chip}>Início: {CURSO.inicio}</span>
            <span className={s.chip}>{CURSO.formato}</span>
            <span className={s.chip}>React + Java</span>
          </div>
          <div className={s.heroActions}>
            <Button appearance="outline" className={s.heroBtn} icon={<Heart24Regular />} onClick={irParaCarta}>
              Ir para o agradecimento
            </Button>
            <Button
              as="a"
              href={RECODE_URL}
              target="_blank"
              rel="noreferrer"
              appearance="outline"
              className={s.heroBtn}
              icon={<ArrowRight24Regular />}
              iconPosition="after"
            >
              Conhecer a Recode
            </Button>
          </div>
        </div>
      </header>

      {/* ── O sistema ────────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHead title="O sistema em resumo" />
        <Body1>
          O <strong>{resumoSistema.nome}</strong> (no menu, <em>Recode — Avaliação Escolas</em>): {resumoSistema.descricao}
        </Body1>
        <div className={s.grid3}>
          {recursos.map(r => (
            <article key={r.id} className={s.card}>
              <div className={s.cardTitleRow}>
                <div className={s.iconBubble} aria-hidden="true">{ICONES_RECURSO[r.id]}</div>
                <Text size={400} className={s.strong}>{r.titulo}</Text>
              </div>
              <Text size={300} className={s.muted}>{r.texto}</Text>
            </article>
          ))}
        </div>
      </section>

      {/* ── Arquitetura ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHead title="Como as peças se conectam" subtitle="Do clique no navegador até o registro no banco de dados." />
        <div className={s.flow} role="list">
          {fluxo.map((n, i) => (
            <Fragment key={n.titulo}>
              <div className={s.node} role="listitem">
                <Text size={400} className={s.strong}>{n.titulo}</Text>
                <Text size={200} className={s.muted}>{n.detalhe}</Text>
              </div>
              {i < fluxo.length - 1 && <ArrowRight24Regular className={s.arrow} aria-hidden="true" />}
            </Fragment>
          ))}
        </div>
        <div className={s.integrations}>
          <Text size={200} className={s.muted}>Integrações:</Text>
          {integracoes.map(i => <span key={i} className={s.tag}>{i}</span>)}
        </div>
      </section>

      {/* ── Tecnologias ──────────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHead title="Tecnologias utilizadas" subtitle="O que cada peça faz neste projeto." />
        <div className={s.grid2}>
          {tecnologias.map(g => (
            <article key={g.titulo} className={s.card}>
              <Text size={400} className={s.strong}>{g.titulo}</Text>
              <ul className={s.techList}>
                {g.itens.map(t => (
                  <li key={t.nome} className={s.techItem}>
                    <Text size={300} className={s.strong}>{t.nome}</Text>
                    <Text size={200} className={s.muted}>{t.papel}</Text>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* ── Jornada no curso ─────────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHead
          title="O que o curso me deu, e onde aparece no projeto"
          subtitle={`Três módulos, ${CURSO.formato.toLowerCase()}, desde ${CURSO.inicio.toLowerCase()}.`}
        />
        <div className={s.grid3}>
          {jornada.map(m => (
            <article key={m.modulo} className={s.card}>
              <Text size={200} className={s.muted}>{m.modulo}</Text>
              <Title3 as="h3">{m.titulo}</Title3>
              <div className={s.topics}>
                {m.topicos.map(t => <span key={t} className={s.topic}>{t}</span>)}
              </div>
              <Text size={200} className={s.strong}>No projeto</Text>
              <ul className={s.bullets}>
                {m.noProjeto.map(b => <li key={b}><Text size={200}>{b}</Text></li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className={s.callout}>
          <Body1>{sinteseProjeto}</Body1>
        </div>
      </section>

      {/* ── Agradecimento ────────────────────────────────────────────────── */}
      <section id="agradecimento" className={s.letter} aria-labelledby="titulo-agradecimento">
        <Title2 as="h2" id="titulo-agradecimento">{AGRADECIMENTO.titulo}</Title2>
        {AGRADECIMENTO.paragrafos.map(p => (
          <Body1 key={p} className={s.letterText}>{p}</Body1>
        ))}
        <div className={s.signature}>
          {AUTOR && <Text size={400} className={s.strong}>{AUTOR}</Text>}
          <Text size={200} className={s.muted}>Projeto Final · Turma 2 · Recode</Text>
        </div>
      </section>

      <footer className={s.footer}>
        <Text size={200} className={s.muted}>Recode: recodificamos vidas através da tecnologia.</Text>
        <Link href={RECODE_URL} target="_blank" rel="noreferrer">trilhas.recode.org.br</Link>
      </footer>
    </div>
  );
}
