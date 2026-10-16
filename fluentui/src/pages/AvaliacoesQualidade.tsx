import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Button, Input, Field, Select, Textarea,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip, Title2,
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular } from '@fluentui/react-icons';
import { getAvaliacoesQualidade, createAvaliacaoQualidade, updateAvaliacaoQualidade, deleteAvaliacaoQualidade, getEscolas } from '../services/api';
import type { AvaliacaoQualidade, Escola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

const empty = { nota: '', comentario: '', dataAvaliacao: '', escolaId: '' };
const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function AvaliacoesQualidade() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoQualidade[]>([]);
  const [escolas,    setEscolas]    = useState<Escola[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [modal,      setModal]      = useState(false);
  const [form,       setForm]       = useState(empty);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [saving,     setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAvaliacoesQualidade(), getEscolas()])
      .then(([av, es]) => { setAvaliacoes(av.data); setEscolas(es.data); })
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(empty); setEditId(null); setError(''); setModal(true); };
  const openEdit = (a: AvaliacaoQualidade) => {
    setForm({ 
      nota: String(a.nota), 
      comentario: a.comentario ?? '', 
      dataAvaliacao: a.dataAvaliacao ?? '', 
      escolaId: String(a.escola?.id ?? '') 
    });
    setEditId(a.id); setError(''); setModal(true);
  };
  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

const handleSubmit = async (ev: React.FormEvent) => {
  ev.preventDefault(); setError(''); setSaving(true);
  
  // Enviando estritamente os campos mapeados pelo DTO no backend
  const payload = { 
    nota: Number(form.nota), 
    comentario: form.comentario || null, 
    dataAvaliacao: form.dataAvaliacao || null 
  };

  try {
    if (editId) {
      await updateAvaliacaoQualidade(editId, payload);
    } else {
      await createAvaliacaoQualidade(Number(form.escolaId), payload);
    }
    closeModal(); 
    load();
  } catch { 
    setError('Erro ao salvar avaliação.'); 
  } finally { 
    setSaving(false); 
  }
};



  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta avaliação?')) return;
    setError('');
    try {
      await deleteAvaliacaoQualidade(id);
      load();
    } catch {
      setError('Erro ao excluir avaliação. Tente novamente.');
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const starColor: Record<number, 'success' | 'warning' | 'danger'> = { 5: 'success', 4: 'success', 3: 'warning', 2: 'danger', 1: 'danger' };

  const columns = [
    createTableColumn<AvaliacaoQualidade>({ columnId: 'escola',   renderHeaderCell: () => 'Escola',    renderCell: i => <TableCellLayout>{i.escola?.nome ?? '—'}</TableCellLayout> }),
    createTableColumn<AvaliacaoQualidade>({ columnId: 'nota',     renderHeaderCell: () => 'Nota',      renderCell: i => <TableCellLayout><Badge appearance="filled" color={starColor[i.nota] ?? 'warning'}>{stars(i.nota)} ({i.nota})</Badge></TableCellLayout> }),
    createTableColumn<AvaliacaoQualidade>({ columnId: 'data',     renderHeaderCell: () => 'Data',      renderCell: i => <TableCellLayout>{i.dataAvaliacao ?? '—'}</TableCellLayout> }),
    createTableColumn<AvaliacaoQualidade>({ columnId: 'coment',   renderHeaderCell: () => 'Comentário',renderCell: i => <TableCellLayout>{i.comentario ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<AvaliacaoQualidade>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
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
        <Title2>⭐ Avaliações de Qualidade</Title2>
        {isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Nova Avaliação</Button>}
      </div>
      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      {loading ? <Spinner label="Carregando..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={avaliacoes} columns={columns} resizableColumns>
            <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
            <DataGridBody<AvaliacaoQualidade>>{({ item, rowId }) => <DataGridRow<AvaliacaoQualidade> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
          </DataGrid>
          {avaliacoes.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>Nenhuma avaliação cadastrada.</div>}
        </div>
      )}
      <AppDialog open={modal} title={editId ? 'Editar Avaliação' : 'Nova Avaliação de Qualidade'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            <Field label="Escola *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.escolaId} disabled={!!editId} onChange={set('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione...</option>
                {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </Select>
            </Field>
            <Field label="Nota (1–5) *" required>
              <Select required value={form.nota} onChange={set('nota') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione...</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{stars(n)} ({n})</option>)}
              </Select>
            </Field>
            <Field label="Data da Avaliação">
              <Input type="date" value={form.dataAvaliacao} onChange={set('dataAvaliacao')} />
            </Field>
            <Field label="Comentário" style={{ gridColumn: '1 / -1' }}>
              <Textarea rows={3} value={form.comentario} onChange={set('comentario') as React.ChangeEventHandler<HTMLTextAreaElement>} />
            </Field>
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>{saving ? <Spinner size="tiny" /> : 'Salvar'}</Button>
          </div>
        </form>
      </AppDialog>
    </div>
  );
}
