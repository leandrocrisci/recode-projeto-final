import { useState } from 'react';
import {
  makeStyles, tokens,
  Text, Title1, Title2, Title3, Body1, Caption1,
  Card, CardHeader, Divider, Badge, Button,
  Tab, TabList,
  type SelectTabData,
  mergeClasses,
} from '@fluentui/react-components';
import {
  DocumentBulletList24Regular,
  Database24Regular,
  CodeBlock24Regular,
  ShareAndroid24Regular,
  ClipboardTaskAdd24Regular,
  BookOpen24Regular,
  Flash24Regular,
  Lightbulb24Regular,
  PuzzlePiece24Regular,
  Sparkle24Regular,
  CheckmarkCircle16Regular,
  Warning16Regular,
  Info16Regular,
} from '@fluentui/react-icons';
import iaMarkdown from '../assets/IA.md?raw';

// ─── Estilos ────────────────────────────────────────────────────────────────

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

  // Hero (mesmo padrão das páginas ODS 4, Início e Agradecimentos)
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
  panel: { display: 'flex', flexDirection: 'column', gap: '20px' },
  tab: { paddingLeft: '8px', paddingRight: '8px' },
  tabsWrap: { overflowX: 'auto', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
  tabContent: {
    paddingTop: '0px', // o espaçamento vem do gap da página
    display: 'flex', flexDirection: 'column', gap: '28px',
  },
  section: { display: 'flex', flexDirection: 'column', gap: '12px' },
  cardGrid2: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
    '@media (max-width: 640px)': { gridTemplateColumns: '1fr' },
  },
  cardGrid3: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px',
    '@media (max-width: 700px)': { gridTemplateColumns: '1fr' },
  },
  codeBlock: {
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px',
    overflowX: 'auto',
    whiteSpace: 'pre',
    lineHeight: '1.6',
    color: tokens.colorNeutralForeground1,
  },
  // Comandos dentro dos passos: quebram a linha em vez de criar rolagem lateral
  codeWrap: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', overflowX: 'visible' },
  inlineCode: {
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusSmall,
    padding: '1px 6px',
    color: tokens.colorBrandForeground1,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '13px',
  },
  th: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '8px 12px',
    textAlign: 'left' as const,
    fontWeight: '600',
    borderBottom: `2px solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForeground1,
  },
  td: {
    padding: '8px 12px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    color: tokens.colorNeutralForeground2,
    verticalAlign: 'top' as const,
  },
  trAlt: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  erBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    border: `2px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: '160px',
  },
  erBoxHeader: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    padding: '4px 8px',
    borderRadius: tokens.borderRadiusSmall,
    fontWeight: '700',
    fontSize: '13px',
    textAlign: 'center' as const,
    marginBottom: '4px',
  },
  erField: {
    fontSize: '11px',
    fontFamily: 'Consolas, monospace',
    padding: '2px 4px',
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
  },
  erPk: { color: tokens.colorStatusWarningForeground1, fontWeight: '700' },
  erFk: { color: tokens.colorBrandForeground1 },
  erDiagram: {
    overflowX: 'auto',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  diagramFrame: {
    width: '100%',
    overflowX: 'auto',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  diagramImage: {
    display: 'block',
    width: '100%',
    minWidth: '680px',
    height: 'auto',
  },
  diagramSource: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '8px 12px',
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorNeutralBackground2,
    textDecorationLine: 'none',
    fontWeight: '600',
  },
  erRow: { display: 'flex', gap: '24px', flexWrap: 'wrap' as const, justifyContent: 'center' },
  archLayer: {
    display: 'flex', flexDirection: 'column', gap: '8px',
    padding: '16px', borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  archLayerTitle: {
    fontWeight: '700', fontSize: '13px', color: tokens.colorBrandForeground1,
    textTransform: 'uppercase' as const, letterSpacing: '0.8px',
  },
  archChip: {
    display: 'inline-flex', gap: '6px', alignItems: 'center',
    padding: '4px 10px', borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground3,
    fontSize: '12px', color: tokens.colorNeutralForeground1,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  archChipRow: { display: 'flex', flexWrap: 'wrap' as const, gap: '6px' },
  badge: { marginRight: '4px' },
  stepRow: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    padding: '12px', borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  stepNum: {
    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px',
  },
  endpointRow: {
    display: 'flex', gap: '10px', alignItems: 'flex-start',
    padding: '8px 12px', borderRadius: tokens.borderRadiusSmall,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  method: {
    fontFamily: 'Consolas, monospace', fontWeight: '700',
    fontSize: '11px', padding: '2px 8px',
    borderRadius: tokens.borderRadiusSmall, width: '50px',
    textAlign: 'center' as const, flexShrink: 0,
  },
  get: { backgroundColor: tokens.colorStatusSuccessBackground1, color: tokens.colorStatusSuccessForeground1 },
  post: { backgroundColor: tokens.colorBrandBackground2, color: tokens.colorBrandForeground1 },
  put: { backgroundColor: tokens.colorStatusWarningBackground1, color: tokens.colorStatusWarningForeground1 },
  del: { backgroundColor: tokens.colorStatusDangerBackground1, color: tokens.colorStatusDangerForeground1 },
  pluginCard: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    padding: '16px', borderRadius: tokens.borderRadiusMedium,
    border: `2px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground2,
  },
  pluginIcon: {
    width: '48px', height: '48px', borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', flexShrink: 0,
  },
  noteBox: {
    overflowWrap: 'anywhere',
    padding: '12px 16px', borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorStatusWarningBorder1}`,
    backgroundColor: tokens.colorStatusWarningBackground1,
    display: 'flex', gap: '8px',
  },
  infoBox: {
    overflowWrap: 'anywhere',
    padding: '12px 16px', borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorStatusSuccessBorder1}`,
    backgroundColor: tokens.colorStatusSuccessBackground1,
    display: 'flex', gap: '8px',
  },
  // Texto só para leitores de tela: invisível na tela, mas lido em voz alta
  srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 },
});

// ─── Dados ───────────────────────────────────────────────────────────────────

const tabelas = [
  { nome: 'escolas', pk: 'id', campos: ['nome VARCHAR(255) NOT NULL', 'tipo VARCHAR(255) NOT NULL', 'telefone VARCHAR(255)', 'email VARCHAR(255)'], fks: [] },
  { nome: 'enderecosescolas', pk: 'id', campos: ['logradouro VARCHAR(255) NOT NULL', 'numero VARCHAR(255)', 'bairro VARCHAR(255)', 'cidade VARCHAR(255) NOT NULL', 'estado VARCHAR(2) NOT NULL', 'cep VARCHAR(9)'], fks: ['escolaid → escolas.id'] },
  { nome: 'cursos', pk: 'id', campos: ['nome VARCHAR(255) NOT NULL', 'descricao VARCHAR(1000)', 'cargahoraria INT', 'nivelensino ENUM'], fks: ['escolaid → escolas.id'] },
  { nome: 'alunos', pk: 'id', campos: ['nome VARCHAR(255) NOT NULL', 'email VARCHAR(255)', 'telefone VARCHAR(255)', 'datanascimento DATE'], fks: ['cursoid → cursos.id', 'escolaid → escolas.id'] },
  { nome: 'professores', pk: 'id', campos: ['nome VARCHAR(255) NOT NULL', 'email VARCHAR(255)', 'telefone VARCHAR(255)', 'especialidade VARCHAR(255)', 'biografia VARCHAR(1000)'], fks: ['escolaid → escolas.id'] },
  { nome: 'matriculas', pk: 'id', campos: ['datamatricula DATETIME NOT NULL', 'valorpago DECIMAL(10,2) NOT NULL', 'statuspagamento ENUM(pago/pendente/cancelado)'], fks: ['alunoid → alunos.id', 'cursoid → cursos.id'] },
  { nome: 'produtos', pk: 'id', campos: ['nome VARCHAR(255) NOT NULL', 'descricao VARCHAR(500)', 'preco DECIMAL(10,2) NOT NULL', 'quantidade INT NOT NULL'], fks: [] },
  { nome: 'pedidos', pk: 'id', campos: ['quantidade INT NOT NULL', 'valorunitario DECIMAL(10,2) NOT NULL', 'valortotal DECIMAL GENERATED', 'datapedido DATETIME NOT NULL', 'statuspedido ENUM'], fks: ['escolaid → escolas.id', 'produtoid → produtos.id', 'professorid → professores.id'] },
  { nome: 'progressosalunos', pk: 'id', campos: ['percentualconclusao INT (0-100)', 'dataatualizacao DATETIME'], fks: ['alunoid → alunos.id', 'cursoid → cursos.id'] },
  { nome: 'avaliacoescursos', pk: 'id', campos: ['nota DOUBLE (0-10)', 'observacao VARCHAR(500)', 'dataavaliacao DATE'], fks: ['alunoid → alunos.id', 'cursoid → cursos.id'] },
  { nome: 'avaliacoesqualidade', pk: 'id', campos: ['nota INT (1-5)', 'comentario VARCHAR(500)', 'dataavaliacao DATE'], fks: ['escolaid → escolas.id'] },
  { nome: 'enderecosalunos', pk: 'id', campos: ['logradouro VARCHAR(255) NOT NULL', 'numero VARCHAR(255)', 'bairro VARCHAR(255)', 'cidade VARCHAR(255) NOT NULL', 'estado VARCHAR(2) NOT NULL', 'cep VARCHAR(9)'], fks: ['alunoid → alunos.id'] },
];

const endpoints = [
  { group: 'Escolas', items: [
    { m: 'GET', p: '/api/escolas', d: 'Lista todas as escolas' },
    { m: 'GET', p: '/api/escolas/{id}', d: 'Busca escola por ID' },
    { m: 'GET', p: '/api/escolas/buscar?nome=', d: 'Busca escola por nome' },
    { m: 'GET', p: '/api/escolas/tipo?tipo=', d: 'Filtra por tipo (pública/privada/federal)' },
    { m: 'POST', p: '/api/escolas', d: 'Cria nova escola' },
    { m: 'PUT', p: '/api/escolas/{id}', d: 'Atualiza escola' },
    { m: 'DELETE', p: '/api/escolas/{id}', d: 'Remove escola' },
  ]},
  { group: 'Endereços das escolas', items: [
    { m: 'GET', p: '/api/enderecos-escolas', d: 'Lista os endereços de todas as escolas' },
    { m: 'POST', p: '/api/enderecos-escolas/escola/{escolaId}', d: 'Cria o endereço de uma escola (a criação é aninhada por escola; POST na raiz retorna 405)' },
  ]},
  { group: 'Cursos', items: [
    { m: 'GET', p: '/api/cursos', d: 'Lista todos os cursos' },
    { m: 'POST', p: '/api/cursos/escola/{escolaId}', d: 'Cria curso vinculado à escola' },
  ]},
  { group: 'Professores', items: [
    { m: 'GET', p: '/api/professores', d: 'Lista todos os professores' },
    { m: 'GET', p: '/api/professores/{id}', d: 'Busca professor por ID' },
    { m: 'GET', p: '/api/professores/buscar?nome=', d: 'Busca por nome' },
    { m: 'GET', p: '/api/professores/escola/{escolaId}', d: 'Professores de uma escola' },
    { m: 'POST', p: '/api/professores/escola/{escolaId}', d: 'Cria professor vinculado à escola' },
    { m: 'PUT', p: '/api/professores/{id}', d: 'Atualiza professor' },
    { m: 'DELETE', p: '/api/professores/{id}', d: 'Remove professor' },
  ]},
  { group: 'Alunos', items: [
    { m: 'GET', p: '/api/alunos', d: 'Lista todos os alunos' },
    { m: 'GET', p: '/api/alunos/{id}', d: 'Busca aluno por ID' },
    { m: 'GET', p: '/api/alunos/buscar?nome=', d: 'Busca por nome' },
    { m: 'GET', p: '/api/alunos/curso/{cursoId}', d: 'Alunos de um curso' },
    { m: 'GET', p: '/api/alunos/escola/{escolaId}', d: 'Alunos de uma escola' },
    { m: 'POST', p: '/api/alunos', d: 'Cria novo aluno' },
    { m: 'PUT', p: '/api/alunos/{id}', d: 'Atualiza aluno' },
    { m: 'DELETE', p: '/api/alunos/{id}', d: 'Remove aluno' },
  ]},
  { group: 'Avaliações de qualidade (escolas, nota de 1 a 5)', items: [
    { m: 'GET', p: '/api/avaliacoes-qualidade', d: 'Lista as avaliações de qualidade de todas as escolas' },
    { m: 'GET', p: '/api/avaliacoes-qualidade/escola/{escolaId}', d: 'Avaliações de qualidade de uma escola' },
    { m: 'POST', p: '/api/avaliacoes-qualidade/escola/{escolaId}', d: 'Cria avaliação de qualidade da escola' },
  ]},
  { group: 'Avaliações de cursos (nota de 0 a 10)', items: [
    { m: 'GET', p: '/api/avaliacoes-cursos', d: 'Lista as avaliações de todos os cursos' },
    { m: 'POST', p: '/api/avaliacoes-cursos/curso/{cursoId}', d: 'Cria avaliação de um curso' },
  ]},
  { group: 'Produtos', items: [
    { m: 'GET', p: '/api/produtos', d: 'Lista todos os produtos' },
    { m: 'GET', p: '/api/produtos/{id}', d: 'Busca produto por ID' },
    { m: 'POST', p: '/api/produtos', d: 'Cria produto' },
    { m: 'PUT', p: '/api/produtos/{id}', d: 'Atualiza produto' },
    { m: 'DELETE', p: '/api/produtos/{id}', d: 'Remove produto' },
  ]},
  { group: 'Pedidos', items: [
    { m: 'GET', p: '/api/pedidos', d: 'Lista todos os pedidos' },
    { m: 'GET', p: '/api/pedidos/{id}', d: 'Busca pedido por ID' },
    { m: 'GET', p: '/api/pedidos/escola/{escolaId}', d: 'Pedidos de uma escola' },
    { m: 'GET', p: '/api/pedidos/professor/{professorId}', d: 'Pedidos vendidos por professor' },
    { m: 'GET', p: '/api/pedidos/status/{status}', d: 'Filtra por status' },
    { m: 'POST', p: '/api/pedidos/escola/{id}/produto/{id}/professor/{id}', d: 'Cria pedido' },
    { m: 'PUT', p: '/api/pedidos/{id}', d: 'Atualiza pedido' },
    { m: 'DELETE', p: '/api/pedidos/{id}', d: 'Remove pedido' },
  ]},
];

// Rotas GET lidas pelas consultas Power Query da planilha Excel (PlanilhaRecode_Painel.xlsx)
const rotasExcel = [
  ['/api/escolas', 'Aba escolas'],
  ['/api/enderecos-escolas', 'Aba enderecos-escolas (cidade, estado, localização)'],
  ['/api/cursos', 'Aba cursos'],
  ['/api/professores', 'Aba professores'],
  ['/api/avaliacoes-qualidade', 'Aba avaliacoes-qualidade (nota média por escola, 1 a 5)'],
  ['/api/avaliacoes-cursos', 'Aba avaliacoes-cursos (nota média por curso, 0 a 10)'],
];

const seedData = [
  { tabela: 'escolas', registros: 50, descricao: 'Pública, privada, estadual, federal' },
  { tabela: 'enderecosescolas', registros: 50, descricao: '1 por escola' },
  { tabela: 'cursos', registros: 50, descricao: 'Fundamental, Médio, Técnico, EJA' },
  { tabela: 'alunos', registros: 50, descricao: '1 por curso/escola' },
  { tabela: 'professores', registros: 50, descricao: 'Vinculados às escolas' },
  { tabela: 'produtos', registros: 20, descricao: 'Material escolar e suprimentos' },
  { tabela: 'pedidos', registros: 50, descricao: 'Escola ↔ Produto ↔ Professor' },
  { tabela: 'avaliacoescursos', registros: 50, descricao: '1 por curso' },
  { tabela: 'avaliacoesqualidade', registros: 50, descricao: '1 por escola' },
];

// ─── Subcomponentes ───────────────────────────────────────────────────────────

// Explica em palavras a escala de cada campo de nota no diagrama
const descreverNotaCampo = (campo: string) => {
  if (!campo.startsWith('nota')) return '';
  if (campo.includes('0-10')) return '. Nota de 0 a 10 dada pelo aluno ao curso; quanto maior, melhor.';
  if (campo.includes('1-5')) return '. Nota de 1 a 5 da qualidade da escola: 4 ou mais é boa, de 2,5 a 3,9 requer atenção, abaixo de 2,5 é crítica.';
  return '';
};

function ErTable({ t }: { t: typeof tabelas[0] }) {
  const s = useStyles();
  return (
    <div className={s.erBox} role="group" aria-label={`Tabela ${t.nome}`}>
      <div className={s.erBoxHeader}>{t.nome}</div>
      <div className={s.erField}><span className={s.erPk} aria-hidden="true">PK</span><span className={s.srOnly}>Chave primária:</span> <span>{t.pk} BIGINT AUTO_INCREMENT</span></div>
      {t.campos.map(c => (
        <div key={c} className={s.erField}><span style={{ width: 16 }} aria-hidden="true" /> <span>{c}</span>{descreverNotaCampo(c) && <span className={s.srOnly}>{descreverNotaCampo(c)}</span>}</div>
      ))}
      {t.fks.map(fk => (
        <div key={fk} className={s.erField}><span className={s.erFk} aria-hidden="true">FK</span><span className={s.srOnly}>Chave estrangeira:</span> <span>{fk}</span></div>
      ))}
    </div>
  );
}

function MethodBadge({ m, s }: { m: string; s: ReturnType<typeof useStyles> }) {
  const cls =
    m === 'GET' ? s.get :
    m === 'POST' ? s.post :
    m === 'PUT' ? s.put : s.del;
  const falado: Record<string, string> = { GET: 'consultar', POST: 'criar', PUT: 'atualizar', DELETE: 'excluir' };
  // O leitor de tela ouve o método e o que ele faz (a cor sozinha não informa)
  return <span className={`${s.method} ${cls}`}><span aria-hidden="true">{m}</span><span className={s.srOnly}>{`${m}, ${falado[m] ?? m}`}</span></span>;
}

// ─── Tabs de conteúdo ─────────────────────────────────────────────────────────

function TabOverview() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Visão Geral do Sistema</Title2>
        <Divider />
        <Body1>
          O <strong>Portal de Suprimentos ODS 4</strong> é um sistema B2B para gerenciamento educacional e venda de materiais escolares, 
          alinhado ao <strong>Objetivo de Desenvolvimento Sustentável 4 — Educação de Qualidade</strong> da ONU / Agenda 2030. 
          O backend expõe uma API REST completa; o frontend é construído com <strong>React + Fluent UI v9</strong>.
        </Body1>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Stack Tecnológico</Title3>
        <div className={s.cardGrid2}>
          <Card>
            <CardHeader header={<Text weight="semibold">Backend</Text>} />
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['Java 21', 'Versão definida no Maven'],
                ['Spring Boot 3.3', 'Framework web'],
                ['Spring Data JPA', 'ORM / persistência'],
                ['Hibernate 6.5', 'Implementação JPA'],
                ['PostgreSQL', 'Banco de dados relacional'],
                ['Maven', 'Build e dependências'],
              ].map(([tech, desc]) => (
                <div key={tech} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                  <CheckmarkCircle16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0 }} />
                  <strong>{tech}</strong><span style={{ color: tokens.colorNeutralForeground3 }}>— {desc}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader header={<Text weight="semibold">Frontend</Text>} />
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                ['React 19 + TypeScript', 'UI framework'],
                ['Fluent UI v9', 'Design System Microsoft'],
                ['Vite 8', 'Build tool'],
                ['React Router v7', 'Roteamento SPA'],
                ['Axios', 'Cliente HTTP'],
                ['Griffel / makeStyles', 'CSS-in-JS'],
              ].map(([tech, desc]) => (
                <div key={tech} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
                  <CheckmarkCircle16Regular style={{ color: tokens.colorBrandForeground1, flexShrink: 0 }} />
                  <strong>{tech}</strong><span style={{ color: tokens.colorNeutralForeground3 }}>— {desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Arquitetura em Camadas (Backend)</Title3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { layer: '① Controller', color: tokens.colorBrandForeground1, chips: ['EscolaController', 'AlunoController', 'ProfessorController', 'PedidoController', 'ProdutoController', '+ 7 outros'], desc: 'Recebe requisições HTTP, valida via @Valid e delega ao Service. Retorna ResponseEntity com status correto.' },
            { layer: '② Service', color: tokens.colorStatusSuccessForeground1, chips: ['EscolaService', 'AlunoService', 'ProfessorService', 'PedidoService', '+ 8 outros'], desc: 'Regra de negócio: resolução de entidades relacionadas, definição de datas, lançamento de RuntimeException para not-found.' },
            { layer: '③ Repository', color: tokens.colorPalettePurpleForeground2, chips: ['JpaRepository<E,Long>', 'findByNomeContainingIgnoreCase', 'findByEscolaId', 'findByProfessorId'], desc: 'Interfaces Spring Data JPA com derived queries. Sem SQL manual.' },
            { layer: '④ Model / Entity', color: tokens.colorPaletteDarkOrangeForeground1, chips: ['@Entity', '@Table', '@ManyToOne', '@JoinColumn', '@Enumerated', '@GeneratedValue'], desc: '11 entidades JPA mapeadas, sem relações bidirecionais @OneToMany.' },
            { layer: '⑤ Banco de Dados', color: tokens.colorNeutralForeground2, chips: ['PostgreSQL', 'Spring Data JPA', 'Hibernate'], desc: 'O schema PostgreSQL é provisionado pelo script SQL; spring.jpa.hibernate.ddl-auto=none.' },
          ].map(({ layer, color, chips, desc }) => (
            <div key={layer} className={s.archLayer}>
              <span className={s.archLayerTitle} style={{ color }}><span aria-hidden="true">{layer}</span><span className={s.srOnly}>{`Camada ${"①②③④⑤".indexOf(layer[0]) + 1}: ${layer.slice(2)}`}</span></span>
              <div className={s.archChipRow}>
                {chips.map(c => <span key={c} className={s.archChip}>{c}</span>)}
              </div>
              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{desc}</Caption1>
            </div>
          ))}
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Seed de Dados</Title3>
        <table className={s.table} aria-label="Seed de Dados">
          <thead>
            <tr>
              <th scope="col" className={s.th}>Tabela</th>
              <th scope="col" className={s.th}>Registros</th>
              <th scope="col" className={s.th}>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {seedData.map((row, i) => (
              <tr key={row.tabela} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><span className={s.inlineCode}>{row.tabela}</span></td>
                <td className={s.td}><Badge appearance="filled" color="brand">{row.registros}</Badge></td>
                <td className={s.td}>{row.descricao}</td>
              </tr>
            ))}
            <tr>
              <td className={s.td} style={{ fontWeight: 700 }}>TOTAL</td>
              <td className={s.td}><Badge appearance="filled" color="warning">
                {seedData.reduce((a, r) => a + r.registros, 0)}
              </Badge></td>
              <td className={s.td}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabBancoDados() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Modelagem do Banco de Dados</Title2>
        <Divider />
        <Body1>
          Banco PostgreSQL. O modelo visual abaixo reflete os relacionamentos JPA do backend; veja o script PostgreSQL
          na raiz do projeto para a definição física do schema.
        </Body1>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Diagrama ER Simplificado</Title3>
        <div className={s.erDiagram} role="region" aria-label="Diagrama de entidades e relacionamentos do banco de dados">
          <div className={s.erRow}>
            {tabelas.map(t => <ErTable key={t.nome} t={t} />)}
          </div>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Relacionamentos Principais</Title3>
        <table className={s.table} aria-label="Relacionamentos Principais">
          <thead>
            <tr>
              <th scope="col" className={s.th}>De</th>
              <th scope="col" className={s.th}>Cardinalidade</th>
              <th scope="col" className={s.th}>Para</th>
              <th scope="col" className={s.th}>Coluna FK</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Escola', '1:1', 'EnderecoEscola', 'enderecosescolas.escolaid'],
              ['Escola', '1:N', 'Curso', 'cursos.escolaid'],
              ['Escola', '1:N', 'Aluno', 'alunos.escolaid'],
              ['Escola', '1:N', 'Professor', 'professores.escolaid'],
              ['Escola', '1:N', 'Pedido', 'pedidos.escolaid'],
              ['Escola', '1:N', 'AvaliacaoQualidade', 'avaliacoesqualidade.escolaid'],
              ['Curso', '1:N', 'Aluno', 'alunos.cursoid'],
              ['Curso', '1:N', 'Matricula', 'matriculas.cursoid'],
              ['Curso', '1:N', 'ProgressoAluno', 'progressosalunos.cursoid'],
              ['Curso', '1:N', 'AvaliacaoCurso', 'avaliacoescursos.cursoid'],
              ['Aluno', '1:N', 'Matricula', 'matriculas.alunoid'],
              ['Aluno', '1:N', 'ProgressoAluno', 'progressosalunos.alunoid'],
              ['Produto', '1:N', 'Pedido', 'pedidos.produtoid'],
              ['Professor', '1:N', 'Pedido', 'pedidos.professorid (vendedor)'],
            ].map(([de, card, para, fk], i) => (
              <tr key={fk} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><span className={s.inlineCode}>{de}</span></td>
                <td className={s.td}><Badge appearance="outline" color="brand">{card}</Badge></td>
                <td className={s.td}><span className={s.inlineCode}>{para}</span></td>
                <td className={s.td}><span className={s.inlineCode}>{fk}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Script de Criação — PostgreSQL</Title3>
        <Body1>
          O schema atual está em <span className={s.inlineCode}>script_tabelas_recodedb_postgresql.sql</span> na raiz do projeto.
          O bloco abaixo é um dump legado do MySQL, mantido apenas como referência; não o execute no PostgreSQL.
        </Body1>
        <pre className={s.codeBlock}>{`DUMP LEGADO MySQL — apenas referência. Não executar no PostgreSQL.

--
-- Table structure for table alunos
--

DROP TABLE IF EXISTS alunos;
CREATE TABLE alunos (
  id bigint NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  datanascimento date DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  telefone varchar(255) DEFAULT NULL,
  cursoid int DEFAULT NULL,
  escolaid int DEFAULT NULL,
  data_nascimento date DEFAULT NULL,
  PRIMARY KEY (id),
  KEY FKcursoid (cursoid),
  KEY FKescolaid (escolaid),
  CONSTRAINT FKalunoscursoid FOREIGN KEY (cursoid) REFERENCES cursos (id),
  CONSTRAINT FKalunosescolaid FOREIGN KEY (escolaid) REFERENCES escolas (id)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table avaliacoescursos
--

DROP TABLE IF EXISTS avaliacoescursos;
CREATE TABLE avaliacoescursos (
  id bigint NOT NULL AUTO_INCREMENT,
  dataavaliacao date DEFAULT NULL,
  nota double NOT NULL,
  observacao varchar(500) DEFAULT NULL,
  alunoid bigint NOT NULL,
  cursoid int NOT NULL,
  data_avaliacao date DEFAULT NULL,
  aluno_id bigint NOT NULL,
  curso_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKalunoid (alunoid),
  KEY FKcursoid (cursoid),
  CONSTRAINT FKavaliacaoalunoscursoid FOREIGN KEY (cursoid) REFERENCES cursos (id),
  CONSTRAINT FKcs6jctu7k2fm34tha0tt277cb FOREIGN KEY (alunoid) REFERENCES alunos (id)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table avaliacoesqualidade
--

DROP TABLE IF EXISTS avaliacoesqualidade;
CREATE TABLE avaliacoesqualidade (
  id bigint NOT NULL AUTO_INCREMENT,
  comentario varchar(500) DEFAULT NULL,
  dataavaliacao date DEFAULT NULL,
  nota int NOT NULL,
  escolaid int NOT NULL,
  data_avaliacao date DEFAULT NULL,
  escola_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKescolaid (escolaid),
  CONSTRAINT FKavaliacaoescolaid FOREIGN KEY (escolaid) REFERENCES escolas (id)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table cursos
--

DROP TABLE IF EXISTS cursos;
CREATE TABLE cursos (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  descricao varchar(1000) DEFAULT NULL,
  cargahoraria int DEFAULT NULL,
  escolaid int NOT NULL,
  professorid int DEFAULT NULL,
  preco decimal(10,2) NOT NULL DEFAULT '0.00',
  nivelensino enum('basico','tecnico','superior','capacitacao') NOT NULL DEFAULT 'capacitacao',
  gratuito tinyint(1) NOT NULL DEFAULT '0',
  carga_horaria int DEFAULT NULL,
  escola_id bigint NOT NULL,
  nivel_ensino enum('basico','capacitacao','superior','tecnico') NOT NULL,
  PRIMARY KEY (id),
  KEY FKescolaid (escolaid),
  KEY FKprofessorid (professorid),
  CONSTRAINT FKecursosscolaid FOREIGN KEY (escolaid) REFERENCES escolas (id),
  CONSTRAINT FKprofessorid FOREIGN KEY (professorid) REFERENCES professores (id)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table enderecosalunos
--

DROP TABLE IF EXISTS enderecosalunos;
CREATE TABLE enderecosalunos (
  id bigint NOT NULL AUTO_INCREMENT,
  cep varchar(9) DEFAULT NULL,
  logradouro varchar(255) NOT NULL,
  numero varchar(255) DEFAULT NULL,
  bairro varchar(255) DEFAULT NULL,
  cidade varchar(255) NOT NULL,
  estado varchar(2) NOT NULL,
  alunoid bigint NOT NULL,
  aluno_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKenderecoalunoid (alunoid),
  CONSTRAINT FKn5ccqeycqixiancupeskpqtcf FOREIGN KEY (alunoid) REFERENCES alunos (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table enderecosescolas
--

DROP TABLE IF EXISTS enderecosescolas;
CREATE TABLE enderecosescolas (
  id bigint NOT NULL AUTO_INCREMENT,
  cep varchar(9) DEFAULT NULL,
  logradouro varchar(255) NOT NULL,
  numero varchar(255) DEFAULT NULL,
  bairro varchar(255) DEFAULT NULL,
  cidade varchar(255) NOT NULL,
  estado varchar(2) NOT NULL,
  escolaid int NOT NULL,
  escola_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKescolaid (escolaid),
  CONSTRAINT FKenderecosescolaid FOREIGN KEY (escolaid) REFERENCES escolas (id)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table escolas
--

DROP TABLE IF EXISTS escolas;
CREATE TABLE escolas (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  email varchar(255) DEFAULT NULL,
  telefone varchar(255) DEFAULT NULL,
  tipo varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table matriculas
--

DROP TABLE IF EXISTS matriculas;
CREATE TABLE matriculas (
  id bigint NOT NULL AUTO_INCREMENT,
  alunoid bigint NOT NULL,
  cursoid int NOT NULL,
  datamatricula datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  valorpago decimal(10,2) NOT NULL,
  statuspagamento enum('pago','pendente','cancelado') NOT NULL DEFAULT 'pendente',
  data_matricula datetime(6) NOT NULL,
  status_pagamento enum('cancelado','pago','pendente') NOT NULL,
  valor_pago decimal(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY FKmatriculaalunoid (alunoid),
  KEY FKmatriculacursoid (cursoid),
  CONSTRAINT FK41lhtucuspxfcu380ld32rxva FOREIGN KEY (alunoid) REFERENCES alunos (id),
  CONSTRAINT FKmatriculacursoid FOREIGN KEY (cursoid) REFERENCES cursos (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table pedidos
--

DROP TABLE IF EXISTS pedidos;
CREATE TABLE pedidos (
  id bigint NOT NULL AUTO_INCREMENT,
  escolaid int NOT NULL,
  produtoid int NOT NULL,
  quantidade int NOT NULL,
  valorunitario decimal(10,2) NOT NULL,
  valortotal decimal(10,2) GENERATED ALWAYS AS ((quantidade * valorunitario)) STORED,
  datapedido datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statuspedido enum('processando','enviado','entregue','cancelado') NOT NULL DEFAULT 'processando',
  professorid bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FKpedidoscolaid (escolaid),
  KEY FKpedidoprodutoid (produtoid),
  CONSTRAINT FKpedidoprodutoid FOREIGN KEY (produtoid) REFERENCES produtos (id),
  CONSTRAINT FKpedidoscolaid FOREIGN KEY (escolaid) REFERENCES escolas (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table produtos
--

DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  descricao varchar(500) DEFAULT NULL,
  preco decimal(38,2) NOT NULL,
  quantidadeestoque int NOT NULL DEFAULT '0',
  categoria enum('material_didatico','uniforme','mobiliario','tecnologia') NOT NULL,
  quantidade int NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table professores
--

DROP TABLE IF EXISTS professores;
CREATE TABLE professores (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(255) NOT NULL,
  email varchar(255) DEFAULT NULL,
  telefone varchar(255) DEFAULT NULL,
  especialidade varchar(255) DEFAULT NULL,
  biografia varchar(1000) DEFAULT NULL,
  escolaid bigint DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Table structure for table progressosalunos
--

DROP TABLE IF EXISTS progressosalunos;
CREATE TABLE progressosalunos (
  id bigint NOT NULL AUTO_INCREMENT,
  alunoid bigint NOT NULL,
  cursoid int NOT NULL,
  percentualconclusao int NOT NULL DEFAULT '0',
  dataatualizacao datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  data_atualizacao datetime(6) NOT NULL,
  percentual_conclusao int NOT NULL,
  PRIMARY KEY (id),
  KEY FKprogressoalunoid (alunoid),
  KEY FKprogressocursoid (cursoid),
  CONSTRAINT FKpmavfpvwadtwfdg9wkd3y0sb8 FOREIGN KEY (alunoid) REFERENCES alunos (id),
  CONSTRAINT FKprogressocursoid FOREIGN KEY (cursoid) REFERENCES cursos (id),
  CONSTRAINT progressosalunos_chk_1 CHECK (((percentual_conclusao <= 100) and (percentual_conclusao >= 0)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`}</pre>
      </div>
    </div>
  );
}

function TabUML() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>

      {/* Callout Draw.io */}
      <div className={s.infoBox}>
        <CheckmarkCircle16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
        <Text size={300}>
          <strong>Diagramas Draw.io disponíveis.</strong> As prévias SVG abaixo acompanham os arquivos fonte
          editáveis em <span className={s.inlineCode}>frontendWeb/public/diagramas</span>. Abra qualquer arquivo
          <span className={s.inlineCode}>.drawio</span> no VS Code com o plugin Draw.io Integration; ao editar a fonte,
          exporte novamente o SVG para manter a prévia atualizada.
        </Text>
      </div>

      <div className={s.section}>
        <Title2 as="h2">Diagramas do projeto</Title2>
        <Divider />
        {[
          {
            title: 'Arquitetura da aplicação',
            image: 'arquitetura.svg',
            alt: 'Frontend React conectado à API Spring Boot e ao banco PostgreSQL, com importação opcional do Google Sheets.',
            source: 'arquitetura.drawio',
          },
          {
            title: 'Modelo entidade-relacionamento',
            image: 'modelo-dados.svg',
            alt: 'Diagrama das entidades JPA do projeto e seus relacionamentos.',
            source: 'modelo-dados.drawio',
          },
          {
            title: 'Fluxos principais',
            image: 'fluxos.svg',
            alt: 'Fluxos de importação de planilha, solicitação de pedido e carregamento do dashboard.',
            source: 'fluxos.drawio',
          },
        ].map(diagram => (
          <div key={diagram.source} className={s.section}>
            <Title3 as="h3">{diagram.title}</Title3>
            <div className={s.diagramFrame}>
              <img
                className={s.diagramImage}
                src={`${import.meta.env.BASE_URL}diagramas/${diagram.image}`}
                alt={diagram.alt}
                loading="lazy"
              />
            </div>
            <a
              className={s.diagramSource}
              href={`${import.meta.env.BASE_URL}diagramas/${diagram.source}`}
              download
            >
              Baixar fonte Draw.io (.drawio)
            </a>
          </div>
        ))}
      </div>

        <div className={s.section}>
          <Title2 as="h2">Diagrama de Classes (UML)</Title2>
          <Divider />
          <Body1>
            Diagrama editável das 11 entidades JPA e seus relacionamentos, baseado nos modelos atuais do pacote
            <span className={s.inlineCode}> recode.leandrocrisci.projetofinal.model</span>. Abra a fonte no VS Code com o
            Draw.io Integration ou no diagrams.net.
          </Body1>
          <a
            className={s.diagramSource}
            href={`${import.meta.env.BASE_URL}diagramas/diagrama-classes.drawio`}
            download
          >
            Baixar diagrama de classes (.drawio)
          </a>
        </div>

      <div className={s.section}>
        <Title3 as="h3">Camadas de Serviço — Diagrama de Pacotes</Title3>
        <p className={s.srOnly}>
          Diagrama de pacotes do backend: controller recebe as requisições, service aplica as regras, repository acessa o banco e model define as entidades.
        </p>
        <pre className={s.codeBlock} aria-hidden="true">{`recode.leandrocrisci.projetofinal
│
├── controller/         ← @RestController  (12 classes)
│   ├── EscolaController
│   ├── ProfessorController
│   ├── AlunoController
│   ├── PedidoController
│   ├── ProdutoController
│   ├── CursoController
│   ├── MatriculaController
│   ├── ProgressoAlunoController
│   ├── AvaliacaoAlunoController
│   ├── AvaliacaoQualidadeController
│   ├── EnderecoAlunoController
│   └── EnderecoEscolaController
│
├── service/            ← @Service  (12 classes)
│   ├── EscolaService            → orquestra lógica de negócio
│   ├── ProfessorService         → injeta EscolaService (relação)
│   ├── PedidoService            → injeta EscolaService + ProfessorService
│   └── ... (demais seguem padrão simétrico)
│
├── repository/         ← JpaRepository<Entity, Long>  (12 interfaces)
│   ├── ProfessorRepository     → findByEscolaId(), findByNome...
│   ├── PedidoRepository        → findByEscolaId(), findByProfessorId()
│   └── ... (demais com queries derivadas específicas)
│
├── model/              ← @Entity JPA  (12 classes)
│   └── [todas as entidades mapeadas acima]
│
├── DataLoader.java     ← @Component CommandLineRunner (seed inicial)
└── ProjetofinalApplication.java`}</pre>
      </div>
    </div>
  );
}

function TabEndpoints() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Referência de Endpoints (API REST)</Title2>
        <Divider />
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>Local: <span className={s.inlineCode}>http://localhost:8090</span> · Produção (Render): <span className={s.inlineCode}>https://webservice-xirs.onrender.com</span> · Porta local configurada em <span className={s.inlineCode}>application.properties</span></Text>
        </div>
      </div>
      {endpoints.map(group => (
        <div key={group.group} className={s.section}>
          <Title3 as="h3">{group.group}</Title3>
          <Card>
            {group.items.map((item, i) => (
              <div key={i} className={s.endpointRow}>
                <MethodBadge m={item.m} s={s} />
                <span className={s.inlineCode} style={{ flex: '0 0 auto', minWidth: 340 }}>{item.p}</span>
                <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>{item.d}</Text>
              </div>
            ))}
          </Card>
        </div>
      ))}
      <div className={s.section}>
        <Title3 as="h3">Rotas lidas pela planilha Excel</Title3>
        <Card>
          {rotasExcel.map(([rota, uso]) => (
            <div key={rota} className={s.endpointRow}>
              <MethodBadge m="GET" s={s} />
              <span className={s.inlineCode} style={{ flex: '0 0 auto', minWidth: 340 }}>{rota}</span>
              <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>{uso}</Text>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function TabGuias() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Guias Técnicos</Title2>
        <Divider />
      </div>

      {/* Guia Fluent UI */}
      <div className={s.section}>
        <Title3 as="h3">1. Configuração React + Fluent UI v9</Title3>
        <Passos itens={[
          { num: '1', title: 'Instalar Node.js LTS', code: 'node -v\nnpm -v' },
          { num: '2', title: 'Criar projeto Vite + React + TypeScript', code: 'npm create vite@latest meu-projeto -- --template react-ts\ncd meu-projeto && npm install' },
          { num: '3', title: 'Instalar Fluent UI v9', code: 'npm install @fluentui/react-components @fluentui/react-icons' },
          { num: '4', title: 'Instalar dependências adicionais', code: 'npm install react-router-dom axios' },
          { num: '5', title: 'Limpar CSS global (evita conflito com tokens Fluent)', code: '// Esvaziar src/index.css e src/App.css completamente' },
        ]} />
      </div>

      {/* Guia Migração */}
      <div className={s.section}>
        <Title3 as="h3">2. Migração MySQL → PostgreSQL (pgloader)</Title3>
        <div className={s.noteBox}>
          <Warning16Regular style={{ color: tokens.colorStatusWarningForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>Útil para deploy em nuvem (Render, Railway) que preferem PostgreSQL.</Text>
        </div>
        <table className={s.table} aria-label="2. Migração MySQL → PostgreSQL (pgloader)">
          <thead>
            <tr>
              <th scope="col" className={s.th}>Diferença</th>
              <th scope="col" className={s.th}>MySQL</th>
              <th scope="col" className={s.th}>PostgreSQL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Auto Increment', 'AUTO_INCREMENT', 'SERIAL / IDENTITY'],
              ['Booleano', 'TINYINT(1)', 'BOOLEAN nativo'],
              ['Case sensitivity', 'Case-insensitive (Win)', 'Case-sensitive (lowercase)'],
              ['JSON avançado', 'Limitado', 'JSONB indexável'],
            ].map(([dif, my, pg], i) => (
              <tr key={dif} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><strong>{dif}</strong></td>
                <td className={s.td}><span className={s.inlineCode}>{my}</span></td>
                <td className={s.td}><span className={s.inlineCode}>{pg}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre className={s.codeBlock}>{`# Migração com pgloader (Java)
java -jar pgloader.jar \\
  mysql://root:SENHA@localhost:3306/recodedb \\
  postgres://usuario:senha@host.render.com/banco_destino`}</pre>
      </div>

      {/* Troubleshooting */}
      <div className={s.section}>
        <Title3 as="h3">3. Resolução de Problemas Comuns</Title3>
        {[
          {
            titulo: 'Tela preta / layout quebrado no Vite',
            causa: 'Arquivos index.css e App.css conflitam com tokens do FluentProvider.',
            solucao: 'Esvaziar completamente src/index.css e src/App.css.',
          },
          {
            titulo: '"Invalid Hook Call" no console',
            causa: 'Múltiplas instâncias do React em node_modules.',
            solucao: 'Remove-Item -Recurse -Force node_modules; npm cache clean --force; npm install',
          },
          {
            titulo: 'Driver PostgreSQL rejeita a jdbcUrl / CannotCreateTransactionException',
            causa: 'No Render, SPRING_DATASOURCE_URL estava como postgresql://... em vez de jdbc:postgresql://.... O Hikari rejeita a URL sem o prefixo JDBC e o JPA não consegue abrir a transação.',
            solucao: 'Configure SPRING_DATASOURCE_URL com jdbc:postgresql://<host>:5432/<database> e confira SPRING_DATASOURCE_USERNAME e SPRING_DATASOURCE_PASSWORD. Use host, porta e database do PostgreSQL no Render; salve e faça novo deploy do backend.',
          },
          {
            titulo: 'API retorna HTTP 500 ou Could not open JPA EntityManager',
            causa: 'A API não conseguiu acessar o banco. Durante o diagnóstico, a causa foi a URL JDBC sem jdbc:. Também pode ocorrer se o banco estiver indisponível ou se o esquema ainda não tiver sido criado.',
            solucao: 'Confira a primeira exceção e as linhas Caused by nos logs do serviço Render. Valide URL e credenciais do datasource. Como ddl-auto está none, crie o esquema PostgreSQL com script_tabelas_recodedb_postgresql.sql antes de testar os endpoints.',
          },
          {
            titulo: 'CORS bloqueia chamadas ou o preflight OPTIONS retorna 403',
            causa: 'A origem do frontend publicado ou local não está na configuração CORS do backend, ou o deploy ainda usa uma versão antiga.',
            solucao: 'No backend, configure CORS_ALLOWED_ORIGINS com as origens completas, separadas por vírgula e sem barra final: https://frontendweb-rcs5.onrender.com,http://localhost:5174. Faça redeploy e confira no navegador a resposta OPTIONS e o cabeçalho Access-Control-Allow-Origin.',
          },
          {
            titulo: 'Frontend não encontra a API / URL duplicada ou endpoint incorreto',
            causa: 'VITE_API_URL é incorporada durante o build do Vite. URL errada, sem /api ou alteração da variável sem novo deploy pode manter chamadas para o endereço antigo.',
            solucao: 'No serviço frontend do Render, configure VITE_API_URL=https://webservice-xirs.onrender.com/api e faça um novo deploy. Localmente, o proxy do Vite encaminha /api para http://localhost:8090; confirme que o backend está ativo nessa porta.',
          },
          {
            titulo: 'Importação cria o registro principal, mas falha ao salvar endereço',
            causa: 'A importação de escolas faz duas chamadas: cria a escola e depois envia o endereço. Se a segunda chamada falhar, a escola pode permanecer cadastrada sem endereço.',
            solucao: 'Consulte os logs do backend no horário da falha e corrija a causa do HTTP 500 antes de reenviar o endereço em /api/enderecos-escolas/escola/{escolaId}. Confirme se a escola já foi criada para evitar duplicatas.',
          },
          {
            titulo: 'Planilha Google não carrega ou retorna acesso negado',
            causa: 'A planilha não está compartilhada para leitura por link, o link não contém o gid correto ou a aba não tem os cabeçalhos esperados.',
            solucao: 'Ative “Qualquer pessoa com o link pode visualizar”, confira o gid da aba e os nomes das colunas documentados na tela de importação. Teste primeiro a exportação CSV da própria aba.',
          },
        ].map(item => (
          <Card key={item.titulo}>
            <CardHeader
              header={<Text weight="semibold" style={{ color: tokens.colorStatusDangerForeground1 }}>{item.titulo}</Text>}
              description={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  <Text size={200}><strong>Causa:</strong> {item.causa}</Text>
                  <Text size={200}><strong>Solução:</strong> <span className={s.inlineCode}>{item.solucao}</span></Text>
                </div>
              }
            />
          </Card>
        ))}

        <div className={s.section}>
          <Title3 as="h3">Publicar a aplicação no Render.com</Title3>
          <Text size={200}>
            Crie ou selecione um PostgreSQL no Render e mantenha o serviço web na mesma região para usar a conexão interna quando disponível.
            Não publique senhas no repositório nem em variáveis VITE_, pois variáveis Vite ficam visíveis no bundle do navegador.
          </Text>
          <Passos itens={[
            {
              num: '1',
              title: 'Criar o banco PostgreSQL',
              desc: 'Render Dashboard → New + → PostgreSQL. Guarde o host, a porta, o nome do banco, o usuário e a senha. Execute script_tabelas_recodedb_postgresql.sql uma vez no banco vazio; ele cria o esquema usado pela API.',
            },
            {
              num: '2',
              title: 'Criar o backend como Web Service Docker',
              desc: 'New + → Web Service → conecte o repositório leandrocrisci/recode-projeto-final. Use a branch main, selecione Docker como runtime e informe backendJava/Dockerfile como caminho do Dockerfile. Mantenha a raiz do repositório como contexto de build, pois o Dockerfile copia o projeto e compila backendJava.',
            },
            {
              num: '3',
              title: 'Configurar variáveis do backend',
              code: 'SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require\nSPRING_DATASOURCE_USERNAME=<usuario-do-postgresql>\nSPRING_DATASOURCE_PASSWORD=<senha-do-postgresql>\nCORS_ALLOWED_ORIGINS=https://<url-do-frontend>.onrender.com,http://localhost:5174',
            },
            {
              num: '4',
              title: 'Criar o frontend como Static Site',
              desc: 'New + → Static Site → conecte o mesmo repositório. Root Directory: frontendWeb. Publish Directory: dist. Em Environment, configure a variável abaixo.',
              code: 'Build Command: npm ci && npm run build\nVITE_API_URL=https://<url-do-backend>.onrender.com/api',
            },
            {
              num: '5',
              title: 'Publicar e validar',
              desc: 'Salve as variáveis e faça deploy dos dois serviços. VITE_API_URL exige novo build do frontend após cada mudança. Depois teste a rota abaixo: deve responder 200 e JSON. Se retornar 500, consulte os logs do backend. Para CORS, confira também OPTIONS, Origin e Access-Control-Allow-Origin no DevTools.',
              code: 'GET https://<url-do-backend>.onrender.com/api/cursos',
            },
          ]} />
          <div className={s.noteBox}>
            <Warning16Regular style={{ color: tokens.colorStatusWarningForeground1, flexShrink: 0, marginTop: 2 }} />
            <Text size={200}>
              Use o formato de URL JDBC com jdbc: no início. Se usar a URL interna do banco Render, adapte-a para jdbc:postgresql:// e use o host interno fornecido pelo Render; não misture host interno e conexão externa. Nunca compartilhe SPRING_DATASOURCE_PASSWORD em prints ou no GitHub.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabTestes() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Testes</Title2>
        <Divider />
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>Servidor: <span className={s.inlineCode}>http://localhost:8090</span> (ou <span className={s.inlineCode}>https://webservice-xirs.onrender.com</span>) · Ferramenta: Postman / Insomnia / curl</Text>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Casos de Teste — Escolas</Title3>
        <table className={s.table} aria-label="Casos de Teste — Escolas">
          <thead>
            <tr>
              <th scope="col" className={s.th}>ID</th><th scope="col" className={s.th}>Descrição</th>
              <th scope="col" className={s.th}>Método</th><th scope="col" className={s.th}>Endpoint</th>
              <th scope="col" className={s.th}>Esperado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['CT-001', 'Listar todas', 'GET', '/api/escolas', '200 OK — 50 escolas'],
              ['CT-002', 'Buscar por ID', 'GET', '/api/escolas/1', '200 OK — EMEF Monteiro Lobato'],
              ['CT-003', 'ID inexistente', 'GET', '/api/escolas/9999', '500 RuntimeException'],
              ['CT-004', 'Buscar por nome parcial', 'GET', '/api/escolas/buscar?nome=federal', '200 OK — 5 institutos'],
              ['CT-005', 'Filtrar por tipo', 'GET', '/api/escolas/tipo?tipo=privada', '200 OK — só privadas'],
              ['CT-006', 'Criar escola válida', 'POST', '/api/escolas', '201 CREATED'],
              ['CT-007', 'Criar sem nome', 'POST', '/api/escolas', '400 BAD REQUEST'],
              ['CT-008', 'Atualizar escola', 'PUT', '/api/escolas/1', '200 OK — dados atualizados'],
              ['CT-009', 'Deletar escola', 'DELETE', '/api/escolas/51', '204 NO CONTENT'],
            ].map(([id, desc, met, ep, esp], i) => (
              <tr key={id} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><Badge appearance="outline">{id}</Badge></td>
                <td className={s.td}>{desc}</td>
                <td className={s.td}><MethodBadge m={met} s={s} /></td>
                <td className={s.td}><span className={s.inlineCode}>{ep}</span></td>
                <td className={s.td}>{esp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Casos de Teste — Professores e Pedidos</Title3>
        <table className={s.table} aria-label="Casos de Teste — Professores e Pedidos">
          <thead>
            <tr>
              <th scope="col" className={s.th}>ID</th><th scope="col" className={s.th}>Descrição</th>
              <th scope="col" className={s.th}>Método</th><th scope="col" className={s.th}>Endpoint</th>
              <th scope="col" className={s.th}>Esperado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['CT-P01', 'Listar professores', 'GET', '/api/professores', '200 OK — 50 professores'],
              ['CT-P02', 'Professores de escola', 'GET', '/api/professores/escola/1', '200 OK — 2 professores'],
              ['CT-P03', 'Criar professor na escola 1', 'POST', '/api/professores/escola/1', '201 CREATED'],
              ['CT-P04', 'Escola inexistente', 'POST', '/api/professores/escola/9999', '500 RuntimeException'],
              ['CT-D01', 'Listar pedidos', 'GET', '/api/pedidos', '200 OK — 50 pedidos'],
              ['CT-D02', 'Pedidos da escola 1', 'GET', '/api/pedidos/escola/1', '200 OK — pedidos da escola 1'],
              ['CT-D03', 'Pedidos do professor 1', 'GET', '/api/pedidos/professor/1', '200 OK — pedidos vendidos'],
              ['CT-D04', 'Criar pedido', 'POST', '/api/pedidos/escola/1/produto/1/professor/1', '201 CREATED'],
              ['CT-D05', 'Filtrar por status', 'GET', '/api/pedidos/status/entregue', '200 OK — pedidos entregues'],
            ].map(([id, desc, met, ep, esp], i) => (
              <tr key={id} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><Badge appearance="outline" color={id.startsWith('CT-P') ? 'brand' : 'success'}>{id}</Badge></td>
                <td className={s.td}>{desc}</td>
                <td className={s.td}><MethodBadge m={met} s={s} /></td>
                <td className={s.td}><span className={s.inlineCode} style={{ fontSize: 11 }}>{ep}</span></td>
                <td className={s.td}>{esp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Casos de Teste — Endereços, Cursos e Avaliações</Title3>
        <table className={s.table} aria-label="Casos de Teste — Endereços, Cursos e Avaliações">
          <thead>
            <tr>
              <th scope="col" className={s.th}>ID</th><th scope="col" className={s.th}>Descrição</th>
              <th scope="col" className={s.th}>Método</th><th scope="col" className={s.th}>Endpoint</th>
              <th scope="col" className={s.th}>Esperado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['CT-E01', 'Listar endereços', 'GET', '/api/enderecos-escolas', '200 OK — endereços das escolas'],
              ['CT-E02', 'Criar endereço da escola 1', 'POST', '/api/enderecos-escolas/escola/1', '201 CREATED'],
              ['CT-E03', 'Criar endereço sem escola na rota', 'POST', '/api/enderecos-escolas', '405 METHOD NOT ALLOWED'],
              ['CT-C01', 'Listar cursos', 'GET', '/api/cursos', '200 OK — lista de cursos'],
              ['CT-C02', 'Criar curso na escola 1', 'POST', '/api/cursos/escola/1', '201 CREATED'],
              ['CT-Q01', 'Listar avaliações de qualidade', 'GET', '/api/avaliacoes-qualidade', '200 OK — notas de 1 a 5'],
              ['CT-Q02', 'Avaliações da escola 1', 'GET', '/api/avaliacoes-qualidade/escola/1', '200 OK — avaliações da escola 1'],
              ['CT-Q03', 'Criar avaliação de qualidade', 'POST', '/api/avaliacoes-qualidade/escola/1', '201 CREATED'],
              ['CT-V01', 'Listar avaliações de cursos', 'GET', '/api/avaliacoes-cursos', '200 OK — notas de 0 a 10'],
              ['CT-V02', 'Criar avaliação do curso 1', 'POST', '/api/avaliacoes-cursos/curso/1', '201 CREATED'],
            ].map(([id, desc, met, ep, esp], i) => (
              <tr key={id} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><Badge appearance="outline" color="informative">{id}</Badge></td>
                <td className={s.td}>{desc}</td>
                <td className={s.td}><MethodBadge m={met} s={s} /></td>
                <td className={s.td}><span className={s.inlineCode} style={{ fontSize: 11 }}>{ep}</span></td>
                <td className={s.td}>{esp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Casos de Teste — Alunos e Produtos</Title3>
        <table className={s.table} aria-label="Casos de Teste — Alunos e Produtos">
          <thead>
            <tr>
              <th scope="col" className={s.th}>ID</th><th scope="col" className={s.th}>Descrição</th>
              <th scope="col" className={s.th}>Método</th><th scope="col" className={s.th}>Endpoint</th>
              <th scope="col" className={s.th}>Esperado</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['CT-L01', 'Listar alunos', 'GET', '/api/alunos', '200 OK — lista de alunos'],
              ['CT-L02', 'Alunos do curso 1', 'GET', '/api/alunos/curso/1', '200 OK — alunos do curso 1'],
              ['CT-L03', 'Alunos da escola 1', 'GET', '/api/alunos/escola/1', '200 OK — alunos da escola 1'],
              ['CT-L04', 'Criar aluno', 'POST', '/api/alunos', '201 CREATED'],
              ['CT-R01', 'Listar produtos', 'GET', '/api/produtos', '200 OK — lista de produtos'],
              ['CT-R02', 'Criar produto', 'POST', '/api/produtos', '201 CREATED'],
            ].map(([id, desc, met, ep, esp], i) => (
              <tr key={id} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><Badge appearance="outline" color="warning">{id}</Badge></td>
                <td className={s.td}>{desc}</td>
                <td className={s.td}><MethodBadge m={met} s={s} /></td>
                <td className={s.td}><span className={s.inlineCode} style={{ fontSize: 11 }}>{ep}</span></td>
                <td className={s.td}>{esp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Verificações de Integridade SQL</Title3>
        <table className={s.table} aria-label="Verificações de Integridade SQL">
          <thead>
            <tr>
              <th scope="col" className={s.th}>#</th>
              <th scope="col" className={s.th}>Verificação</th>
              <th scope="col" className={s.th}>Comando SQL</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['V-01', 'Toda escola tem endereço', 'SELECT escolaid, COUNT(*) FROM enderecosescolas GROUP BY escolaid;'],
              ['V-02', 'Alunos com curso e escola', 'SELECT COUNT(*) FROM alunos WHERE cursoid IS NULL OR escolaid IS NULL;'],
              ['V-03', 'Notas de cursosválidas', 'SELECT * FROM avaliacoescursos WHERE nota < 0 OR nota > 10;'],
              ['V-04', 'Notas de qualidade válidas', 'SELECT * FROM avaliacoesqualidade WHERE nota < 1 OR nota > 5;'],
              ['V-05', 'Pedidos com professor', 'SELECT COUNT(*) FROM pedidos WHERE professorid IS NULL;'],
              ['V-06', 'Professores com escola', 'SELECT COUNT(*) FROM professores WHERE escolaid IS NULL;'],
            ].map(([num, ver, sql], i) => (
              <tr key={num} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><Badge appearance="filled" color="informative">{num}</Badge></td>
                <td className={s.td}>{ver}</td>
                <td className={s.td}><span className={s.inlineCode} style={{ fontSize: 11 }}>{sql}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabPlugin() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>

      {/* Status: instalado */}
      <div className={s.infoBox}>
        <CheckmarkCircle16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
        <Text size={300}>
          <strong>Plugin instalado!</strong> O Draw.io Integration (<span className={s.inlineCode}>hediet.vscode-drawio</span>) já está
          ativo neste VS Code. Abra qualquer arquivo <span className={s.inlineCode}>.drawio</span> ou <span className={s.inlineCode}>.dio</span> e
          o editor visual será carregado automaticamente.
        </Text>
      </div>

      <div className={s.section}>
        <Title2 as="h2">Draw.io Integration — Plugin VS Code</Title2>
        <Divider />
        <Body1>
          Permite criar e editar diagramas diretamente no VS Code, com interface visual drag-and-drop.
          Suporte completo a UML, ER, fluxogramas e arquitetura de sistemas.
        </Body1>
      </div>

      <div className={s.pluginCard}>
        <div className={s.pluginIcon}>🖼️</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Text weight="semibold" size={400}>Draw.io Integration</Text>
          <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
            Publisher: <strong>Henning Dieterichs</strong> · ID: <span className={s.inlineCode}>hediet.vscode-drawio</span>
          </Caption1>
          <Text size={200}>
            Edita arquivos <strong>.drawio</strong>, <strong>.dio</strong> e <strong>.svg</strong> inline no VS Code —
            UML (classes, sequência, componentes), diagramas ER, fluxogramas e arquitetura, tudo via drag-and-drop
            sem sair do editor. Suporta export PNG/SVG.
          </Text>
          <div className={s.archChipRow} style={{ marginTop: 4 }}>
            {['UML Classes', 'Diagrama ER', 'Fluxograma', 'Arquitetura', 'Sequência', 'Export PNG/SVG'].map(t => (
              <span key={t} className={s.archChip}><CheckmarkCircle16Regular style={{ color: tokens.colorStatusSuccessForeground1 }} />{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Fontes dos diagramas Draw.io</Title3>
        <Body1>
          Os arquivos editáveis ficam em <span className={s.inlineCode}>frontendWeb/public/diagramas</span>.
          As versões SVG exibidas nesta página devem ser atualizadas quando uma fonte for alterada.
        </Body1>
        <Passos itens={[
          {
            num: '1',
            title: 'Abrir um diagrama existente',
            code: 'frontendWeb/public/diagramas/arquitetura.drawio\nfrontendWeb/public/diagramas/modelo-dados.drawio\nfrontendWeb/public/diagramas/diagrama-classes.drawio\nfrontendWeb/public/diagramas/fluxos.drawio\n\n// Abra qualquer arquivo com o plugin Draw.io Integration.',
          },
          {
            num: '2',
            title: 'Exportar uma prévia para a documentação',
            code: '// No editor Draw.io, exporte como SVG e salve em:\nfrontendWeb/public/diagramas/\n\n// Mantenha os nomes arquitetura.svg, modelo-dados.svg ou fluxos.svg.',
          },
          {
            num: '3',
            title: 'Conferir a documentação',
            code: '// Execute o frontend e abra a aba UML / Arquitetura.\n// As prévias SVG são servidas junto com o frontend.',
          },
          {
            num: '4',
            title: 'Criar um novo diagrama',
            code: '// Salve o novo arquivo .drawio em:\nfrontendWeb/public/diagramas/\n\n// Exporte também o SVG e incorpore a prévia na aba UML / Arquitetura.',
          },
        ]} />
      </div>

      <div className={s.section}>
        <Title3 as="h3">Outras Extensões Úteis para o Projeto</Title3>
        <table className={s.table} aria-label="Outras Extensões Úteis para o Projeto">
          <thead>
            <tr>
              <th scope="col" className={s.th}>Extensão</th>
              <th scope="col" className={s.th}>ID</th>
              <th scope="col" className={s.th}>Para que serve</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Draw.io Integration', 'hediet.vscode-drawio', '✅ Instalado — editor visual de diagramas .drawio/.dio/.svg'],
              ['Spring Boot Extension Pack', 'vmware.vscode-boot-dev-pack', 'Suporte completo ao Spring Boot (run, debug, beans)'],
              ['Extension Pack for Java', 'vscjava.vscode-java-pack', 'Java language support, Maven, debugger'],
              ['MySQL (by cweijan)', 'cweijan.vscode-mysql-client2', 'Cliente MySQL integrado no VS Code'],
              ['REST Client', 'humao.rest-client', 'Testar endpoints HTTP direto em arquivos .http'],
              ['Prettier', 'esbenp.prettier-vscode', 'Formatação automática do código TypeScript/React'],
              ['ES7+ React snippets', 'dsznajder.es7-react-js-snippets', 'Snippets para React/TypeScript'],
              ['GitLens', 'eamodio.gitlens', 'Histórico de Git avançado inline no código'],
            ].map(([ext, id, desc], i) => (
              <tr key={id} className={i % 2 === 0 ? s.trAlt : undefined}>
                <td className={s.td}><strong>{ext}</strong></td>
                <td className={s.td}><span className={s.inlineCode} style={{ fontSize: 11 }}>{id}</span></td>
                <td className={s.td}>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabIA() {
  const s = useStyles();
  const conteudo = iaMarkdown.split('## 11. GitHub, Copilot e Render: guia executivo e acesso ao projeto')[1]?.split('\n## ')[0] ?? '';
  const secoes = conteudo.split(/^### /m).slice(1).map(bloco => {
    const [titulo, ...linhas] = bloco.split('\n');
    return { titulo, linhas: linhas.join('\n').trim() };
  });

  const renderInline = (texto: string) =>
    texto.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/g).map((parte, indice) => {
      const codigo = parte.match(/^`([^`]+)`$/);
      if (codigo) return <span key={indice} className={s.inlineCode}>{codigo[1]}</span>;
      const link = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        return <a key={indice} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
      }
      return parte;
    });

  const renderLinhas = (texto: string) => {
    const blocos: Array<{ tipo: 'codigo' | 'item' | 'paragrafo'; texto: string }> = [];
    let codigoAtual: string[] | null = null;

    for (const linha of texto.split('\n')) {
      const limpa = linha.trim();
      if (limpa.startsWith('```')) {
        if (codigoAtual) {
          blocos.push({ tipo: 'codigo', texto: codigoAtual.join('\n') });
          codigoAtual = null;
        } else {
          codigoAtual = [];
        }
      } else if (codigoAtual) {
        codigoAtual.push(linha);
      } else if (limpa.startsWith('- ')) {
        blocos.push({ tipo: 'item', texto: limpa.slice(2) });
      } else if (limpa) {
        blocos.push({ tipo: 'paragrafo', texto: limpa });
      }
    }

    if (codigoAtual) blocos.push({ tipo: 'codigo', texto: codigoAtual.join('\n') });

    return blocos.map((bloco, indice) => {
      if (bloco.tipo === 'codigo') return <pre key={indice} className={s.codeBlock}>{bloco.texto}</pre>;
      if (bloco.tipo === 'item') {
        return (
          <div key={indice} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <Text aria-hidden="true">•</Text>
            <Text>{renderInline(bloco.texto)}</Text>
          </div>
        );
      }
      return <Body1 key={indice}>{renderInline(bloco.texto)}</Body1>;
    });
  };

  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">Inteligência Artificial e publicação do projeto</Title2>
        <Body1>
          Introdução executiva ao GitHub, GitHub Copilot e Render, com instruções para consultar o repositório e conhecer
          as principais melhorias realizadas com apoio de IA. Este conteúdo é carregado do arquivo <span className={s.inlineCode}>IA.md</span>.
        </Body1>
      </div>
      <div className={s.cardGrid2}>
        {secoes.map(secao => (
          <Card key={secao.titulo}>
            <CardHeader header={<Title3 as="h3">{secao.titulo}</Title3>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px 16px' }}>
              {renderLinhas(secao.linhas)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Aba: n8n e Render ───────────────────────────────────────────────────────

type Classe = 'segredo' | 'config' | 'publico';

interface Variavel {
  nome: string;
  valor: string;
  descricao: string;
  classe: Classe;
}

function ClasseBadge({ classe }: { classe: Classe }) {
  if (classe === 'segredo') return <Badge appearance="filled" color="danger">Segredo: só no Render</Badge>;
  if (classe === 'config') return <Badge appearance="filled" color="warning">Configuração: só no Render</Badge>;
  return <Badge appearance="filled" color="informative">Público: vai no build</Badge>;
}

function TabelaVariaveis({ titulo, itens }: { titulo: string; itens: Variavel[] }) {
  const s = useStyles();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={s.table} aria-label={titulo}>
        <thead>
          <tr>
            <th scope="col" className={s.th}>Variável</th>
            <th scope="col" className={s.th}>Valor ou origem</th>
            <th scope="col" className={s.th}>Descrição</th>
            <th scope="col" className={s.th}>Classificação</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((v, i) => (
            <tr key={v.nome} className={i % 2 === 0 ? s.trAlt : undefined}>
              <td className={s.td}><span className={s.inlineCode}>{v.nome}</span></td>
              <td className={s.td}><span className={s.inlineCode} style={{ wordBreak: 'break-word' }}>{v.valor}</span></td>
              <td className={s.td}>{v.descricao}</td>
              <td className={s.td}><ClasseBadge classe={v.classe} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabelaSimples({ titulo, colunas, linhas, codigo = [] }: {
  titulo: string; colunas: string[]; linhas: string[][]; codigo?: number[];
}) {
  const s = useStyles();
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={s.table} aria-label={titulo}>
        <thead>
          <tr>{colunas.map(c => <th key={c} scope="col" className={s.th}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={`${linha[0]}-${i}`} className={i % 2 === 0 ? s.trAlt : undefined}>
              {linha.map((celula, j) => (
                <td key={j} className={s.td}>
                  {codigo.includes(j)
                    ? <span className={s.inlineCode} style={{ wordBreak: 'break-word' }}>{celula}</span>
                    : celula}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Passos({ itens }: { itens: { num: string; title: string; desc?: string; code?: string }[] }) {
  const s = useStyles();
  return (
    <>
      {itens.map(step => (
        <div key={step.num} className={s.stepRow}>
          <div className={s.stepNum}>{step.num}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
            <Text weight="semibold">{step.title}</Text>
            {step.desc && <Text size={200}>{step.desc}</Text>}
            {step.code && <pre className={mergeClasses(s.codeBlock, s.codeWrap)}>{step.code}</pre>}
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Dados: serviços e variáveis ─────────────────────────────────────────────

const servicosRender: string[][] = [
  ['Frontend', 'Static Site', 'https://frontendweb-rcs5.onrender.com', 'Interface React. Chama a API e o webhook do n8n pelo navegador.'],
  ['Backend', 'Web Service (Docker)', 'https://webservice-xirs.onrender.com', 'API Spring Boot. É usada pelo frontend e pelo workflow do n8n.'],
  ['PostgreSQL da API', 'PostgreSQL', 'conexão interna', 'Dados do sistema: escolas, cursos, alunos, professores e avaliações.'],
  ['n8n', 'Web Service (Docker)', 'https://recode-n8n.onrender.com', 'Executa o workflow que gera, grava e valida os registros.'],
  ['PostgreSQL do n8n', 'PostgreSQL', 'conexão interna', 'Workflows, credenciais, conta e histórico de execuções do n8n.'],
  ['Gemini', 'API do Google', 'chamada feita pelo n8n', 'Gera os dados fictícios das novas escolas e completa os cadastros incompletos.'],
];

const pgCampos: Variavel[] = [
  { nome: 'Hostname', valor: 'dpg-xxxxxxxx-a (interno)', descricao: 'Endereço do servidor. O hostname interno só funciona entre serviços da mesma conta e região. O externo termina em .render.com e exige SSL.', classe: 'config' },
  { nome: 'Port', valor: '5432', descricao: 'Porta padrão do PostgreSQL.', classe: 'config' },
  { nome: 'Database', valor: '<nome-do-banco>', descricao: 'Nome do banco criado pelo Render.', classe: 'config' },
  { nome: 'Username', valor: '<usuario>', descricao: 'Usuário de acesso ao banco.', classe: 'config' },
  { nome: 'Password', valor: '<senha-do-postgresql>', descricao: 'Senha do usuário. Quem a tiver acessa todos os dados do banco.', classe: 'segredo' },
  { nome: 'Internal Database URL', valor: 'postgresql://usuario:senha@host/banco', descricao: 'URL completa para serviços da mesma região. Contém a senha. O Spring não aceita nesse formato: precisa do prefixo jdbc:postgresql://.', classe: 'segredo' },
  { nome: 'External Database URL', valor: 'postgresql://usuario:senha@host.render.com/banco', descricao: 'A mesma URL para acesso de fora do Render, como a sua máquina. Contém a senha e exige SSL.', classe: 'segredo' },
  { nome: 'PSQL Command', valor: 'PGPASSWORD=<senha> psql -h <host> -U <usuario> <banco>', descricao: 'Comando pronto para abrir o terminal do banco. Contém a senha. Serve para conferir as tabelas com \\dt.', classe: 'segredo' },
];

const pgMapa: string[][] = [
  ['Hostname', 'dentro de SPRING_DATASOURCE_URL', 'DB_POSTGRESDB_HOST'],
  ['Port', 'dentro de SPRING_DATASOURCE_URL', 'DB_POSTGRESDB_PORT'],
  ['Database', 'dentro de SPRING_DATASOURCE_URL', 'DB_POSTGRESDB_DATABASE'],
  ['Username', 'SPRING_DATASOURCE_USERNAME', 'DB_POSTGRESDB_USER'],
  ['Password', 'SPRING_DATASOURCE_PASSWORD', 'DB_POSTGRESDB_PASSWORD'],
];

const backendVars: Variavel[] = [
  { nome: 'SPRING_DATASOURCE_URL', valor: 'jdbc:postgresql://<host>:5432/<database>?sslmode=require', descricao: 'Endereço do banco para o Spring. Precisa começar com jdbc:postgresql://. Sem o prefixo jdbc: o Hikari recusa a URL. Use o host interno quando o backend estiver na mesma região do banco e não misture host interno com conexão externa.', classe: 'config' },
  { nome: 'SPRING_DATASOURCE_USERNAME', valor: '<usuario-do-postgresql>', descricao: 'Usuário do banco da API.', classe: 'config' },
  { nome: 'SPRING_DATASOURCE_PASSWORD', valor: '<senha-do-postgresql>', descricao: 'Senha do banco da API. Nunca aparece em print, log compartilhado ou no GitHub.', classe: 'segredo' },
  { nome: 'CORS_ALLOWED_ORIGINS', valor: 'https://frontendweb-rcs5.onrender.com,http://localhost:5174', descricao: 'Origens do frontend autorizadas a chamar a API: endereços completos, separados por vírgula e sem barra no final. Qualquer mudança exige novo deploy do backend. O n8n chama a API de servidor para servidor e não depende de CORS.', classe: 'config' },
];

const frontendVars: Variavel[] = [
  { nome: 'VITE_API_URL', valor: 'https://webservice-xirs.onrender.com/api', descricao: 'Base da API usada pelo axios. Inclui /api no final. É gravada no build: mudar o valor exige novo deploy do Static Site.', classe: 'publico' },
  { nome: 'VITE_N8N_WEBHOOK_URL', valor: 'https://recode-n8n.onrender.com/webhook/gerar-escolas', descricao: 'Endereço do webhook que a aba N8N chama com POST. Sem a variável, a aba usa http://localhost:5678/webhook/gerar-escolas. Também é gravada no build.', classe: 'publico' },
];

const n8nVars: Variavel[] = [
  { nome: 'N8N_ENCRYPTION_KEY', valor: '<chave gerada por você>', descricao: 'Criptografa as credenciais salvas no n8n, como a do Gemini. Gere uma vez, guarde uma cópia e nunca altere.', classe: 'segredo' },
  { nome: 'DB_TYPE', valor: 'postgresdb', descricao: 'Faz o n8n usar o PostgreSQL em vez do SQLite do container. Sem isso, tudo se perde a cada reinício.', classe: 'config' },
  { nome: 'DB_POSTGRESDB_HOST', valor: '<hostname-interno-do-banco-do-n8n>', descricao: 'Servidor do banco do n8n.', classe: 'config' },
  { nome: 'DB_POSTGRESDB_PORT', valor: '5432', descricao: 'Porta do banco.', classe: 'config' },
  { nome: 'DB_POSTGRESDB_DATABASE', valor: '<nome-do-banco>', descricao: 'Nome do banco do n8n.', classe: 'config' },
  { nome: 'DB_POSTGRESDB_USER', valor: '<usuario>', descricao: 'Usuário do banco do n8n.', classe: 'config' },
  { nome: 'DB_POSTGRESDB_PASSWORD', valor: '<senha-do-postgresql>', descricao: 'Senha do banco do n8n.', classe: 'segredo' },
  { nome: 'N8N_HOST', valor: 'recode-n8n.onrender.com', descricao: 'Domínio público do serviço, sem https://.', classe: 'config' },
  { nome: 'N8N_PROTOCOL', valor: 'https', descricao: 'Protocolo público do serviço.', classe: 'config' },
  { nome: 'N8N_PORT', valor: '10000', descricao: 'Porta em que o n8n escuta. 10000 é a porta padrão que o Render espera.', classe: 'config' },
  { nome: 'WEBHOOK_URL', valor: 'https://recode-n8n.onrender.com/', descricao: 'Base usada para montar as URLs dos webhooks. Sem ela, a Production URL do nó Webhook mostra localhost.', classe: 'config' },
  { nome: 'N8N_EDITOR_BASE_URL', valor: 'https://recode-n8n.onrender.com/', descricao: 'Endereço público do editor.', classe: 'config' },
  { nome: 'N8N_PROXY_HOPS', valor: '1', descricao: 'Avisa que existe um proxy do Render na frente do n8n.', classe: 'config' },
  { nome: 'GENERIC_TIMEZONE e TZ', valor: 'America/Sao_Paulo', descricao: 'Fuso horário das execuções e do histórico.', classe: 'config' },
  { nome: 'EXECUTIONS_DATA_PRUNE', valor: 'true', descricao: 'Apaga execuções antigas para economizar espaço no banco.', classe: 'config' },
  { nome: 'EXECUTIONS_DATA_MAX_AGE', valor: '168', descricao: 'Idade máxima do histórico, em horas (168 horas = 7 dias).', classe: 'config' },
];

const configWorkflow: string[][] = [
  ['baseUrl', 'https://webservice-xirs.onrender.com', 'Endereço público do backend: só o domínio, sem /api e sem barra no final. O campo remove sobras de /api e barras.'],
  ['qtdEscolas', '5', 'Escolas novas por execução.'],
  ['qtdAlunos', '1', 'Alunos por escola.'],
  ['qtdProfessores', '1', 'Professores por escola.'],
  ['maxReparos', '10', 'Máximo de escolas incompletas que o reparo tenta completar por execução.'],
  ['urlEndereco', '/api/enderecos-escolas/escola/{escolaId}', 'Rota de criação do endereço.'],
  ['urlAvaliacao', '/api/avaliacoes-qualidade/escola/{escolaId}', 'Rota de criação da avaliação de qualidade.'],
  ['urlCurso', '/api/cursos/escola/{escolaId}', 'Rota de criação do curso.'],
  ['urlAvaliacaoCurso', '/api/avaliacoes-cursos/curso/{cursoId}', 'Rota de criação da avaliação do curso.'],
  ['urlProfessor', '/api/professores/escola/{escolaId}', 'Rota de criação do professor.'],
  ['urlAluno', '/api/alunos', 'Rota de criação do aluno.'],
];

const rotasWorkflow: string[][] = [
  ['Listar Escolas', 'GET', '/api/escolas'],
  ['Criar Escola', 'POST', '/api/escolas'],
  ['Criar Endereço', 'POST', '/api/enderecos-escolas/escola/{escolaId}'],
  ['Criar Avaliação', 'POST', '/api/avaliacoes-qualidade/escola/{escolaId}'],
  ['Criar Curso', 'POST', '/api/cursos/escola/{escolaId}'],
  ['Criar Avaliação do Curso', 'POST', '/api/avaliacoes-cursos/curso/{cursoId}'],
  ['Criar Aluno', 'POST', '/api/alunos'],
  ['Criar Professor', 'POST', '/api/professores/escola/{escolaId}'],
  ['Verificar Escolas, Endereços, Alunos, Avaliações e Cursos', 'GET', '/api/escolas, /api/enderecos-escolas, /api/alunos, /api/avaliacoes-qualidade, /api/cursos'],
  ['Aplicar Reparo', 'POST', 'as mesmas rotas de endereço, avaliação de qualidade e aluno'],
];

const passosN8n = [
  {
    num: '1',
    title: 'Preparar o repositório recode.n8n',
    desc: 'O repositório precisa de um Dockerfile na raiz, com a versão do n8n fixada (a mesma usada localmente). O render.yaml serve só de referência das variáveis, porque o serviço é criado manualmente. O workflow exportado, sem credenciais, fica em workflows/gerar-escolas-gemini.json.',
    code: 'FROM docker.io/n8nio/n8n:2.43.8',
  },
  {
    num: '2',
    title: 'Criar o PostgreSQL do n8n',
    desc: 'Render Dashboard, New +, PostgreSQL, na mesma região do serviço do n8n. Prefira um banco separado do banco da API. Anote Hostname interno, Port, Database, Username e Password.',
  },
  {
    num: '3',
    title: 'Criar o Web Service',
    desc: 'New +, Web Service, repositório leandrocrisci/recode.n8n, branch main, linguagem Docker, mesma região do banco. Em Health Check Path informe /healthz.',
    code: 'Health Check Path: /healthz',
  },
  {
    num: '4',
    title: 'Gerar a chave e cadastrar as variáveis',
    desc: 'Gere a N8N_ENCRYPTION_KEY, guarde uma cópia fora do GitHub e cadastre todas as variáveis da tabela acima na aba Environment do serviço.',
    code: `$b = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
[Convert]::ToBase64String($b)`,
  },
  {
    num: '5',
    title: 'Informar o domínio e refazer o deploy',
    desc: 'Depois do primeiro deploy o Render mostra a URL do serviço (https://recode-n8n.onrender.com). Preencha N8N_HOST, WEBHOOK_URL e N8N_EDITOR_BASE_URL com ela e faça um novo deploy.',
  },
  {
    num: '6',
    title: 'Configurar o n8n',
    desc: 'Abra a URL do serviço e crie a conta de dono na primeira tela. Importe o workflow, crie a credencial Google Gemini(PaLM) Api e selecione-a nos dois nós de modelo (Gemini e Gemini de reparo). Confira o baseUrl no nó Config e publique o workflow: o webhook de produção só roda a versão publicada.',
  },
  {
    num: '7',
    title: 'Validar a persistência',
    desc: 'Faça Manual Deploy, Restart service. A conta e o workflow devem continuar lá, sem a tela Customize n8n to you. No shell do Postgres do n8n (PSQL Command), o comando abaixo lista as tabelas do n8n, como workflow_entity.',
    code: '\\dt',
  },
  {
    num: '8',
    title: 'Testar o webhook',
    desc: 'Use o botão Executar workflow da aba N8N ou o PowerShell. O teste executa o workflow de verdade e cria registros na API.',
    code: 'Invoke-RestMethod -Method Post -Uri "https://recode-n8n.onrender.com/webhook/gerar-escolas" -ContentType "application/json" -Body "{}"',
  },
];

// ─── Dados: segurança ────────────────────────────────────────────────────────

const inventario: { servico: string; nome: string; valor: string; classe: Classe }[] = [
  { servico: 'Backend', nome: 'SPRING_DATASOURCE_URL', valor: 'jdbc:postgresql://<host>:5432/<database>?sslmode=require', classe: 'config' },
  { servico: 'Backend', nome: 'SPRING_DATASOURCE_USERNAME', valor: '<usuario-do-postgresql>', classe: 'config' },
  { servico: 'Backend', nome: 'SPRING_DATASOURCE_PASSWORD', valor: '<senha-do-postgresql>', classe: 'segredo' },
  { servico: 'Backend', nome: 'CORS_ALLOWED_ORIGINS', valor: 'https://frontendweb-rcs5.onrender.com,http://localhost:5174', classe: 'config' },
  { servico: 'Frontend', nome: 'VITE_API_URL', valor: 'https://webservice-xirs.onrender.com/api', classe: 'publico' },
  { servico: 'Frontend', nome: 'VITE_N8N_WEBHOOK_URL', valor: 'https://recode-n8n.onrender.com/webhook/gerar-escolas', classe: 'publico' },
  { servico: 'n8n', nome: 'N8N_ENCRYPTION_KEY', valor: '<chave gerada por você>', classe: 'segredo' },
  { servico: 'n8n', nome: 'DB_TYPE', valor: 'postgresdb', classe: 'config' },
  { servico: 'n8n', nome: 'DB_POSTGRESDB_HOST', valor: '<hostname-interno-do-banco-do-n8n>', classe: 'config' },
  { servico: 'n8n', nome: 'DB_POSTGRESDB_PORT', valor: '5432', classe: 'config' },
  { servico: 'n8n', nome: 'DB_POSTGRESDB_DATABASE', valor: '<nome-do-banco>', classe: 'config' },
  { servico: 'n8n', nome: 'DB_POSTGRESDB_USER', valor: '<usuario>', classe: 'config' },
  { servico: 'n8n', nome: 'DB_POSTGRESDB_PASSWORD', valor: '<senha-do-postgresql>', classe: 'segredo' },
  { servico: 'n8n', nome: 'N8N_HOST', valor: 'recode-n8n.onrender.com', classe: 'config' },
  { servico: 'n8n', nome: 'N8N_PROTOCOL', valor: 'https', classe: 'config' },
  { servico: 'n8n', nome: 'N8N_PORT', valor: '10000', classe: 'config' },
  { servico: 'n8n', nome: 'WEBHOOK_URL', valor: 'https://recode-n8n.onrender.com/', classe: 'config' },
  { servico: 'n8n', nome: 'N8N_EDITOR_BASE_URL', valor: 'https://recode-n8n.onrender.com/', classe: 'config' },
  { servico: 'n8n', nome: 'N8N_PROXY_HOPS', valor: '1', classe: 'config' },
  { servico: 'n8n', nome: 'GENERIC_TIMEZONE e TZ', valor: 'America/Sao_Paulo', classe: 'config' },
  { servico: 'n8n', nome: 'EXECUTIONS_DATA_PRUNE e EXECUTIONS_DATA_MAX_AGE', valor: 'true e 168', classe: 'config' },
  { servico: 'n8n (tela de credenciais)', nome: 'Google Gemini(PaLM) Api', valor: '<chave da API do Google AI>', classe: 'segredo' },
];

const podeIrParaGithub = [
  'Código do frontend e do backend.',
  'Dockerfile com a versão da imagem fixada.',
  'render.yaml sem valores secretos (só nomes de variáveis, geração automática ou preenchimento no painel).',
  'Workflow exportado sem credenciais, ids da instância e senhas (workflows/gerar-escolas-gemini.json e n8n-fluxo.json).',
  'Documentação, sempre com valores de exemplo entre sinais de menor e maior, como <senha-do-postgresql>.',
];

const nuncaIrParaGithub = [
  'Senha do banco e as URLs Internal Database URL, External Database URL e PSQL Command.',
  'N8N_ENCRYPTION_KEY.',
  'Chave da API do Gemini.',
  'Arquivos .env e qualquer arquivo com valores reais de variáveis.',
  'Export bruto do workflow baixado do n8n, que traz referências a credenciais e à instância.',
  'Prints de logs, do painel do Render ou de variáveis sem esconder os valores.',
];

const boasPraticas = [
  { titulo: 'Segredos só no Render', texto: 'Senhas, chaves e URLs de banco são cadastradas na aba Environment do serviço, ou como credencial dentro do n8n. O repositório recode.n8n é público: tudo o que for enviado a ele pode ser lido por qualquer pessoa, inclusive em commits antigos.' },
  { titulo: 'Revisar antes de cada commit', texto: 'Confira o git diff e procure senha, chave ou URL com usuário e senha. Mantenha .env e arquivos *.env no .gitignore.' },
  { titulo: 'Variáveis VITE_ são públicas', texto: 'Tudo o que começa com VITE_ é copiado para o código que o navegador baixa. Nunca coloque senha, chave ou token nelas. VITE_API_URL e VITE_N8N_WEBHOOK_URL são só endereços.' },
  { titulo: 'Chave de criptografia do n8n', texto: 'A N8N_ENCRYPTION_KEY protege as credenciais salvas. Gere uma vez, guarde uma cópia em um gerenciador de senhas e não altere: se mudar, as credenciais precisam ser recriadas.' },
  { titulo: 'Conta do n8n', texto: 'O editor fica aberto na internet. Crie a conta de dono assim que o serviço subir, com senha forte e exclusiva.' },
  { titulo: 'Webhook público', texto: 'Quem souber a URL do webhook pode disparar o workflow, criar dados e gastar a cota do Gemini. Troque o CORS do nó Webhook pelo endereço do frontend: isso barra chamadas feitas por outros sites, mas não chamadas diretas por terminal. Para proteção de verdade, adicione autenticação ao webhook ou limite o uso da aba N8N a administradores, e nunca coloque um segredo em VITE_.' },
  { titulo: 'Versão fixada da imagem', texto: 'Use docker.io/n8nio/n8n:2.43.8, ou a versão que você testou, e não latest. Assim uma atualização automática não quebra o workflow. Atualize de propósito e teste antes.' },
  { titulo: 'Conexão interna do banco', texto: 'Use o hostname interno com serviços da mesma região. O acesso externo exige SSL e serve só para administração, com a senha guardada fora do Git.' },
  { titulo: 'Se um segredo vazar', texto: 'Considere-o comprometido, mesmo que apague o commit, porque o histórico do Git continua visível. Troque a senha ou a chave (senha do Postgres no Render, chave do Gemini no Google AI), atualize a variável no Render e só depois limpe o histórico. Se for a N8N_ENCRYPTION_KEY, recrie as credenciais do n8n.' },
  { titulo: 'Logs e prints', texto: 'Antes de compartilhar um log ou print, esconda senhas, URLs de banco e chaves. Mensagens de erro de conexão podem incluir host e usuário.' },
];

// ─── Dados: resumo executivo ─────────────────────────────────────────────────

const causasRaiz = [
  { titulo: 'Rota ou URL errada', texto: 'Erros 405 e 404, URL duplicada e nome remoto não resolvido. Quase sempre foi uma rota deduzida em vez de lida no código, ou um baseUrl com sobras.' },
  { titulo: 'Dados fora do formato esperado', texto: 'O que o Gemini gerou não batia com os formulários da API, e a resposta do nó Gemini veio num formato diferente do esperado pelo código.' },
  { titulo: 'Ambiente local diferente da produção', texto: 'localhost e host.docker.internal no n8n do Render, versão antiga do workflow ou da página em uso, e serviços do plano gratuito dormindo.' },
  { titulo: 'Falta de persistência no n8n', texto: 'Sem PostgreSQL, o n8n guardava tudo no disco do container e perdia workflows, conta e credenciais a cada reinício.' },
];

const metodoDiagnostico = [
  { num: '1', title: 'Reproduzir e anotar', desc: 'Repita a ação e anote onde falhou: qual tela, qual nó do workflow ou qual comando.' },
  { num: '2', title: 'Pegar a mensagem exata', desc: 'No n8n, abra Executions e clique no nó em vermelho. No Render, abra Logs. No navegador, use F12 e a aba Network. A mensagem da tela do site mostra só o status.' },
  { num: '3', title: 'Enviar a mensagem completa, sem senhas', desc: 'Informe o nome do nó, a URL chamada e o texto do erro. Um pedaço da pilha de erro, como o final do Axios, não diz qual nó falhou.' },
  { num: '4', title: 'Aplicar a correção e repetir o teste', desc: 'Salve e publique o workflow, refaça o deploy quando mudar variáveis e rode de novo o mesmo teste que falhou.' },
];

const ondeErro: string[][] = [
  ['n8n, Executions', 'Abra a execução com erro e clique no nó em vermelho.', 'Nome do nó, URL chamada, status (404, 405, 500) e a mensagem do erro. É o primeiro lugar para olhar quando o site mostra HTTP 500.'],
  ['Render, Logs', 'Painel do serviço, aba Logs.', 'Exceções do Spring (linhas Caused by), falhas de conexão com o banco, falta de memória e reinícios do n8n.'],
  ['Navegador, DevTools', 'F12, aba Network, repita a ação no site.', 'Método, URL e resposta de cada chamada, o que revela CORS, URL errada e rota que mudou.'],
  ['PowerShell', 'Comandos da seção abaixo.', 'O corpo do erro 500 do webhook, o status de cada rota da API e a resolução do DNS.'],
];

const problemas: string[][] = [
  ['n8n, nó Criar Endereço: 405 Method not allowed (Whitelabel Error Page)', 'O workflow fazia POST em /api/enderecos-escolas, que só aceita GET. Na API, a criação é aninhada por escola.', 'Usar POST /api/enderecos-escolas/escola/{escolaId}. O mesmo vale para avaliações de qualidade, cursos e professores. As rotas certas estão em src/services/api.ts, ou no DevTools ao salvar um registro no site.'],
  ['Avaliação do curso gravada na rota errada', 'A rota foi deduzida pelo nome do ícone do menu (avaliacoes-alunos) em vez de lida no código.', 'Usar POST /api/avaliacoes-cursos/curso/{cursoId}, como no api.ts. Confirmar a rota no código antes de assumir.'],
  ['Dados gerados não batem com a API', 'O prompt pedia nota de 0 a 10, o campo data e alunos com nome. A API usa nota de 1 a 5 na qualidade, dataAvaliacao e alunos só com indicadores de deslocamento.', 'Montar o modelo do prompt a partir dos formulários do site e validar tudo no nó Extrair Escolas (nota limitada, tipo e transporte válidos).'],
  ['Estourou o limite da IA: resposta cortada ou erro 429', 'Registros demais em uma só resposta (10 escolas com 10 alunos cada).', 'Reduzir no nó Config: qtdEscolas 5, qtdAlunos 1 e qtdProfessores 1. Em erro 429, esperar cerca de 1 minuto e executar de novo.'],
  ['Gemini não retornou conteúdo (nó Extrair Escolas)', 'O nó Gemini do n8n devolve { text }, e o código esperava o formato candidates da chamada HTTP.', 'O código passou a aceitar text, output, response e candidates. O erro agora mostra o final do texto recebido, o que ajuda quando o JSON vem cortado.'],
  ['Escola criada sem endereço, aluno ou avaliação', 'A execução parou no meio, depois de criar a escola.', 'Verificação final que cruza as listas da API por escola, mais um ramo de reparo com um segundo Gemini, limitado por maxReparos. Se ainda restar pendência, execute de novo.'],
  ['Tela Escolas com texto sobreposto', 'E-mails e endereços gerados são mais longos que as colunas.', 'Larguras por coluna, texto cortado com reticências e rolagem horizontal na tabela.'],
  ['Aba N8N mostra a versão antiga', 'Um N8N.jsx antigo na pasta tem prioridade sobre o N8N.tsx no Vite.', 'Apagar o N8N.jsx, manter N8N.tsx e n8n-fluxo.json na mesma pasta, rodar npm run dev -- --force e Ctrl+F5. A legenda abaixo do desenho mostra o nome do fluxo e o número de etapas.'],
  ['Webhook aberto no navegador: 404 This webhook is not registered for GET requests', 'O webhook só aceita POST. A resposta é esperada e mostra que o n8n está no ar.', 'Testar pela aba N8N ou pelo PowerShell com Invoke-RestMethod -Method Post. A URL /webhook-test exige Listen for test event. A URL /webhook exige o workflow publicado.'],
  ['Failed to fetch no site; no PowerShell: o nome remoto não pôde ser resolvido', 'URL do serviço incorreta (o Render pode acrescentar um sufixo ao nome) ou problema de DNS na rede.', 'Copiar a URL do painel do Render, testar com nslookup e abrir /healthz. Atualizar VITE_N8N_WEBHOOK_URL e refazer o deploy do frontend.'],
  ['Site mostra: O n8n respondeu HTTP 500', 'Algum nó falhou dentro do workflow, e o n8n responde 500 ao webhook.', 'No n8n, abrir Executions, clicar no nó em vermelho e ler a mensagem. No terminal, o comando que lê o corpo do erro mostra o detalhe.'],
  ['Listar Escolas: 404 em /api/escolas/api/escolas', 'O baseUrl do nó Config continha a rota completa, e o fluxo acrescenta /api/escolas por conta própria.', 'Deixar só o domínio (https://webservice-xirs.onrender.com). O Config agora remove sobras de /api e barras. Salvar e publicar de novo, porque o webhook de produção roda a versão publicada.'],
  ['The connection cannot be established, this usually occurs due to an incorrect host', 'baseUrl local (localhost ou host.docker.internal) no n8n que roda no Render.', 'Usar o endereço público do backend no baseUrl. O arquivo workflows/gerar-escolas-gemini.json já vem com ele.'],
  ['Whitelabel Error Page 404 do Spring Boot', 'Rota inexistente no backend publicado, ou URL montada errada pelo workflow.', 'Testar todas as rotas com o script de rotas (todas devem dar 200). Se alguma falhar, conferir o último deploy do backend. Se todas passarem, o erro está na URL montada pelo workflow.'],
  ['n8n perde workflows e conta; reaparece a tela Customize n8n to you', 'Sem banco externo, o n8n usa SQLite no disco do container, que é apagado a cada reinício ou quando o serviço dorme.', 'Conectar o n8n ao PostgreSQL (DB_TYPE e DB_POSTGRESDB_*), definir N8N_ENCRYPTION_KEY e testar com Restart service e o comando \\dt.'],
  ['Qual valor usar em N8N_ENCRYPTION_KEY', 'A chave é gerada por você: o n8n não a fornece.', 'Gerar com o comando do passo 4, guardar fora do GitHub e nunca alterar. Recriar a credencial do Gemini se ela tiver sido salva antes de a chave existir.'],
  ['Primeira chamada demora cerca de 1 minuto', 'Serviços do plano gratuito dormem depois de um tempo sem uso.', 'Os nós HTTP têm timeout de 90 segundos. Execute de novo logo depois que o serviço acordar. Para uso contínuo, prefira um plano pago.'],
];

const checklistProducao = [
  'O backend responde 200 em /api/escolas e nas demais rotas usadas pelo workflow.',
  'O frontend tem VITE_API_URL e VITE_N8N_WEBHOOK_URL, e passou por novo deploy depois de criá-las.',
  'O n8n responde em /healthz, tem a conta de dono criada e mantém os dados depois de um Restart service.',
  'A credencial do Gemini está selecionada nos dois nós de modelo.',
  'No nó Config, o baseUrl é o endereço público do backend, sem /api no final.',
  'O workflow está publicado.',
  'O CORS do nó Webhook está limitado ao endereço do frontend.',
  'Nenhum segredo está no GitHub, nem no histórico de commits.',
];

// ─── Componente da aba ───────────────────────────────────────────────────────

function TabN8nRender() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2 as="h2">n8n no Render: instalação, variáveis e segurança</Title2>
        <Divider />
        <Body1>
          O workflow do n8n gera escolas novas com o Gemini, grava tudo pela API do backend e valida o resultado,
          completando o que ficar faltando. O frontend dispara o workflow pela aba N8N. Esta página reúne os serviços
          no Render, as variáveis de cada um, o passo a passo do n8n, as regras de segurança e um resumo dos problemas
          encontrados durante a implantação.
        </Body1>
      </div>

      <div className={s.section}>
        <Title3 as="h3">Serviços e fluxo de uma execução</Title3>
        <TabelaSimples
          titulo="Serviços do projeto no Render"
          colunas={['Serviço', 'Tipo no Render', 'Endereço', 'Papel']}
          linhas={servicosRender}
          codigo={[2]}
        />
        <Text size={200}>
          Fluxo: o navegador envia um POST ao webhook do n8n. O n8n lê as escolas da API, pede ao Gemini os dados
          novos, grava endereços, avaliações, cursos, alunos e professores pela API, confere se alguma escola ficou
          incompleta e, se ficou, pede ao Gemini os dados que faltam. No fim, devolve ao site o resumo com os totais.
        </Text>
      </div>

      <div className={s.section}>
        <Title3 as="h3">1. PostgreSQL: campos e variáveis</Title3>
        <Text size={200}>
          O projeto usa dois bancos PostgreSQL: o da API (Spring Boot) e o do n8n. O painel do Render mostra os mesmos
          campos nos dois. O banco do n8n guarda workflows, credenciais, conta e execuções. Sem ele, o n8n perde tudo a
          cada reinício. Prefira um banco separado do banco da API.
        </Text>
        <TabelaVariaveis titulo="Campos de conexão do PostgreSQL no Render" itens={pgCampos} />
        <TabelaSimples
          titulo="Como os campos do PostgreSQL viram variáveis do backend e do n8n"
          colunas={['Campo do Render', 'Backend (Spring Boot)', 'n8n']}
          linhas={pgMapa}
          codigo={[0, 1, 2]}
        />
        <div className={s.noteBox}>
          <Warning16Regular style={{ color: tokens.colorStatusWarningForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>
            Os limites do PostgreSQL gratuito do Render, como o prazo de validade, mudam com o tempo. Confira os valores
            atuais no painel antes de depender dele para dados que não podem se perder.
          </Text>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">2. Backend: variáveis</Title3>
        <Text size={200}>
          Configuradas no Web Service do backend (Docker), na aba Environment. O esquema do banco é criado pelo script
          SQL, porque o ddl-auto está como none.
        </Text>
        <TabelaVariaveis titulo="Variáveis do backend" itens={backendVars} />
        <Text size={200}>Rotas da API que o workflow do n8n usa:</Text>
        <TabelaSimples
          titulo="Rotas da API usadas pelo workflow"
          colunas={['Etapa do workflow', 'Método', 'Rota']}
          linhas={rotasWorkflow}
          codigo={[1, 2]}
        />
        <div className={s.noteBox}>
          <Warning16Regular style={{ color: tokens.colorStatusWarningForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>
            As avaliações de curso usam /api/avaliacoes-cursos, e não /api/avaliacoes-alunos. Em caso de dúvida,
            vale a rota do api.ts do frontend.
          </Text>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">3. Frontend: variáveis</Title3>
        <Text size={200}>
          Configuradas no Static Site (Root Directory frontendWeb, Build Command npm ci &amp;&amp; npm run build, Publish
          Directory dist). O Vite grava as variáveis no código durante o build, então toda mudança exige um novo deploy
          do frontend.
        </Text>
        <TabelaVariaveis titulo="Variáveis do frontend" itens={frontendVars} />
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>
            Em desenvolvimento local o proxy do Vite encaminha /api para http://localhost:8090. A aba N8N usa
            http://localhost:5678/webhook/gerar-escolas quando VITE_N8N_WEBHOOK_URL não existe. O desenho do workflow
            vem do arquivo n8n-fluxo.json, que deve ficar na mesma pasta da página N8N.tsx.
          </Text>
        </div>
      </div>

      <div className={s.section}>
        <Title3 as="h3">4. n8n: instalar no Render</Title3>
        <Text size={200}>
          O n8n roda como Web Service Docker criado manualmente, sem Blueprint. Os passos abaixo seguem a ordem em que
          precisam ser feitos.
        </Text>
        <Passos itens={passosN8n.slice(0, 3)} />
        <Title3 as="h3">Variáveis do serviço n8n</Title3>
        <TabelaVariaveis titulo="Variáveis do serviço n8n" itens={n8nVars} />
        <Passos itens={passosN8n.slice(3)} />
        <Title3 as="h3">Campos do nó Config no workflow</Title3>
        <Text size={200}>
          Estes valores ficam no próprio workflow (nó Config), e não nas variáveis do Render. Mudam o que a execução
          gera e para onde ela grava.
        </Text>
        <TabelaSimples
          titulo="Campos do nó Config do workflow"
          colunas={['Campo', 'Valor', 'Descrição']}
          linhas={configWorkflow}
          codigo={[0, 1]}
        />
      </div>

      <div className={s.section}>
        <Title3 as="h3">5. Segurança: o que fica no Render e nunca no GitHub</Title3>
        <div className={s.noteBox}>
          <Warning16Regular style={{ color: tokens.colorStatusWarningForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>
            Todas as variáveis abaixo são criadas no painel do Render, com os valores reais. Em hipótese nenhuma elas
            vão para o GitHub: o repositório recode.n8n é público. Os valores da tabela são exemplos ou espaços para
            preencher.
          </Text>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className={s.table} aria-label="Inventário das variáveis a criar no Render">
            <thead>
              <tr>
                <th scope="col" className={s.th}>Serviço</th>
                <th scope="col" className={s.th}>Variável</th>
                <th scope="col" className={s.th}>Valor a configurar</th>
                <th scope="col" className={s.th}>Classificação</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((v, i) => (
                <tr key={`${v.servico}-${v.nome}`} className={i % 2 === 0 ? s.trAlt : undefined}>
                  <td className={s.td}>{v.servico}</td>
                  <td className={s.td}><span className={s.inlineCode}>{v.nome}</span></td>
                  <td className={s.td}><span className={s.inlineCode} style={{ wordBreak: 'break-word' }}>{v.valor}</span></td>
                  <td className={s.td}><ClasseBadge classe={v.classe} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Text size={200}>
          Segredo: dá acesso a dados ou a contas, e nunca aparece em print, log compartilhado ou repositório.
          Configuração: específica do ambiente, criada no Render e fora do repositório. Público: valor que o navegador
          enxerga, então só pode conter endereços.
        </Text>

        <div className={s.cardGrid2}>
          <Card>
            <CardHeader header={<Text weight="semibold">Pode ir para o GitHub</Text>} />
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {podeIrParaGithub.map(item => (
                <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                  <CheckmarkCircle16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader header={<Text weight="semibold">Nunca vai para o GitHub</Text>} />
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {nuncaIrParaGithub.map(item => (
                <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                  <Warning16Regular style={{ color: tokens.colorStatusDangerForeground1, flexShrink: 0, marginTop: 2 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Text weight="semibold">Arquivo .gitignore recomendado</Text>
        <pre className={s.codeBlock}>{`.env
*.env
.env.*`}</pre>

        <Title3 as="h3">Boas práticas</Title3>
        {boasPraticas.map(item => (
          <Card key={item.titulo}>
            <CardHeader
              header={<Text weight="semibold">{item.titulo}</Text>}
              description={<Text size={200}>{item.texto}</Text>}
            />
          </Card>
        ))}
      </div>

      <div className={s.section}>
        <Title3 as="h3">6. Resumo executivo: problemas e como resolver</Title3>
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>
            Quase todos os problemas da implantação vieram de quatro causas. Cada um foi resolvido da mesma forma:
            pegar a mensagem de erro exata no lugar certo, enviá-la completa e aplicar a correção que ela indicava.
          </Text>
        </div>

        <div className={s.cardGrid2}>
          {causasRaiz.map(c => (
            <Card key={c.titulo}>
              <CardHeader
                header={<Text weight="semibold">{c.titulo}</Text>}
                description={<Text size={200}>{c.texto}</Text>}
              />
            </Card>
          ))}
        </div>

        <Title3 as="h3">Como diagnosticar um erro</Title3>
        <Passos itens={metodoDiagnostico} />

        <Title3 as="h3">Onde encontrar a mensagem de erro</Title3>
        <TabelaSimples
          titulo="Onde encontrar a mensagem de erro"
          colunas={['Onde', 'Como abrir', 'O que mostra']}
          linhas={ondeErro}
        />

        <Title3 as="h3">Problemas encontrados</Title3>
        <TabelaSimples
          titulo="Problemas encontrados, causa e solução"
          colunas={['Problema e mensagem', 'Causa', 'Como resolver']}
          linhas={problemas}
        />

        <Title3 as="h3">Comandos úteis no PowerShell</Title3>
        <Passos
          itens={[
            {
              num: '1',
              title: 'Testar o webhook',
              desc: 'Executa o workflow de verdade e cria registros. Abrir a URL no navegador não serve: o webhook só aceita POST.',
              code: 'Invoke-RestMethod -Method Post -Uri "https://recode-n8n.onrender.com/webhook/gerar-escolas" -ContentType "application/json" -Body "{}"',
            },
            {
              num: '2',
              title: 'Ler o corpo de um erro 500',
              desc: 'Mostra o texto que o n8n devolveu, em vez de só o status.',
              code: `try { Invoke-RestMethod -Method Post -Uri "https://recode-n8n.onrender.com/webhook/gerar-escolas" -ContentType "application/json" -Body "{}" } catch { (New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())).ReadToEnd() }`,
            },
            {
              num: '3',
              title: 'Testar as rotas da API',
              desc: 'Todas devem responder 200. A primeira chamada pode levar cerca de 1 minuto se o backend estiver dormindo.',
              code: `$base = "https://webservice-xirs.onrender.com"
"escolas","enderecos-escolas","avaliacoes-qualidade","cursos","avaliacoes-cursos","professores","alunos" | ForEach-Object {
  try { $r = Invoke-WebRequest "$base/api/$_" -UseBasicParsing; "$_ -> $($r.StatusCode)" }
  catch { "$_ -> $($_.Exception.Response.StatusCode.value__)" }
}`,
            },
            {
              num: '4',
              title: 'Conferir o DNS e a saúde do n8n',
              desc: 'O /healthz deve responder com status ok.',
              code: `nslookup recode-n8n.onrender.com
Invoke-RestMethod https://recode-n8n.onrender.com/healthz`,
            },
          ]}
        />

        <Title3 as="h3">Checklist antes de considerar em produção</Title3>
        <Card>
          <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {checklistProducao.map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13 }}>
                <CheckmarkCircle16Regular style={{ color: tokens.colorBrandForeground1, flexShrink: 0, marginTop: 2 }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TAB_NOMES: Record<string, string> = {
  overview: 'Visão Geral', bd: 'Banco de Dados', uml: 'UML', endpoints: 'Endpoints',
  testes: 'Testes', guias: 'Guias', plugin: 'Plugin VS Code', ia: 'IA', n8n: 'Render',
};

export default function Documentacao() {
  const s = useStyles();
  const [tab, setTab] = useState<string>('overview');

  return (
    <div className={s.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className={s.hero}>
        <div className={s.heroMark} aria-hidden="true"><DocumentBulletList24Regular style={{ fontSize: '44px' }} /></div>
        <div className={s.heroBody}>
          <Text size={200} className={s.heroKicker}>Recode · Projeto final</Text>
          <Title1 as="h1" style={{ color: '#fff' }}>Documentação do Projeto</Title1>
          <Body1 className={s.heroLead}>
            Arquitetura, banco de dados, endpoints, testes e guias de publicação do sistema Spring Boot + React Fluent UI,
            incluindo o workflow n8n no Render.
          </Body1>
          <div className={s.chips}>
            <span className={s.chip}>9 seções</span>
            <span className={s.chip}>Spring Boot + React</span>
            <span className={s.chip}>PostgreSQL · Render · n8n</span>
            <span className={s.chip}><span className={s.srOnly}>Versão </span>v1.0</span>
          </div>
          <div className={s.heroActions}>
            <Button appearance="outline" className={s.heroBtn} icon={<Database24Regular />} onClick={() => setTab('bd')}>
              Banco de dados
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<ShareAndroid24Regular />} onClick={() => setTab('endpoints')}>
              Endpoints
            </Button>
            <Button appearance="outline" className={s.heroBtn} icon={<Flash24Regular />} onClick={() => setTab('n8n')}>
              Render
            </Button>
          </div>
        </div>
      </header>

      {/* ── Abas ─────────────────────────────────────────────────────────── */}
      <div className={s.tabsWrap}>
        <TabList
          aria-label="Seções da documentação"
          selectedValue={tab}
          onTabSelect={(_: unknown, d: SelectTabData) => setTab(d.value as string)}
          size="large"
        >
          <Tab value="overview" className={s.tab} icon={<BookOpen24Regular />}>Visão Geral</Tab>
          <Tab value="bd" className={s.tab} icon={<Database24Regular />}>Banco de Dados</Tab>
          <Tab value="uml" className={s.tab} icon={<CodeBlock24Regular />}>UML</Tab>
          <Tab value="endpoints" className={s.tab} icon={<ShareAndroid24Regular />}>Endpoints</Tab>
          <Tab value="testes" className={s.tab} icon={<ClipboardTaskAdd24Regular />}>Testes</Tab>
          <Tab value="guias" className={s.tab} icon={<Lightbulb24Regular />}>Guias</Tab>
          <Tab value="plugin" className={s.tab} icon={<PuzzlePiece24Regular />}>Plugin VS Code</Tab>
          <Tab value="ia" className={s.tab} icon={<Sparkle24Regular />}>IA</Tab>
          <Tab value="n8n" className={s.tab} icon={<Flash24Regular />}>Render</Tab>
        </TabList>
      </div>

      <div role="tabpanel" aria-label={TAB_NOMES[tab]} className={s.panel}>
      {tab === 'overview'  && <TabOverview />}
      {tab === 'bd'        && <TabBancoDados />}
      {tab === 'uml'       && <TabUML />}
      {tab === 'endpoints' && <TabEndpoints />}
      {tab === 'testes'    && <TabTestes />}
      {tab === 'guias'     && <TabGuias />}
      {tab === 'plugin'    && <TabPlugin />}
      {tab === 'ia'        && <TabIA />}
      {tab === 'n8n'       && <TabN8nRender />}
      </div>
    </div>
  );
}
