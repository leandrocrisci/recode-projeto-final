import { Link } from 'react-router-dom';
import {
  makeStyles, mergeClasses, tokens, Text, Badge, Tooltip, Avatar, Button,
  Menu, MenuTrigger, MenuPopover, MenuList, MenuGroupHeader, MenuItemRadio,
} from '@fluentui/react-components';
import {
  BookOpen24Regular,
  Person24Regular,
  Settings24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  ChevronDown16Regular,
  Navigation24Regular,
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserRole } from '../types';
import { NAVBAR_HEIGHT, alternarMenu, useMenuLateral } from '../hooks/useMenuLateral';

const PERFIS: Record<UserRole, { label: string; badge: string }> = {
  user: { label: 'Usuário', badge: 'USER' },
  admin: { label: 'Administrador', badge: 'ADMIN' },
};

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${NAVBAR_HEIGHT}px`,
    padding: '0 20px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    gap: '16px',
    flexShrink: 0,
    boxShadow: tokens.shadow4,
    '@media (max-width: 768px)': { padding: '0 8px', gap: '4px' },
  },
  esquerda: { display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0 },
  menuBtn: {
    color: tokens.colorNeutralForegroundOnBrand,
    flexShrink: 0,
    ':hover': { backgroundColor: 'rgba(255,255,255,0.15)', color: tokens.colorNeutralForegroundOnBrand },
    ':hover:active': { backgroundColor: 'rgba(255,255,255,0.22)', color: tokens.colorNeutralForegroundOnBrand },
  },
  brand: {
    display: 'flex',
    minWidth: 0,
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: tokens.borderRadiusMedium,
    ':focus-visible': { outline: '2px solid #fff', outlineOffset: '4px' },
  },
  title: {
    fontWeight: '600',
    fontSize: '16px',
    color: tokens.colorNeutralForegroundOnBrand,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  // Celular: nome curto, para o título não quebrar em três linhas
  tituloCompleto: { '@media (max-width: 560px)': { display: 'none' } },
  tituloCurto: { display: 'none', '@media (max-width: 560px)': { display: 'inline' } },
  ocultarNoCelular: { '@media (max-width: 560px)': { display: 'none' } },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255,255,255,0.25)',
    flexShrink: 0,
  },
  // Botões sobre o cabeçalho colorido: texto branco e fundo translúcido ao passar o mouse.
  profileBtn: {
    color: tokens.colorNeutralForegroundOnBrand,
    gap: '8px',
    ':hover': { backgroundColor: 'rgba(255,255,255,0.15)', color: tokens.colorNeutralForegroundOnBrand },
    ':hover:active': { backgroundColor: 'rgba(255,255,255,0.22)', color: tokens.colorNeutralForegroundOnBrand },
  },
  profileText: {
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  themeBtn: {
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.35)',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.55)',
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

export default function Navbar() {
  const s = useStyles();
  const { role, setRole, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const perfil = PERFIS[role];
  const { aberto } = useMenuLateral();

  return (
    <header className={s.header}>
      <div className={s.esquerda}>
        <Button
          appearance="transparent"
          className={s.menuBtn}
          icon={<Navigation24Regular />}
          onClick={alternarMenu}
          aria-label={aberto ? 'Esconder o menu lateral' : 'Mostrar o menu lateral'}
          aria-expanded={aberto}
          aria-controls="menu-lateral"
        />
        <Link to="/" className={s.brand} aria-label="Recode — Avaliação Escolas, ir para o Dashboard">
          <BookOpen24Regular style={{ fontSize: '24px', flexShrink: 0 }} />
          <Text className={mergeClasses(s.title, s.tituloCompleto)}>Recode — Avaliação Escolas</Text>
          <Text className={mergeClasses(s.title, s.tituloCurto)}>Recode</Text>
        </Link>
      </div>

      <div className={s.right}>
        {/* Perfil de acesso: avatar, papel atual e troca de papel num único menu */}
        <Menu
          checkedValues={{ perfil: [role] }}
          onCheckedValueChange={(_, d) => {
            const novo = d.checkedItems[0];
            if (novo === 'admin' || novo === 'user') setRole(novo);
          }}
        >
          <MenuTrigger disableButtonEnhancement>
            <Button
              appearance="transparent"
              className={s.profileBtn}
              icon={<Avatar name={perfil.label} color={isAdmin ? 'gold' : 'blue'} size={28} />}
              aria-label={`Perfil atual: ${perfil.label}. Abrir menu de perfil`}
            >
              <span className={mergeClasses(s.profileText, s.ocultarNoCelular)}>{perfil.label}</span>
              <Badge className={s.ocultarNoCelular} appearance="filled" color={isAdmin ? 'warning' : 'informative'} size="medium">
                {perfil.badge}
              </Badge>
              <ChevronDown16Regular />
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuGroupHeader>Perfil de acesso</MenuGroupHeader>
              <MenuItemRadio name="perfil" value="user" icon={<Person24Regular />}>Usuário comum</MenuItemRadio>
              <MenuItemRadio name="perfil" value="admin" icon={<Settings24Regular />}>Administrador</MenuItemRadio>
            </MenuList>
          </MenuPopover>
        </Menu>

        <div className={s.divider} />

        <Tooltip
          content={isDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          relationship="label"
        >
          <Button
            appearance="subtle"
            icon={isDark ? <WeatherSunny24Regular /> : <WeatherMoon24Regular />}
            className={s.themeBtn}
            onClick={toggleTheme}
            aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          />
        </Tooltip>
      </div>
    </header>
  );
}
