// Conteúdo do Manual do Sistema. Para atualizar textos ou rotas, edite só este arquivo.
// As rotas seguem o menu lateral (Sidebar.tsx).

export interface Cadastro {
  id: string;
  titulo: string;
  texto: string;
  pergunta: string;
  rota: string;
}

export interface Avaliacao {
  id: string;
  titulo: string;
  escala: string;
  texto: string;
  rota: string;
}

export interface Perfil {
  id: string;
  titulo: string;
  texto: string;
  pode: string[];
}

export interface Passo {
  num: number;
  titulo: string;
  texto: string;
  dica?: string;
  rota: string;
  acao: string;
}

export interface Tela {
  id: string;
  nome: string;
  rota: string;
  para: string;
  uso: string[];
}

export interface GrupoTelas {
  titulo: string;
  texto: string;
  telas: Tela[];
}

export interface Leitura {
  titulo: string;
  texto: string;
}

export interface Duvida {
  pergunta: string;
  resposta: string;
}

export const resumoExecutivo =
  'O Recode — Avaliação Escolas reúne, em um só lugar, o cadastro das escolas e de tudo o que gira em torno delas: ' +
  'endereço, cursos, professores e o perfil de deslocamento dos alunos. Com essa base, o sistema registra a avaliação ' +
  'de qualidade de cada escola e de cada curso. O resultado é um controle de avaliação que gestores, pais e ' +
  'responsáveis podem acompanhar no mapa e nos relatórios.';

export const cadastros: Cadastro[] = [
  {
    id: 'escolas',
    titulo: 'Escolas',
    texto: 'Identifica cada unidade de ensino: nome, dependência administrativa (Pública, Estadual, Municipal, Técnica, Privada ou Federal), telefone e e-mail.',
    pergunta: 'Quais escolas existem e de que tipo são?',
    rota: '/escolas',
  },
  {
    id: 'enderecos',
    titulo: 'Endereços',
    texto: 'Localiza a escola com CEP, logradouro, número, bairro, cidade e UF. É o dado que permite ver a escola no mapa.',
    pergunta: 'Onde cada escola fica?',
    rota: '/enderecos',
  },
  {
    id: 'cursos',
    titulo: 'Cursos',
    texto: 'Registra o que cada escola oferece, com descrição e carga horária.',
    pergunta: 'O que cada escola ensina e em quantas horas?',
    rota: '/cursos',
  },
  {
    id: 'professores',
    titulo: 'Professores',
    texto: 'Reúne o corpo docente de cada escola, com especialidade, contatos e uma pequena biografia.',
    pergunta: 'Quem leciona em cada escola?',
    rota: '/professores',
  },
  {
    id: 'alunos',
    titulo: 'Perfil dos alunos',
    texto: 'Guarda apenas indicadores, sem nome: área residencial (urbana ou rural), distância, meio de transporte e tempo de trajeto, ligados a uma escola e a um curso.',
    pergunta: 'Como os alunos chegam à escola e quanto tempo levam?',
    rota: '/alunos',
  },
];

export const avaliacoes: Avaliacao[] = [
  {
    id: 'av-qualidade',
    titulo: 'Avaliação de qualidade da escola',
    escala: 'Nota de 1 a 5 estrelas',
    texto: 'Cada avaliação traz a nota, a data e um comentário. As notas de uma escola formam a média de qualidade exibida no dashboard.',
    rota: '/av-qualidade',
  },
  {
    id: 'av-cursos',
    titulo: 'Avaliação dos cursos',
    escala: 'Nota de 0 a 10',
    texto: 'Cada avaliação traz a nota, a data e uma observação. Permite comparar os cursos entre as escolas.',
    rota: '/av-cursos',
  },
];

export const paraPaisEResponsaveis: string[] = [
  'Ver como a escola do filho é avaliada e comparar com as demais.',
  'Conhecer os cursos oferecidos e a carga horária de cada um.',
  'Saber onde a escola fica e quanto tempo os alunos costumam levar para chegar até ela.',
  'Acompanhar a evolução das notas ao longo do tempo, pelas datas das avaliações.',
];

export const perfis: Perfil[] = [
  {
    id: 'admin',
    titulo: 'Administrador',
    texto: 'Quem mantém os dados do sistema.',
    pode: [
      'Cadastrar, editar e excluir escolas, endereços, cursos, professores, alunos e avaliações.',
      'Gerenciar o catálogo de produtos e os pedidos.',
      'Consultar o dashboard, o relatório gerencial e a Central de Eventos.',
    ],
  },
  {
    id: 'consulta',
    titulo: 'Consulta: gestores, pais e responsáveis',
    texto: 'Quem acompanha os resultados.',
    pode: [
      'Consultar todas as telas, o mapa, as avaliações e o relatório gerencial.',
      'Pesquisar e ordenar as tabelas.',
      'Não vê os botões de cadastrar, editar e excluir: eles aparecem só para o administrador.',
    ],
  },
];

export const passos: Passo[] = [
  {
    num: 1,
    titulo: 'Cadastre a escola',
    texto: 'Em Escolas, clique em Nova Escola. A janela tem duas etapas: dados gerais (nome, dependência administrativa, telefone e e-mail) e endereço.',
    dica: 'Sem pressa para o endereço: o botão Definir depois salva a escola e você completa em Endereços.',
    rota: '/escolas',
    acao: 'Abrir Escolas',
  },
  {
    num: 2,
    titulo: 'Complete o endereço',
    texto: 'Em Endereços, escolha a escola e preencha CEP, logradouro, número, bairro, cidade e UF.',
    dica: 'Escola sem endereço tende a ficar fora do mapa do dashboard.',
    rota: '/enderecos',
    acao: 'Abrir Endereços',
  },
  {
    num: 3,
    titulo: 'Cadastre os cursos',
    texto: 'Em Cursos, clique em Novo Curso e informe nome, escola, carga horária e descrição.',
    rota: '/cursos',
    acao: 'Abrir Cursos',
  },
  {
    num: 4,
    titulo: 'Cadastre os professores',
    texto: 'Em Professores, informe nome e escola. Especialidade, e-mail, telefone e biografia são opcionais.',
    rota: '/professores',
    acao: 'Abrir Professores',
  },
  {
    num: 5,
    titulo: 'Registre o perfil dos alunos',
    texto: 'Em Alunos, informe área residencial, distância até a escola (km), meio de transporte, tempo de trajeto (minutos), escola e curso.',
    dica: 'Não existe campo de nome: o sistema guarda só indicadores, para proteger a privacidade.',
    rota: '/alunos',
    acao: 'Abrir Alunos',
  },
  {
    num: 6,
    titulo: 'Registre as avaliações',
    texto: 'Em Aval. Qualidade, dê uma nota de 1 a 5 para a escola. Em Aval. Cursos, dê uma nota de 0 a 10 para o curso. Data e comentário são opcionais.',
    rota: '/av-qualidade',
    acao: 'Abrir Aval. Qualidade',
  },
  {
    num: 7,
    titulo: 'Acompanhe os resultados',
    texto: 'No Dashboard, veja o mapa e os totais. No Relatório Gerencial, filtre por escola ou dependência e alterne entre as abas Avaliação por Região, Avaliação dos Cursos e Escolas.',
    rota: '/',
    acao: 'Abrir o Dashboard',
  },
];

export const ordemImporta =
  'A ordem importa: a escola vem primeiro, porque endereços, cursos, professores e alunos são sempre ligados a uma escola, e o aluno também precisa de um curso.';

export const gruposTelas: GrupoTelas[] = [
  {
    titulo: 'Acompanhar',
    texto: 'Para quem quer ver os resultados.',
    telas: [
      {
        id: 'dashboard',
        nome: 'Dashboard',
        rota: '/',
        para: 'Visão geral das escolas em um mapa.',
        uso: [
          'Veja os totais de escolas, alunos, nota média de qualidade e alunos em zona rural.',
          'Clique em um marcador do mapa, ou em uma escola da lista lateral, para ver os indicadores dela. A busca aceita nome da escola ou endereço.',
        ],
      },
      {
        id: 'relatorio',
        nome: 'Relatório Gerencial',
        rota: '/progressos',
        para: 'Painel analítico para comparar escolas, regiões e cursos.',
        uso: [
          'Filtre por escola ou por dependência administrativa.',
          'Alterne entre as abas Avaliação por Região, Avaliação dos Cursos e Escolas.',
        ],
      },
      {
        id: 'ods4',
        nome: 'ODS 4',
        rota: '/ods4',
        para: 'Contexto da educação de qualidade.',
        uso: ['Explica o objetivo da ONU, com dados do mundo e do Brasil, e mostra como os indicadores do sistema se ligam às metas.'],
      },
    ],
  },
  {
    titulo: 'Cadastros',
    texto: 'Para quem mantém a base de dados.',
    telas: [
      {
        id: 'escolas',
        nome: 'Escolas',
        rota: '/escolas',
        para: 'Cadastro das unidades de ensino.',
        uso: [
          'Nova Escola abre duas etapas: dados gerais e endereço.',
          'Clique no título de uma coluna para ordenar a tabela.',
        ],
      },
      {
        id: 'enderecos',
        nome: 'Endereços',
        rota: '/enderecos',
        para: 'Localização de cada escola.',
        uso: ['Escolha a escola e preencha CEP, logradouro, número, bairro, cidade e UF.'],
      },
      {
        id: 'cursos',
        nome: 'Cursos',
        rota: '/cursos',
        para: 'O que cada escola oferece.',
        uso: ['Informe nome, escola, carga horária e descrição.'],
      },
      {
        id: 'alunos',
        nome: 'Alunos',
        rota: '/alunos',
        para: 'Perfil de deslocamento, sem identificar o aluno.',
        uso: ['Registre área, distância, transporte, tempo de trajeto, escola e curso.'],
      },
      {
        id: 'professores',
        nome: 'Professores',
        rota: '/professores',
        para: 'Corpo docente de cada escola.',
        uso: ['Informe nome e escola; o restante é opcional.'],
      },
    ],
  },
  {
    titulo: 'Avaliações',
    texto: 'Para registrar e consultar as notas.',
    telas: [
      {
        id: 'av-qualidade',
        nome: 'Aval. Qualidade',
        rota: '/av-qualidade',
        para: 'Nota de qualidade de cada escola.',
        uso: ['Escolha a escola e dê uma nota de 1 a 5 estrelas, com data e comentário opcionais.'],
      },
      {
        id: 'av-cursos',
        nome: 'Aval. Cursos',
        rota: '/av-cursos',
        para: 'Nota de cada curso.',
        uso: ['Escolha o curso e dê uma nota de 0 a 10, com data e observação opcionais.'],
      },
    ],
  },
  {
    titulo: 'Suprimentos (módulo de estudo)',
    texto: 'Simula um pequeno comércio eletrônico de materiais escolares.',
    telas: [
      {
        id: 'produtos',
        nome: 'Produtos',
        rota: '/produtos',
        para: 'Catálogo de materiais escolares.',
        uso: [
          'A vitrine mostra os materiais; use Solicitar para pedir um produto.',
          'O administrador alterna para a tabela de estoque e cadastra produtos.',
        ],
      },
      {
        id: 'pedidos',
        nome: 'Pedidos',
        rota: '/pedidos',
        para: 'Compras feitas pelas escolas.',
        uso: [
          'Use a busca e o filtro de status. Um pedido liga uma escola compradora, um produto e um professor vendedor.',
          'Status possíveis: processando, enviado, entregue ou cancelado.',
        ],
      },
    ],
  },
  {
    titulo: 'Ferramentas e projeto',
    texto: 'Apoio técnico e documentação.',
    telas: [
      {
        id: 'eventos',
        nome: 'Central de Eventos',
        rota: '/eventos',
        para: 'Registro das chamadas à API e do console do navegador.',
        uso: ['Filtre por nível ou texto, abra um evento para ver o detalhe técnico e exporte tudo em JSON.'],
      },
      {
        id: 'n8n',
        nome: 'N8N',
        rota: '/n8n',
        para: 'Geração automática de escolas de teste com inteligência artificial.',
        uso: ['Confira a URL do webhook e execute o workflow; o desenho mostra cada etapa enquanto roda.'],
      },
      {
        id: 'docs',
        nome: 'Documentação',
        rota: '/docs',
        para: 'Documentação técnica do projeto.',
        uso: ['Banco de dados, diagramas UML, endpoints, plano de testes e guias de instalação.'],
      },
    ],
  },
];

export const leituras: Leitura[] = [
  {
    titulo: 'Nota de qualidade da escola',
    texto: 'Vai de 1 a 5 estrelas. No dashboard, a nota média de cada escola é a média das avaliações recebidas.',
  },
  {
    titulo: 'Nota do curso',
    texto: 'Vai de 0 a 10. Na tela de avaliações, aparece em verde a partir de 7, em amarelo de 5 a menos de 7 e em vermelho abaixo de 5.',
  },
  {
    titulo: 'Distância e tempo de trajeto',
    texto: 'Quanto maiores, mais difícil é chegar à escola. Compare também a área residencial (urbana ou rural) e o meio de transporte.',
  },
  {
    titulo: 'Status do pedido',
    texto: 'Processando: recebido. Enviado: a caminho. Entregue: concluído. Cancelado: encerrado sem entrega.',
  },
];

export const duvidas: Duvida[] = [
  {
    pergunta: 'Não vejo os botões Novo, Editar e Excluir. O que houve?',
    resposta: 'Seu acesso é de consulta. Esses botões aparecem só para o administrador.',
  },
  {
    pergunta: 'A tela demorou muito ou mostrou erro ao carregar.',
    resposta: 'O servidor da versão de estudo dorme quando fica parado. Aguarde cerca de 1 minuto e atualize a página. Se o erro continuar, a Central de Eventos mostra o detalhe técnico.',
  },
  {
    pergunta: 'Uma escola não aparece no mapa.',
    resposta: 'Provavelmente falta o endereço. Complete em Endereços.',
  },
  {
    pergunta: 'Não consigo excluir uma escola.',
    resposta: 'Ela provavelmente tem registros ligados a ela, como endereço, cursos, professores, alunos ou pedidos. Remova esses registros antes.',
  },
  {
    pergunta: 'Posso registrar o nome do aluno?',
    resposta: 'Não. O sistema guarda só indicadores de deslocamento, por privacidade.',
  },
  {
    pergunta: 'Para que serve a tela N8N?',
    resposta: 'Para gerar escolas completas de teste com inteligência artificial, sem digitar cada cadastro. É útil para demonstrar o sistema com dados.',
  },
];
