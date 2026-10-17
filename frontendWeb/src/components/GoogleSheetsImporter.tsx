import { useState, type FormEvent } from 'react';
import {
  Button,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Spinner,
  Text,
} from '@fluentui/react-components';
import { ArrowUpload24Regular } from '@fluentui/react-icons';
import { AppDialog } from './AppDialog';

export type GoogleSheetRow = Record<string, string>;

interface GoogleSheetsImporterProps {
  title: string;
  requiredColumns: string[];
  onBeforeImport?: () => Promise<void>;
  validateRows?: (rows: GoogleSheetRow[]) => void;
  onImportRow: (row: GoogleSheetRow) => Promise<void>;
  onComplete: () => void;
}

const normalizeHeader = (value: string) =>
  value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const parseCsv = (csv: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') {
      if (quoted && csv[i + 1] === '"') {
        cell += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(cell);
      if (row.some(value => value.trim())) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (quoted) throw new Error('CSV inválido: há aspas sem fechamento.');
  if (cell || row.length) {
    row.push(cell);
    if (row.some(value => value.trim())) rows.push(row);
  }
  return rows;
};

export const sheetValue = (row: GoogleSheetRow, column: string) =>
  (row[normalizeHeader(column)] ?? '').trim();

export const findSheetEntity = <T extends { nome: string }>(
  entities: T[],
  name: string,
  label: string,
) => {
  const target = normalizeHeader(name);
  const match = entities.find(entity => normalizeHeader(entity.nome) === target);
  if (!target || !match) throw new Error(`${label} "${name || '(vazio)'}" não encontrado. Importe/cadastre esse relacionamento antes.`);
  return match;
};

export const sheetNumber = (value: string, label: string) => {
  const normalized = value.trim().replace(/\s/g, '').replace(/^R\$/i, '');
  const parsed = Number(normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized);
  if (!normalized || !Number.isFinite(parsed)) {
    throw new Error(`Valor numérico inválido em "${label}".`);
  }
  return parsed;
};

const readGoogleSheet = async (sheetUrl: string, requiredColumns: string[]) => {
  let url: URL;
  try {
    url = new URL(sheetUrl);
  } catch {
    throw new Error('Informe um link válido do Google Sheets.');
  }

  const match = url.pathname.match(/^\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (url.hostname !== 'docs.google.com' || !match) {
    throw new Error('O link informado não é de uma planilha Google Sheets.');
  }

  const gid = url.searchParams.get('gid') ?? '0';
  const csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv&gid=${encodeURIComponent(gid)}`;
  const response = await fetch(csvUrl, { credentials: 'omit' });
  if (!response.ok) {
    throw new Error('Não foi possível ler a planilha. Compartilhe-a como "Qualquer pessoa com o link" com acesso de leitor.');
  }

  const csv = (await response.text()).replace(/^\uFEFF/, '');
  if (/^\s*<!doctype html|^\s*<html/i.test(csv)) {
    throw new Error('O Google retornou uma página HTML em vez do CSV. Verifique o compartilhamento e a aba do link.');
  }

  const parsedRows = parseCsv(csv);
  if (parsedRows.length < 2) throw new Error('A aba está vazia ou contém somente o cabeçalho.');

  const headers = parsedRows[0].map(normalizeHeader);
  if (headers.some(header => !header) || new Set(headers).size !== headers.length) {
    throw new Error('O cabeçalho possui nomes vazios ou duplicados.');
  }

  const missing = requiredColumns.filter(column => !headers.includes(normalizeHeader(column)));
  if (missing.length) throw new Error(`Colunas obrigatórias ausentes: ${missing.join(', ')}.`);

  return parsedRows.slice(1).map((values, index) => {
    const row: GoogleSheetRow = {};
    headers.forEach((header, cellIndex) => { row[header] = values[cellIndex]?.trim() ?? ''; });
    Object.defineProperty(row, '__rowNumber', { value: index + 2, enumerable: false });
    return row;
  }).filter(row => Object.values(row).some(value => value.trim()));
};

export function GoogleSheetsImporter({
  title,
  requiredColumns,
  onBeforeImport,
  validateRows,
  onImportRow,
  onComplete,
}: GoogleSheetsImporterProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [rows, setRows] = useState<GoogleSheetRow[]>([]);
  const [nextRowIndex, setNextRowIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const close = () => {
    if (!loading) setOpen(false);
  };

  const readSheet = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setRows([]);
    setNextRowIndex(0);
    setLoading(true);
    try {
      const sheetRows = await readGoogleSheet(url, requiredColumns);
      if (sheetRows.length === 0) throw new Error('Não há linhas de dados para importar.');
      setRows(sheetRows);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Falha ao ler a planilha.');
    } finally {
      setLoading(false);
    }
  };

  const importRows = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    let imported = 0;
    try {
      await onBeforeImport?.();
      validateRows?.(rows);
      for (let index = nextRowIndex; index < rows.length; index++) {
        const row = rows[index];
        const rowNumber = Number((row as GoogleSheetRow & { __rowNumber?: number }).__rowNumber);
        try {
          await onImportRow(row);
        } catch (cause) {
          const reason = cause instanceof Error ? cause.message : 'A API rejeitou o registro.';
          throw new Error(`Falha na linha ${rowNumber || index + 2} depois de ${nextRowIndex + imported} de ${rows.length} registro(s): ${reason}`, { cause });
        }
        imported++;
        setNextRowIndex(index + 1);
      }
      setSuccess(`${rows.length} registro(s) importado(s).`);
      setRows([]);
      setNextRowIndex(0);
      setUrl('');
      onComplete();
    } catch (cause) {
      if (imported > 0) onComplete();
      setError(cause instanceof Error ? cause.message : `Importação interrompida após ${imported} registro(s).`);
    } finally {
      setLoading(false);
    }
  };

  const previewColumns = rows.length ? Object.keys(rows[0]).slice(0, 6) : [];

  return (
    <>
      <Button
        icon={<ArrowUpload24Regular />}
        onClick={() => {
          setError('');
          setSuccess('');
          setRows([]);
          setNextRowIndex(0);
          setUrl('');
          setOpen(true);
        }}
      >
        Importar da Planilha
      </Button>
      <AppDialog open={open} title={`Importar ${title} do Google Sheets`} onClose={close}>
        {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
        {success && <MessageBar intent="success"><MessageBarBody>{success}</MessageBarBody></MessageBar>}
        <form onSubmit={readSheet} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Field label="Link da planilha *">
            <Input
              required
              type="url"
              value={url}
              placeholder="Cole o link da planilha ou da aba"
              disabled={loading}
              onChange={event => {
                setUrl(event.target.value);
                setRows([]);
                setNextRowIndex(0);
                setSuccess('');
              }}
            />
          </Field>
          <Text size={200}>
            A planilha precisa permitir leitura a qualquer pessoa com o link. Colunas obrigatórias: {requiredColumns.join(', ')}.
            O `gid` do link determina qual aba será lida. Cada importação cria novos registros.
          </Text>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button type="button" onClick={close} disabled={loading}>Fechar</Button>
            <Button appearance="primary" type="submit" disabled={loading || !url}>
              {loading && rows.length === 0 ? <Spinner size="tiny" label="Lendo planilha..." /> : 'Ler planilha'}
            </Button>
          </div>
        </form>
        {rows.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            <MessageBar intent="success">
              <MessageBarBody>{rows.length} registro(s) lidos. Prévia das primeiras 10 linhas:</MessageBarBody>
            </MessageBar>
            <div style={{ overflow: 'auto', maxHeight: '280px' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '12px' }}>
                <thead>
                  <tr>{previewColumns.map(column => <th key={column} style={{ textAlign: 'left', padding: 6 }}>{column}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      {previewColumns.map(column => (
                        <td key={column} style={{ borderTop: '1px solid #ddd', padding: 6 }}>{row[column]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 10 && <Text size={200}>Exibindo 10 de {rows.length} registros.</Text>}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button appearance="primary" onClick={importRows} disabled={loading}>
                {loading ? <Spinner size="tiny" label="Importando..." /> : `Importar ${rows.length} registro(s)`}
              </Button>
            </div>
          </div>
        )}
      </AppDialog>
    </>
  );
}
