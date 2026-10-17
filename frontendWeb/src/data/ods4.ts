import type { HBarGroup } from '../components/charts/HBarChart';
import type { ColumnItem } from '../components/charts/ColumnChart';

// ─────────────────────────────────────────────────────────────────────────────
// Dados do ODS 4. Valores globais: ONU (Relatório dos ODS 2026) e UNESCO (GEM 2026).
// Valores do Brasil: IBGE, PNAD Contínua Educação 2025 (divulgada em 19/06/2026).
// Para atualizar a página no próximo ciclo, basta editar este arquivo.
// ─────────────────────────────────────────────────────────────────────────────

export const FONTES = {
  unsd: {
    nome: 'ONU (UNSD): Relatório dos ODS 2026, Relatório Estendido, Objetivo 4',
    url: 'https://unstats.un.org/sdgs/report/2026/extended-report/Extended-Report-2026_Goal-4.pdf',
  },
  gem: {
    nome: 'UNESCO: Relatório de Monitoramento Global da Educação (GEM) 2026, Acesso e equidade',
    url: 'https://www.unesco.org/reports/gem-report/en/2026',
  },
  uis: {
    nome: 'UNESCO UIS: navegador de dados de educação',
    url: 'https://databrowser.uis.unesco.org/',
  },
  ibge: {
    nome: 'IBGE: PNAD Contínua, módulo Educação 2025',
    url: 'https://agenciadenoticias.ibge.gov.br/agencia-noticias/2012-agencia-de-noticias/noticias/47221-analfabetismo-fica-abaixo-de-5-em-2025-mas-8-4-milhoes-ainda-nao-sabem-ler-e-escrever',
  },
} as const;

// ── Cenário global ────────────────────────────────────────────────────────────

// 2000 e 2015 são calculados a partir das variações publicadas: queda de 127 mi
// entre 2000 e 2015 e alta de 9 mi desde então (273 mi em 2024).
export const foraDaEscolaPopulacao: ColumnItem[] = [
  { label: '2000', value: 391, display: '≈ 391 mi', tone: 'muted' },
  { label: '2015', value: 264, display: '≈ 264 mi', tone: 'brandSoft' },
  { label: '2024', value: 273, display: '273 mi', tone: 'danger' },
];

export const foraDaEscolaPorEtapa: HBarGroup[] = [
  {
    items: [
      { label: 'Idade do ensino primário', value: 10, display: '≈ 10%', tone: 'warning' },
      { label: 'Idade do 1º ciclo secundário', value: 15, display: '≈ 15%', tone: 'warning' },
      { label: 'Idade do 2º ciclo secundário', value: 31, display: '≈ 31%', tone: 'danger' },
    ],
  },
];

export const conclusaoPorEtapa: HBarGroup[] = [
  {
    title: 'Ensino primário',
    items: [
      { label: '2000', value: 77, display: '77%', tone: 'muted' },
      { label: '2015', value: 84.5, display: '84,5%', tone: 'brandSoft' },
      { label: '2024', value: 88, display: '88%', tone: 'brand' },
    ],
  },
  {
    title: '1º ciclo secundário',
    items: [
      { label: '2000', value: 60, display: '60%', tone: 'muted' },
      { label: '2015', value: 73, display: '73%', tone: 'brandSoft' },
      { label: '2024', value: 78, display: '78%', tone: 'brand' },
    ],
  },
  {
    title: '2º ciclo secundário (ensino médio)',
    items: [
      { label: '2000', value: 37, display: '37%', tone: 'muted' },
      { label: '2015', value: 53, display: '53%', tone: 'brandSoft' },
      { label: '2024', value: 61, display: '61%', tone: 'brand' },
    ],
  },
];

export const alfabetizacao: HBarGroup[] = [
  {
    title: 'Adultos (15 anos ou mais), mundo',
    items: [
      { label: '2015', value: 86, display: '86%', tone: 'muted' },
      { label: '2024', value: 88, display: '88%', tone: 'brand' },
    ],
  },
  {
    title: 'Jovens (15 a 24 anos), mundo',
    items: [
      { label: '2015', value: 91, display: '91%', tone: 'muted' },
      { label: '2024', value: 93, display: '93%', tone: 'brand' },
    ],
  },
  {
    title: 'Adultos, África Subsaariana',
    items: [
      { label: '2015', value: 64, display: '64%', tone: 'muted' },
      { label: '2024', value: 69, display: '69%', tone: 'warning' },
    ],
  },
  {
    title: 'Jovens, África Subsaariana',
    items: [
      { label: '2015', value: 75, display: '75%', tone: 'muted' },
      { label: '2024', value: 79, display: '79%', tone: 'warning' },
    ],
  },
];

export const competenciasDigitais: HBarGroup[] = [
  {
    items: [
      { label: 'Comunicação e colaboração', value: 84, display: '84%' },
      { label: 'Informação e dados', value: 76, display: '76%' },
      { label: 'Resolução de problemas', value: 72, display: '72%' },
      { label: 'Criação de conteúdo digital', value: 59, display: '59%', tone: 'warning' },
      { label: 'Segurança digital', value: 57, display: '57%', tone: 'warning' },
    ],
  },
];

// ── Brasil (IBGE, PNAD Contínua Educação 2025) ────────────────────────────────

export const analfabetismoRegioes: ColumnItem[] = [
  { label: 'Brasil', value: 4.9, display: '4,9%', tone: 'brandSoft' },
  { label: 'Nordeste', value: 10.6, display: '10,6%', tone: 'danger' },
  { label: 'Norte', value: 5.7, display: '5,7%', tone: 'warning' },
  { label: 'Centro-Oeste', value: 3.3, display: '3,3%', tone: 'brand' },
  { label: 'Sul', value: 2.4, display: '2,4%', tone: 'brand' },
  { label: 'Sudeste', value: 2.3, display: '2,3%', tone: 'brand' },
];

export const analfabetismoPerfil: HBarGroup[] = [
  {
    title: 'Por faixa etária',
    items: [
      { label: '15 a 59 anos', value: 2.6, display: '2,6%' },
      { label: '60 anos ou mais', value: 13.8, display: '13,8%', tone: 'danger' },
    ],
  },
  {
    title: 'Por cor ou raça (15 anos ou mais)',
    items: [
      { label: 'Brancos', value: 2.8, display: '2,8%' },
      { label: 'Pretos ou pardos', value: 6.5, display: '6,5%', tone: 'warning' },
    ],
  },
  {
    title: 'Por cor ou raça (60 anos ou mais)',
    items: [
      { label: 'Brancos', value: 7.3, display: '7,3%' },
      { label: 'Pretos ou pardos', value: 20.6, display: '20,6%', tone: 'danger' },
    ],
  },
];

export const medioAdequado: HBarGroup[] = [
  {
    items: [
      { label: 'Total (15 a 17 anos)', value: 80.6, display: '80,6%' },
      { label: 'Mulheres', value: 84.0, display: '84,0%', tone: 'brandSoft' },
      { label: 'Homens', value: 77.4, display: '77,4%', tone: 'warning' },
      { label: 'Brancos', value: 84.9, display: '84,9%', tone: 'brandSoft' },
      { label: 'Pretos ou pardos', value: 77.8, display: '77,8%', tone: 'warning' },
    ],
  },
];

export const motivosAbandono: HBarGroup[] = [
  {
    items: [
      { label: 'Necessidade de trabalhar', value: 43.0, display: '43,0%', tone: 'danger' },
      { label: 'Falta de interesse em estudar', value: 25.6, display: '25,6%', tone: 'warning' },
      { label: 'Gravidez', value: 9.9, display: '9,9%', tone: 'warning' },
      { label: 'Problema de saúde permanente', value: 4.4, display: '4,4%', tone: 'muted' },
      { label: 'Afazeres domésticos ou cuidados', value: 3.9, display: '3,9%', tone: 'muted' },
      { label: 'Sem escola, vaga ou turno na localidade', value: 2.8, display: '2,8%', tone: 'muted' },
    ],
  },
];

// ── Metas ─────────────────────────────────────────────────────────────────────

export interface Meta {
  id: string;
  /** Texto da meta (resumo em português). */
  titulo: string;
  /** Leitura da meta no contexto brasileiro. */
  brasil: string;
  /** Dado recente mais ilustrativo para a meta. */
  dado: string;
  prazo: string;
  grupo: 'resultado' | 'meios';
}

export const metas: Meta[] = [
  {
    id: '4.1', grupo: 'resultado', prazo: '2030',
    titulo: 'Ensino primário e secundário gratuito, equitativo e de qualidade.',
    brasil: 'Ensino fundamental e médio na idade adequada na rede pública.',
    dado: 'Conclusão em 2024: 88% no primário, 78% no 1º ciclo secundário e 61% no 2º ciclo. Só 58% atingiam a proficiência mínima em leitura ao fim do primário (estimativa de 2019).',
  },
  {
    id: '4.2', grupo: 'resultado', prazo: '2030',
    titulo: 'Desenvolvimento na primeira infância e pré-escola.',
    brasil: 'Atendimento integral na educação infantil.',
    dado: 'Participação em aprendizagem organizada um ano antes do ingresso no primário: 74% (2015) e 75% (2024). América Latina e Caribe ficam acima de 90%.',
  },
  {
    id: '4.3', grupo: 'resultado', prazo: '2030',
    titulo: 'Acesso igualitário à educação técnica, profissional e superior.',
    brasil: 'Equidade no acesso e permanência no ensino superior e profissional.',
    dado: 'No Brasil, 24,5% dos jovens de 18 a 24 anos cursavam o ensino superior em 2025, a etapa adequada à idade.',
  },
  {
    id: '4.4', grupo: 'resultado', prazo: '2030',
    titulo: 'Aumento de competências para emprego e empreendedorismo.',
    brasil: 'Desenvolvimento de habilidades técnicas necessárias ao mercado de trabalho.',
    dado: 'Entre usuários de internet, 84% têm ao menos competências básicas de comunicação digital, mas só 57% em segurança digital.',
  },
  {
    id: '4.5', grupo: 'resultado', prazo: '2030',
    titulo: 'Eliminação de disparidades de gênero e inclusão de vulneráveis.',
    brasil: 'Combate a desigualdades de gênero, raça e apoio a grupos historicamente marginalizados.',
    dado: 'No mundo, há 93 mulheres alfabetizadas para cada 100 homens (84 na África Subsaariana e na Ásia Central e do Sul).',
  },
  {
    id: '4.6', grupo: 'resultado', prazo: '2030',
    titulo: 'Alfabetização e suficiência em cálculo para jovens e adultos.',
    brasil: 'Ampliação de competências de leitura, escrita e matemática básica.',
    dado: 'Alfabetização de adultos: 86% (2015) para 88% (2024). De jovens: 91% para 93%. No Brasil, 4,9% das pessoas com 15 anos ou mais eram analfabetas em 2025.',
  },
  {
    id: '4.7', grupo: 'resultado', prazo: '2030',
    titulo: 'Educação voltada para o desenvolvimento sustentável e direitos humanos.',
    brasil: 'Integração da cidadania global e direitos humanos nos currículos escolares.',
    dado: 'O indicador mede o quanto a educação para a cidadania global e para o desenvolvimento sustentável está incorporada às políticas, aos currículos, à formação docente e à avaliação dos estudantes.',
  },
  {
    id: '4.a', grupo: 'meios', prazo: '2030',
    titulo: 'Construção e melhoria de instalações físicas escolares seguras e inclusivas.',
    brasil: 'Garantia de infraestrutura adequada, com acessibilidade, água e saneamento.',
    dado: 'Mais de 1 em cada 5 escolas primárias do mundo não tem eletricidade, água potável ou saneamento básico.',
  },
  {
    id: '4.b', grupo: 'meios', prazo: '2020',
    titulo: 'Expansão de bolsas de estudo para países em desenvolvimento.',
    brasil: 'Ampliação de vagas em programas de intercâmbio e cooperação internacional.',
    dado: 'A ajuda oficial ao desenvolvimento para bolsas somou US$ 1,96 bilhão em 2024, queda de 8,1% sobre 2023, mas ainda acima do nível de 2015.',
  },
  {
    id: '4.c', grupo: 'meios', prazo: '2030',
    titulo: 'Aumento do contingente de professores qualificados.',
    brasil: 'Foco na formação inicial, continuada e valorização salarial docente.',
    dado: 'Entre 18% e 21% dos professores no mundo não atendiam, em 2024, à qualificação mínima exigida em seus países.',
  },
];

// ── Visão geral ───────────────────────────────────────────────────────────────

export const termos = [
  {
    termo: 'Inclusiva',
    texto: 'Ninguém fica de fora: meninas e meninos, zonas rurais e urbanas, pessoas com deficiência, povos indígenas e crianças em situação de vulnerabilidade.',
  },
  {
    termo: 'Equitativa',
    texto: 'Oportunidades justas, com apoio extra a quem parte de condições mais difíceis. Isso exige olhar para renda, território, gênero e raça.',
  },
  {
    termo: 'De qualidade',
    texto: 'Matricular não basta: é preciso aprender. Só 58% atingiam a proficiência mínima em leitura ao fim do ensino primário (estimativa de 2019).',
  },
  {
    termo: 'Ao longo da vida',
    texto: 'Da primeira infância à educação de jovens e adultos e ao ensino superior, incluindo a formação técnica e profissional.',
  },
];

export const linhaDoTempo = [
  {
    ano: '1990',
    titulo: 'Acesso universal ao primário',
    texto: 'A primeira grande agenda global de educação declara a meta de acesso universal ao ensino primário.',
  },
  {
    ano: '2000',
    titulo: 'Conclusão universal do primário',
    texto: 'A ambição sobe: a meta passa a ser a conclusão do ensino primário por todos (período dos ODM, 2000 a 2015).',
  },
  {
    ano: '2015',
    titulo: 'Agenda 2030 e ODS 4',
    texto: 'Entra a meta de conclusão universal do secundário, com foco em qualidade, equidade e aprendizagem ao longo da vida.',
  },
  {
    ano: '2024',
    titulo: '273 milhões fora da escola',
    texto: 'A população fora da escola cresce há sete anos seguidos, embora as taxas de conclusão continuem subindo.',
  },
  {
    ano: '2030',
    titulo: 'Prazo da Agenda',
    texto: 'No ritmo atual, o mundo só chegaria a 95% de conclusão do ensino médio em 2105 (projeção do Relatório GEM 2026).',
  },
];

// ── Desafios e caminhos ───────────────────────────────────────────────────────

export const desafios = [
  {
    id: 'infra',
    titulo: 'Infraestrutura básica',
    texto: 'Mais de 1 em cada 5 escolas primárias no mundo não tem eletricidade, água potável ou saneamento. Nos países menos desenvolvidos, mais da metade das escolas está sem energia e cerca de três em cada quatro não têm computadores nem internet para uso pedagógico.',
  },
  {
    id: 'aprendizado',
    titulo: 'Defasagem de aprendizado',
    texto: 'Só 58% dos estudantes atingiam a proficiência mínima em leitura ao fim do primário (estimativa de 2019). Entre 2018 e 2022, a média da OCDE no PISA caiu 15 pontos em matemática e 10 em leitura.',
  },
  {
    id: 'docentes',
    titulo: 'Valorização docente',
    texto: 'Cerca de 20% dos professores no mundo não atendem à qualificação mínima exigida em seus países, e o quadro mudou pouco desde 2015. Falta de candidatos, condições de trabalho difíceis e financiamento limitado pesam na formação e na permanência.',
  },
  {
    id: 'equidade',
    titulo: 'Desigualdade de conclusão',
    texto: 'Em mais de 90% dos países com dados, há disparidade na conclusão do 1º ciclo secundário entre crianças de famílias ricas e pobres. Em mais de seis em cada dez, há diferença entre áreas rurais e urbanas.',
  },
];

export const estrategias = [
  {
    num: '1',
    titulo: 'Priorização orçamentária',
    texto: 'Tratar o financiamento da educação como investimento estratégico de longo prazo, com recursos direcionados a quem está mais distante da meta.',
  },
  {
    num: '2',
    titulo: 'Formação continuada',
    texto: 'Ampliar a capacidade de formação de professores, melhorar as condições de trabalho e criar incentivos para recrutar e manter docentes qualificados.',
  },
  {
    num: '3',
    titulo: 'Inclusão e diversidade',
    texto: 'Criar políticas ativas de permanência para meninas, povos indígenas, quilombolas, pessoas com deficiência e estudantes de áreas rurais.',
  },
  {
    num: '4',
    titulo: 'Metas nacionais e dados desagregados',
    texto: 'Definir metas nacionais compatíveis com a Agenda 2030 e acompanhá-las com dados por sexo, local de moradia, renda, cor ou raça e deficiência.',
  },
  {
    num: '5',
    titulo: 'Reduzir barreiras de demanda e de oferta',
    texto: 'Combinar transferências de renda, bolsas, material escolar, alimentação e saúde com a expansão da rede pública e do ensino aberto e a distância.',
  },
];
