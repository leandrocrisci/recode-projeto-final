// Tipos centrais compartilhados entre todas as páginas

export interface Escola {
  id: number;
  nome: string;
  tipo: string;
  telefone?: string;
  email?: string;
}

export interface Curso {
  id: number;
  nome: string;
  descricao?: string;
  cargaHoraria?: number;
  escola?: Escola;
}

export interface Aluno {
  id: number;
  nome: string;
  area?: 'urbana' | 'rural';
  distanciaEscola?: number;
  tipoTransporte?: 'a_pe' | 'transporte_escolar' | 'transporte_publico' | 'proprio';
  tempoDeslocamentoMinutos?: number;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  escolaId?: number;
  curso?: Curso;
  escola?: Escola;
}

export interface Professor {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  especialidade?: string;
  biografia?: string;
  escola?: Escola;
}

export interface Pedido {
  id: number;
  escola?: Escola;
  produto?: Produto;
  professor?: Professor;
  quantidade: number;
  valorUnitario: number;
  dataPedido?: string;
  statusPedido: 'processando' | 'enviado' | 'entregue' | 'cancelado';
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  icone?: string; // <-- Inclua esta linha no seu arquivo de tipos TypeScript
}


export interface AvaliacaoAluno {
  id: number;
  nota: number;
  observacao?: string;
  dataAvaliacao?: string;
  aluno?: Aluno;
  curso?: Curso;
}

export interface AvaliacaoCurso {
  id: number;
  nota: number;
  observacao?: string;
  dataAvaliacao?: string;
  curso?: Curso;
}

export interface AvaliacaoQualidade {
  id: number;
  nota: number;
  comentario?: string;
  dataAvaliacao?: string;
  escola?: Escola;
}

export interface EnderecoEscola {
  id: number;
  logradouro: string;
  numero?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
  tipoLocalizacao?: 'urbana' | 'rural';
  latitude?: number | string | null;
  longitude?: number | string | null;
  formattedAddress?: string;
  escolaId?: number;
  escola?: Escola;
}

export interface EnderecoAluno {
  id: number;
  logradouro: string;
  numero?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
  aluno?: Aluno;
}

export interface ProgressoAluno {
  id: number;
  percentualConclusao: number;
  dataAtualizacao?: string;
  aluno?: Aluno;
  curso?: Curso;
}

export type UserRole = 'admin' | 'user';
