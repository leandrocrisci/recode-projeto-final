// ─────────────────────────────────────────────────────────────────────────────
// Textos da página "Agradecimentos". Para personalizar, edite este arquivo:
// o nome do autor, a carta de agradecimento e os pontos de cada módulo.
// ─────────────────────────────────────────────────────────────────────────────

/** Nome exibido na assinatura da carta. Deixe vazio para assinar só com "Projeto Final · Turma 2". */
export const AUTOR = '';

export const RECODE_URL = 'https://trilhas.recode.org.br/';

export const CURSO = {
  inicio: 'Junho de 2026',
  formato: 'Aulas noturnas, de segunda a quinta',
};

// ── O sistema ─────────────────────────────────────────────────────────────────

export const resumoSistema = {
  nome: 'Portal de Suprimentos ODS 4',
  descricao:
    'Sistema B2B de gestão educacional e venda de materiais escolares, alinhado ao Objetivo de Desenvolvimento Sustentável 4 (Educação de Qualidade) da Agenda 2030. Reúne cadastros, avaliações, indicadores socioespaciais e um catálogo de suprimentos, com uma API REST em Java e uma interface em React.',
};

export interface Recurso {
  id: 'cadastros' | 'avaliacoes' | 'mapa' | 'suprimentos' | 'auditoria' | 'experiencia';
  titulo: string;
  texto: string;
}

export const recursos: Recurso[] = [
  {
    id: 'cadastros',
    titulo: 'Cadastros',
    texto: 'Escolas, cursos, alunos, professores e endereços, com busca de endereço pelo CEP (ViaCEP) e cadastro de escola em duas etapas.',
  },
  {
    id: 'avaliacoes',
    titulo: 'Avaliações',
    texto: 'Notas de 0 a 10 para os cursos e de 1 a 5 para a qualidade de cada escola, com data e observações.',
  },
  {
    id: 'mapa',
    titulo: 'Mapa e indicadores',
    texto: 'Dashboard com Google Maps: raio de deslocamento dos alunos, zona rural e urbana, transporte escolar, tempo de trajeto e nota de qualidade.',
  },
  {
    id: 'suprimentos',
    titulo: 'Suprimentos',
    texto: 'Catálogo de produtos em vitrine e em estoque, e pedidos ligados a uma escola, a um produto e a um professor.',
  },
  {
    id: 'auditoria',
    titulo: 'Relatórios e auditoria',
    texto: 'Relatório gerencial socioespacial e uma Central de Eventos que registra as chamadas à API em tempo real, com latência e payload.',
  },
  {
    id: 'experiencia',
    titulo: 'Experiência de uso',
    texto: 'Perfis de usuário e administrador, modo claro e escuro, página do ODS 4 com dados oficiais e documentação técnica integrada.',
  },
];

// ── Arquitetura ───────────────────────────────────────────────────────────────

export const fluxo = [
  { titulo: 'Navegador', detalhe: 'React 19, TypeScript e Fluent UI v9' },
  { titulo: 'Cliente HTTP', detalhe: 'Axios em /api, com registro na Central de Eventos' },
  { titulo: 'API REST', detalhe: 'Spring Boot 3.3: Controller, Service e Repository' },
  { titulo: 'Banco de dados', detalhe: 'PostgreSQL com Spring Data JPA e Hibernate' },
];

export const integracoes = ['Google Maps JavaScript API', 'ViaCEP', 'Google Sheets (importação opcional)'];

// ── Tecnologias ───────────────────────────────────────────────────────────────

export const resumoExecutivoN8n =
  'O n8n é uma plataforma de automação de fluxos de trabalho que conecta aplicações e serviços por meio de integrações visuais e APIs. Hospedado em Docker, pode ser executado sob controle da própria infraestrutura e, neste projeto, representa uma possibilidade de integrar e automatizar processos entre o portal, sua API e outros serviços, sem substituir a lógica central do sistema.';

export interface Tecnologia {
  nome: string;
  papel: string;
}

export interface GrupoTecnologias {
  titulo: string;
  itens: Tecnologia[];
}

export const tecnologias: GrupoTecnologias[] = [
  {
    titulo: 'Backend',
    itens: [
      { nome: 'Java 21', papel: 'Linguagem do servidor' },
      { nome: 'Spring Boot 3.3', papel: 'API REST, injeção de dependência e configuração' },
      { nome: 'Spring Data JPA', papel: 'Repositórios com consultas derivadas, sem SQL manual' },
      { nome: 'Hibernate 6.5', papel: 'Mapeamento objeto-relacional das entidades' },
      { nome: 'PostgreSQL', papel: 'Banco de dados relacional' },
      { nome: 'Maven', papel: 'Build e gerenciamento de dependências' },
    ],
  },
  {
    titulo: 'Frontend',
    itens: [
      { nome: 'React 19 e TypeScript', papel: 'Componentes, estado e tipagem' },
      { nome: 'Fluent UI v9', papel: 'Design system da Microsoft (componentes, tokens e ícones)' },
      { nome: 'Griffel (makeStyles)', papel: 'Estilos em CSS-in-JS com tema claro e escuro' },
      { nome: 'Vite 8', papel: 'Servidor de desenvolvimento e build' },
      { nome: 'React Router 7', papel: 'Navegação entre as telas' },
      { nome: 'Axios', papel: 'Consumo da API REST e interceptores de log' },
    ],
  },
  {
    titulo: 'Integrações',
    itens: [
      { nome: 'Google Maps JavaScript API', papel: 'Mapa interativo das escolas, marcadores e raio de deslocamento' },
      { nome: 'ViaCEP', papel: 'Preenchimento de endereço a partir do CEP' },
      { nome: 'Google Sheets', papel: 'Importação opcional de produtos a partir de planilha' },
    ],
  },
  {
    titulo: 'Automação',
    itens: [
      { nome: 'n8n', papel: 'Automação visual de fluxos e integração entre aplicações e APIs; pode ser hospedado em Docker' },
    ],
  },
  {
    titulo: 'Ferramentas',
    itens: [
      { nome: 'Git', papel: 'Versionamento e histórico do código' },
      { nome: 'VS Code', papel: 'Editor das aulas de Python e do projeto, com extensões para Java, Spring e React' },
      { nome: 'Eclipse', papel: 'IDE usada nas aulas de Java' },
      { nome: 'MySQL Workbench', papel: 'SQL do treinamento e primeiras versões do banco, antes da migração para PostgreSQL' },
      { nome: 'Postman, Insomnia e curl', papel: 'Testes dos endpoints da API' },
      { nome: 'Draw.io', papel: 'Diagramas de arquitetura, ER e UML da documentação' },
    ],
  },
  {
    titulo: 'Certificação',
    itens: [
      {
        nome: 'Microsoft® Certified Technology Specialist: BizTalk Server 2006, Custom Applications',
        papel: 'Certificação em desenvolvimento de aplicações personalizadas com Microsoft BizTalk Server 2006',
      },
    ],
  },
];

// ── Jornada no curso ──────────────────────────────────────────────────────────

export interface ModuloCurso {
  modulo: string;
  titulo: string;
  topicos: string[];
  noProjeto: string[];
}

export const jornada: ModuloCurso[] = [
  {
    modulo: 'Módulo 1',
    titulo: 'Iniciação à Computação, Programação e Front-end',
    topicos: ['Lógica de Programação', 'JavaScript', 'Versionamento com Git', 'HTML e CSS', 'Python e Orientação a Objetos (VS Code)'],
    noProjeto: [
      'Lógica de programação nos cálculos dos indicadores de cada escola: médias, percentuais e agrupamentos.',
      'HTML, CSS e JavaScript como base de tudo o que roda no navegador, da estrutura semântica às interações.',
      'Git para registrar a evolução do código e proteger segredos fora do repositório.',
    ],
  },
  {
    modulo: 'Módulo 2',
    titulo: 'Banco de Dados, ETL e Machine Learning',
    topicos: ['Pandas', 'Machine Learning', 'Banco de Dados e SQL', 'NoSQL (MongoDB)', 'Linux', 'Computação em Nuvem', 'Containers e Docker'],
    noProjeto: [
      'SQL e modelagem relacional, praticados no MySQL Workbench no treinamento: entidades, chaves estrangeiras e script de criação do banco.',
      'ETL na prática: o projeto nasceu em MySQL e foi migrado para o PostgreSQL com pgloader, além da importação opcional de planilhas.',
      'Dados em indicadores: o mesmo raciocínio de limpar, cruzar e agregar registros que se aprende com Pandas.',
      'Próximo passo: levar o sistema para a nuvem, em contêineres.',
    ],
  },
  {
    modulo: 'Módulo 3',
    titulo: 'Desenvolvimento de Sistemas III: Frontend e Backend Avançado',
    topicos: [
      'JavaScript ES6+',
      'React e API REST',
      'Java e Orientação a Objetos',
      'Acesso a dados (JDBC)',
      'Java Web com Spring',
      'Angular e API REST',
    ],
    noProjeto: [
      'JavaScript ES6+ por todo o front: arrow functions, template strings, módulos e async/await.',
      'React com componentes, estado e props, consumindo a API REST com Axios.',
      'Orientação a objetos em Java, praticada no Eclipse: entidades, encapsulamento e a separação em Controller, Service e Repository.',
      'Do JDBC ao Spring Data JPA, com injeção de dependência e transações no Spring Boot.',
      'Angular como contraste: componentes e serviços de API são ideias que React e Angular compartilham.',
    ],
  },
];

export const sinteseProjeto =
  'O projeto final reúne o caminho inteiro: a lógica e o HTML do primeiro módulo, o banco de dados e os dados do segundo, e a API em Spring com a interface em React do terceiro.';

// ── Carta de agradecimento ────────────────────────────────────────────────────

export const AGRADECIMENTO = {
  titulo: 'Obrigado, Recode',
  paragrafos: [
    'Chegar ao projeto final é a soma de muitos passos: lógica de programação, HTML, CSS, JavaScript, Git, Python, bancos de dados, Linux, nuvem, Docker, Java, Spring e React. Foram noites de segunda a quinta, desde junho de 2026, e cada módulo abriu uma porta. Este sistema só existe porque alguém me mostrou como atravessá-la.',
    'A Recode acredita que a tecnologia pode recodificar vidas, e eu senti isso na prática: ela abre caminhos de desenvolvimento, de empregabilidade, de retorno aos estudos e de empreendedorismo. Construir um sistema que olha para a educação de qualidade, o ODS 4, é a minha forma de devolver um pouco do que recebi.',
    'Agradeço a toda a equipe da Recode, aos professores e monitores que tiraram dúvidas e não deixaram ninguém para trás, aos colegas da Turma 2 pela parceria nos desafios, e a quem trabalha nos bastidores para manter a plataforma, os materiais e as avaliações de pé.',
    'Este projeto é um ponto de chegada e, principalmente, um ponto de partida. Obrigado por recodificar a minha trajetória.',
  ],
};
