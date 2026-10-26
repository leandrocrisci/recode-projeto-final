import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Button, Input, Field, Select, Textarea,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip,
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular, ClipboardTaskAdd24Regular } from '@fluentui/react-icons';
import { getAvaliacoesCursos, createAvaliacaoCurso, updateAvaliacaoCurso, deleteAvaliacaoCurso, getCursos } from '../services/api';
import type { AvaliacaoCurso, Curso } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useConfirm } from '../hooks/useConfirm';
import { cmpNumero, cmpTexto } from '../utils/tableSort';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';
import { mensagemDeErro } from '../utils/erroApi';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
  nota: { minWidth: '40px', justifyContent: 'center' }, // badges de largura igual, não importa o dígito
});

const empty = { nota: '', observacao: '', dataAvaliacao: '', cursoId: '' };

export default function AvaliacoesCursos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();
  const { confirmar, dialog } = useConfirm();
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCurso[]>([]);
  const [cursos,     setCursos]     = useState<Curso[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [modal,      setModal]      = useState(false);
  const [form,       setForm]       = useState(empty);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [saving,     setSaving]     = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAvaliacoesCursos(), getCursos()])
      .then(([av, cu]) => { setAvaliacoes(av.data); setCursos(cu.data); })
      .catch((e) => setError(mensagemDeErro(e, 'carregar as avaliações e os cursos')))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew  = () => { setForm(empty); setEditId(null); setError(''); setModal(true); };
  const openEdit = (a: AvaliacaoCurso) => {
    setForm({ 
      nota: String(a.nota), 
      observacao: a.observacao ?? '', 
      dataAvaliacao: a.dataAvaliacao ?? '', 
      cursoId: String(a.curso?.id ?? '') 
    });
    setEditId(a.id); setError(''); setModal(true);
  };
  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError(''); setSaving(true);
    
    // Payload limpo sem objetos complexos internos para bater com o DTO do Back
    const payload = { 
      nota: Number(form.nota), 
      observacao: form.observacao || null, 
      dataAvaliacao: form.dataAvaliacao || null 
    };

    try {
      if (editId) {
        await updateAvaliacaoCurso(editId, payload);
      } else {
        await createAvaliacaoCurso(Number(form.cursoId), payload);
      }
      closeModal(); 
      load();
    } catch (e) { 
      setError(mensagemDeErro(e, 'salvar a avaliação do curso')); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirmar('Deseja realmente excluir esta avaliação?'))) return;
    setError('');
    try {
      await deleteAvaliacaoCurso(id);
      load();
    } catch (e) {
      setError(mensagemDeErro(e, 'excluir a avaliação'));
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const notaBadge = (n: number) => {
    if (n >= 7) return <Badge className={s.nota} appearance="filled" color="success">{n}</Badge>;
    if (n >= 5) return <Badge className={s.nota} appearance="filled" color="warning">{n}</Badge>;
    return <Badge className={s.nota} appearance="filled" color="danger">{n}</Badge>;
  };

  const columns = [
    createTableColumn<AvaliacaoCurso>({ columnId: 'curso', compare: (a, b) => cmpTexto(a.curso?.nome, b.curso?.nome),   renderHeaderCell: () => 'Curso',        renderCell: i => <TableCellLayout description={i.curso?.escola?.nome}>{i.curso?.nome ?? '—'}</TableCellLayout> }),
    createTableColumn<AvaliacaoCurso>({ columnId: 'nota', compare: (a, b) => cmpNumero(a.nota, b.nota),    renderHeaderCell: () => 'Nota',         renderCell: i => <TableCellLayout>{notaBadge(i.nota)}</TableCellLayout> }),
    createTableColumn<AvaliacaoCurso>({ columnId: 'data', compare: (a, b) => cmpTexto(a.dataAvaliacao, b.dataAvaliacao),    renderHeaderCell: () => 'Data',         renderCell: i => <TableCellLayout>{i.dataAvaliacao ?? '—'}</TableCellLayout> }),
    createTableColumn<AvaliacaoCurso>({ columnId: 'obs',     renderHeaderCell: () => 'Observação',   renderCell: i => <TableCellLayout>{i.observacao ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<AvaliacaoCurso>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
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
      <PageHeader
        icon={<ClipboardTaskAdd24Regular />}
        title="Avaliações de Cursos"
        actions={isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Nova Avaliação</Button>}
      />
      {error && !modal && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      {loading ? <Spinner label="Carregando..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={avaliacoes} columns={columns} sortable resizableColumns>
            <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
            <DataGridBody<AvaliacaoCurso>>{({ item, rowId }) => <DataGridRow<AvaliacaoCurso> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
          </DataGrid>
          {avaliacoes.length === 0 && <EmptyState message="Nenhuma avaliação de curso cadastrada." />}
        </div>
      )}
      <AppDialog open={modal} title={editId ? 'Editar Avaliação de Curso' : 'Nova Avaliação de Curso'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            <Field label="Curso *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.cursoId} disabled={!!editId} onChange={set('cursoId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione...</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </Field>
            <Field label="Nota (0–10) *" required>
              <Input required type="number" min="0" max="10" step="0.1" value={form.nota} onChange={set('nota')} />
            </Field>
            <Field label="Data da Avaliação">
              <Input type="date" value={form.dataAvaliacao} onChange={set('dataAvaliacao')} />
            </Field>
            <Field label="Observação" style={{ gridColumn: '1 / -1' }}>
              <Textarea rows={3} value={form.observacao} onChange={set('observacao') as React.ChangeEventHandler<HTMLTextAreaElement>} />
            </Field>
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>{saving ? <Spinner size="tiny" /> : 'Salvar'}</Button>
          </div>
        </form>
      </AppDialog>
      {dialog}
    </div>
  );
}
