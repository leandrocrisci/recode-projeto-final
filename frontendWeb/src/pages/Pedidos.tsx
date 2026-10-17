import React, { useEffect, useState, useMemo } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip,
} from '@fluentui/react-components';
import {
  Add24Regular, Delete24Regular, Cart24Regular, Search24Regular, Edit24Regular,
} from '@fluentui/react-icons';
import {
  getPedidos, createPedido, deletePedido, updatePedido,
  getEscolas, getProdutos, getProfessores,
} from '../services/api';
import type { Pedido, Escola, Produto, Professor } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

// ── Estilos ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  page:       { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  filterBar: {
    display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '10px 14px', borderRadius: tokens.borderRadiusMedium,
  },
  tableWrap:  { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtPreco = (v: number) =>
  Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const fmtData = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR') : '—';

const STATUS_COLOR: Record<Pedido['statusPedido'], 'success' | 'warning' | 'informative' | 'danger'> = {
  entregue:    'success',
  enviado:     'informative',
  processando: 'warning',
  cancelado:   'danger',
};

const emptyForm = {
  escolaId: '', produtoId: '', professorId: '',
  quantidade: '1', valorUnitario: '',
  statusPedido: 'processando' as Pedido['statusPedido'],
};

// ── Componente ────────────────────────────────────────────────────────────────

export default function Pedidos() {
  const s  = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();

  const [pedidos,    setPedidos]    = useState<Pedido[]>([]);
  const [escolas,    setEscolas]    = useState<Escola[]>([]);
  const [produtos,   setProdutos]   = useState<Produto[]>([]);
  const [professores,setProfessores]= useState<Professor[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [modal,      setModal]      = useState(false);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [form,       setForm]       = useState(emptyForm);
  const [saving,     setSaving]     = useState(false);
  const [busca,      setBusca]      = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Preenche valorUnitario automaticamente ao selecionar produto (Apenas na Criação)
  const produtoSelecionado = useMemo(
    () => produtos.find(p => String(p.id) === form.produtoId),
    [produtos, form.produtoId],
  );
  useEffect(() => {
    if (produtoSelecionado && !editId) {
      setForm(f => ({ ...f, valorUnitario: String(produtoSelecionado.preco) }));
    }
  }, [produtoSelecionado, editId]);

  const load = () => {
    setLoading(true);
    Promise.all([getPedidos(), getEscolas(), getProdutos(), getProfessores()])
      .then(([pd, es, pr, pf]) => {
        setPedidos(pd.data); setEscolas(es.data);
        setProdutos(pr.data); setProfessores(pf.data);
      })
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const filtrados = useMemo(() => pedidos.filter(p => {
    const matchBusca =
      (p.escola?.nome ?? '').toLowerCase().includes(busca.toLowerCase()) ||
      (p.produto?.nome ?? '').toLowerCase().includes(busca.toLowerCase()) ||
      (p.professor?.nome ?? '').toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || p.statusPedido === filtroStatus;
    return matchBusca && matchStatus;
  }), [pedidos, busca, filtroStatus]);

  const openNew = () => { setForm(emptyForm); setEditId(null); setError(''); setModal(true); };
  
  const openEdit = (p: Pedido) => {
    setForm({
      escolaId: String(p.escola?.id ?? ''),
      produtoId: String(p.produto?.id ?? ''),
      professorId: String(p.professor?.id ?? ''),
      quantidade: String(p.quantidade),
      valorUnitario: String(p.valorUnitario),
      statusPedido: p.statusPedido,
    });
    setEditId(p.id);
    setError('');
    setModal(true);
  };

  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const { escolaId, produtoId, professorId, quantidade, valorUnitario, statusPedido } = form;
    if (!escolaId || !produtoId || !professorId) {
      setError('Selecione escola, produto e professor.'); return;
    }
    setError(''); setSaving(true);
    const payload = {
      quantidade: Number(quantidade),
      valorUnitario: Number(valorUnitario),
      statusPedido,
    };
    try {
      if (editId) {
        await updatePedido(editId, payload);
      } else {
        await createPedido(Number(escolaId), Number(produtoId), Number(professorId), payload);
      }
      closeModal(); load();
    } catch { setError('Erro ao salvar pedido.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Cancelar/excluir este pedido?')) return;
    setError('');
    try { await deletePedido(id); load(); }
    catch { setError('Erro ao excluir pedido.'); }
  };

  const set = (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // ── Colunas ──────────────────────────────────────────────────────────────────

  const columns = [
    createTableColumn<Pedido>({ columnId: 'escola',
      renderHeaderCell: () => 'Escola',
      renderCell: p => <TableCellLayout>{p.escola?.nome ?? '—'}</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'produto',
      renderHeaderCell: () => 'Produto',
      renderCell: p => <TableCellLayout media={<Cart24Regular />}>{p.produto?.nome ?? '—'}</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'professor',
      renderHeaderCell: () => 'Vendedor',
      renderCell: p => <TableCellLayout>{p.professor?.nome ?? '—'}</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'quantidade',
      renderHeaderCell: () => 'Qtd',
      renderCell: p => <TableCellLayout>{p.quantidade} un.</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'valorUnitario',
      renderHeaderCell: () => 'Vlr Unitário',
      renderCell: p => <TableCellLayout>{fmtPreco(p.valorUnitario)}</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'total',
      renderHeaderCell: () => 'Total',
      renderCell: p => (
        <TableCellLayout>
          <Text weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>
            {fmtPreco(p.quantidade * p.valorUnitario)}
          </Text>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Pedido>({ columnId: 'dataPedido',
      renderHeaderCell: () => 'Data',
      renderCell: p => <TableCellLayout>{fmtData(p.dataPedido)}</TableCellLayout>,
    }),
    createTableColumn<Pedido>({ columnId: 'status',
      renderHeaderCell: () => 'Status',
      renderCell: p => (
        <TableCellLayout>
          <Badge appearance="filled" color={STATUS_COLOR[p.statusPedido]}>
            {p.statusPedido}
          </Badge>
        </TableCellLayout>
      ),
    }),
    createTableColumn<Pedido>({ columnId: 'acoes',
      renderHeaderCell: () => 'Ações',
      renderCell: p => (
        <TableCellLayout>
          <div className={s.actionCell}>
            {isAdmin && (
              <>
                <Tooltip content="Editar" relationship="label">
                  <Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(p)} />
                </Tooltip>
                <Tooltip content="Excluir" relationship="label">
                  <Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={() => handleDelete(p.id)} />
                </Tooltip>
              </>
            )}
          </div>
        </TableCellLayout>
      ),
    }),
  ];

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className={s.page}>
      {/* Cabeçalho */}
      <PageHeader
        title="🛒 Pedidos"
        subtitle={`${pedidos.length} pedido${pedidos.length !== 1 ? 's' : ''} no sistema`}
        actions={<Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Pedido</Button>}
      />

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      {/* Filtros */}
      <div className={s.filterBar}>
        <Input
          contentBefore={<Search24Regular />}
          placeholder="Buscar por escola, produto ou professor..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ minWidth: '280px' }}
        />
        <Select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ minWidth: '160px' }}>
          <option value="todos">Todos os status</option>
          <option value="processando">Processando</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </Select>
        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''}
        </Text>
      </div>

      {/* Tabela */}
      {loading ? <Spinner label="Carregando pedidos..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={filtrados} columns={columns} resizableColumns
            columnSizingOptions={{ escola: { defaultWidth: 180 }, produto: { defaultWidth: 180 }, professor: { defaultWidth: 160 } }}>
            <DataGridHeader>
              <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
            </DataGridHeader>
            <DataGridBody<Pedido>>
              {({ item, rowId }) => (
                <DataGridRow<Pedido> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {filtrados.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
              Nenhum pedido encontrado.
            </div>
          )}
        </div>
      )}

      {/* Modal de criação/edição */}
      <AppDialog
        open={modal}
        title={editId ? 'Editar Pedido' : 'Novo Pedido'}
        onClose={closeModal}
      >
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            {/* Escola */}
            <Field label="Escola compradora *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.escolaId} onChange={set('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}
                disabled={!!editId}>
                <option value="">Selecione a escola...</option>
                {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </Select>
            </Field>
            {/* Produto */}
            <Field label="Produto *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.produtoId} onChange={set('produtoId') as React.ChangeEventHandler<HTMLSelectElement>}
                disabled={!!editId}>
                <option value="">Selecione o produto...</option>
                {produtos.map(p => <option key={p.id} value={p.id}>{p.nome} — {fmtPreco(p.preco)}</option>)}
              </Select>
            </Field>
            {/* Professor/Vendedor */}
            <Field label="Professor (vendedor) *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.professorId} onChange={set('professorId') as React.ChangeEventHandler<HTMLSelectElement>}
                disabled={!!editId}>
                <option value="">Selecione o professor...</option>
                {professores.map(p => <option key={p.id} value={p.id}>{p.nome}{p.especialidade ? ` — ${p.especialidade}` : ''}</option>)}
              </Select>
            </Field>
            {/* Quantidade */}
            <Field label="Quantidade *" required>
              <Input required type="number" min="1" value={form.quantidade} onChange={set('quantidade')} />
            </Field>
            {/* Valor unitário — preenchido automaticamente pelo produto */}
            <Field label="Valor unitário (R$) *" required>
              <Input required type="number" step="0.01" min="0.01"
                value={form.valorUnitario} onChange={set('valorUnitario')}
                placeholder={produtoSelecionado ? String(produtoSelecionado.preco) : '0.00'}
              />
            </Field>
            {/* Status — editável apenas ao editar */}
            {editId && (
              <Field label="Status" style={{ gridColumn: '1 / -1' }}>
                <Select value={form.statusPedido} onChange={set('statusPedido') as React.ChangeEventHandler<HTMLSelectElement>}>
                  <option value="processando">Processando</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </Select>
              </Field>
            )}
            {/* Resumo do total */}
            {form.quantidade && form.valorUnitario && (
              <div style={{
                gridColumn: '1 / -1', padding: '10px 14px',
                backgroundColor: tokens.colorBrandBackground2,
                borderRadius: tokens.borderRadiusMedium,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <Text size={200}>Total estimado:</Text>
                <Text weight="semibold" size={400} style={{ color: tokens.colorBrandForeground1 }}>
                  {fmtPreco(Number(form.quantidade) * Number(form.valorUnitario))}
                </Text>
              </div>
            )}
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving} icon={<Cart24Regular />}>
              {saving ? <Spinner size="tiny" /> : (editId ? 'Salvar Alterações' : 'Confirmar Pedido')}
            </Button>
          </div>
        </form>
      </AppDialog>
    </div>
  );
}
