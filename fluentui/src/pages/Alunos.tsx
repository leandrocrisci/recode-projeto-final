import React, { useEffect, useState } from 'react';
import {
  makeStyles, tokens, Text, Button, Input, Field, Select,
  DataGrid, DataGridHeader, DataGridHeaderCell, DataGridBody, DataGridRow, DataGridCell,
  TableCellLayout, createTableColumn, Spinner, MessageBar, MessageBarBody,
  Tooltip, Title2, Badge
} from '@fluentui/react-components';
import { Add24Regular, Edit24Regular, Delete24Regular, People24Regular, Location24Regular, VehicleBus24Regular } from '@fluentui/react-icons';

import {
  getAlunos, getEscolas, getCursos, createAluno, updateAluno, deleteAluno  
} from '../services/api';

import type { Escola, Curso } from '../types';
import { AppDialog } from '../components/AppDialog';
import { useFormStyles } from '../components/FormUtils';
import { useAuth } from '../context/AuthContext';

const useStyles = makeStyles({
  page: { padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' },
  tableWrap: { border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium, overflow: 'hidden' },
  actionCell: { display: 'flex', gap: '6px' },
});

const emptyAluno = { 
  area: 'urbana', 
  distanciaEscola: '', 
  tipoTransporte: 'a_pe', 
  tempoDeslocamentoMinutos: '', 
  cursoId: '', 
  escolaId: '' 
};

export default function Alunos() {
  const s = useStyles();
  const fs = useFormStyles();
  const { isAdmin } = useAuth();

  const [alunos,    setAlunos]    = useState<any[]>([]);
  const [escolas,   setEscolas]   = useState<Escola[]>([]);
  const [cursos,    setCursos]    = useState<Curso[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [modal,     setModal]     = useState(false);
  const [editId,    setEditId]    = useState<number | null>(null);
  const [formAluno, setFormAluno] = useState(emptyAluno);
  const [saving,    setSaving]    = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAlunos(), getEscolas(), getCursos()])
      .then(([a, e, c]) => { 
        setAlunos(a.data || []); 
        setEscolas(e.data || []); 
        setCursos(c.data || []); 
      })
      .catch(() => setError('Erro ao carregar dados dos alunos.'))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { 
    load(); 
  }, []);

  const openNew = () => {
    setFormAluno(emptyAluno);
    setEditId(null);
    setError(''); 
    setModal(true);
  };

  const openEdit = (a: any) => {
    setFormAluno({ 
      area: a.area || 'urbana', 
      distanciaEscola: String(a.distanciaEscola || ''), 
      tipoTransporte: a.tipoTransporte || 'a_pe', 
      tempoDeslocamentoMinutos: String(a.tempoDeslocamentoMinutos || ''), 
      cursoId: String(a.curso?.id || ''), 
      escolaId: String(a.escola?.id || '') 
    });
    setEditId(a.id);
    setError(''); 
    setModal(true);
  };

  const closeModal = () => { 
    setModal(false); 
    setError(''); 
    setSaving(false); 
  };

  const handleSubmitAluno = async (ev: React.FormEvent) => {
    ev.preventDefault(); 
    setError(''); 
    setSaving(true);
    
    const payload = { 
      area: formAluno.area.toLowerCase(), 
      distanciaEscola: parseFloat(formAluno.distanciaEscola) || 0, 
      tipoTransporte: formAluno.tipoTransporte, 
      tempoDeslocamentoMinutos: parseInt(formAluno.tempoDeslocamentoMinutos) || 0, 
      curso: formAluno.cursoId ? { id: Number(formAluno.cursoId) } : null, 
      escola: formAluno.escolaId ? { id: Number(formAluno.escolaId) } : null 
    };

    try {
      if (editId) { 
        await updateAluno(editId, payload); 
      } else { 
        await createAluno(payload); 
      }
      closeModal();
      load();
    } catch { 
      setError('Erro ao salvar os indicadores do aluno.'); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir permanentemente este aluno do censo?')) return;
    try { 
      await deleteAluno(id); 
      load(); 
    } catch { 
      setError('Erro ao excluir aluno.'); 
    }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormAluno(f => ({ ...f, [k]: e.target.value }));

  const formatarTransporte = (tipo: string) => {
    switch (tipo) {
      case 'a_pe': return 'A pé';
      case 'transporte_escolar': return 'Transporte Escolar Público';
      case 'transporte_publico': return 'Transporte Público Coletivo';
      case 'proprio': return 'Veículo Próprio';
      default: return tipo || '—';
    }
  };

  const columns = [
    createTableColumn<any>({ 
      columnId: 'area', 
      renderHeaderCell: () => 'Área Residencial', 
      renderCell: i => (
        <TableCellLayout>
          <Badge appearance="filled" color={i.area?.toLowerCase() === 'rural' ? 'important' : 'informative'}>
            {i.area?.toUpperCase()}
          </Badge>
        </TableCellLayout>
      )
    }),
    createTableColumn<any>({ 
      columnId: 'distancia', 
      renderHeaderCell: () => 'Distância', 
      renderCell: i => <TableCellLayout media={<Location24Regular />}>{i.distanciaEscola ? `${i.distanciaEscola.toFixed(2)} km` : '—'}</TableCellLayout> 
    }),
    createTableColumn<any>({ 
      columnId: 'transporte', 
      renderHeaderCell: () => 'Modo de Transporte', 
      renderCell: i => <TableCellLayout media={<VehicleBus24Regular />}>{formatarTransporte(i.tipoTransporte)}</TableCellLayout> 
    }),
    createTableColumn<any>({ 
      columnId: 'tempo', 
      renderHeaderCell: () => 'Tempo de Trajeto', 
      renderCell: i => <TableCellLayout>{i.tempoDeslocamentoMinutos ? `${i.tempoDeslocamentoMinutos} min` : '—'}</TableCellLayout> 
    }),
    createTableColumn<any>({ 
      columnId: 'escola', 
      renderHeaderCell: () => 'Escola Vinculada', 
      renderCell: i => <TableCellLayout><b>{i.escola?.nome ?? '—'}</b></TableCellLayout> 
    }),
    createTableColumn<any>({ 
      columnId: 'curso', 
      renderHeaderCell: () => 'Curso', 
      renderCell: i => <TableCellLayout>{i.curso?.nome ?? '—'}</TableCellLayout> 
    }),
    ...(isAdmin ? [createTableColumn<any>({ 
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
          <Title2>🎓 Alunos</Title2>
        </div>
        {isAdmin && <Button appearance="primary" icon={<Add24Regular />} onClick={openNew}>Novo Aluno</Button>}
      </div>

      {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
      
      {loading ? <Spinner label="Carregando indicadores espaciais..." /> : (
        <div className={s.tableWrap}>
          <DataGrid items={alunos} columns={columns} resizableColumns>
            <DataGridHeader>
              <DataGridRow>
                {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<any>>
              {({ item, rowId }) => (
                <DataGridRow<any> key={rowId}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {alunos.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
              Nenhum aluno localizado no mapeamento.
            </div>
          )}
        </div>
      )}

      <AppDialog open={modal} title={editId ? 'Editar Perfil Geoprocessado' : 'Registrar Indicadores Socioespaciais'} onClose={closeModal}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}

        <form onSubmit={handleSubmitAluno}>
          <div className={fs.formGrid}>
            <Field label="Área Residencial *" required>
              <Select value={formAluno.area} onChange={set('area') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="urbana">Urbana</option>
                <option value="rural">Rural</option>
              </Select>
            </Field>

            <Field label="Distância até a Escola (km) *" required>
              <Input type="number" step="0.01" required value={formAluno.distanciaEscola} onChange={set('distanciaEscola')} placeholder="Ex: 5.20" />
            </Field>

            <Field label="Modo de Transporte Principal *" required>
              <Select value={formAluno.tipoTransporte} onChange={set('tipoTransporte') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="a_pe">A pé</option>
                <option value="transporte_escolar">Transporte Escolar Público</option>
                <option value="transporte_publico">Transporte Público Coletivo</option>
                <option value="proprio">Veículo Próprio</option>
              </Select>
            </Field>

            <Field label="Tempo de Deslocamento (minutos) *" required>
              <Input type="number" required value={formAluno.tempoDeslocamentoMinutos} onChange={set('tempoDeslocamentoMinutos')} placeholder="Ex: 25" />
            </Field>

            <Field label="Escola / Unidade Vinculada *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={formAluno.escolaId} onChange={set('escolaId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione a instituição...</option>
                {escolas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
              </Select>
            </Field>

            <Field label="Curso de Matrícula *" required style={{ gridColumn: '1 / -1' }}>
              <Select required value={formAluno.cursoId} onChange={set('cursoId') as React.ChangeEventHandler<HTMLSelectElement>}>
                <option value="">Selecione o programa acadêmico...</option>
                {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </Select>
            </Field>
          </div>
          
          <div className={fs.actions}>
            <Button appearance="secondary" onClick={closeModal}>Cancelar</Button>
            <Button appearance="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="tiny" /> : 'Confirmar e Salvar ✓'}
            </Button>
          </div>
        </form>
      </AppDialog>
    </div>
  );
}
