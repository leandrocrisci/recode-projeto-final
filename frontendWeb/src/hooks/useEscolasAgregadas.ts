import { useCallback, useEffect, useRef, useState } from 'react';
import { getAlunos, getAvaliacoesQualidade, getEnderecos, getEscolas } from '../services/api';
import { agregarEscolas } from '../utils/agregarEscolas';
import type { EscolaAgregada } from '../utils/agregarEscolas';
import type { Aluno, AvaliacaoQualidade, EnderecoEscola, Escola } from '../types';

/**
 * Carrega escolas, alunos, endereços e avaliações pelo services/api
 * (assim os requests passam pelo interceptor e aparecem na Central de Eventos)
 * e devolve as escolas já agregadas.
 */
export function useEscolasAgregadas() {
  const [escolas, setEscolas] = useState<EscolaAgregada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ativo = useRef(true); // evita setState depois de desmontar a página

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [rEscolas, rAlunos, rEnderecos, rAvaliacoes] = await Promise.all([
        getEscolas(), getAlunos(), getEnderecos(), getAvaliacoesQualidade(),
      ]);
      if (!ativo.current) return;
      setEscolas(agregarEscolas(
        (rEscolas.data ?? []) as Escola[],
        (rAlunos.data ?? []) as Aluno[],
        (rEnderecos.data ?? []) as EnderecoEscola[],
        (rAvaliacoes.data ?? []) as AvaliacaoQualidade[],
      ));
    } catch (err) {
      console.error(err);
      if (ativo.current) setError('Erro ao carregar ou cruzar dados dos endpoints.');
    } finally {
      if (ativo.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    ativo.current = true;
    reload();
    return () => { ativo.current = false; };
  }, [reload]);

  return { escolas, loading, error, reload };
}
