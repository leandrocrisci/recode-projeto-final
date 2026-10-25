import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Button, Input, Field, Select, Textarea,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip,
} from '@fluentui/react-components';
import {
  Add24Regular, Edit24Regular, Delete24Regular, Person24Regular, PersonBoard24Regular
} from '@fluentui/react-icons';
import {
  getProfessores, createProfessor, updateProfessor, deleteProfessor, getEscolas,
} from '../services/api';
import type { Professor, Escola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useConfirm } from '../hooks/useConfirm';
import { cmpTexto } from '../utils/tableSort';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page:       { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  tableWrap:  { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

const emptyForm = { nome: '', email: '', telefone: '', especialidade: '', biografia: '', escolaId: '', senha: '' };

export default function Professores() {
  const s  = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();
  const { confirmar, dialog } = useConfirm();

  const [professores, setProfessores] = useState<Professor[]>([]);
  const [escolas,     setEscolas]     = useState<Escola[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [modal,       setModal]       = useState(false);
  const [editId,      setEditId]      = useState<number | null>(null);
  const [form,        setForm]        = useState(emptyForm);
  const [saving,      setSaving]      = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getProfessores(), getEscolas()])
      .then(([p, e]) => { setProfessores(p.data); setEscolas(e.data); })
      .catch(() => setError('Erro ao carregar professores.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm); setEditId(null); setError(''); setModal(true);
  };
  const openEdit = (p: Professor) => {
    setForm({
      nome: p.nome, email: p.email ?? '', telefone: p.telefone ?? '',
      especialidade: p.especialidade ?? '', biografia: p.biografia ?? '',
      escolaId: String(p.escola?.id ?? ''),
      senha: '',
    });
    setEditId(p.id); setError(''); setModal(true);
  };
  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.escolaId) { setError('Selecione uma escola.'); return; }
    setError(''); setSaving(true);
    const payload = {
      nome: form.nome, email: form.email || null,
      telefone: form.telefone || null,
      especialidade: form.especialidade || null,
      biografia: form.biografia || null,
      senha: form.senha || undefined,
    };
    try {
      if (editId) {
        await updateProfessor(editId, { ...payload, escola: { id: Number(form.escolaId) } });
      } else {
        await createProfessor(Number(form.escolaId), payload);
      }
      closeModal(); load();
    } catch { setError('Erro ao salvar professor.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirmar('Excluir este professor?'))) return;
    try { await deleteProfessor(id); load(); }
    catch { setError('Erro ao excluir professor.'); }
  };

  const set = (k: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const columns = [
    // createTableColumn<Professor>({ columnId: 'id',           renderHeaderCell: () => '#',            renderCell: p => <TableCellLayout>{p.id}</TableCellLayout> }),
    createTableColumn<Professor>({ columnId: 'nome', compare: (a, b) => cmpTexto(a.nome, b.nome),         renderHeaderCell: () => 'Nome',          renderCell: p => <TableCellLayout media={<Person24Regular />}>{p.nome}</TableCellLayout> }),
    createTableColumn<Professor>({ columnId: 'especialidade', compare: (a, b) => cmpTexto(a.especialidade, b.especialidade),renderHeaderCell: () => 'Especialidade', renderCell: p => <TableCellLayout><Badge appearance="outline">{p.especialidade ?? '—'}</Badge></TableCellLayout> }),
    createTableColumn<Professor>({ columnId: 'escola', compare: (a, b) => cmpTexto(a.escola?.nome, b.escola?.nome),       renderHeaderCell: () => 'Escola',        renderCell: p => <TableCellLayout>{p.escola?.nome ?? '—'}</TableCellLayout> }),
    createTableColumn<Professor>({ columnId: 'email', compare: (a, b) => cmpTexto(a.email, b.email),        renderHeaderCell: () => 'E-mail',        renderCell: p => <TableCellLayout>{p.email ?? '—'}</TableCellLayout> }),
    createTableColumn<Professor>({ columnId: 'telefone',     renderHeaderCell: () => 'Telefone',      renderCell: p => <TableCellLayout>{p.telefone ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<Professor>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
      renderCell: p => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar"  relationship="label"><Button icon={<Edit24Regular />}   appearance="subtle" size="small" onClick={() => openEdit(p)} /></Tooltip>
            <Tooltip content="Excluir" relationship="label"><Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={() => handleDelete(p.id)} /></Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <PageHeader
        icon={<PersonBoard24Regular />}
        title="Professores"
        subtitle={`${professores.length} professor${professores.length !== 1 ? 'es' : ''} cadastrado${professores.length !== 1 ? 's' : ''}`}
        actions={isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Professor</Button>}
      />

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      {loading ? <Spinner label="Carregando professores..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={professores} columns={columns} sortable resizableColumns
            columnSizingOptions={{ nome: { defaultWidth: 200 }, escola: { defaultWidth: 200 } }}>
            <DataGridHeader>
              <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
            </DataGridHeader>
            <DataGridBody<Professor>>
              {({ item, rowId }) => (
                <DataGridRow<Professor> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {professores.length === 0 && (
            <EmptyState message="Nenhum professor cadastrado." />
          )}
        </div>
      )}

      <AppDialog open={modal} title={editId ? 'Editar Professor' : 'Novo Professor'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            <Field label="Nome *" required style={{ gridColumn: '1 / -1' }}>
              <Input required value={form.nome} onChange={set('nome')} />
            </Field>
            <Field label="Escola *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.escolaId} onChange={set('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione uma escola...</option>
                {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </Select>
            </Field>
            <Field label="Especialidade">
              <Input value={form.especialidade} onChange={set('especialidade')} placeholder="Ex: Matemática" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Telefone">
              <Input value={form.telefone} onChange={set('telefone')} />
            </Field>
            <Field
              label="Senha de acesso"
              style={{ gridColumn: '1 / -1' }}
              hint={editId
                ? 'Deixe em branco para manter a senha atual. Mínimo de 8 caracteres.'
                : 'Opcional. Professores com senha podem entrar. Mínimo de 8 caracteres.'}
            >
              <Input type="password" autoComplete="new-password" minLength={8} maxLength={72}
                value={form.senha} onChange={set('senha')} />
            </Field>
            <Field label="Biografia" style={{ gridColumn: '1 / -1' }}>
              <Textarea rows={3} value={form.biografia}
                onChange={set('biografia') as React.ChangeEventHandler<HTMLTextAreaElement>}
                placeholder="Formação e experiência..."
              />
            </Field>
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="tiny" /> : 'Salvar'}
            </Button>
          </div>
        </form>
      </AppDialog>
      {dialog}
    </div>
  );
}
