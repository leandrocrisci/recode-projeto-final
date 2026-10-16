import {
  makeStyles, tokens, Text, Badge, Switch, Tooltip, Avatar, Button,
} from '@fluentui/react-components';
import {
  BookOpen24Regular,
  Person24Regular,
  Settings24Regular,
  WeatherMoon24Regular,
  WeatherSunny24Regular,
} from '@fluentui/react-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  switchLabel: {
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: 'rgba(255,255,255,0.25)',
    flexShrink: 0,
  },
  themeBtn: {
    color: tokens.colorNeutralForegroundOnBrand,
    // força fundo transparente sobre o header colorido
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.35)',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.55)',
    },
  },
});

export default function Navbar() {
  const s = useStyles();
  const { setRole, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className={s.header}>
      <div className={s.brand}>
        <BookOpen24Regular style={{ fontSize: '24px' }} />
        <Text className={s.title}>Recode — Avaliação Escolas</Text>
      </div>

      <div className={s.right}>
        {/* ── Perfil de usuário ── */}
        <div className={s.roleBadge}>
          {isAdmin
            ? <Settings24Regular style={{ color: tokens.colorNeutralForegroundOnBrand }} />
            : <Person24Regular   style={{ color: tokens.colorNeutralForegroundOnBrand }} />
          }
          <Text className={s.switchLabel}>{isAdmin ? 'Administrador' : 'Usuário'}</Text>
        </div>

        <Tooltip
          content={isAdmin ? 'Mudar para Usuário Comum' : 'Mudar para Administrador'}
          relationship="label"
        >
          <Switch
            checked={isAdmin}
            onChange={(_, d) => setRole(d.checked ? 'admin' : 'user')}
            label={
              <Badge
                appearance="filled"
                color={isAdmin ? 'warning' : 'informative'}
                size="medium"
              >
                {isAdmin ? 'ADMIN' : 'USER'}
              </Badge>
            }
          />
        </Tooltip>

        <Avatar
          name={isAdmin ? 'Admin' : 'Usuário'}
          color={isAdmin ? 'gold' : 'blue'}
          size={32}
          badge={{ status: 'available' }}
        />

        {/* ── Separador ── */}
        <div className={s.divider} />

        {/* ── Botão de tema ── */}
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
