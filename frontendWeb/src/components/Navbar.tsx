import { Link } from 'react-router-dom';
import {
  makeStyles, tokens, Text, Badge, Tooltip, Avatar, Button,
  Menu, MenuTrigger, MenuPopover, MenuList, MenuGroupHeader, MenuItemRadio,
} from '@fluentui/react-components';
import {
  BookOpen24Regular,
  Person24Regular,
  Settings24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
  ChevronDown16Regular,
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import type { UserRole } from '../types';

const PERFIS: Record<UserRole, { label: string; badge: string }> = {
  user: { label: 'Usuário', badge: 'USER' },
  admin: { label: 'Administrador', badge: 'ADMIN' },
};

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    padding: '0 20px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    gap: '16px',
    flexShrink: 0,
    boxShadow: tokens.shadow4,
  },
  brand: {
    display: 'flex',
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
  },
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

  return (
    <header className={s.header}>
      <Link to="/" className={s.brand} aria-label="Recode — Avaliação Escolas, ir para o Dashboard">
        <BookOpen24Regular style={{ fontSize: '24px' }} />
        <Text className={s.title}>Recode — Avaliação Escolas</Text>
      </Link>

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
              <span className={s.profileText}>{perfil.label}</span>
              <Badge appearance="filled" color={isAdmin ? 'warning' : 'informative'} size="medium">
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
