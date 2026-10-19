import { useState } from 'react';
import {
  makeStyles, tokens,
  Text, Title1, Title2, Title3, Body1, Caption1,
  Card, CardHeader, Divider, Badge,
  Tab, TabList,
  type SelectTabData,
} from '@fluentui/react-components';
import {
  DocumentBulletList24Regular,
  Database24Regular,
  CodeBlock24Regular,
  ShareAndroid24Regular,
  ClipboardTaskAdd24Regular,
  BookOpen24Regular,
  ArrowRight16Regular,
  CheckmarkCircle16Regular,
  Warning16Regular,
  Info16Regular,
} from '@fluentui/react-icons';
import iaMarkdown from '../../../IA.md?raw';

// ─── Estilos ────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  page: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    maxWidth: '980px',
  },
  hero: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '24px', borderRadius: tokens.borderRadiusLarge,
    background: `linear-gradient(135deg, #1e3a5f, #0f6cbd)`,
    color: '#fff', marginBottom: '24px',
  },
  heroText: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 },
  heroTag:  { flexShrink: 0, whiteSpace: 'nowrap' },
  heroIcon: {
    width: '56px', height: '56px', borderRadius: tokens.borderRadiusLarge,
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tabContent: {
    paddingTop: '24px',
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
  get: { backgroundColor: '#e6f4ea', color: '#137333' },
  post: { backgroundColor: '#e8f0fe', color: '#1a73e8' },
  put: { backgroundColor: '#fef7e0', color: '#b06000' },
  del: { backgroundColor: '#fce8e6', color: '#c5221f' },
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
    padding: '12px 16px', borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorStatusWarningBorder1}`,
    backgroundColor: tokens.colorStatusWarningBackground1,
    display: 'flex', gap: '8px',
  },
  infoBox: {
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
  { group: 'Produtos', items: [
    { m: 'GET', p: '/api/produtos', d: 'Lista todos os produtos' },
    { m: 'GET', p: '/api/produtos/{id}', d: 'Busca produto por ID' },
    { m: 'POST', p: '/api/produtos', d: 'Cria produto' },
    { m: 'PUT', p: '/api/produtos/{id}', d: 'Atualiza produto' },
    { m: 'DELETE', p: '/api/produtos/{id}', d: 'Remove produto' },
  ]},
  { group: 'Avaliações', items: [
    { m: 'GET', p: '/api/avaliacoes-alunos', d: 'Lista avaliações de alunos' },
    { m: 'GET', p: '/api/avaliacoes-alunos/aluno/{alunoId}', d: 'Avaliações por aluno' },
    { m: 'POST', p: '/api/avaliacoes-alunos', d: 'Cria avaliação de aluno' },
    { m: 'GET', p: '/api/avaliacoes-qualidade/escola/{escolaId}', d: 'Avaliações de qualidade da escola' },
    { m: 'POST', p: '/api/avaliacoes-qualidade/escola/{escolaId}', d: 'Cria avaliação de qualidade' },
  ]},
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
        <Title2>Visão Geral do Sistema</Title2>
        <Divider />
        <Body1>
          O <strong>Portal de Suprimentos ODS 4</strong> é um sistema B2B para gerenciamento educacional e venda de materiais escolares, 
          alinhado ao <strong>Objetivo de Desenvolvimento Sustentável 4 — Educação de Qualidade</strong> da ONU / Agenda 2030. 
          O backend expõe uma API REST completa; o frontend é construído com <strong>React + Fluent UI v9</strong>.
        </Body1>
      </div>

      <div className={s.section}>
        <Title3>Stack Tecnológico</Title3>
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
        <Title3>Arquitetura em Camadas (Backend)</Title3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { layer: '① Controller', color: '#0f6cbd', chips: ['EscolaController', 'AlunoController', 'ProfessorController', 'PedidoController', 'ProdutoController', '+ 7 outros'], desc: 'Recebe requisições HTTP, valida via @Valid e delega ao Service. Retorna ResponseEntity com status correto.' },
            { layer: '② Service', color: '#107c10', chips: ['EscolaService', 'AlunoService', 'ProfessorService', 'PedidoService', '+ 8 outros'], desc: 'Regra de negócio: resolução de entidades relacionadas, definição de datas, lançamento de RuntimeException para not-found.' },
            { layer: '③ Repository', color: '#8764b8', chips: ['JpaRepository<E,Long>', 'findByNomeContainingIgnoreCase', 'findByEscolaId', 'findByProfessorId'], desc: 'Interfaces Spring Data JPA com derived queries. Sem SQL manual.' },
            { layer: '④ Model / Entity', color: '#c43501', chips: ['@Entity', '@Table', '@ManyToOne', '@JoinColumn', '@Enumerated', '@GeneratedValue'], desc: '11 entidades JPA mapeadas, sem relações bidirecionais @OneToMany.' },
            { layer: '⑤ Banco de Dados', color: '#797673', chips: ['PostgreSQL', 'Spring Data JPA', 'Hibernate'], desc: 'O schema PostgreSQL é provisionado pelo script SQL; spring.jpa.hibernate.ddl-auto=none.' },
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
        <Title3>Seed de Dados</Title3>
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
        <Title2>Modelagem do Banco de Dados</Title2>
        <Divider />
        <Body1>
          Banco PostgreSQL. O modelo visual abaixo reflete os relacionamentos JPA do backend; veja o script PostgreSQL
          na raiz do projeto para a definição física do schema.
        </Body1>
      </div>

      <div className={s.section}>
        <Title3>Diagrama ER Simplificado</Title3>
        <div className={s.erDiagram} role="region" aria-label="Diagrama de entidades e relacionamentos do banco de dados">
          <div className={s.erRow}>
            {tabelas.map(t => <ErTable key={t.nome} t={t} />)}
          </div>
        </div>
      </div>

      <div className={s.section}>
        <Title3>Relacionamentos Principais</Title3>
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
        <Title3>Script de Criação — PostgreSQL</Title3>
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
        <Title2>Diagramas do projeto</Title2>
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
            <Title3>{diagram.title}</Title3>
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
          <Title2>Diagrama de Classes (UML)</Title2>
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
        <Title3>Camadas de Serviço — Diagrama de Pacotes</Title3>
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
        <Title2>Referência de Endpoints (API REST)</Title2>
        <Divider />
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>Base URL: <span className={s.inlineCode}>http://localhost:8090</span> · Porta configurada em <span className={s.inlineCode}>application.properties</span></Text>
        </div>
      </div>
      {endpoints.map(group => (
        <div key={group.group} className={s.section}>
          <Title3>{group.group}</Title3>
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
    </div>
  );
}

function TabGuias() {
  const s = useStyles();
  return (
    <div className={s.tabContent}>
      <div className={s.section}>
        <Title2>Guias Técnicos</Title2>
        <Divider />
      </div>

      {/* Guia Fluent UI */}
      <div className={s.section}>
        <Title3>1. Configuração React + Fluent UI v9</Title3>
        {[
          { num: '1', title: 'Instalar Node.js LTS', code: 'node -v\nnpm -v' },
          { num: '2', title: 'Criar projeto Vite + React + TypeScript', code: 'npm create vite@latest meu-projeto -- --template react-ts\ncd meu-projeto && npm install' },
          { num: '3', title: 'Instalar Fluent UI v9', code: 'npm install @fluentui/react-components @fluentui/react-icons' },
          { num: '4', title: 'Instalar dependências adicionais', code: 'npm install react-router-dom axios' },
          { num: '5', title: 'Limpar CSS global (evita conflito com tokens Fluent)', code: '// Esvaziar src/index.css e src/App.css completamente' },
        ].map(step => (
          <div key={step.num} className={s.stepRow}>
            <div className={s.stepNum}>{step.num}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <Text weight="semibold">{step.title}</Text>
              <pre className={s.codeBlock}>{step.code}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Guia Migração */}
      <div className={s.section}>
        <Title3>2. Migração MySQL → PostgreSQL (pgloader)</Title3>
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
        <Title3>3. Resolução de Problemas Comuns</Title3>
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
          <Title3>Publicar a aplicação no Render.com</Title3>
          <Text size={200}>
            Crie ou selecione um PostgreSQL no Render e mantenha o serviço web na mesma região para usar a conexão interna quando disponível.
            Não publique senhas no repositório nem em variáveis VITE_, pois variáveis Vite ficam visíveis no bundle do navegador.
          </Text>
          {[
            {
              num: '1',
              title: 'Criar o banco PostgreSQL',
              code: 'Render Dashboard → New + → PostgreSQL. Guarde o host, a porta, o nome do banco, o usuário e a senha. Execute script_tabelas_recodedb_postgresql.sql uma vez no banco vazio; ele cria o esquema usado pela API.',
            },
            {
              num: '2',
              title: 'Criar o backend como Web Service Docker',
              code: 'New + → Web Service → conecte o repositório leandrocrisci/recode-projeto-final. Use a branch main, selecione Docker como runtime e informe backendJava/Dockerfile como caminho do Dockerfile. Mantenha a raiz do repositório como contexto de build, pois o Dockerfile copia o projeto e compila backendJava.',
            },
            {
              num: '3',
              title: 'Configurar variáveis do backend',
              code: 'SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<database>?sslmode=require\nSPRING_DATASOURCE_USERNAME=<usuario-do-postgresql>\nSPRING_DATASOURCE_PASSWORD=<senha-do-postgresql>\nCORS_ALLOWED_ORIGINS=https://<url-do-frontend>.onrender.com,http://localhost:5174',
            },
            {
              num: '4',
              title: 'Criar o frontend como Static Site',
              code: 'New + → Static Site → conecte o mesmo repositório. Root Directory: frontendWeb. Build Command: npm ci && npm run build. Publish Directory: dist. Em Environment, configure VITE_API_URL=https://<url-do-backend>.onrender.com/api.',
            },
            {
              num: '5',
              title: 'Publicar e validar',
              code: 'Salve as variáveis e faça deploy dos dois serviços. VITE_API_URL exige novo build do frontend após cada mudança. Teste GET https://<url-do-backend>.onrender.com/api/cursos; espere 200 e JSON. Se retornar 500, consulte os logs do backend. Para CORS, confira também OPTIONS, Origin e Access-Control-Allow-Origin no DevTools.',
            },
          ].map(step => (
            <div key={step.num} className={s.stepRow}>
              <div className={s.stepNum}>{step.num}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <Text weight="semibold">{step.title}</Text>
                <pre className={s.codeBlock}>{step.code}</pre>
              </div>
            </div>
          ))}
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
        <Title2>Plano de Testes</Title2>
        <Divider />
        <div className={s.infoBox}>
          <Info16Regular style={{ color: tokens.colorStatusSuccessForeground1, flexShrink: 0, marginTop: 2 }} />
          <Text size={200}>Servidor: <span className={s.inlineCode}>http://localhost:8090</span> · Ferramenta: Postman / Insomnia / curl</Text>
        </div>
      </div>

      <div className={s.section}>
        <Title3>Casos de Teste — Escolas</Title3>
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
        <Title3>Casos de Teste — Professores e Pedidos</Title3>
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
        <Title3>Verificações de Integridade SQL</Title3>
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
        <Title2>Draw.io Integration — Plugin VS Code</Title2>
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
        <Title3>Fontes dos diagramas Draw.io</Title3>
        <Body1>
          Os arquivos editáveis ficam em <span className={s.inlineCode}>frontendWeb/public/diagramas</span>.
          As versões SVG exibidas nesta página devem ser atualizadas quando uma fonte for alterada.
        </Body1>
        {[
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
        ].map(step => (
          <div key={step.num} className={s.stepRow}>
            <div className={s.stepNum}>{step.num}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              <Text weight="semibold">{step.title}</Text>
              <pre className={s.codeBlock}>{step.code}</pre>
            </div>
          </div>
        ))}
      </div>

      <div className={s.section}>
        <Title3>Outras Extensões Úteis para o Projeto</Title3>
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
        <Title2>Inteligência Artificial e publicação do projeto</Title2>
        <Body1>
          Introdução executiva ao GitHub, GitHub Copilot e Render, com instruções para consultar o repositório e conhecer
          as principais melhorias realizadas com apoio de IA. Este conteúdo é carregado do arquivo <span className={s.inlineCode}>IA.md</span>.
        </Body1>
      </div>
      <div className={s.cardGrid2}>
        {secoes.map(secao => (
          <Card key={secao.titulo}>
            <CardHeader header={<Title3>{secao.titulo}</Title3>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 16px 16px' }}>
              {renderLinhas(secao.linhas)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

const TAB_NOMES: Record<string, string> = {
  overview: 'Visão Geral', bd: 'Banco de Dados', uml: 'UML / Arquitetura', endpoints: 'Endpoints',
  testes: 'Plano de Testes', guias: 'Guias', plugin: 'Plugin VS Code', ia: 'IA',
};

export default function Documentacao() {
  const s = useStyles();
  const [tab, setTab] = useState<string>('overview');

  return (
    <div className={s.page}>
      {/* Hero */}
      <div className={s.hero}>
        <div className={s.heroIcon} aria-hidden="true">
          <DocumentBulletList24Regular style={{ fontSize: 28, color: '#fff' }} />
        </div>
        <div className={s.heroText}>
          <Title1 style={{ color: '#fff' }}>Documentação do Projeto</Title1>
          <Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            Recode · Spring Boot + React Fluent UI
          </Text>
        </div>
        <Badge appearance="filled" color="informative" size="large" className={s.heroTag}>
          <span className={s.srOnly}>Versão </span>v1.0
        </Badge>
      </div>

      {/* Tabs */}
      <TabList
        aria-label="Seções da documentação"
        selectedValue={tab}
        onTabSelect={(_: unknown, d: SelectTabData) => setTab(d.value as string)}
        size="medium"
      >
        <Tab value="overview" icon={<BookOpen24Regular />}>Visão Geral</Tab>
        <Tab value="bd" icon={<Database24Regular />}>Banco de Dados</Tab>
        <Tab value="uml" icon={<CodeBlock24Regular />}>UML</Tab>
        <Tab value="endpoints" icon={<ShareAndroid24Regular />}>Endpoints</Tab>
        <Tab value="testes" icon={<ClipboardTaskAdd24Regular />}>Plano de Testes</Tab>
        <Tab value="guias" icon={<ArrowRight16Regular />}>Guias</Tab>
        <Tab value="plugin" icon={<Info16Regular />}>Plugin VS Code</Tab>
        <Tab value="ia" icon={<Info16Regular />}>IA</Tab>
      </TabList>

      <div role="tabpanel" aria-label={TAB_NOMES[tab]}>
      {tab === 'overview'  && <TabOverview />}
      {tab === 'bd'        && <TabBancoDados />}
      {tab === 'uml'       && <TabUML />}
      {tab === 'endpoints' && <TabEndpoints />}
      {tab === 'testes'    && <TabTestes />}
      {tab === 'guias'     && <TabGuias />}
      {tab === 'plugin'    && <TabPlugin />}
      {tab === 'ia'        && <TabIA />}
      </div>
    </div>
  );
}
