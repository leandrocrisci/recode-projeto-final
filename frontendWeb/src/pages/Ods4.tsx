
import {
  makeStyles, tokens, Text, Badge, Title1, Title2, Title3, Body1,
  Card, CardHeader, Divider,
} from '@fluentui/react-components';
import { Globe24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' },
  hero: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '24px', borderRadius: tokens.borderRadiusLarge,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground}, ${tokens.colorBrandBackgroundHover})`,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  heroText: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 },
  heroTag:  { flexShrink: 0, whiteSpace: 'nowrap' },
  heroBadge: {
    width: '56px', height: '56px', borderRadius: tokens.borderRadiusLarge,
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', fontWeight: '800', color: '#fff', flexShrink: 0,
  },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' },
  metaRow: { display: 'grid', gridTemplateColumns: '60px 1fr 1fr', gap: '12px', alignItems: 'start' },
  estrategiaRow: {
    display: 'flex', gap: '16px', alignItems: 'flex-start',
    padding: '12px 16px', borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  numCircle: {
    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px',
  },
});

const metas = [
  { id: '4.1', global: 'Ensino primário e secundário gratuito, equitativo e de qualidade.', brasil: 'Ensino fundamental e médio na idade adequada na rede pública.' },
  { id: '4.2', global: 'Desenvolvimento na primeira infância e pré-escola.', brasil: 'Atendimento integral na educação infantil.' },
  { id: '4.3', global: 'Acesso igualitário à educação técnica, profissional e superior.', brasil: 'Equidade no acesso e permanência no ensino superior e profissional.' },
  { id: '4.4', global: 'Aumento de competências para emprego e empreendedorismo.', brasil: 'Desenvolvimento de habilidades técnicas necessárias ao mercado de trabalho.' },
  { id: '4.5', global: 'Eliminação de disparidades de gênero e inclusão de vulneráveis.', brasil: 'Combate a desigualdades de gênero, raça e apoio a grupos historicamente marginalizados.' },
  { id: '4.6', global: 'Alfabetização e suficiência em cálculo para jovens e adultos.', brasil: 'Ampliação de competências de leitura, escrita e matemática básica.' },
  { id: '4.7', global: 'Educação voltada para o desenvolvimento sustentável e direitos humanos.', brasil: 'Integração da cidadania global e direitos humanos nos currículos escolares.' },
  { id: '4.a', global: 'Construção e melhoria de instalações físicas escolares seguras e inclusivas.', brasil: 'Garantia de infraestrutura adequada, com acessibilidade, água e saneamento.' },
  { id: '4.b', global: 'Expansão de bolsas de estudo para países em desenvolvimento.', brasil: 'Ampliação de vagas em programas de intercâmbio e cooperação internacional.' },
  { id: '4.c', global: 'Aumento do contingente de professores qualificados.', brasil: 'Foco na formação inicial, continuada e valorização salarial docente.' },
];

const desafios = [
  { icon: '🏗️', titulo: 'Infraestrutura Básica', texto: 'Países em desenvolvimento e regiões periféricas sofrem com a falta de saneamento, internet e laboratórios.' },
  { icon: '📉', titulo: 'Defasagem de Aprendizado', texto: 'Milhões de crianças completam os ciclos sem domínio adequado de leitura e matemática básica.' },
  { icon: '👩‍🏫', titulo: 'Valorização Docente', texto: 'A escassez de professores qualificados e baixa remuneração desestimulam a carreira docente.' },
];

const estrategias = [
  { num: '1', titulo: 'Priorização Orçamentária', texto: 'Tratar o financiamento educacional como investimento estratégico nacional de longo prazo.' },
  { num: '2', titulo: 'Formação Continuada', texto: 'Apoiar educadores com capacitação focada em ferramentas digitais e metodologias ativas.' },
  { num: '3', titulo: 'Inclusão e Diversidade', texto: 'Criar políticas ativas de permanência para meninas, povos indígenas, quilombolas e PcD.' },
];

export default function Ods4() {
  const s = useStyles();

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroBadge}><Globe24Regular style={{ fontSize: '28px' }} /></div>
        <div className={s.heroText}>
          <Title1 style={{ color: '#fff' }}>Educação de Qualidade</Title1>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>ODS 4 · Agenda 2030 · Organização das Nações Unidas</Text>
        </div>
        <Badge appearance="filled" color="informative" size="large" className={s.heroTag}>ODS 4</Badge>
      </div>

      {/* Introdução */}
      <div className={s.section}>
        <Title2>1. Introdução</Title2>
        <Divider />
        <Body1>
          O <strong>Objetivo de Desenvolvimento Sustentável 4 (ODS 4)</strong> integra a Agenda 2030 da ONU.
          Sua missão consiste em <strong>assegurar a educação inclusiva, equitativa e de qualidade,
          promovendo oportunidades de aprendizagem ao longo da vida para todos.</strong>
        </Body1>
        <Body1>
          Diferente das metas anteriores do milênio, que focavam na taxa de matrícula,
          o ODS 4 reconhece que o acesso não basta: é fundamental garantir a retenção,
          o aprendizado prático e ambientes escolares adequados.
        </Body1>
      </div>

      {/* Metas */}
      <div className={s.section}>
        <Title2>2. Metas Principais</Title2>
        <Divider />
        <Text style={{ color: tokens.colorNeutralForeground2 }}>
          O ODS 4 desdobra-se em <strong>dez metas</strong> que abrangem da primeira infância ao ensino superior.
        </Text>
        <Card>
          {metas.map((m, idx) => (
            <div key={m.id}>
              {idx > 0 && <Divider style={{ margin: '0' }} />}
              <div className={s.metaRow} style={{ padding: '10px 16px' }}>
                <Badge appearance="filled" color="brand">{m.id}</Badge>
                <Text size={200}>{m.global}</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>{m.brasil}</Text>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Desafios */}
      <div className={s.section}>
        <Title2>3. Desafios para a Implementação</Title2>
        <Divider />
        <div className={s.cardGrid}>
          {desafios.map(d => (
            <Card key={d.titulo}>
              <CardHeader
                image={<span style={{ fontSize: '28px' }}>{d.icon}</span>}
                header={<Text weight="semibold">{d.titulo}</Text>}
                description={<Text size={200}>{d.texto}</Text>}
              />
            </Card>
          ))}
        </div>
      </div>

      {/* Estratégias */}
      <div className={s.section}>
        <Title2>4. Estratégias e Recomendações</Title2>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {estrategias.map(e => (
            <div key={e.num} className={s.estrategiaRow}>
              <div className={s.numCircle}>{e.num}</div>
              <div>
                <Text weight="semibold">{e.titulo}</Text>
                <Text size={200} block style={{ color: tokens.colorNeutralForeground2, marginTop: '4px' }}>{e.texto}</Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusão */}
      <Card style={{ backgroundColor: tokens.colorBrandBackground2 }}>
        <CardHeader
          header={<Title3>5. Conclusão</Title3>}
          description={
            <Body1>
              A educação de qualidade atua como um <strong>catalisador para todos os outros ODS</strong>.
              Sem garantir o aprendizado inclusivo e equitativo, torna-se inviável erradicar a pobreza (ODS 1),
              reduzir as desigualdades (ODS 10) ou promover o crescimento econômico sustentável (ODS 8).
            </Body1>
          }
        />
      </Card>
    </div>
  );
}
