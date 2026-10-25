import React, { useEffect, useState, useMemo } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Textarea, Select,
  DataGrid, DataGridHeader, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Card, CardHeader, CardPreview, CardFooter,   Badge, Subtitle2
} from '@fluentui/react-components';
import {
  Add24Regular, Edit24Regular, Delete24Regular, Box24Regular, Grid24Regular, 
  Table24Regular, Cart24Regular, Search24Regular,
  DocumentText24Regular, Pen24Regular, Eraser24Regular, Wrench24Regular, 
  Ruler24Regular, Cut24Regular, Backpack24Regular, Folder24Regular, Calculator24Regular
} from '@fluentui/react-icons';
import { getProdutos, createProduto, updateProduto, deleteProduto, getEscolas, getProfessores, createPedido } from '../services/api';
import type { Produto, Escola, Professor } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { useConfirm } from '../hooks/useConfirm';
import { cmpNumero, cmpTexto } from '../utils/tableSort';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  caderno: DocumentText24Regular, caneta: Pen24Regular, apagador: Eraser24Regular,
  ferramentas: Wrench24Regular, régua: Ruler24Regular, tesoura: Cut24Regular,
  bolsa: Backpack24Regular, pasta: Folder24Regular, calculadora: Calculator24Regular, caixa: Box24Regular,
};

const renderIcon = (name?: string, style?: React.CSSProperties) => {
  const Icon = ICON_MAP[String(name).toLowerCase().trim()] || Box24Regular;
  return <Icon style={style} />;
};

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', backgroundColor: tokens.colorNeutralBackground2, padding: '12px 16px', borderRadius: tokens.borderRadiusMedium },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  cardPreview: { height: '100px', backgroundColor: tokens.colorNeutralBackground3, display: 'flex', alignItems: 'center', justifyContent: 'center' }
});

const emptyForm = { nome: '', descricao: '', preco: '', quantidade: '0', icone: '' };
const emptyPedido = { escolaId: '', professorId: '', quantidade: '1' };
export default function Produtos() {
  const s = useStyles(), fs = useFormStyles(), { isAdmin, abrirLogin } = useAuth();
  const { confirmar, dialog } = useConfirm();
  const [produtos, setProdutos] = useState<Produto[]>([]), [escolas, setEscolas] = useState<Escola[]>([]), [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [view, setView] = useState<'vitrine'|'estoque'>('vitrine'), [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false), [form, setForm] = useState(emptyForm), [editId, setEditId] = useState<number | null>(null), [saving, setSaving] = useState(false);
  const [pModal, setPModal] = useState(false), [pProd, setPProd] = useState<Produto | null>(null), [pForm, setPForm] = useState(emptyPedido), [pSaving, setPSaving] = useState(false), [pSuccess, setPSuccess] = useState(false);
  const [impModal, setImpModal] = useState(false), [sheetUrl, setSheetUrl] = useState(''), [impLoading, setImpLoading] = useState(false), [impSuccess, setImpSuccess] = useState('');

  const filtrados = useMemo(() => produtos.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.descricao ?? '').toLowerCase().includes(busca.toLowerCase())), [produtos, busca]);
  const fmtPreco = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
  const load = () => {
    setLoading(true);
    Promise.all([getProdutos(), getEscolas(), getProfessores()]).then(([p, e, pf]) => { setProdutos(p.data); setEscolas(e.data); setProfessores(pf.data); }).catch(() => setError('Erro ao carregar dados.')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleSolicitar = async (ev: React.FormEvent) => {
    ev.preventDefault(); if (!pForm.escolaId || !pForm.professorId) return setError('Selecione escola e professor.');
    setPSaving(true);
    try {
      await createPedido(Number(pForm.escolaId), pProd!.id, Number(pForm.professorId), { quantidade: Number(pForm.quantidade), valorUnitario: pProd!.preco, statusPedido: 'processando' });
      setPSuccess(true); setTimeout(() => { setPModal(false); setPSuccess(false); }, 1500);
    } catch { setError('Erro no pedido.'); } finally { setPSaving(false); }
  };

  // FUNÇÃO REATIVADA: Salva ou Atualiza itens de estoque manualmente
  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setSaving(true); setError('');
    const payload = { nome: form.nome, descricao: form.descricao, preco: Number(form.preco), quantidade: Number(form.quantidade), icone: form.icone || 'caixa', categoria: 'material_didatico' };
    try { 
      if (editId) await updateProduto(editId, payload); 
      else await createProduto(payload); 
      setModal(false); load(); 
    } catch { setError('Erro ao salvar produto.'); } finally { setSaving(false); }
  };
    const handleImportSheet = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError(''); setImpSuccess('');
    const matches = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!matches) return setError('URL da planilha inválida.');
    
    const sheetId = matches[1]; // Captura estritamente o ID isolado do array
    setImpLoading(true);

    try {
      // Altere a linha 77 do seu arquivo para:
        const urlCompleta = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
      
      // CORREÇÃO: Adicionado opções de CORS e omissão de credenciais
      const res = await fetch(urlCompleta, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!res.ok) throw new Error('Não foi possível ler a planilha pública. Verifique se o link está aberto para "Qualquer pessoa com o link".');
      
      const text = await res.text();
      const linhas = text.split('\n').map(l => l.trim()).filter(l => l !== '');
      if (linhas.length <= 1) throw new Error('Planilha vazia ou sem cabeçalhos válidos.');

      const cab = linhas[0].split(',').map(c => c.replace(/"/g, '').trim().toLowerCase());
      const iNome = cab.indexOf('nome'), iDesc = cab.indexOf('descricao'), iPreco = cab.indexOf('preco'), iQtd = cab.indexOf('quantidade'), iIcon = cab.indexOf('icone');

      if (iNome === -1 || iPreco === -1) throw new Error('Colunas obrigatórias "nome" ou "preco" ausentes na primeira linha.');

      let cadastrados = 0;
      for (let i = 1; i < linhas.length; i++) {
        const col = linhas[i].split(',').map(v => v.replace(/"/g, '').trim());
        if (!col[iNome]) continue;

        const rawIcon = iIcon !== -1 ? col[iIcon].toLowerCase() : 'caixa';

        await createProduto({
          nome: col[iNome],
          descricao: iDesc !== -1 ? col[iDesc] : '',
          preco: Number(col[iPreco]) || 0,
          quantidade: iQtd !== -1 ? Number(col[iQtd]) || 0 : 0,
          icone: ICON_MAP[rawIcon] ? rawIcon : 'caixa',
          categoria: 'material_didatico'
        });
        cadastrados++;
      }

      setImpSuccess(cadastrados + " produtos importados!");
      setSheetUrl(''); load(); setTimeout(() => setImpModal(false), 1500);
    } catch (err: any) { setError(err.message || 'Erro na importação.'); } finally { setImpLoading(false); }
  };

  const columns = [
    createTableColumn<Produto>({ columnId: 'nome', compare: (a, b) => cmpTexto(a.nome, b.nome), renderHeaderCell: () => 'Nome', renderCell: i => <TableCellLayout media={renderIcon(i.icone)}>{i.nome}</TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'preco', compare: (a, b) => cmpNumero(a.preco, b.preco), renderHeaderCell: () => 'Preço', renderCell: i => <TableCellLayout>{fmtPreco(i.preco)}</TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'qtd', compare: (a, b) => cmpNumero(a.quantidade, b.quantidade), renderHeaderCell: () => 'Estoque', renderCell: i => <TableCellLayout><Badge appearance="filled" color={i.quantidade > 0 ? 'success' : 'danger'}>{i.quantidade} un.</Badge></TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'acoes', renderHeaderCell: () => 'Ações', renderCell: i => isAdmin && (
      <TableCellLayout><div style={{ display: 'flex', gap: '6px' }}>
        <Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => { setForm({ nome: i.nome, descricao: i.descricao ?? '', preco: String(i.preco), quantidade: String(i.quantidade), icone: i.icone ?? '' }); setEditId(i.id); setModal(true); }} />
        <Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={async () => { if (await confirmar('Deseja excluir este produto?')) { await deleteProduto(i.id); load(); } }} />
      </div></TableCellLayout>
    ) }),
  ];

  return (
    <div className={s.page}>
      <PageHeader
        icon={<Box24Regular />}
        title="Produtos"
        subtitle="Catálogo de materiais escolares"
        actions={isAdmin && (
          <>
            <Button icon={<Grid24Regular />} appearance={view === 'vitrine' ? 'primary' : 'outline'} onClick={() => setView('vitrine')} />
            <Button icon={<Table24Regular />} appearance={view === 'estoque' ? 'primary' : 'outline'} onClick={() => setView('estoque')} />
            {/* <Button icon={<ArrowUpload24Regular />} onClick={() => { setError(''); setImpSuccess(''); setSheetUrl(''); setImpModal(true); }}>Importar da Planilha</Button> */}
            <Button appearance="primary" icon={<Add24Regular />} onClick={() => { setForm(emptyForm); setEditId(null); setModal(true); }}>Novo</Button>
          </>
        )}
      />

      {error && !impModal && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      <div className={s.filterBar}>
        <Input contentBefore={<Search24Regular />} placeholder="Pesquisar..." value={busca} onChange={e => setBusca(e.target.value)} />
        <Subtitle2>{filtrados.length} encontrados</Subtitle2>
      </div>

      {loading ? <Spinner label="Buscando informações..." /> : view === 'vitrine' ? (
        <div className={s.cardGrid}>
          {filtrados.map(p => (
            <Card key={p.id}>
              <CardPreview><div className={s.cardPreview}>{renderIcon(p.icone, { fontSize: '48px' })}</div></CardPreview>
              <CardHeader header={<Text weight="semibold">{p.nome}</Text>} description={<Text size={200}>{p.descricao}</Text>} />
              <CardFooter style={{ justifyContent: 'space-between' }}>
                <Text size={500} weight="bold">{fmtPreco(p.preco)}</Text>
                <Button appearance="primary" icon={<Cart24Regular />} onClick={() => {
                  if (!isAdmin) {
                    abrirLogin('Entre como professor para criar um pedido.');
                    return;
                  }
                  setPProd(p); setPForm(emptyPedido); setError(''); setPModal(true);
                }} disabled={p.quantidade <= 0}>{p.quantidade > 0 ? (isAdmin ? 'Solicitar' : 'Entrar para solicitar') : 'Sem estoque'}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className={s.tableWrap}>
          <DataGrid items={filtrados} columns={columns} sortable>
            <DataGridHeader />
            <DataGridBody<Produto>>{({ item }) => <DataGridRow<Produto>>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
          </DataGrid>
        </div>
      )}

      {/* Modal: Novo / Editar */}
      <AppDialog open={modal} title={editId ? 'Editar Produto' : 'Novo Produto'} onClose={() => setModal(false)}>
        <form onSubmit={handleSubmit} className={fs.formGrid}>
          <Field label="Nome *"><Input required value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></Field>
          <Field label="Preço *"><Input required type="number" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} /></Field>
          <Field label="Estoque"><Input type="number" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} /></Field>
          <Field label="Ícone">
            <Select value={form.icone} onChange={e => setForm({ ...form, icone: e.target.value })}>
              <option value="caixa">Caixa (Padrão)</option>
              {Object.keys(ICON_MAP).filter(k => k !== 'caixa').map(k => <option key={k} value={k}>{k}</option>)}
            </Select>
          </Field>
          <Field label="Descrição" style={{ gridColumn: '1/-1' }}><Textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></Field>
          <div className={fs.actions} style={{ gridColumn: '1/-1' }}><Button onClick={() => setModal(false)}>Sair</Button><Button appearance="primary" type="submit" disabled={saving}>Salvar</Button></div>
        </form>
      </AppDialog>

      {/* Modal: Solicitar */}
      <AppDialog open={pModal} title={`Solicitar: ${pProd?.nome}`} onClose={() => setPModal(false)}>
        {pSuccess ? <Text size={400}>✅ Pedido enviado com sucesso!</Text> : (
          <form onSubmit={handleSolicitar} className={fs.formGrid}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', gridColumn: '1/-1' }}>{renderIcon(pProd?.icone, { fontSize: '32px' })}<Text>{pProd?.nome} ({fmtPreco(pProd?.preco ?? 0)})</Text></div>
            <Field label="Escola *"><Select required value={pForm.escolaId} onChange={e => setPForm({ ...pForm, escolaId: e.target.value })}><option value="">Selecione...</option>{escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</Select></Field>
            <Field label="Professor *"><Select required value={pForm.professorId} onChange={e => setPForm({ ...pForm, professorId: e.target.value })}><option value="">Selecione...</option>{professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</Select></Field>
            <Field label="Qtd *"><Input required type="number" min="1" value={pForm.quantidade} onChange={e => setPForm({ ...pForm, quantidade: e.target.value })} /></Field>
            <div className={fs.actions} style={{ gridColumn: '1/-1' }}><Button onClick={() => setPModal(false)}>Sair</Button><Button appearance="primary" type="submit" disabled={pSaving}>Confirmar</Button></div>
          </form>
        )}
      </AppDialog>

      {/* Modal: Importar */}
      <AppDialog open={impModal} title="Importar Planilha do Google Sheets" onClose={() => setImpModal(false)}>
        {error && <MessageBar intent="error" style={{ marginBottom: '12px' }}><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        {impSuccess && <MessageBar intent="success" style={{ marginBottom: '12px' }}><MessageBarBody>{impSuccess}</MessageBarBody></MessageBar>}
        <form onSubmit={handleImportSheet} className={fs.formGrid}>
          <Field label="Link da Planilha do Google *" style={{ gridColumn: '1/-1' }} validationMessage="A planilha deve conter exatamente as colunas: nome, descricao, preco, quantidade, icone">
            <Input required type="url" placeholder="https://google.com" value={sheetUrl} onChange={e => setSheetUrl(e.target.value)} disabled={impLoading} />
          </Field>
          <div className={fs.actions} style={{ gridColumn: '1/-1', marginTop: '20px' }}>
            <Button appearance="secondary" onClick={() => setImpModal(false)} disabled={impLoading}>Sair</Button>
            <Button appearance="primary" type="submit" disabled={impLoading || !sheetUrl}>
              {impLoading ? <Spinner size="tiny" label="Efetuando carga em lote..." /> : 'Iniciar Importação'}
            </Button>
          </div>
        </form>
      </AppDialog>
      {dialog}
    </div>
  );
}
