import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, tokens, Text, Button, Title1, Title2, Body1, Spinner,
} from '@fluentui/react-components';
import {
  Building24Regular, Location24Regular, People24Regular, PersonBoard24Regular, BookOpen24Regular,
  StarEmphasis24Regular, ClipboardTaskAdd24Regular, DataTrending24Regular, Home24Regular,
  Globe24Regular, Box24Regular, ShoppingBag24Regular, Shield24Regular, Flash24Regular,
  ArrowRight24Regular, QuestionCircle24Regular, Star24Regular,
} from '@fluentui/react-icons';
import { KpiCard } from '../components/KpiCard';
import type { KpiTone } from '../components/KpiCard';
import { useEscolasAgregadas } from '../hooks/useEscolasAgregadas';
import { calcularKpis } from '../utils/agregarEscolas';

// O logotipo fica em public/logo-marca.png (o Vite o serve na raiz do site)
const LOGO_URL = `${import.meta.env.BASE_URL}logo-marca.png`;

/**
 * Página de apresentação do sistema (rota /inicio).
 * Para mudar textos ou rotas, edite os arrays logo abaixo.
 */

const PERGUNTAS = [
  { id: 'av-qualidade', q: 'Quais escolas têm a melhor avaliação de qualidade?', a: 'Avaliações de qualidade', rota: '/av-qualidade' },
  { id: 'alunos', q: 'Onde os alunos gastam mais tempo para chegar à escola?', a: 'Alunos e Dashboard', rota: '/' },
  { id: 'av-cursos', q: 'Quais cursos os alunos estão avaliando melhor?', a: 'Avaliações de cursos', rota: '/av-cursos' },
];

const PUBLICO = [
  { quem: 'Secretarias de educação', dor: 'Precisam comparar escolas e decidir onde investir sem juntar dados de várias planilhas.' },
  { quem: 'Diretores e coordenadores', dor: 'Querem saber como a escola está em relação às outras e o que os cursos entregam.' },
  { quem: 'Projetos sociais e ONGs de educação', dor: 'Precisam mostrar dados confiáveis para apoiar pedidos de recursos e relatórios de impacto.' },
];

interface Modulo { id: string; nome: string; rota: string; uso: string }
interface Grupo { titulo: string; texto: string; itens: Modulo[] }

const GRUPOS: Grupo[] = [
  {
    titulo: 'Cadastrar a rede de ensino',
    texto: 'Monte a base que sustenta todas as análises.',
    itens: [
      { id: 'escolas', nome: 'Escolas', rota: '/escolas', uso: 'Registra cada escola com dependência administrativa (municipal, estadual, técnica, privada...) e contatos.' },
      { id: 'enderecos', nome: 'Endereços', rota: '/enderecos', uso: 'Localiza a escola no mapa e permite comparar regiões.' },
      { id: 'cursos', nome: 'Cursos', rota: '/cursos', uso: 'Mostra o que cada escola oferece e a carga horária.' },
      { id: 'professores', nome: 'Professores', rota: '/professores', uso: 'Reúne o corpo docente por escola, com especialidade e contatos. No módulo de compras, aparecem como vendedores.' },
      { id: 'alunos', nome: 'Alunos', rota: '/alunos', uso: 'Guarda só indicadores de deslocamento (área, distância, transporte e tempo), sem nome, para proteger a privacidade.' },
      { id: 'n8n', nome: 'Geração automática (N8N)', rota: '/n8n', uso: 'Cria escolas completas de teste com inteligência artificial e grava tudo pela API, sem digitar um cadastro por vez.' },
    ],
  },
  {
    titulo: 'Avaliar a qualidade',
    texto: 'Transforme opinião em número comparável.',
    itens: [
      { id: 'av-qualidade', nome: 'Avaliações de qualidade', rota: '/av-qualidade', uso: 'Dá nota de 1 a 5 estrelas para cada escola, com comentário.' },
      { id: 'av-cursos', nome: 'Avaliações de cursos', rota: '/av-cursos', uso: 'Dá nota de 0 a 10 para cada curso, com observações.' },
    ],
  },
  {
    titulo: 'Acompanhar e decidir',
    texto: 'Veja o conjunto e escolha onde agir.',
    itens: [
      { id: 'dashboard', nome: 'Dashboard', rota: '/', uso: 'Indicadores e mapa das escolas em uma tela.' },
      { id: 'relatorio', nome: 'Relatório gerencial', rota: '/progressos', uso: 'Painel para comparar escolas, regiões e cursos e apresentar a quem decide.' },
      { id: 'ods4', nome: 'ODS 4', rota: '/ods4', uso: 'Liga os dados ao objetivo de educação de qualidade da ONU.' },
      { id: 'eventos', nome: 'Central de eventos', rota: '/eventos', uso: 'Registra em tempo real as chamadas à API e as mensagens do console, para achar a causa de um erro sem parar o sistema.' },
    ],
  },
  {
    titulo: 'Comprar materiais escolares',
    texto: 'Módulo de estudo que simula um pequeno comércio eletrônico.',
    itens: [
      { id: 'produtos', nome: 'Produtos', rota: '/produtos', uso: 'Catálogo de materiais escolares com preço e estoque, em vitrine para solicitar ou em tabela para o administrador.' },
      { id: 'pedidos', nome: 'Pedidos', rota: '/pedidos', uso: 'Registra a compra de cada escola: produto, professor vendedor, quantidade, valor, total e status.' },
    ],
  },
];

// Faixas de nota (escala 1 a 5), as mesmas do Dashboard: >= 4 boa, >= 2,5 atenção, abaixo disso crítica
const toneDaNota = (n: number | null): KpiTone =>
  n === null ? 'neutral' : n >= 4 ? 'success' : n >= 2.5 ? 'warning' : 'danger';

const ICONES: Record<string, ReactNode> = {
  escolas: <Building24Regular />,
  enderecos: <Location24Regular />,
  cursos: <BookOpen24Regular />,
  professores: <PersonBoard24Regular />,
  alunos: <People24Regular />,
  n8n: <Flash24Regular />,
  'av-qualidade': <StarEmphasis24Regular />,
  'av-cursos': <ClipboardTaskAdd24Regular />,
  dashboard: <Home24Regular />,
  relatorio: <DataTrending24Regular />,
  ods4: <Globe24Regular />,
  eventos: <Shield24Regular />,
  produtos: <Box24Regular />,
  pedidos: <ShoppingBag24Regular />,
};

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

  // Hero (mesmo padrão das páginas ODS 4, Agradecimentos e Manual)
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
  // Logotipo: o PNG já traz o fundo escuro com cantos arredondados, então só dimensionamos e damos sombra
  heroMark: {
    width: '120px',
    height: '120px',
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: '22%',
    boxShadow: tokens.shadow16,
    zIndex: 1,
  },
  heroLogo: { display: 'block', width: '100%', height: '100%', objectFit: 'contain' },
  heroBody: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '260px', zIndex: 1 },
  heroKicker: { color: 'rgba(255,255,255,0.85)' },
  // Nome do projeto em destaque no topo da página inicial
  heroNome: {
    margin: 0,
    fontSize: 'clamp(46px, 8vw, 76px)',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-1px',
    color: '#fff',
    textShadow: '0 2px 14px rgba(0,0,0,0.25)',
    '::after': {
      content: '""',
      display: 'block',
      width: '84px',
      height: '6px',
      marginTop: '12px',
      borderRadius: '3px',
      backgroundColor: '#FACC15',
    },
  },
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

  // Indicadores ao vivo
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' },
  kpiAviso: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 2px' },

  // Estrutura
  section: { display: 'flex', flexDirection: 'column', gap: '16px' },
  sectionHead: { display: 'flex', flexDirection: 'column', gap: '4px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '12px' },
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
  cardAction: { alignSelf: 'flex-start', marginTop: 'auto' },

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
});

function SectionHead({ title, subtitle }: { title: string; subtitle?: string }) {
  const s = useStyles();
  return (
    <div className={s.sectionHead}>
      <Title2 as="h2">{title}</Title2>
      {subtitle && <Text size={300} className={s.muted}>{subtitle}</Text>}
    </div>
  );
}

export default function Home() {
  const s = useStyles();
  const navigate = useNavigate();
  const { escolas, loading, error } = useEscolasAgregadas();
  const kpis = useMemo(() => calcularKpis(escolas), [escolas]);
  const semDados = !loading && error && escolas.length === 0;

  return (
    <div className={s.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={s.heroMark}>
          <img className={s.heroLogo} src={LOGO_URL} alt="Logotipo do Semear: marcador de mapa com capelo de formatura e uma estrela" width={120} height={120} />
        </div>
        <div className={s.heroBody}>
          <p className={s.heroNome}>Semear</p>
          <Text size={300} className={s.heroKicker}>Avaliação Escolar · Projeto final Recode</Text>
          <Title1 as="h1" style={{ color: '#fff' }}>
            A qualidade das escolas e o caminho dos alunos até elas, em um só lugar.
          </Title1>
          <Body1 className={s.heroLead}>
            O Semear junta cadastro, notas de qualidade, cursos e deslocamento dos alunos para que quem
            gerencia a educação saiba onde agir primeiro.
          </Body1>
          <div className={s.chips}>
            <span className={s.chip}>Cadastros</span>
            <span className={s.chip}>Avaliações</span>
            <span className={s.chip}>Mapa e relatórios</span>
            <span className={s.chip}>ODS 4</span>
          </div>
          <div className={s.heroActions}>
            <Button appearance="outline" className={s.heroBtn} icon={<Home24Regular />} onClick={() => navigate('/')}>
              Abrir o dashboard
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<Building24Regular />} onClick={() => navigate('/escolas')}>
              Ver as escolas
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<QuestionCircle24Regular />} onClick={() => navigate('/manual')}>
              Manual do sistema
            </Button>
          </div>
        </div>
      </header>

      {/* ── Indicadores ao vivo ──────────────────────────────────────────── */}
      {loading && (
        <div className={s.kpiAviso} role="status">
          <Spinner size="tiny" label="Carregando os indicadores do sistema..." />
        </div>
      )}
      {semDados && (
        <Text size={200} className={s.muted} role="status">
          Os indicadores não puderam ser carregados agora. O servidor pode estar iniciando: aguarde cerca de 1 minuto e atualize a página.
        </Text>
      )}
      {!loading && !semDados && (
        <section className={s.kpiGrid} aria-label="Resumo geral das escolas">
          <KpiCard
            icon={<Building24Regular />}
            label="Escolas"
            value={kpis.totalEscolas}
            hint={kpis.totalEscolas === 0 ? 'nenhuma cadastrada' : kpis.escolasNoMapa === kpis.totalEscolas ? 'todas localizadas no mapa' : `${kpis.escolasNoMapa} localizadas no mapa`}
          />
          <KpiCard icon={<People24Regular />} label="Alunos" value={kpis.totalAlunos} hint="cadastrados no censo" />
          <KpiCard
            icon={<Star24Regular />}
            label="Nota média de qualidade"
            value={kpis.notaMediaGeral === null ? '—' : `${kpis.notaMediaGeral.toFixed(1)} / 5`}
            hint={`${kpis.escolasAvaliadas} de ${kpis.totalEscolas} escolas avaliadas`}
            tone={toneDaNota(kpis.notaMediaGeral)}
          />
          <KpiCard icon={<Location24Regular />} label="Alunos em zona rural" value={`${kpis.percentualRural}%`} hint={`${kpis.alunosRurais} de ${kpis.totalAlunos} alunos`} />
        </section>
      )}

      {/* ── Perguntas que o sistema responde ─────────────────────────────── */}
      <section className={s.section} aria-label="Perguntas que o sistema responde">
        <SectionHead title="Perguntas que o sistema responde" subtitle="Cada uma leva direto à tela que traz a resposta." />
        <div className={s.grid3}>
          {PERGUNTAS.map(p => (
            <article key={p.id} className={s.card}>
              <div className={s.cardHead}>
                <div className={s.iconBubble} aria-hidden="true">{ICONES[p.id]}</div>
                <Text size={400} className={s.strong}>{p.q}</Text>
              </div>
              <Text size={200} className={s.muted}>Resposta em {p.a}</Text>
              <Button className={s.cardAction} appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after" onClick={() => navigate(p.rota)}>
                Ver a resposta
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* ── Problema e público ───────────────────────────────────────────── */}
      <section className={s.section}>
        <SectionHead title="O problema" />
        <div className={s.callout}>
          <Body1>
            Os dados das escolas costumam ficar espalhados em planilhas e relatórios separados. A nota de qualidade
            está em um lugar, os cursos em outro e a distância que o aluno percorre quase nunca aparece. Sem a visão
            completa, fica difícil decidir onde investir e garantir educação de qualidade para todos, como pede o ODS 4.
          </Body1>
        </div>
      </section>

      <section className={s.section}>
        <SectionHead title="Para quem é" />
        <div className={s.grid3}>
          {PUBLICO.map(p => (
            <article key={p.quem} className={s.card}>
              <Text size={400} className={s.strong}>{p.quem}</Text>
              <Text size={300} className={s.muted}>{p.dor}</Text>
            </article>
          ))}
        </div>
      </section>

      {/* ── Para que serve cada parte ────────────────────────────────────── */}
      {GRUPOS.map(g => (
        <section key={g.titulo} className={s.section}>
          <SectionHead title={g.titulo} subtitle={g.texto} />
          <div className={s.grid3}>
            {g.itens.map(i => (
              <article key={i.id} className={s.card}>
                <div className={s.cardHead}>
                  <div className={s.iconBubble} aria-hidden="true">{ICONES[i.id]}</div>
                  <Text size={400} className={s.strong}>{i.nome}</Text>
                </div>
                <Text size={300} className={s.muted}>{i.uso}</Text>
                <Button className={s.cardAction} appearance="subtle" icon={<ArrowRight24Regular />} iconPosition="after" onClick={() => navigate(i.rota)}>
                  Abrir {i.nome}
                </Button>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* ── Fechamento ───────────────────────────────────────────────────── */}
      <div className={s.callout}>
        <Text size={400} className={s.strong}>Primeira vez por aqui?</Text>
        <Body1>
          O manual explica o que o sistema controla, como usar cada tela e como ler as notas. Para ver o resultado
          direto, abra o dashboard.
        </Body1>
        <div className={s.calloutActions}>
          <Button appearance="primary" icon={<QuestionCircle24Regular />} onClick={() => navigate('/manual')}>Ler o manual</Button>
          <Button appearance="outline" icon={<Home24Regular />} onClick={() => navigate('/')}>Abrir o dashboard</Button>
        </div>
      </div>
    </div>
  );
}
