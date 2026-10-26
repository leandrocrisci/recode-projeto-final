/**
 * Chama o webhook do n8n protegido por Basic Auth (usuário e senha).
 * A senha NÃO fica guardada no código nem no navegador: o usuário digita a cada execução.
 *
 * Uso:
 *   const resultado = await executarWorkflow(URL_DO_WEBHOOK, usuario, senha);
 */

// Basic Auth com suporte a acentos (btoa sozinho quebra com caracteres fora do ASCII)
const basic = (usuario: string, senha: string) => {
  const bytes = new TextEncoder().encode(`${usuario}:${senha}`);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return 'Basic ' + btoa(bin);
};

export async function executarWorkflow(url: string, usuario: string, senha: string): Promise<unknown> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: basic(usuario, senha), 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  } catch {
    // fetch só lança erro quando não chega resposta: rede, CORS bloqueado ou servidor dormindo
    throw new Error(
      'Não foi possível falar com o n8n. Verifique sua internet. Se o servidor estava parado, aguarde cerca de 1 minuto e tente de novo.'
    );
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Usuário ou senha do workflow incorretos.');
  }
  if (res.status === 404) {
    throw new Error('O workflow não foi encontrado. Confira se ele está ativo no n8n e se a URL do webhook está correta.');
  }
  if (!res.ok) {
    throw new Error(`O n8n respondeu com erro (${res.status}). Veja os detalhes na aba Executions do n8n.`);
  }

  const texto = await res.text();
  try {
    return texto ? JSON.parse(texto) : {};
  } catch {
    return texto;
  }
}
