import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Select, Textarea,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Tooltip, Title2,
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular, BookOpen24Regular, Building24Regular } from '@fluentui/react-icons';
import { getCursos, getEscolas, createCurso, updateCurso, deleteCurso } from '../services/api';
import type { Curso, Escola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

const empty = { nome: '', descricao: '', cargaHoraria: '', escolaId: '' };

export default function Cursos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();

  const [cursos,  setCursos]  = useState<Curso[]>([]);
  const [escolas, setEscolas] = useState<Escola[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(empty);
  const [editId,  setEditId]  = useState<number | null>(null);
  const [saving,  setSaving]  = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getCursos(), getEscolas()])
      .then(([c, e]) => { 
        setCursos(c.data || []); 
        setEscolas(e.data || []); 
      })
      .catch(() => setError('Erro ao carregar dados dos programas de ensino.'))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { 
    load(); 
  }, []);

  const openNew = () => { 
    setForm(empty); 
    setEditId(null); 
    setError(''); 
    setModal(true); 
  };
  
  const openEdit = (c: Curso) => {
    setForm({ 
      nome: c.nome, 
      descricao: c.descricao ?? '', 
      cargaHoraria: String(c.cargaHoraria ?? ''), 
      escolaId: String(c.escola?.id ?? '') 
    });
    setEditId(c.id); 
    setError(''); 
    setModal(true);
  };
  
  const closeModal = () => { 
    setModal(false); 
    setError(''); 
    setSaving(false); 
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); 
    setError(''); 
    setSaving(true);
    
    // Mapeamento correto aceito pela camada de serviço do Spring Boot
    const payload = { 
      nome: form.nome, 
      descricao: form.descricao, 
      cargaHoraria: form.cargaHoraria ? Number(form.cargaHoraria) : null,
      escola: form.escolaId ? { id: Number(form.escolaId) } : null
    };

    try {
      if (editId) {
        await updateCurso(editId, payload);
      } else {
        await createCurso(Number(form.escolaId), payload);
      }
      closeModal(); 
      load();
    } catch { 
      setError('Erro ao salvar as informações do curso.'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir permanentemente este curso da grade?')) return;
    try { 
      await deleteCurso(id); 
      load(); 
    } catch { 
      setError('Erro ao excluir curso.'); 
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const columns = [
    createTableColumn<Curso>({ 
      columnId: 'nome',        
      renderHeaderCell: () => 'Programa Acadêmico',          
      renderCell: i => <TableCellLayout media={<BookOpen24Regular />}><b>{i.nome}</b></TableCellLayout> 
    }),
    createTableColumn<Curso>({ 
      columnId: 'escola',      
      renderHeaderCell: () => 'Instituição Vinculada',        
      renderCell: i => <TableCellLayout media={<Building24Regular />}>{i.escola?.nome ?? '—'}</TableCellLayout> 
    }),
    createTableColumn<Curso>({ 
      columnId: 'cargaHoraria',
      renderHeaderCell: () => 'Carga Horária', 
      renderCell: i => <TableCellLayout>{i.cargaHoraria ? `${i.cargaHoraria}h` : '—'}</TableCellLayout> 
    }),
    createTableColumn<Curso>({ 
      columnId: 'descricao',   
      renderHeaderCell: () => 'Descrição Geral',     
      renderCell: i => <TableCellLayout><Text size={200} italic>{i.descricao ?? '—'}</Text></TableCellLayout> 
    }),
    ...(isAdmin ? [createTableColumn<Curso>({ 
      columnId: 'acoes', 
      renderHeaderCell: () => 'Ações',
      renderCell: i => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar" relationship="label">
              <Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(i)} />
            </Tooltip>
            <Tooltip content="Excluir" relationship="label">
              <Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={() => handleDelete(i.id)} />
            </Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <div>
          <Title2>📚 Cursos</Title2>
          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
            {cursos.length} curso{cursos.length !== 1 ? 's' : ''} ativo{cursos.length !== 1 ? 's' : ''}
          </Text>
        </div>
        {isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Curso</Button>}
      </div>

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      {loading ? <Spinner label="Consultando grade acadêmica cadastrada..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={cursos} columns={columns} resizableColumns columnSizingOptions={{ nome: { defaultWidth: 240 }, escola: { defaultWidth: 240 } }}>
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Curso>>
              {({ item, rowId }) => (
                <DataGridRow<Curso> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {cursos.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
              Nenhum programa acadêmico cadastrado.
            </div>
          )}
        </div>
      )}

      <AppDialog open={modal} title={editId ? 'Editar Especificações do Curso' : 'Cadastrar Novo Curso'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            <Field label="Nome do Curso *" required style={{ gridColumn: '1 / -1' }}>
              <Input required value={form.nome} onChange={set('nome')} placeholder="Ex: Avaliação Geral de Desempenho" />
            </Field>
            
            <Field label="Escola / Campus Vinculado *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={form.escolaId} onChange={set('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione a unidade institucional...</option>
                {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </Select>
            </Field>

            <Field label="Carga Horária Total (Horas)">
              <Input type="number" min="1" value={form.cargaHoraria} onChange={set('cargaHoraria')} placeholder="Ex: 120" />
            </Field>
            
            <Field label="Descrição da Ementa" style={{ gridColumn: '1 / -1' }}>
              <Textarea rows={3} value={form.descricao} onChange={set('descricao') as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Breve resumo sobre o escopo ou censo do curso..." />
            </Field>
          </div>
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="tiny" /> : 'Confirmar e Gravar ✓'}
            </Button>
          </div>
        </form>
      </AppDialog>
    </div>
  );
}
