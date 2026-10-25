import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, tokens, Text, Badge, Button, Title1, Title2, Body1, Tab, TabList,
} from '@fluentui/react-components';
import {
  BookOpen24Regular, Building24Regular, Location24Regular, People24Regular, PersonBoard24Regular,
  StarEmphasis24Regular, ClipboardTaskAdd24Regular, DataTrending24Regular, Map24Regular,
  Globe24Regular, Box24Regular, ShoppingBag24Regular, Shield24Regular, Flash24Regular,
  DocumentBulletList24Regular, Checkmark24Regular, QuestionCircle24Regular, ArrowRight24Regular,
} from '@fluentui/react-icons';
import {
  resumoExecutivo, cadastros, avaliacoes, paraPaisEResponsaveis, perfis, passos, ordemImporta,
  gruposTelas, leituras, duvidas,
} from '../data/manual';

type TabId = 'executiva' | 'uso' | 'telas' | 'duvidas';

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    width: '100%',
    maxWidth: '1120px',
    margin: '0 auto',
    padding: '24px',
    boxSizing: 'border-box',
  },

  // Hero (mesmo padrão das páginas ODS 4 e Agradecimentos)
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

  // Estrutura
  tabsWrap: { overflowX: 'auto', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  panel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '12px' },
  sectionHead: { display: 'flex', flexDirection: 'column', gap: '4px' },
  muted: { color: tokens.colorNeutralForeground3 },
  strong: { fontWeight: tokens.fontWeightSemibold },

  // Cartões
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
  cardHead: { display: 'flex', alignItems: 'center', gap: '12px' },
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
  pergunta: {
    marginTop: 'auto',
    padding: '10px 12px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  cardAction: { alignSelf: 'flex-start' },
  bullets: { display: 'flex', flexDirection: 'column', gap: '6px', margin: 0, paddingLeft: '18px' },

  // Destaques
  callout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '14px 18px',
    backgroundColor: tokens.colorBrandBackground2,
    borderLeft: `4px solid ${tokens.colorBrandBackground}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  calloutActions: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  checkList: { display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, padding: 0, listStyle: 'none' },
  checkItem: { display: 'flex', alignItems: 'flex-start', gap: '8px' },
  checkIcon: { flexShrink: 0, color: tokens.colorBrandForeground1 },

  // Passo a passo
  steps: { display: 'flex', flexDirection: 'column', gap: '10px', margin: 0, padding: 0, listStyle: 'none' },
  step: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    padding: '14px 16px',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  numCircle: {
    width: '36px',
    height: '36px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontWeight: tokens.fontWeightBold,
  },
  stepBody: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '220px' },

  srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 },
});

const ICONES: Record<string, ReactNode> = {
  escolas: <Building24Regular />,
  enderecos: <Location24Regular />,
  cursos: <BookOpen24Regular />,
  professores: <PersonBoard24Regular />,
  alunos: <People24Regular />,
  'av-qualidade': <StarEmphasis24Regular />,
  'av-cursos': <ClipboardTaskAdd24Regular />,
  dashboard: <Map24Regular />,
  relatorio: <DataTrending24Regular />,
  ods4: <Globe24Regular />,
  produtos: <Box24Regular />,
  pedidos: <ShoppingBag24Regular />,
  eventos: <Shield24Regular />,
  n8n: <Flash24Regular />,
  docs: <DocumentBulletList24Regular />,
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

export default function Manual() {
  const s = useStyles();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('executiva');
  const totalTelas = gruposTelas.reduce((n, g) => n + g.telas.length, 0);

  return (
    <div className={s.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={s.heroMark} aria-hidden="true"><BookOpen24Regular style={{ fontSize: '44px' }} /></div>
        <div className={s.heroBody}>
          <Text size={200} className={s.heroKicker}>Recode · Avaliação Escolas</Text>
          <Title1 as="h1" style={{ color: '#fff' }}>Manual do Sistema</Title1>
          <Body1 className={s.heroLead}>
            Entenda o que o sistema controla, quem acompanha as avaliações e como usar cada tela, do primeiro
            cadastro ao relatório.
          </Body1>
          <div className={s.chips}>
            <span className={s.chip}>Visão executiva</span>
            <span className={s.chip}>Passo a passo</span>
            <span className={s.chip}>{totalTelas} telas explicadas</span>
          </div>
          <div className={s.heroActions}>
            <Button appearance="outline" className={s.heroBtn} icon={<Checkmark24Regular />} onClick={() => setTab('uso')}>
              Como usar
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<Map24Regular />} onClick={() => navigate('/dashboard')}>
              Abrir o dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* ── Abas ─────────────────────────────────────────────────────────── */}
      <div className={s.tabsWrap}>
        <TabList aria-label="Seções do manual" selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as TabId)} size="large">
          <Tab value="executiva" icon={<DataTrending24Regular />}>Visão executiva</Tab>
          <Tab value="uso" icon={<Checkmark24Regular />}>Como usar</Tab>
          <Tab value="telas" icon={<DocumentBulletList24Regular />}>Guia das telas</Tab>
          <Tab value="duvidas" icon={<QuestionCircle24Regular />}>Números e dúvidas</Tab>
        </TabList>
      </div>

      {/* ── Visão executiva ──────────────────────────────────────────────── */}
      {tab === 'executiva' && (
        <div className={s.panel} role="tabpanel" aria-label="Visão executiva">
          <SectionHead title="O que o sistema controla" />
          <Body1>{resumoExecutivo}</Body1>

          <SectionHead title="A base: cinco cadastros" subtitle="Cada um responde a uma pergunta e se liga à escola." />
          <div className={s.grid3}>
            {cadastros.map((c, i) => (
              <article key={c.id} className={s.card}>
                <div className={s.cardHead}>
                  <div className={s.iconBubble} aria-hidden="true">{ICONES[c.id]}</div>
                  <Text size={400} className={s.strong}><span className={s.srOnly}>Cadastro {i + 1}: </span>{c.titulo}</Text>
                </div>
                <Text size={300} className={s.muted}>{c.texto}</Text>
                <div className={s.pergunta}>
                  <Text size={200}><b>Responde:</b> {c.pergunta}</Text>
                </div>
                <Button className={s.cardAction} appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after" onClick={() => navigate(c.rota)}>
                  Abrir {c.titulo}
                </Button>
              </article>
            ))}
          </div>

          <SectionHead title="O que se faz com essa base: avaliar" subtitle="Com os cadastros prontos, o sistema registra duas avaliações." />
          <div className={s.grid2}>
            {avaliacoes.map(a => (
              <article key={a.id} className={s.card}>
                <div className={s.cardHead}>
                  <div className={s.iconBubble} aria-hidden="true">{ICONES[a.id]}</div>
                  <div>
                    <Text size={400} className={s.strong} block>{a.titulo}</Text>
                    <Badge appearance="tint" color="brand">{a.escala}</Badge>
                  </div>
                </div>
                <Text size={300} className={s.muted}>{a.texto}</Text>
                <Button className={s.cardAction} appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after" onClick={() => navigate(a.rota)}>
                  Abrir avaliações
                </Button>
              </article>
            ))}
          </div>

          <div className={s.callout}>
            <Text size={400} className={s.strong}>Para pais e responsáveis</Text>
            <Body1>Com esse controle de avaliação, é possível:</Body1>
            <ul className={s.checkList}>
              {paraPaisEResponsaveis.map(t => (
                <li key={t} className={s.checkItem}>
                  <Checkmark24Regular className={s.checkIcon} aria-hidden="true" />
                  <Text size={300}>{t}</Text>
                </li>
              ))}
            </ul>
            <div className={s.calloutActions}>
              <Button appearance="primary" icon={<Location24Regular />} onClick={() => navigate('/dashboard')}>Ver o mapa de escolas</Button>
              <Button appearance="outline" icon={<DataTrending24Regular />} onClick={() => navigate('/progressos')}>Abrir o relatório gerencial</Button>
            </div>
          </div>

          <SectionHead title="Quem usa o sistema" />
          <div className={s.grid2}>
            {perfis.map(p => (
              <article key={p.id} className={s.card}>
                <Text size={400} className={s.strong}>{p.titulo}</Text>
                <Text size={200} className={s.muted}>{p.texto}</Text>
                <ul className={s.bullets}>
                  {p.pode.map(t => <li key={t}><Text size={300}>{t}</Text></li>)}
                </ul>
              </article>
            ))}
          </div>

          <div className={s.callout}>
            <Text size={400} className={s.strong}>Ligação com o ODS 4</Text>
            <Body1>
              Os indicadores do sistema (distância até a escola, zona rural, transporte e notas de qualidade)
              conversam com as metas de acesso, equidade e qualidade da educação.
            </Body1>
            <div className={s.calloutActions}>
              <Button appearance="outline" icon={<Globe24Regular />} onClick={() => navigate('/ods4')}>Conhecer o ODS 4</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Como usar ────────────────────────────────────────────────────── */}
      {tab === 'uso' && (
        <div className={s.panel} role="tabpanel" aria-label="Como usar">
          <SectionHead
            title="Como usar, passo a passo"
            subtitle="Do primeiro cadastro ao acompanhamento. Os passos de 1 a 6 são do administrador."
          />
          <ol className={s.steps}>
            {passos.map(p => (
              <li key={p.num} className={s.step}>
                <div className={s.numCircle} aria-hidden="true">{p.num}</div>
                <div className={s.stepBody}>
                  <Text size={400} className={s.strong}><span className={s.srOnly}>Passo {p.num}: </span>{p.titulo}</Text>
                  <Text size={300}>{p.texto}</Text>
                  {p.dica && <Text size={200} className={s.muted}><b>Dica.</b> {p.dica}</Text>}
                </div>
                <Button appearance="outline" onClick={() => navigate(p.rota)}>{p.acao}</Button>
              </li>
            ))}
          </ol>
          <div className={s.callout}>
            <Text size={400} className={s.strong}>Antes de começar</Text>
            <Body1>{ordemImporta}</Body1>
          </div>
        </div>
      )}

      {/* ── Guia das telas ───────────────────────────────────────────────── */}
      {tab === 'telas' && (
        <div className={s.panel} role="tabpanel" aria-label="Guia das telas">
          {gruposTelas.map(g => (
            <section key={g.titulo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <SectionHead title={g.titulo} subtitle={g.texto} />
              <div className={s.grid3}>
                {g.telas.map(t => (
                  <article key={t.id} className={s.card}>
                    <div className={s.cardHead}>
                      <div className={s.iconBubble} aria-hidden="true">{ICONES[t.id]}</div>
                      <Text size={400} className={s.strong}>{t.nome}</Text>
                    </div>
                    <Text size={300} className={s.muted}>{t.para}</Text>
                    <ul className={s.bullets}>
                      {t.uso.map(u => <li key={u}><Text size={200}>{u}</Text></li>)}
                    </ul>
                    <Button className={s.cardAction} appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after" onClick={() => navigate(t.rota)}>
                      Abrir {t.nome}
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Números e dúvidas ────────────────────────────────────────────── */}
      {tab === 'duvidas' && (
        <div className={s.panel} role="tabpanel" aria-label="Números e dúvidas">
          <SectionHead title="Como ler os números" />
          <div className={s.grid2}>
            {leituras.map(l => (
              <article key={l.titulo} className={s.card}>
                <Text size={400} className={s.strong}>{l.titulo}</Text>
                <Text size={300} className={s.muted}>{l.texto}</Text>
              </article>
            ))}
          </div>

          <SectionHead title="Dúvidas frequentes" />
          <div className={s.grid2}>
            {duvidas.map(d => (
              <article key={d.pergunta} className={s.card}>
                <Text size={400} className={s.strong}>{d.pergunta}</Text>
                <Text size={300} className={s.muted}>{d.resposta}</Text>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
