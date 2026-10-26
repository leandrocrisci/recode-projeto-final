/**
 * Transforma qualquer erro de chamada à API em uma mensagem clara para o usuário.
 * Pensado para erros do axios (err.response.status / err.response.data), mas funciona com qualquer erro.
 *
 * Uso:
 *   .catch(e => setError(mensagemDeErro(e, 'carregar as escolas')))
 *   catch (e) { setError(mensagemDeErro(e, 'excluir a escola', 'Verifique se ela não tem cursos ou professores vinculados.')); }
 *
 * @param err   erro capturado
 * @param acao  o que o usuário tentava fazer, no infinitivo ("salvar o pedido")
 * @param dica  (opcional) orientação extra para conflitos e falhas do servidor
 */

type ErroComResposta = {
  response?: { status?: number; data?: unknown };
  code?: string;
  message?: string;
};

// Pega a mensagem enviada pelo backend, se for curta e legível (descarta stack trace e texto técnico)
function detalheDoServidor(data: unknown): string | null {
  let texto: unknown = data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    texto = d.message ?? d.error ?? d.detail ?? d.mensagem ?? null;
  }
  if (typeof texto !== 'string') return null;
  const limpo = texto.trim();
  if (!limpo || limpo.length > 160) return null;
  if (/exception|sql|constraint|stack|<html|org\.|java\./i.test(limpo)) return null;
  return limpo;
}

export function mensagemDeErro(err: unknown, acao = 'concluir a operação', dica?: string): string {
  const e = (err ?? {}) as ErroComResposta;
  const status = e.response?.status;
  const extra = dica ? ` ${dica}` : '';

  // Sem resposta do servidor: rede, servidor dormindo ou timeout
  if (status === undefined) {
    if (e.code === 'ECONNABORTED' || /timeout/i.test(e.message ?? '')) {
      return `Não foi possível ${acao}: o servidor demorou demais para responder. Ele pode estar iniciando; aguarde cerca de 1 minuto e tente de novo.`;
    }
    return `Não foi possível ${acao}: sem conexão com o servidor. Verifique sua internet e tente de novo.`;
  }

  const detalhe = detalheDoServidor(e.response?.data);
  const comDetalhe = (base: string) => (detalhe ? `${base} Detalhe: ${detalhe}` : base);

  switch (status) {
    case 400:
    case 422:
      return comDetalhe(`Não foi possível ${acao}: há dados inválidos ou faltando. Revise os campos e tente de novo.`);
    case 401:
      return 'Sua sessão expirou. Entre novamente para continuar.';
    case 403:
      return `Você não tem permissão para ${acao}.`;
    case 404:
      return 'Este registro não foi encontrado. Ele pode ter sido removido; atualize a página.';
    case 409:
      return comDetalhe(`Não foi possível ${acao}: já existe um registro igual ou este está em uso.${extra}`);
    default:
      if (status >= 500) {
        return `O servidor teve um problema ao tentar ${acao}. Tente de novo em instantes.${extra}`;
      }
      return comDetalhe(`Não foi possível ${acao} (erro ${status}).`);
  }
}
