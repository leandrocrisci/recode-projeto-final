import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  makeStyles, tokens, Text, Badge, Button, Link, Title1, Title2, Title3, Body1, Tab, TabList,
} from '@fluentui/react-components';
import {
  Globe24Regular, People24Regular, DataTrending24Regular, BookOpen24Regular, PersonBoard24Regular,
  DocumentBulletList24Regular, Location24Regular, ClipboardTaskAdd24Regular, Building24Regular,
} from '@fluentui/react-icons';
import { KpiCard } from '../components/KpiCard';
import { ChartCard } from '../components/ChartCard';
import { HBarChart } from '../components/charts/HBarChart';
import { ColumnChart } from '../components/charts/ColumnChart';
import { RingChart } from '../components/charts/RingChart';
import {
  FONTES, foraDaEscolaPopulacao, foraDaEscolaPorEtapa, conclusaoPorEtapa, alfabetizacao, competenciasDigitais,
  analfabetismoRegioes, analfabetismoPerfil, medioAdequado, motivosAbandono,
  metas, termos, linhaDoTempo, desafios, estrategias,
} from '../data/ods4';
import type { Meta } from '../data/ods4';

type TabId = 'visao' | 'global' | 'brasil' | 'metas' | 'caminhos';

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
    backgroundColor: '#C5192D', // vermelho associado ao ODS 4
    color: '#fff',
    fontSize: '52px',
    fontWeight: 800,
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

  // Blocos
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' },
  tabsWrap: { overflowX: 'auto', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  panel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: '16px' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))', gap: '12px' },
  sectionHead: { display: 'flex', flexDirection: 'column', gap: '4px' },
  muted: { color: tokens.colorNeutralForeground3 },
  rings: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '24px' },
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

  // Cartões de conteúdo
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px 18px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow2,
  },
  cardHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' },
  cardTitle: { fontWeight: tokens.fontWeightSemibold },
  dado: {
    marginTop: 'auto',
    padding: '10px 12px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
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
  rowWithIcon: { display: 'flex', alignItems: 'flex-start', gap: '14px' },
  timeline: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '12px' },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    paddingTop: '12px',
    borderTop: `3px solid ${tokens.colorBrandBackground}`,
  },
  stepFuture: { borderTopStyle: 'dashed' },
  year: { color: tokens.colorBrandForeground1, fontWeight: tokens.fontWeightBold },
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
  estrategia: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '14px 16px',
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  sources: { display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px', borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  // Texto só para leitores de tela: invisível na tela, mas lido em voz alta
  srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 },
});

const ICONES_DESAFIO: Record<string, ReactNode> = {
  infra: <Building24Regular />,
  aprendizado: <BookOpen24Regular />,
  docentes: <PersonBoard24Regular />,
  equidade: <People24Regular />,
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

function MetaCard({ meta }: { meta: Meta }) {
  const s = useStyles();
  return (
    <article className={s.card}>
      <div className={s.cardHead}>
        <Badge appearance="filled" color="brand" size="large"><span className={s.srOnly}>Meta </span>{meta.id}</Badge>
        <Text size={200} className={s.muted}>Prazo: {meta.prazo}</Text>
      </div>
      <Text className={s.cardTitle}>{meta.titulo}</Text>
      <Text size={200} className={s.muted}>No Brasil: {meta.brasil}</Text>
      <div className={s.dado}>
        <Text size={200}><b>Dado recente.</b> {meta.dado}</Text>
      </div>
    </article>
  );
}

export default function Ods4() {
  const s = useStyles();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>('visao');

  const metasResultado = metas.filter(m => m.grupo === 'resultado');
  const metasMeios = metas.filter(m => m.grupo === 'meios');

  return (
    <div className={s.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={s.heroMark} aria-hidden="true">4</div>
        <div className={s.heroBody}>
          <Text size={200} className={s.heroKicker}>Objetivo de Desenvolvimento Sustentável 4 · Agenda 2030 da ONU</Text>
          <Title1 as="h1" style={{ color: '#fff' }}>Educação de Qualidade</Title1>
          <Body1 className={s.heroLead}>
            Assegurar a educação inclusiva, equitativa e de qualidade, e promover oportunidades de
            aprendizagem ao longo da vida para todos.
          </Body1>
          <div className={s.chips}>
            <span className={s.chip}>10 metas</span>
            <span className={s.chip}>Prazo: 2030</span>
            <span className={s.chip}>Dados de 2024 e 2025</span>
          </div>
          <div className={s.heroActions}>
            <Button appearance="outline" className={s.heroBtn} icon={<DataTrending24Regular />} onClick={() => setTab('global')}>
              Dados globais
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<Location24Regular />} onClick={() => setTab('brasil')}>
              Dados do Brasil
            </Button>
          </div>
        </div>
      </header>

      {/* ── Indicadores-chave ────────────────────────────────────────────── */}
      <div className={s.kpiGrid}>
        <KpiCard icon={<People24Regular />} label="Fora da escola (2024)" value="273 mi" hint="cerca de 1 em cada 6 em idade escolar" tone="danger" />
        <KpiCard icon={<DataTrending24Regular />} label="Conclusão do ensino médio" value="61%" hint="eram 37% em 2000" tone="brand" />
        <KpiCard icon={<BookOpen24Regular />} label="Proficiência mínima em leitura" value="58%" hint="fim do primário, estimativa de 2019" tone="warning" />
        <KpiCard icon={<PersonBoard24Regular />} label="Professores sem qualificação mínima" value="~1 em 5" hint="18% a 21% em 2024" tone="warning" />
        <KpiCard icon={<DocumentBulletList24Regular />} label="Alfabetização de adultos" value="88%" hint="eram 86% em 2015" tone="success" />
      </div>

      {/* ── Abas ─────────────────────────────────────────────────────────── */}
      <div className={s.tabsWrap}>
        <TabList aria-label="Seções da página ODS 4" selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as TabId)} size="large">
          <Tab value="visao" icon={<Globe24Regular />}>Visão geral</Tab>
          <Tab value="global" icon={<DataTrending24Regular />}>Cenário global</Tab>
          <Tab value="brasil" icon={<Location24Regular />}>Brasil</Tab>
          <Tab value="metas" icon={<DocumentBulletList24Regular />}>Metas</Tab>
          <Tab value="caminhos" icon={<ClipboardTaskAdd24Regular />}>Desafios e caminhos</Tab>
        </TabList>
      </div>

      {/* ── Visão geral ──────────────────────────────────────────────────── */}
      {tab === 'visao' && (
        <div className={s.panel} role="tabpanel" aria-label="Visão geral">
          <SectionHead title="O que o ODS 4 propõe" />
          <Body1>
            O <strong>ODS 4</strong> integra a Agenda 2030 da ONU. Diferente das metas anteriores do milênio, que
            miravam sobretudo a taxa de matrícula, ele reconhece que o acesso não basta: é fundamental garantir a
            permanência, a conclusão, o aprendizado de fato e ambientes escolares adequados.
          </Body1>
          <div className={s.grid2}>
            {termos.map(t => (
              <article key={t.termo} className={s.card}>
                <Text size={400} className={s.cardTitle}>{t.termo}</Text>
                <Text size={300} className={s.muted}>{t.texto}</Text>
              </article>
            ))}
          </div>

          <SectionHead
            title="Da universalização do acesso à conclusão"
            subtitle="Como as agendas globais de educação elevaram a ambição, até chegar ao prazo de 2030."
          />
          <div className={s.timeline}>
            {linhaDoTempo.map((p, i) => (
              <div key={p.ano} className={`${s.step}${i === linhaDoTempo.length - 1 ? ' ' + s.stepFuture : ''}`}>
                <Title3 className={s.year}>{p.ano}</Title3>
                <Text className={s.cardTitle}>{p.titulo}</Text>
                <Text size={200} className={s.muted}>{p.texto}</Text>
              </div>
            ))}
          </div>

          <div className={s.callout}>
            <Text size={400} className={s.cardTitle}>Por que a educação de qualidade importa para todos os ODS</Text>
            <Body1>
              A educação atua como <strong>catalisador dos demais objetivos</strong>. Sem aprendizado inclusivo e
              equitativo, fica inviável erradicar a pobreza (ODS 1), reduzir as desigualdades (ODS 10) ou promover o
              crescimento econômico sustentável (ODS 8).
            </Body1>
          </div>
        </div>
      )}

      {/* ── Cenário global ───────────────────────────────────────────────── */}
      {tab === 'global' && (
        <div className={s.panel} role="tabpanel" aria-label="Cenário global">
          <SectionHead
            title="Cenário global"
            subtitle="A conclusão escolar avança, mas a população fora da escola voltou a crescer."
          />
          <div className={s.grid2}>
            <ChartCard
              title="Quantas crianças e jovens estão fora da escola"
              subtitle="População em idade escolar (primário e secundário), em milhões"
              note="A taxa de exclusão caiu de 27,2% (2000) para 17,4% (2015) e está parada desde então (16,8% em 2024). O número absoluto sobe porque a população cresce nos países de renda baixa e média-baixa. Valores de 2000 e 2015 calculados a partir das variações publicadas."
              source="ONU/UNESCO UIS, Relatório Estendido dos ODS 2026"
            >
              <ColumnChart
                items={foraDaEscolaPopulacao}
                ariaLabel="Crianças e jovens fora da escola: cerca de 391 milhões em 2000, 264 milhões em 2015 e 273 milhões em 2024."
              />
            </ChartCard>

            <ChartCard
              title="Onde a exclusão é maior"
              subtitle="Percentual fora da escola por faixa etária, 2024"
              note="A África Subsaariana e a Ásia Central e do Sul concentram três quartos de toda a população fora da escola."
              source="ONU/UNESCO UIS, Relatório Estendido dos ODS 2026"
            >
              <HBarChart
                groups={foraDaEscolaPorEtapa}
                max={40}
                ariaLabel="Fora da escola em 2024: cerca de 10% na idade do primário, 15% no 1º ciclo secundário e 31% no 2º ciclo secundário."
              />
            </ChartCard>
          </div>

          <ChartCard
            title="Cada vez mais estudantes concluem as etapas"
            subtitle="Taxa de conclusão por nível de ensino (% de quem chega à última série até 3 a 5 anos após a idade oficial)"
            note="No ritmo atual de expansão, o mundo atingiria 95% de conclusão do ensino médio apenas em 2105 (Relatório GEM 2026)."
            source="ONU/UNESCO UIS e Relatório GEM 2026"
          >
            <HBarChart
              groups={conclusaoPorEtapa}
              ariaLabel="Conclusão do primário: 77% em 2000, 84,5% em 2015, 88% em 2024. 1º ciclo secundário: 60%, 73%, 78%. Ensino médio: 37%, 53%, 61%."
            />
          </ChartCard>

          <div className={s.grid2}>
            <ChartCard
              title="Alfabetização: mundo e África Subsaariana"
              subtitle="Percentual de alfabetizados, 2015 e 2024"
              source="UNESCO UIS, Relatório Estendido dos ODS 2026"
            >
              <HBarChart
                groups={alfabetizacao}
                ariaLabel="Alfabetização de adultos no mundo: 86% em 2015 e 88% em 2024. Jovens: 91% e 93%. Na África Subsaariana, adultos 64% e 69%, jovens 75% e 79%."
              />
            </ChartCard>

            <ChartCard
              title="Competências digitais de quem usa internet"
              subtitle="Pessoas com ao menos competências básicas, por área"
              note="O uso da internet (mediana de 92% nos países com dados) é bem maior que as competências para aproveitá-la com segurança. Só cerca de 100 países enviaram dados desde 2020."
              source="UIT e UNESCO UIS, Relatório Estendido dos ODS 2026"
            >
              <HBarChart
                groups={competenciasDigitais}
                ariaLabel="Entre usuários de internet: 84% com competências básicas de comunicação, 76% de informação, 72% de resolução de problemas, 59% de criação de conteúdo e 57% de segurança."
              />
            </ChartCard>
          </div>

          <SectionHead title="Escolas, professores e financiamento" />
          <div className={s.kpiGrid}>
            <KpiCard icon={<Building24Regular />} label="Escolas primárias sem serviços básicos" value="> 1 em 5" hint="sem eletricidade, água potável ou saneamento" tone="warning" />
            <KpiCard icon={<Building24Regular />} label="Países menos desenvolvidos: sem energia" value="> 50%" hint="das escolas primárias" tone="danger" />
            <KpiCard icon={<Building24Regular />} label="Países menos desenvolvidos: sem internet" value="~3 em 4" hint="escolas sem computadores nem internet pedagógicos" tone="danger" />
            <KpiCard icon={<PersonBoard24Regular />} label="Professores sem a qualificação mínima" value="18% a 21%" hint="padrão definido por cada país, 2024" tone="warning" />
            <KpiCard icon={<DocumentBulletList24Regular />} label="Ajuda oficial para bolsas (2024)" value="US$ 1,96 bi" hint="queda de 8,1% sobre 2023" tone="brand" />
          </div>
        </div>
      )}

      {/* ── Brasil ───────────────────────────────────────────────────────── */}
      {tab === 'brasil' && (
        <div className={s.panel} role="tabpanel" aria-label="Brasil">
          <SectionHead
            title="Brasil"
            subtitle="Módulo Educação da PNAD Contínua (IBGE), com dados de 2025 divulgados em 19/06/2026."
          />

          <ChartCard
            title="Três termômetros da educação básica"
            subtitle="Resultados de 2025 em comparação com as metas do Plano Nacional de Educação (PNE)"
            source="IBGE, PNAD Contínua Educação 2025"
          >
            {/* Resumo falado dos três anéis: o leitor de tela ouve valor, meta e situação numa frase só */}
            <ul className={s.srOnly}>
              <li>Crianças de 6 a 14 anos no ensino fundamental: 96,1%. Meta do PNE de 95%, atingida.</li>
              <li>Jovens de 15 a 17 anos no ensino médio: 80,6%. Meta do PNE de 85%, ainda não atingida; faltam 4,4 pontos.</li>
              <li>Adultos de 25 anos ou mais com o ensino médio completo: 57,4%, em alta desde 2016.</li>
            </ul>
            <div className={s.rings} aria-hidden="true">
              <RingChart value={96.1} display="96,1%" label="Crianças de 6 a 14 anos no ensino fundamental" sublabel="Meta do PNE: 95%, atingida" tone="success" />
              <RingChart value={80.6} display="80,6%" label="Jovens de 15 a 17 anos no ensino médio" sublabel="Meta do PNE: 85%, ainda não atingida" tone="warning" />
              <RingChart value={57.4} display="57,4%" label="Adultos (25+) com o ensino médio completo" sublabel="Em 2016 eram menos: a escolaridade avança" tone="brand" />
            </div>
          </ChartCard>

          <div className={s.grid2}>
            <ChartCard
              title="Analfabetismo por região"
              subtitle="Pessoas com 15 anos ou mais, 2025"
              note="São 8,4 milhões de analfabetos no país, 4,8 milhões deles no Nordeste. É a primeira vez, desde 2016, que a taxa fica abaixo de 5%, mas a meta do PNE era erradicar o analfabetismo até 2024."
              source="IBGE, PNAD Contínua Educação 2025"
            >
              <ColumnChart
                items={analfabetismoRegioes}
                ariaLabel="Taxa de analfabetismo em 2025: Brasil 4,9%, Nordeste 10,6%, Norte 5,7%, Centro-Oeste 3,3%, Sul 2,4%, Sudeste 2,3%."
              />
            </ChartCard>

            <ChartCard
              title="Quem ainda não lê nem escreve"
              subtitle="Taxa de analfabetismo por idade e cor ou raça, 2025"
              note="O analfabetismo está cada vez mais associado ao envelhecimento: 58% dos analfabetos têm 60 anos ou mais."
              source="IBGE, PNAD Contínua Educação 2025"
            >
              <HBarChart
                groups={analfabetismoPerfil}
                max={25}
                ariaLabel="Analfabetismo: 2,6% entre 15 e 59 anos e 13,8% com 60 anos ou mais. Brancos 2,8% e pretos ou pardos 6,5% com 15 anos ou mais; entre idosos, 7,3% e 20,6%."
              />
            </ChartCard>

            <ChartCard
              title="Ensino médio na idade certa"
              subtitle="Jovens de 15 a 17 anos que frequentavam ou concluíram o ensino médio, 2025"
              source="IBGE, PNAD Contínua Educação 2025"
            >
              <HBarChart
                groups={medioAdequado}
                marker={{ value: 85, label: 'Meta do PNE: 85%' }}
                ariaLabel="Ensino médio na idade certa em 2025: total 80,6%, mulheres 84%, homens 77,4%, brancos 84,9%, pretos ou pardos 77,8%. Meta do PNE: 85%."
              />
            </ChartCard>

            <ChartCard
              title="Por que jovens deixam a escola"
              subtitle="Motivo de quem tem 14 a 29 anos e não concluiu o ensino médio, 2025"
              note="Entre os homens, trabalhar pesa mais (54,2%). Entre as mulheres, gravidez (24,7%) e afazeres domésticos ou cuidados (8,6%) também aparecem entre os principais motivos."
              source="IBGE, PNAD Contínua Educação 2025"
            >
              <HBarChart
                groups={motivosAbandono}
                max={50}
                ariaLabel="Motivos de abandono entre jovens de 14 a 29 anos: trabalho 43%, falta de interesse 25,6%, gravidez 9,9%, saúde 4,4%, afazeres domésticos 3,9%, falta de escola ou vaga 2,8%."
              />
            </ChartCard>
          </div>

          <div className={s.kpiGrid}>
            <KpiCard icon={<People24Regular />} label="Jovens de 14 a 29 sem ensino médio completo" value="7,7 mi" hint="72,8% pretos ou pardos; 59,8% homens" tone="danger" />
            <KpiCard icon={<BookOpen24Regular />} label="Anos de estudo (25 anos ou mais)" value="10,2" hint="eram 9,1 em 2016" tone="brand" />
            <KpiCard icon={<DataTrending24Regular />} label="Diferença por cor ou raça" value="1,6 ano" hint="brancos 11,1 anos; pretos ou pardos 9,5" tone="warning" />
            <KpiCard icon={<Location24Regular />} label="Ensino médio completo: pretos ou pardos" value="51,3%" hint="pela 1ª vez mais da metade (brancos: 64,9%)" tone="success" />
          </div>

          <div className={s.callout}>
            <Text size={400} className={s.cardTitle}>E o Recode com isso?</Text>
            <Body1>
              Distância até a escola, zona rural, transporte escolar e notas de qualidade, os indicadores que o Recode
              reúne, conversam diretamente com as metas de acesso, equidade e infraestrutura (4.1, 4.5 e 4.a).
            </Body1>
            <div className={s.calloutActions}>
              <Button appearance="primary" icon={<Location24Regular />} onClick={() => navigate('/')}>Ver o mapa de escolas</Button>
              <Button appearance="outline" icon={<DataTrending24Regular />} onClick={() => navigate('/progressos')}>Abrir o relatório gerencial</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Metas ────────────────────────────────────────────────────────── */}
      {tab === 'metas' && (
        <div className={s.panel} role="tabpanel" aria-label="Metas">
          <SectionHead
            title="As dez metas do ODS 4"
            subtitle="Sete metas de resultado e três meios de implementação, cada uma com um dado recente."
          />
          <Text size={400} className={s.cardTitle}>Metas de resultado (4.1 a 4.7)</Text>
          <div className={s.grid3}>{metasResultado.map(m => <MetaCard key={m.id} meta={m} />)}</div>
          <Text size={400} className={s.cardTitle}>Meios de implementação (4.a a 4.c)</Text>
          <div className={s.grid3}>{metasMeios.map(m => <MetaCard key={m.id} meta={m} />)}</div>
        </div>
      )}

      {/* ── Desafios e caminhos ──────────────────────────────────────────── */}
      {tab === 'caminhos' && (
        <div className={s.panel} role="tabpanel" aria-label="Desafios e caminhos">
          <SectionHead title="Desafios para a implementação" />
          <div className={s.grid2}>
            {desafios.map(d => (
              <article key={d.id} className={`${s.card} ${s.rowWithIcon}`}>
                <div className={s.iconBubble}>{ICONES_DESAFIO[d.id]}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <Text size={400} className={s.cardTitle}>{d.titulo}</Text>
                  <Text size={300} className={s.muted}>{d.texto}</Text>
                </div>
              </article>
            ))}
          </div>

          <SectionHead title="Estratégias e recomendações" subtitle="Caminhos apontados pelos relatórios da ONU e da UNESCO." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {estrategias.map(e => (
              <div key={e.num} className={s.estrategia}>
                <div className={s.numCircle}>{e.num}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text className={s.cardTitle}>{e.titulo}</Text>
                  <Text size={200} className={s.muted}>{e.texto}</Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fontes ───────────────────────────────────────────────────────── */}
      <footer className={s.sources} aria-label="Fontes dos dados">
        <Text size={200} weight="semibold">Fontes</Text>
        {Object.values(FONTES).map(f => (
          <Text key={f.url} size={200}>
            <Link href={f.url} target="_blank" rel="noreferrer">{f.nome}<span className={s.srOnly}> (abre em nova aba)</span></Link>
          </Text>
        ))}
      </footer>
    </div>
  );
}
