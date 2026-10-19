import { useSyncExternalStore } from 'react';

/**
 * Estado do menu lateral, compartilhado entre a Navbar (botão) e a Sidebar (menu) sem precisar
 * de Provider nem de mudanças no App.tsx.
 *
 *  • Computador (acima de 768 px): o menu fica na lateral e o botão recolhe e reabre. A escolha é lembrada.
 *  • Celular (até 768 px): o menu é uma gaveta sobre o conteúdo. Começa fechada e fecha sozinha ao
 *    navegar. O ponto de corte é o mesmo do layout do Dashboard.
 */

/** Altura da Navbar (components/Navbar.tsx). A gaveta começa logo abaixo dela. */
export const NAVBAR_HEIGHT = 56;

const CONSULTA_DESKTOP = '(min-width: 769px)';
const CHAVE_PREFERENCIA = 'recode:menu-lateral-aberto';

interface Estado {
  aberto: boolean;
  desktop: boolean;
}

const temJanela = typeof window !== 'undefined' && typeof window.matchMedia === 'function';

function lerPreferenciaDesktop(): boolean {
  try {
    return window.localStorage.getItem(CHAVE_PREFERENCIA) !== '0';
  } catch {
    return true; // armazenamento bloqueado (modo privado): segue o padrão
  }
}

function salvarPreferenciaDesktop(aberto: boolean) {
  try {
    window.localStorage.setItem(CHAVE_PREFERENCIA, aberto ? '1' : '0');
  } catch { /* sem armazenamento: só não lembra */ }
}

let estado: Estado = (() => {
  const desktop = temJanela ? window.matchMedia(CONSULTA_DESKTOP).matches : true;
  return { desktop, aberto: desktop ? lerPreferenciaDesktop() : false };
})();

const ouvintes = new Set<() => void>();

function definir(proximo: Estado) {
  if (proximo.aberto === estado.aberto && proximo.desktop === estado.desktop) return;
  estado = proximo; // objeto novo só quando algo muda (exigência do useSyncExternalStore)
  ouvintes.forEach(avisar => avisar());
}

// Girar o aparelho ou redimensionar a janela atravessa o ponto de corte: reajusta o menu.
if (temJanela) {
  const consulta = window.matchMedia(CONSULTA_DESKTOP);
  const aoMudar = (e: { matches: boolean }) =>
    definir({ desktop: e.matches, aberto: e.matches ? lerPreferenciaDesktop() : false });
  if (typeof consulta.addEventListener === 'function') consulta.addEventListener('change', aoMudar);
  else consulta.addListener(aoMudar); // Safari antigo
}

export function alternarMenu() {
  const aberto = !estado.aberto;
  if (estado.desktop) salvarPreferenciaDesktop(aberto);
  definir({ ...estado, aberto });
}

export function fecharMenu() {
  definir({ ...estado, aberto: false });
}

/** Usado ao escolher uma tela: no celular fecha a gaveta, no computador deixa como está. */
export function fecharMenuNoCelular() {
  if (!estado.desktop) fecharMenu();
}

const assinar = (aoMudar: () => void) => {
  ouvintes.add(aoMudar);
  return () => { ouvintes.delete(aoMudar); };
};
const obter = () => estado;

export function useMenuLateral() {
  const { aberto, desktop } = useSyncExternalStore(assinar, obter, obter);
  return { aberto, desktop };
}
