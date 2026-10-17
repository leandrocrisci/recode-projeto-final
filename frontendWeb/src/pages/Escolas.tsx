import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Badge, Tooltip,
} from '@fluentui/react-components';
import {
  Add24Regular, Edit24Regular, Delete24Regular, Building24Regular, Location24Regular
} from '@fluentui/react-icons';
import {
  getEscolas, createEscola, updateEscola, deleteEscola,
  getEnderecos, createEndereco, updateEndereco,
} from '../services/api';
import type { Escola, EnderecoEscola } from '../types';
import { AppDialog } from '../components/AppDialog';
import { PageHeader } from '../components/PageHeader';
import { useFormStyles, EnderecoFormFields } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

const emptyEscola   = { nome: '', tipo: '', telefone: '', email: '' };
const emptyEndereco = { cep: '', logradouro: '', numero: '', bairro: '', cidade: '', estado: '' };

export default function Escolas() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();

  const [escolas,    setEscolas]    = useState<Escola[]>([]);
  const [enderecos,  setEnderecos]  = useState<EnderecoEscola[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [modal,      setModal]      = useState(false);
  const [passo,      setPasso]      = useState<1 | 2>(1);
  const [editId,     setEditId]     = useState<number | null>(null);
  const [savedId,    setSavedId]    = useState<number | null>(null);
  const [enderecoId, setEnderecoId] = useState<number | null>(null);
  const [formEscola, setFormEscola] = useState(emptyEscola);
  const [formEnd,    setFormEnd]    = useState(emptyEndereco);
  const [saving,     setSaving]     = useState(false);

  const encontrarEndereco = (id: number) => {
    return enderecos.find(e => e.escola?.id === id || (e as any).escolaId === id);
  };

  const enderecoResumido = (id: number) => {
    const en = encontrarEndereco(id);
    if (!en) return '—';
    if ((en as any).formattedAddress) return (en as any).formattedAddress;
    return [en.logradouro, en.numero, en.cidade, en.estado].filter(Boolean).join(', ');
  };

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([getEscolas(), getEnderecos()])
      .then(([es, en]) => { 
        setEscolas(es.data || []); 
        setEnderecos(en.data || []); 
      })
      .catch(() => setError('Erro ao sincronizar dados da matriz de escolas.'))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { 
    load(); 
  }, []);

  const openNew = () => {
    setFormEscola(emptyEscola); 
    setFormEnd(emptyEndereco);
    setEditId(null); 
    setSavedId(null); 
    setEnderecoId(null);
    setPasso(1); 
    setError(''); 
    setModal(true);
  };

  const openEdit = (e: Escola) => {
    setFormEscola({ nome: e.nome, tipo: e.tipo, telefone: e.telefone ?? '', email: e.email ?? '' });
    setEditId(e.id); 
    setSavedId(e.id);
    
    const en = encontrarEndereco(e.id);
    if (en) {
      setFormEnd({ 
        cep: en.cep ?? '', 
        logradouro: en.logradouro || '', 
        numero: en.numero ?? '', 
        bairro: en.bairro ?? '', 
        cidade: en.cidade || '', 
        estado: en.estado || '' 
      });
      setEnderecoId(en.id);
    } else {
      setFormEnd(emptyEndereco); 
      setEnderecoId(null);
    }
    setPasso(1); 
    setError(''); 
    setModal(true);
  };

  const closeModal = () => { 
    setModal(false); 
    setError(''); 
    setSaving(false); 
  };

  const handleSubmitEscola = async (ev: React.FormEvent) => {
    ev.preventDefault(); 
    setError(''); 
    setSaving(true);
    try {
      let id: number;
      if (editId) { 
        await updateEscola(editId, formEscola); 
        id = editId; 
      } else { 
        const r = await createEscola(formEscola); 
        id = r.data.id; 
      }
      setSavedId(id); 
      setPasso(2);
    } catch { 
      setError('Erro ao salvar as informações iniciais da escola.'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleSubmitEndereco = async (ev: React.FormEvent) => {
    ev.preventDefault(); 
    setError(''); 
    setSaving(true);
    const payload = { ...formEnd, escola: { id: savedId } };
    try {
      if (enderecoId) {
        await updateEndereco(enderecoId, payload);
      } else {
        await createEndereco(savedId!, payload);
      }
      closeModal(); 
      load();
    } catch { 
      setError('Erro ao salvar a localização espacial da instituição.'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja remover permanentemente esta unidade de ensino?')) return;
    try { 
      await deleteEscola(id); 
      load(); 
    } catch { 
      setError('Não foi possível excluir a escola selecionada.'); 
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormEscola(f => ({ ...f, [k]: e.target.value }));

  const obterEstiloTipo = (tipo: string) => {
    const t = tipo?.toLowerCase();
    if (t === 'pública' || t === 'municipal') return 'informative';
    if (t === 'estadual') return 'success';
    if (t === 'técnica') return 'warning';
    return 'subtle';
  };

  const columns = [
    createTableColumn<Escola>({ 
      columnId: 'nome',     
      renderHeaderCell: () => 'Unidade de Ensino',      
      renderCell: i => <TableCellLayout media={<Building24Regular />}><b>{i.nome}</b></TableCellLayout> 
    }),
    createTableColumn<Escola>({ 
      columnId: 'tipo',     
      renderHeaderCell: () => 'Classificação',      
      renderCell: i => <TableCellLayout><Badge appearance="filled" color={obterEstiloTipo(i.tipo)}>{i.tipo}</Badge></TableCellLayout> 
    }),
    createTableColumn<Escola>({ 
      columnId: 'telefone', 
      renderHeaderCell: () => 'Telefone',  
      renderCell: i => <TableCellLayout>{i.telefone || '—'}</TableCellLayout> 
    }),
    createTableColumn<Escola>({ 
      columnId: 'email',    
      renderHeaderCell: () => 'E-mail Institucional',    
      renderCell: i => <TableCellLayout>{i.email || '—'}</TableCellLayout> 
    }),
    createTableColumn<Escola>({ 
      columnId: 'endereco', 
      renderHeaderCell: () => 'Localização Geográfica',  
      renderCell: i => <TableCellLayout media={<Location24Regular />}>{enderecoResumido(i.id)}</TableCellLayout> 
    }),
    ...(isAdmin ? [createTableColumn<Escola>({ 
      columnId: 'acoes', 
      renderHeaderCell: () => 'Ações',
      renderCell: i => (
        <TableCellLayout>
          <div className={s.actionCell}>
            <Tooltip content="Editar Registro" relationship="label">
              <Button icon={<Edit24Regular />} appearance="subtle" size="small" onClick={() => openEdit(i)} />
            </Tooltip>
            <Tooltip content="Remover" relationship="label">
              <Button icon={<Delete24Regular />} appearance="subtle" size="small" onClick={() => handleDelete(i.id)} />
            </Tooltip>
          </div>
        </TableCellLayout>
      ),
    })] : []),
  ];

  return (
    <div className={s.page}>
      <PageHeader
        title="🏫 Gestão de Unidades Escolares"
        subtitle={`${escolas.length} escola${escolas.length !== 1 ? 's' : ''} integrada${escolas.length !== 1 ? 's' : ''} ao censo`}
        actions={isAdmin && (
          <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>
            Nova Escola
          </Button>
        )}
      />

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

      {loading ? (
        <Spinner label="Consolidando base de dados cartográfica..." />
      ) : (
        <div className={s.tableWrap}>
          <DataGrid items={escolas} columns={columns} resizableColumns columnSizingOptions={{ nome: { defaultWidth: 260 }, endereco: { defaultWidth: 260 } }}>
            <DataGridHeader>
              <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
            </DataGridHeader>
            <DataGridBody<Escola>>
              {({ item, rowId }) => (
                <DataGridRow<Escola> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {escolas.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
              Nenhuma unidade escolar cadastrada no sistema local.
            </div>
          )}
        </div>
      )}

      <AppDialog open={modal} title={passo === 1 ? (editId ? 'Editar Dados Cadastrais' : 'Nova Escola') : `Vincular Endereço — ${formEscola.nome}`} onClose={closeModal}>
        <div className={fs.stepper}>
          <div className={`${fs.stepCircle} ${passo === 1 ? fs.stepActive : fs.stepDone}`}>{passo > 1 ? '✓' : '1'}</div>
          <Text size={200}>Dados Gerais</Text>
          <div className={fs.stepLine} />
          <div className={`${fs.stepCircle} ${passo === 2 ? fs.stepActive : fs.stepPending}`}>2</div>
          <Text size={200}>Geolocalização</Text>
        </div>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

        {passo === 1 && (
          <form onSubmit={handleSubmitEscola}>
            <div className={fs.formGrid}>
              <Field label="Nome da Instituição *" required style={{ gridColumn: '1 / -1' }}>
                <Input required value={formEscola.nome} onChange={set('nome')} />
              </Field>
              <Field label="Dependência Administrativa *" required>
                <Select required value={formEscola.tipo} onChange={set('tipo') as React.ChangeEventHandler<HTMLSelectElement>}>
                  <option value="">Selecione...</option>
                  {['Pública', 'Estadual', 'Municipal', 'Técnica', 'Privada', 'Federal'].map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </Field>
              <Field label="Telefone de Contato">
                <Input value={formEscola.telefone} onChange={set('telefone')} placeholder="(XX) XXXXX-XXXX" />
              </Field>
              <Field label="E-mail de Contato" style={{ gridColumn: '1 / -1' }}>
                <Input type="email" value={formEscola.email} onChange={set('email')} placeholder="escola@edu.br" />
              </Field>
            </div>
            <div className={fs.actions}>
              <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
              <Button appearance="primary" type="submit" disabled={saving}>
                {saving ? <Spinner size="tiny" /> : 'Próximo: Coordenadas e Endereço →'}
              </Button>
            </div>
          </form>
        )}

        {passo === 2 && (
          <form onSubmit={handleSubmitEndereco}>
            <div className={fs.formGrid}>
              <EnderecoFormFields form={formEnd} setForm={setFormEnd} />
            </div>
            <div className={fs.actions}>
              <Button appearance="secondary" onClick={() => { closeModal(); load(); }}>Definir depois</Button>
              <Button appearance="primary" type="submit" disabled={saving}>
                {saving ? <Spinner size="tiny" /> : 'Salvar Localização ✓'}
              </Button>
            </div>
          </form>
        )}
      </AppDialog>
    </div>
  );
}