import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  FluentProvider, webLightTheme, webDarkTheme, makeStyles, tokens,
} from '@fluentui/react-components';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LogProvider, useLogs } from './context/LogContext';
import { registerLogger } from './services/api';
import Navbar    from './components/Navbar';
import Sidebar   from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Escolas   from './pages/Escolas';
import Cursos    from './pages/Cursos';
import Alunos    from './pages/Alunos';
import AvaliacoesCursos    from './pages/AvaliacoesCursos';
import AvaliacoesQualidade from './pages/AvaliacoesQualidade';
import Enderecos from './pages/Enderecos';
import Produtos  from './pages/Produtos';
import Ods4         from './pages/Ods4';
import Documentacao from './pages/Documentacao';
import Professores  from './pages/Professores';
import Pedidos      from './pages/Pedidos';
import Progressos   from './pages/RelatorioDashboard';
import GerenciamentoEventos from './components/DevLogger'; // Importação direta segura da nova página

const useStyles = makeStyles({
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  body: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflowY: 'auto',
  },
});

// Conecta o addLog do contexto ao interceptor Axios (sem criar dependência circular)
function LoggerBridge() {
  const { addLog } = useLogs();
  useEffect(() => {
    registerLogger(addLog);
    return () => registerLogger(() => {}); // limpa ao desmontar
  }, [addLog]);
  return null;
}

function AppShell() {
  const s = useStyles();
  return (
    <div className={s.shell}>
      <Navbar />
      <div className={s.body}>
        <Sidebar />
        <main className={s.main}>
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/escolas"      element={<Escolas />} />
            <Route path="/cursos"       element={<Cursos />} />
            <Route path="/alunos"       element={<Alunos />} />
            <Route path="/av-cursos"    element={<AvaliacoesCursos />} />
            <Route path="/av-qualidade" element={<AvaliacoesQualidade />} />
            <Route path="/enderecos"    element={<Enderecos />} />
            <Route path="/produtos"     element={<Produtos />} />
            <Route path="/ods4"         element={<Ods4 />} />
            <Route path="/docs"         element={<Documentacao />} />
            <Route path="/professores"  element={<Professores />} />
            <Route path="/pedidos"      element={<Pedidos />} />
            <Route path="/progressos"   element={<Progressos />} />
            
            {/* Rota dedicada adicionada para renderizar o Logger em tela cheia na URL correspondente */}
            <Route path="/DevLogger"    element={<GerenciamentoEventos />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// FluentProvider precisa ler o contexto, então fica dentro do ThemeProvider
function ThemedApp() {
  const { isDark } = useTheme();
  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <BrowserRouter>
        <AuthProvider>
          <LogProvider>
            <LoggerBridge />
            <AppShell />
          </LogProvider>
        </AuthProvider>
      </BrowserRouter>
    </FluentProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
