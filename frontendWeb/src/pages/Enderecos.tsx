import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Button, Field, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip,
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular, Location24Regular } from '@fluentui/react-icons';
import { getEnderecos, getEscolas, createEndereco, updateEndereco, deleteEndereco } from '../services/api';
import type { EnderecoEscola, Escola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { EmptyState } from '../components/EmptyState';
import { useConfirm } from '../hooks/useConfirm';
import { cmpTexto } from '../utils/tableSort';
import { useFormStyles, EnderecoFormFields } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';
import { mensagemDeErro } from '../utils/erroApi';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

export default function Enderecos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();
  const { confirmar, dialog } = useConfirm();
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
      .catch((e) => setError(mensagemDeErro(e, 'carregar os endereços e as escolas')))
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
    } catch (e) { setError(mensagemDeErro(e, 'salvar o endereço')); }
    finally { setSaving(false); }
  };

  const columns = [
    // createTableColumn<EnderecoEscola>({ columnId: 'id',        renderHeaderCell: () => '#',          renderCell: i => <TableCellLayout>{i.id}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'escola', compare: (a, b) => cmpTexto(a.escola?.nome, b.escola?.nome),    renderHeaderCell: () => 'Escola',      renderCell: i => <TableCellLayout>{i.escola?.nome ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'logr', compare: (a, b) => cmpTexto(a.logradouro, b.logradouro),      renderHeaderCell: () => 'Logradouro',  renderCell: i => <TableCellLayout media={<Location24Regular />}>{i.logradouro}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'num', compare: (a, b) => cmpTexto(a.numero, b.numero),       renderHeaderCell: () => 'Nº',          renderCell: i => <TableCellLayout>{i.numero ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'bairro', compare: (a, b) => cmpTexto(a.bairro, b.bairro),    renderHeaderCell: () => 'Bairro',      renderCell: i => <TableCellLayout>{i.bairro ?? '—'}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'cidade', compare: (a, b) => cmpTexto(a.cidade, b.cidade),    renderHeaderCell: () => 'Cidade',      renderCell: i => <TableCellLayout>{i.cidade}</TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'uf', compare: (a, b) => cmpTexto(a.estado, b.estado),        renderHeaderCell: () => 'UF',          renderCell: i => <TableCellLayout><Badge appearance="outline" size="small">{i.estado}</Badge></TableCellLayout> }),
    createTableColumn<EnderecoEscola>({ columnId: 'cep', compare: (a, b) => cmpTexto(a.cep, b.cep),       renderHeaderCell: () => 'CEP',         renderCell: i => <TableCellLayout>{i.cep ?? '—'}</TableCellLayout> }),
    ...(isAdmin ? [createTableColumn<EnderecoEscola>({ columnId: 'acoes', renderHeaderCell: () => 'Ações',
      renderCell: i => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar" relationship="label"><Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(i)} /></Tooltip>
            <Tooltip content="Excluir" relationship="label"><Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={async () => { if (!(await confirmar('Deseja excluir este endereço?'))) return; try { await deleteEndereco(i.id); load(); } catch (e) { setError(mensagemDeErro(e, 'excluir o endereço')); } }} /></Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <PageHeader
        icon={<Location24Regular />}
        title="Endereços das Escolas"
        actions={isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Endereço</Button>}
      />
      {error && !modal && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      {loading ? <Spinner label="Carregando..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={enderecos} columns={columns} sortable resizableColumns>
            <DataGridHeader><DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow></DataGridHeader>
            <DataGridBody<EnderecoEscola>>{({ item, rowId }) => <DataGridRow<EnderecoEscola> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>}</DataGridBody>
          </DataGrid>
          {enderecos.length === 0 && <EmptyState message="Nenhum endereço cadastrado." />}
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
      {dialog}
    </div>
  );
}
