import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  makeStyles, tokens, Text, Badge, Tooltip,
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
  bundleIcon,
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';

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
  section: {
    paddingLeft: '8px',
    paddingTop: '16px',
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
    padding: '8px 10px',
    borderRadius: tokens.borderRadiusMedium,
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontSize: '14px',
    transition: 'background 0.15s',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
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
}

function NavItem({ to, icon: Icon, label, badge }: NavItemProps) {
  const s = useStyles();
  return (
    <NavLink
      to={to}
      end={to === '/'}
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

  return (
    <nav className={s.nav}>
      <Text className={s.section}>Navegação</Text>
      <NavItem to="/"            icon={HomeIcon}    label="Dashboard" />
      <NavItem to="/ods4"        icon={Ods4Icon}    label="ODS 4" />

      <Text className={s.section}>Cadastros</Text>
      <NavItem to="/escolas"     icon={EscolaIcon}  label="Escolas" />
      <NavItem to="/cursos"      icon={CursoIcon}   label="Cursos" />
      <NavItem to="/alunos"      icon={AlunoIcon}   label="Alunos" />

      <Text className={s.section}>Avaliações</Text>
      <NavItem to="/av-cursos"    icon={AvAlunoIcon}  label="Aval. Cursos" />
      <NavItem to="/av-qualidade" icon={AvQualIcon}   label="Aval. Qualidade" />

      <Text className={s.section}>Endereços</Text>
      <NavItem to="/enderecos"   icon={EnderecoIcon} label="Endereços" />

      <Text className={s.section}>Suprimentos</Text>
      <Tooltip content={isAdmin ? 'Gestão de Produtos' : 'Vitrine de Produtos'} relationship="label">
        <NavItem to="/produtos"    icon={ProdutoIcon}   label="Produtos"
          badge={isAdmin ? 'Admin' : undefined}
        />
      </Tooltip>
      <NavItem to="/professores" icon={ProfessorIcon} label="Professores" />
      <NavItem to="/pedidos"     icon={PedidoIcon}    label="Pedidos" />

      <Text className={s.section}>Acompanhamento</Text>
      <NavItem to="/progressos"  icon={ProgressoIcon} label="Relatorio Gerencial" />
      <NavItem to="/DevLogger"  icon={ProgressoIcon} label="Gerenciamento Eventos" />

      <Text className={s.section}>Projeto</Text>
      <NavItem to="/docs" icon={DocsIcon} label="Documentação" />
    </nav>
  );
}
