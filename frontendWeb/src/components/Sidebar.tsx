import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  makeStyles, mergeClasses, tokens, Text, Badge,
} from '@fluentui/react-components';
import {
  Home24Regular, Home24Filled,
  Building24Regular, Building24Filled,
  BookOpen24Regular, BookOpen24Filled,
  People24Regular, People24Filled,
  ClipboardTaskAdd24Regular, ClipboardTaskAdd24Filled,
  StarEmphasis24Regular, StarEmphasis24Filled,
  Location24Regular, Location24Filled,
  Globe24Regular, Globe24Filled,
  Box24Regular, Box24Filled,
  DocumentBulletList24Regular, DocumentBulletList24Filled,
  PersonBoard24Regular, PersonBoard24Filled,
  ShoppingBag24Regular, ShoppingBag24Filled,
  DataTrending24Regular, DataTrending24Filled,
  Shield24Regular, Shield24Filled,
  Heart24Regular, Heart24Filled,
  bundleIcon,
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';
import { NAVBAR_HEIGHT, fecharMenu, fecharMenuNoCelular, useMenuLateral } from '../hooks/useMenuLateral';

const HomeIcon      = bundleIcon(Home24Filled,              Home24Regular);
const EscolaIcon    = bundleIcon(Building24Filled,          Building24Regular);
const CursoIcon     = bundleIcon(BookOpen24Filled,          BookOpen24Regular);
const AlunoIcon     = bundleIcon(People24Filled,            People24Regular);
const AvAlunoIcon   = bundleIcon(ClipboardTaskAdd24Filled,  ClipboardTaskAdd24Regular);
const AvQualIcon    = bundleIcon(StarEmphasis24Filled,      StarEmphasis24Regular);
const EnderecoIcon  = bundleIcon(Location24Filled,          Location24Regular);
const Ods4Icon      = bundleIcon(Globe24Filled,             Globe24Regular);
const ProdutoIcon   = bundleIcon(Box24Filled,               Box24Regular);
const DocsIcon       = bundleIcon(DocumentBulletList24Filled, DocumentBulletList24Regular);
const ProfessorIcon  = bundleIcon(PersonBoard24Filled,        PersonBoard24Regular);
const PedidoIcon     = bundleIcon(ShoppingBag24Filled,        ShoppingBag24Regular);
const ProgressoIcon  = bundleIcon(DataTrending24Filled,       DataTrending24Regular);
const EventosIcon    = bundleIcon(Shield24Filled,             Shield24Regular);
const AgradIcon      = bundleIcon(Heart24Filled,              Heart24Regular);

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'column',
    width: '220px',
    minWidth: '220px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: '12px 8px',
    gap: '2px',
    overflowY: 'auto',
  },
  // Computador: menu recolhido some do layout
  navRecolhido: { display: 'none' },
  // Celular: gaveta sobre o conteúdo, logo abaixo da Navbar
  navGaveta: {
    position: 'fixed',
    top: `${NAVBAR_HEIGHT}px`,
    bottom: 0,
    left: 0,
    zIndex: 1000,
    width: 'min(280px, 85vw)',
    minWidth: 0,
    boxSizing: 'border-box',
    boxShadow: tokens.shadow16,
    overscrollBehavior: 'contain',
    transitionProperty: 'transform, visibility',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': { transitionDuration: '0s' },
  },
  navGavetaFechada: { transform: 'translateX(-100%)', visibility: 'hidden' },
  fundoGaveta: {
    position: 'fixed',
    top: `${NAVBAR_HEIGHT}px`,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  section: {
    paddingLeft: '8px',
    paddingTop: '12px',
    paddingBottom: '4px',
    color: tokens.colorNeutralForeground3,
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '7px 10px',
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    transition: 'background 0.15s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
    ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '-2px' },
  },
  active: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: '600',
  },
});

interface NavItemProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  title?: string; // dica nativa ao passar o mouse
}

function NavItem({ to, icon: Icon, label, badge, title }: NavItemProps) {
  const s = useStyles();
  return (
    <NavLink
      to={to}
      end={to === '/'}
      title={title}
      onClick={fecharMenuNoCelular}
      className={({ isActive }) => `${s.link}${isActive ? ' ' + s.active : ''}`}
    >
      <Icon />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <Badge appearance="filled" color="brand" size="small">{badge}</Badge>}
    </NavLink>
  );
}

export default function Sidebar() {
  const s = useStyles();
  const { isAdmin } = useAuth();
  const { aberto, desktop } = useMenuLateral();

  // Esc fecha a gaveta no celular (teclado externo, acessibilidade)
  useEffect(() => {
    if (desktop || !aberto) return;
    const aoTecla = (e: KeyboardEvent) => { if (e.key === 'Escape') fecharMenu(); };
    window.addEventListener('keydown', aoTecla);
    return () => window.removeEventListener('keydown', aoTecla);
  }, [desktop, aberto]);

  const classeNav = mergeClasses(
    s.nav,
    desktop && !aberto && s.navRecolhido,
    !desktop && s.navGaveta,
    !desktop && !aberto && s.navGavetaFechada,
  );

  return (
    <>
    {!desktop && aberto && <div className={s.fundoGaveta} onClick={fecharMenu} aria-hidden="true" />}
    <nav id="menu-lateral" className={classeNav} aria-label="Navegação principal">
      <Text className={s.section}>Navegação</Text>
      <NavItem to="/"            icon={HomeIcon}    label="Dashboard" />
      <NavItem to="/ods4"        icon={Ods4Icon}    label="ODS 4" />

      <Text className={s.section}>Cadastros</Text>
      <NavItem to="/escolas"     icon={EscolaIcon}  label="Escolas" />
      <NavItem to="/cursos"      icon={CursoIcon}   label="Cursos" />
      <NavItem to="/alunos"      icon={AlunoIcon}   label="Alunos" />
      <NavItem to="/professores" icon={ProfessorIcon} label="Professores" />
      <NavItem to="/enderecos"   icon={EnderecoIcon}  label="Endereços" />

      <Text className={s.section}>Avaliações</Text>
      <NavItem to="/av-cursos"    icon={AvAlunoIcon}  label="Aval. Cursos" />
      <NavItem to="/av-qualidade" icon={AvQualIcon}   label="Aval. Qualidade" />

      <Text className={s.section}>Suprimentos</Text>
      <NavItem
        to="/produtos"
        icon={ProdutoIcon}
        label="Produtos"
        badge={isAdmin ? 'Admin' : undefined}
        title={isAdmin ? 'Gestão de Produtos' : 'Vitrine de Produtos'}
      />
      <NavItem to="/pedidos"     icon={PedidoIcon}    label="Pedidos" />

      <Text className={s.section}>Acompanhamento</Text>
      <NavItem to="/progressos"  icon={ProgressoIcon} label="Relatório Gerencial" />
      <NavItem to="/eventos"    icon={EventosIcon}   label="Central de Eventos" />

      <Text className={s.section}>Projeto</Text>
      <NavItem to="/docs" icon={DocsIcon} label="Documentação" />
      <NavItem to="/agradecimentos" icon={AgradIcon} label="Agradecimentos" />
    </nav>
    </>
  );
}
