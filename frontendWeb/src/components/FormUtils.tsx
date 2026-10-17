import {
  makeStyles, tokens, Field, Input, Button,
  MessageBar, MessageBarBody, Spinner,
} from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';
import { buscarCep } from '../services/api';
import { useState } from 'react';

// ── Estilos compartilhados de formulário ──────────────────────────────────────
export const useFormStyles = makeStyles({
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    '@media (max-width: 520px)': {
      gridTemplateColumns: '1fr',
    },
  },
  fullSpan: {
    gridColumn: '1 / -1',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: '8px',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  stepCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
    flexShrink: 0,
  },
  stepActive: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  stepDone: {
    backgroundColor: tokens.colorPaletteGreenBackground3,
    color: '#fff',
  },
  stepPending: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground3,
  },
  stepLine: {
    flex: 1,
    height: '2px',
    backgroundColor: tokens.colorNeutralStroke1,
  },
});

// ── Subformulário de endereço reutilizável ────────────────────────────────────
interface EndForm {
  cep: string; logradouro: string; numero: string;
  bairro: string; cidade: string; estado: string;
}

interface EnderecoFormProps {
  form: EndForm;
  setForm: (f: EndForm) => void;
}

export function EnderecoFormFields({ form, setForm }: EnderecoFormProps) {
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  const set = (k: keyof EndForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleBuscarCep = async () => {
    setCepError('');
    setCepLoading(true);
    try {
      const data = await buscarCep(form.cep);
      setForm({
        ...form,
        logradouro: data.logradouro || form.logradouro,
        bairro:     data.bairro     || form.bairro,
        cidade:     data.localidade || form.cidade,
        estado:     data.uf         || form.estado,
        cep:        data.cep        || form.cep,
      });
    } catch (err: unknown) {
      setCepError((err as Error).message || 'CEP não encontrado.');
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <>
      <Field label="CEP" style={{ gridColumn: '1 / -1' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            value={form.cep}
            onChange={set('cep')}
            placeholder="00000-000"
            maxLength={9}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleBuscarCep(); } }}
          />
          <Button
            icon={cepLoading ? <Spinner size="tiny" /> : <Search24Regular />}
            onClick={handleBuscarCep}
            disabled={cepLoading}
          >
            Buscar
          </Button>
        </div>
        {cepError && (
          <MessageBar intent="error" style={{ marginTop: '4px' }}>
            <MessageBarBody>{cepError}</MessageBarBody>
          </MessageBar>
        )}
      </Field>

      <Field label="Logradouro *" style={{ gridColumn: '1 / -1' }} required>
        <Input value={form.logradouro} onChange={set('logradouro')} />
      </Field>

      <Field label="Número">
        <Input value={form.numero} onChange={set('numero')} />
      </Field>

      <Field label="Bairro">
        <Input value={form.bairro} onChange={set('bairro')} />
      </Field>

      <Field label="Cidade *" required>
        <Input value={form.cidade} onChange={set('cidade')} />
      </Field>

      <Field label="Estado (UF) *" required>
        <Input value={form.estado} onChange={set('estado')} maxLength={2} placeholder="SP" />
      </Field>
    </>
  );
}
