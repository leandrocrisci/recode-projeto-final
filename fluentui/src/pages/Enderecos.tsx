import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Button, Field, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip, Title2,
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular, Location24Regular } from '@fluentui/react-icons';
import { getEnderecos, getEscolas, createEndereco, updateEndereco, deleteEndereco } from '../services/api';
import type { EnderecoEscola, Escola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { useFormStyles, EnderecoFormFields } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

export default function Enderecos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();
  const [enderecos, setEnderecos] = useState<EnderecoEscola[]>([]);
  const [escolas,   setEscolas]   = useState<Escola[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [modal,     setModal]     = useState(false);
  const [editId,    setEditId]    = useState<number | null>(null);
  const [saving,    setSaving]    = useState(false);
  const [formEnd,   setFormEnd]   = useState({ cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '' });
  const [escolaId,  setEscolaId]  = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([getEnderecos(), getEscolas()])
      .then(([en, es]) => { setEnderecos(en.data); setEscolas(es.data); })
      .catch(() => setError('Erro ao carregar dados.'))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setFormEnd({ cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '' }); setEscolaId(''); setEditId(null); setError(''); setModal(true); };
  const openEdit = (e: EnderecoEscola) => {
    setFormEnd({ cep: e.cep ?? '', logradouro: e.logradouro, numero: e.numero ?? '', bairro: e.bairro ?? '', cidade: e.cidade, estado: e.estado });
    setEscolaId(String(e.escola?.id ?? ''));
    setEditId(e.id); setError(''); setModal(true);
  };
  const closeModal = () => { setModal(false); setError(''); setSaving(false); };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError(''); setSaving(true);
    const payload = { ...formEnd, escola: { id: Number(escolaId) } };
    try {
      if (editId) await updateEndereco(editId, payload);
      else await createEndereco(Number(escolaId), payload);
      closeModal(); load();
    } catch { setError('Erro ao salvar endereço.'); }
    finally { setSaving(false); }
  };

  const columns = [
    // createTableColumn<EnderecoEscola>({ columnId: 'id',        renderHeaderCell: () => '#',          renderCell: i => <TableCellLayout>{i.id}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'escola',    renderHeaderCell: () => 'Escola',      renderCell: i => <TableCellLayout>{i.escola?.nome ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'logr',      renderHeaderCell: () => 'Logradouro',  renderCell: i => <TableCellLayout media={<Location24Regular />}>{i.logradouro}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'num',       renderHeaderCell: () => 'Nº',          renderCell: i => <TableCellLayout>{i.numero ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'bairro',    renderHeaderCell: () => 'Bairro',      renderCell: i => <TableCellLayout>{i.bairro ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'cidade',    renderHeaderCell: () => 'Cidade',      renderCell: i => <TableCellLayout>{i.cidade}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'uf',        renderHeaderCell: () => 'UF',          renderCell: i => <TableCellLayout><Badge appearance="outline" size="small">{i.estado}</Badge></TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'cep',       renderHeaderCell: () => 'CEP',         renderCell: i => <TableCellLayout>{i.cep ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<EnderecoEscola>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
      renderCell: i => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar" relationship="label"><Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(i)} /></Tooltip>
            <Tooltip content="Excluir" relationship="label"><Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={async () => { if (!confirm('Excluir?')) return; await deleteEndereco(i.id); load(); }} /></Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <div className={s.toolbar}>
        <Title2>📍 Endereços das Escolas</Title2>
        {isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Endereço</Button>}
      </div>
      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      {loading ? <Spinner label="Carregando..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={enderecos} columns={columns} resizableColumns>
            <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
            <DataGridBody<EnderecoEscola>>{({ item, rowId }) => <DataGridRow<EnderecoEscola> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
          </DataGrid>
          {enderecos.length === 0 && <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>Nenhum endereço cadastrado.</div>}
        </div>
      )}
      <AppDialog open={modal} title={editId ? 'Editar Endereço' : 'Novo Endereço'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        <form onSubmit={handleSubmit}>
          <div className={fs.formGrid}>
            {!editId && (
              <Field label="Escola *" required style={{ gridColumn: '1 / -1' }}>
                <Select required value={escolaId} onChange={e => setEscolaId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </Select>
              </Field>
            )}
            <EnderecoFormFields form={formEnd} setForm={setFormEnd} />
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
