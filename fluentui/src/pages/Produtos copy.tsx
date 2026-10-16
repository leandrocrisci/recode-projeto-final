import React, { useEffect, useState, useMemo } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Textarea, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Card, CardHeader, CardPreview, CardFooter, Badge,
  Title2, Subtitle2, Tooltip,
} from '@fluentui/react-components';
import {
  Add24Regular, Edit24Regular, Delete24Regular, Box24Regular,
  Grid24Regular, Table24Regular, Cart24Regular, Search24Regular,
} from '@fluentui/react-icons';
import {
  getProdutos, createProduto, updateProduto, deleteProduto,
  getEscolas, getProfessores, createPedido,
} from '../services/api';
import type { Produto, Escola, Professor } from '../types';
import { AppDialog } from '../components/AppDialog';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  filterBar: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', gap: '16px', flexWrap: 'wrap',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '12px 16px', borderRadius: tokens.borderRadiusMedium,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
  cardPreview: {
    height: '100px',
    backgroundColor: tokens.colorNeutralBackground3,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '48px',
  },
  adminBanner: {
    padding: '8px 16px',
    backgroundColor: tokens.colorPaletteYellowBackground1,
    borderRadius: tokens.borderRadiusMedium,
    display: 'flex', alignItems: 'center', gap: '8px',
  },
});

const empty = { nome: '', descricao: '', preco: '', quantidade: '0' };

const emptyPedidoForm = { escolaId: '', professorId: '', quantidade: '1' };

export default function Produtos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();

  const [produtos,    setProdutos]    = useState<Produto[]>([]);
  const [escolas,     setEscolas]     = useState<Escola[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [modal,       setModal]       = useState(false);
  const [form,        setForm]        = useState(empty);
  const [editId,      setEditId]      = useState<number | null>(null);
  const [saving,      setSaving]      = useState(false);
  const [busca,       setBusca]       = useState('');
  const [view,        setView]        = useState<'vitrine' | 'estoque'>('vitrine');
  // Estado para modal de solicitar compra
  const [pedidoModal,    setPedidoModal]    = useState(false);
  const [pedidoProduto,  setPedidoProduto]  = useState<Produto | null>(null);
  const [pedidoForm,     setPedidoForm]     = useState(emptyPedidoForm);
  const [pedidoSaving,   setPedidoSaving]   = useState(false);
  const [pedidoError,    setPedidoError]    = useState('');
  const [pedidoSuccess,  setPedidoSuccess]  = useState(false);

  const filtrados = useMemo(() =>
    produtos.filter(p =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.descricao ?? '').toLowerCase().includes(busca.toLowerCase())
    ), [produtos, busca]);

  const fmtPreco = (v: number) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const load = () => {
    setLoading(true);
    Promise.all([getProdutos(), getEscolas(), getProfessores()])
      .then(([p, e, pf]) => { setProdutos(p.data); setEscolas(e.data); setProfessores(pf.data); })
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openSolicitar = (p: Produto) => {
    setPedidoProduto(p);
    setPedidoForm(emptyPedidoForm);
    setPedidoError('');
    setPedidoSuccess(false);
    setPedidoModal(true);
  };

  const handleSolicitar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!pedidoForm.escolaId || !pedidoForm.professorId) {
      setPedidoError('Selecione escola e professor.'); return;
    }
    setPedidoError(''); setPedidoSaving(true);
    try {
      await createPedido(
        Number(pedidoForm.escolaId),
        pedidoProduto!.id,
        Number(pedidoForm.professorId),
        { quantidade: Number(pedidoForm.quantidade), valorUnitario: pedidoProduto!.preco, statusPedido: 'processando' },
      );
      setPedidoSuccess(true);
      setTimeout(() => { setPedidoModal(false); setPedidoSuccess(false); }, 1800);
    } catch { setPedidoError('Erro ao registrar pedido. Tente novamente.'); }
    finally { setPedidoSaving(false); }
  };

  const setPedido = (k: keyof typeof emptyPedidoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setPedidoForm(f => ({ ...f, [k]: e.target.value }));

  const openNew  = () => { setForm(empty); setEditId(null); setError(''); setModal(true); };
  const openEdit = (p: Produto) => { setForm({ nome: p.nome, descricao: p.descricao ?? '', preco: String(p.preco), quantidade: String(p.quantidade) }); setEditId(p.id); setError(''); setModal(true); };
  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError(''); setSaving(true);
    const payload = { nome: form.nome, descricao: form.descricao, preco: Number(form.preco), quantidade: Number(form.quantidade) };
    try {
      if (editId) await updateProduto(editId, payload);
      else await createProduto(payload);
      closeModal(); load();
    } catch { setError('Erro ao salvar produto.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este produto?')) return;
    try { await deleteProduto(id); load(); } catch { setError('Erro ao excluir produto.'); }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  // Colunas para o DataGrid (modo admin/estoque)
  const columns = [
    // createTableColumn<Produto>({ columnId: 'id',       renderHeaderCell: () => '#',         renderCell: i => <TableCellLayout>{i.id}</TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'nome',     renderHeaderCell: () => 'Nome',       renderCell: i => <TableCellLayout media={<Box24Regular />}>{i.nome}</TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'preco',    renderHeaderCell: () => 'Preço',      renderCell: i => <TableCellLayout>{fmtPreco(i.preco)}</TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'qtd',      renderHeaderCell: () => 'Estoque',    renderCell: i => <TableCellLayout><Badge appearance="filled" color={i.quantidade > 0 ? 'success' : 'danger'}>{i.quantidade} un.</Badge></TableCellLayout> }),
    createTableColumn<Produto>({ columnId: 'descricao',renderHeaderCell: () => 'Descrição',  renderCell: i => <TableCellLayout>{i.descricao ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<Produto>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
      renderCell: i => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar" relationship="label"><Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(i)} /></Tooltip>
            <Tooltip content="Excluir" relationship="label"><Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={() => handleDelete(i.id)} /></Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div>
          <Title2>📦 Produtos   </Title2>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            {isAdmin ? 'Gestão de estoque e preços' : 'Catálogo de materiais escolares'}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {/* Botões de visualização: user só tem vitrine; admin tem os dois */}
          {isAdmin && (
            <>
              <Button icon={<Grid24Regular />}  appearance={view === 'vitrine' ? 'primary' : 'outline'} onClick={() => setView('vitrine')}>Vitrine</Button>
              <Button icon={<Table24Regular />} appearance={view === 'estoque' ? 'primary' : 'outline'} onClick={() => setView('estoque')}>Estoque</Button>
              <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Produto</Button>
            </>
          )}
        </div>
      </div>

      {/* Banner informativo para admin */}
      {isAdmin && (
        <div className={s.adminBanner}>
          <Text size={200} weight="semibold">⚙️ Modo Administrador:</Text>
          <Text size={200}>Use "Vitrine" para ver como o usuário vê, ou "Estoque" para gerenciar inventário.</Text>
        </div>
      )}

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      {/* Barra de busca */}
      <div className={s.filterBar}>
        <Input
          contentBefore={<Search24Regular />}
          placeholder="Pesquisar produto..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ minWidth: '280px' }}
        />
        <Subtitle2 style={{ color: tokens.colorNeutralForeground3 }}>
          {filtrados.length} produto{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
        </Subtitle2>
      </div>

      {loading ? <Spinner label="Carregando produtos..." /> : (
        filtrados.length === 0
          ? <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>Nenhum produto encontrado.</div>
          : (
            /* Usuário comum: sempre vitrine | Admin: depende do toggle */
            (!isAdmin || view === 'vitrine') ? (
              /* ── VITRINE EM CARDS ── */
              <div className={s.cardGrid}>
                {filtrados.map(p => (
                  <Card key={p.id}>
                    <CardPreview>
                      <div className={s.cardPreview}>📦</div>
                    </CardPreview>
                    <CardHeader
                      header={<Text weight="semibold">{p.nome}</Text>}
                      description={<Text size={200}>{p.descricao ?? ''}</Text>}
                      action={
                        <Badge appearance="filled" color={p.quantidade > 0 ? 'success' : 'danger'} size="small">
                          {p.quantidade > 0 ? 'Disponível' : 'Esgotado'}
                        </Badge>
                      }
                    />
                    <CardFooter style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text size={100} block style={{ color: tokens.colorNeutralForeground3 }}>Preço unitário</Text>
                        <Text size={500} weight="bold" style={{ color: tokens.colorBrandForeground1 }}>{fmtPreco(p.preco)}</Text>
                      </div>
                      <Button
                        icon={<Cart24Regular />}
                        appearance="primary"
                        disabled={p.quantidade === 0}
                        onClick={() => isAdmin ? openEdit(p) : openSolicitar(p)}
                      >
                        {isAdmin ? 'Editar' : 'Solicitar'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              /* ── ESTOQUE EM DATAGRID (admin) ── */
              <div className={s.tableWrap}>
                <DataGrid items={filtrados} columns={columns} resizableColumns>
                  <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
                  <DataGridBody<Produto>>{({ item, rowId }) => <DataGridRow<Produto> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
                </DataGrid>
              </div>
            )
          )
      )}

      {/* Modal de criação/edição (admin) */}
      <AppDialog open={modal} title={editId ? 'Editar Produto' : 'Novo Produto'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            <Field label="Nome *" required style={{ gridColumn: '1 / -1' }}>
              <Input required value={form.nome} onChange={set('nome')} />
            </Field>
            <Field label="Preço (R$) *" required>
              <Input required type="number" step="0.01" min="0.01" value={form.preco} onChange={set('preco')} />
            </Field>
            <Field label="Quantidade em Estoque">
              <Input type="number" min="0" value={form.quantidade} onChange={set('quantidade')} />
            </Field>
            <Field label="Descrição" style={{ gridColumn: '1 / -1' }}>
              <Textarea rows={3} value={form.descricao} onChange={set('descricao') as React.ChangeEventHandler<HTMLTextAreaElement>} />
            </Field>
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>{saving ? <Spinner size="tiny" /> : 'Salvar'}</Button>
          </div>
        </form>
      </AppDialog>

      {/* Modal de Solicitar Compra (usuário comum e admin na vitrine) */}
      <AppDialog
        open={pedidoModal}
        title={`Solicitar: ${pedidoProduto?.nome ?? ''}`}
        onClose={() => { setPedidoModal(false); setPedidoSuccess(false); }}
      >
        {pedidoSuccess ? (
          <div style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 48 }}>✅</span>
            <Text weight="semibold" size={400}>Pedido registrado com sucesso!</Text>
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>Você pode acompanhar em Pedidos.</Text>
          </div>
        ) : (
          <form onSubmit={handleSolicitar}>
            {pedidoError && <MessageBar intent="error" style={{ marginBottom: 12 }}><MessageBarBody>{pedidoError}</MessageBarBody></MessageBar>}

            {/* Resumo do produto */}
            <div style={{
              display: 'flex', gap: 12, alignItems: 'center',
              padding: '10px 14px', marginBottom: 16,
              backgroundColor: tokens.colorNeutralBackground2,
              borderRadius: tokens.borderRadiusMedium,
            }}>
              <span style={{ fontSize: 32 }}>📦</span>
              <div>
                <Text weight="semibold" block>{pedidoProduto?.nome}</Text>
                <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                  {fmtPreco(pedidoProduto?.preco ?? 0)} por unidade · {pedidoProduto?.quantidade} em estoque
                </Text>
              </div>
            </div>

            <div className={fs.formGrid}>
              <Field label="Escola compradora *" required style={{ gridColumn: '1 / -1' }}>
                <Select required value={pedidoForm.escolaId}
                  onChange={setPedido('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}>
                  <option value="">Selecione a escola...</option>
                  {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </Select>
              </Field>
              <Field label="Professor responsável *" required style={{ gridColumn: '1 / -1' }}>
                <Select required value={pedidoForm.professorId}
                  onChange={setPedido('professorId') as React.ChangeEventHandler<HTMLSelectElement>}>
                  <option value="">Selecione o professor...</option>
                  {professores.map(p => <option key={p.id} value={p.id}>{p.nome}{p.especialidade ? ` — ${p.especialidade}` : ''}</option>)}
                </Select>
              </Field>
              <Field label="Quantidade *" required style={{ gridColumn: '1 / -1' }}>
                <Input required type="number" min="1"
                  max={pedidoProduto?.quantidade}
                  value={pedidoForm.quantidade}
                  onChange={setPedido('quantidade')} />
              </Field>

              {/* Total calculado */}
              {pedidoForm.quantidade && pedidoProduto && (
                <div style={{
                  gridColumn: '1 / -1', padding: '10px 14px',
                  backgroundColor: tokens.colorBrandBackground2,
                  borderRadius: tokens.borderRadiusMedium,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <Text size={200}>Total do pedido:</Text>
                  <Text weight="semibold" size={400} style={{ color: tokens.colorBrandForeground1 }}>
                    {fmtPreco(Number(pedidoForm.quantidade) * pedidoProduto.preco)}
                  </Text>
                </div>
              )}
            </div>

            <div className={fs.actions}>
              <Button appearance="secondary" onClick={() => setPedidoModal(false)}>Cancelar</Button>
              <Button appearance="primary" type="submit" disabled={pedidoSaving} icon={<Cart24Regular />}>
                {pedidoSaving ? <Spinner size="tiny" /> : 'Confirmar Pedido'}
              </Button>
            </div>
          </form>
        )}
      </AppDialog>
    </div>
  );
}
