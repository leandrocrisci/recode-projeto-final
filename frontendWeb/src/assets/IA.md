# IA.md — Recode · Avaliação Escolas (Portal de Suprimentos ODS 4)

Guia do projeto para pessoas e ferramentas de inteligência artificial. Resume o sistema, as convenções adotadas, correções e melhorias registradas e itens que ainda podem ser verificados.

Última atualização: 18/10/2026.

> **Como usar este arquivo:** este resumo foi consolidado a partir das revisões e alterações do projeto. Ele não substitui o código nem uma validação atual. Se um caminho, configuração ou comportamento aqui divergir do repositório, vale o repositório. Valide as alterações com `npm run build`, os testes disponíveis e a aplicação em execução.

---

## 1. Visão geral

Sistema B2B de gestão educacional e venda de materiais escolares, alinhado ao **ODS 4 (Educação de Qualidade)** da Agenda 2030. É o **projeto final do curso da Recode** (trilhas.recode.org.br, Turma 2). No menu aparece como **Recode — Avaliação Escolas**.

- **Frontend:** React + TypeScript + Fluent UI v9, nesta pasta.
- **Backend:** API REST em Java (Spring Boot), porta `8090`, banco PostgreSQL. Fica em outro projeto.
- **Funcionalidades:** cadastros (escolas, cursos, alunos, professores, endereços), avaliações (cursos e qualidade), mapa com indicadores socioespaciais, suprimentos (produtos e pedidos), relatório gerencial, Central de Eventos e Auditoria, página do ODS 4, documentação técnica e página de Agradecimentos.
- **Perfis:** usuário e administrador (troca pelo menu do avatar na Navbar). Ações de criar, editar e excluir só aparecem para admin.

## 2. Stack e como rodar

| Camada | Tecnologia |
|---|---|
| UI | React 19, TypeScript, Fluent UI v9 (`@fluentui/react-components`, `@fluentui/react-icons`), Griffel (`makeStyles`) |
| Build / rota | Vite 8, React Router 7 |
| HTTP | Axios (`baseURL: '/api'`), com interceptores de log |
| Mapa | Google Maps JavaScript API via `@vis.gl/react-google-maps` |
| Integrações | ViaCEP (busca de endereço), Google Sheets (importação opcional de produtos, no backend) |

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # faz a checagem de tipos de verdade: rode antes de entregar
```

**Variáveis de ambiente** (`.env.local`, que **não** vai para o Git):

| Variável | Uso |
|---|---|
| `VITE_GOOGLE_MAPS_API_KEY` | Chave da Maps JavaScript API |
| `VITE_GOOGLE_MAP_ID` | Map ID do Google (opcional; sem ele usa `DEMO_MAP_ID`, só para desenvolvimento) |

O front chama `/api/...`, então o Vite precisa encaminhar `/api` para o backend em `localhost:8090` (proxy no `vite.config`).

## 3. Estrutura de `src/`

```
App.tsx                      rotas e providers
components/
  Navbar.tsx  Sidebar.tsx    casca da aplicação
  PageHeader.tsx             título, ícone, subtítulo e ações de toda tela
  KpiCard.tsx                card de indicador (rótulo, número, dica, tom)
  ChartCard.tsx              cartão de gráfico (título, nota, fonte)
  EmptyState.tsx             estado vazio padrão das tabelas
  Stars.tsx                  estrelas cheias e vazias (notas 1 a 5)
  AppDialog.tsx  FormUtils.tsx
  charts/
    HBarChart.tsx            barras horizontais, agrupadas, com linha de referência
    ColumnChart.tsx          colunas verticais em SVG
    RingChart.tsx            anel de progresso em SVG
    shared.ts                tons dos gráficos e hook de animação
context/
  AuthContext.tsx            perfil (user/admin)
  ThemeContext.tsx           claro/escuro
  LogContext.tsx             eventos da Central; liga a captura do console
hooks/
  useEscolasAgregadas.ts     carrega e cruza escolas, alunos, endereços e avaliações
  useConfirm.tsx             diálogo de confirmação (no lugar de window.confirm)
services/
  api.ts                     instância Axios, endpoints e interceptores de log
  consoleCapture.ts          espelha o console do navegador na Central de Eventos
utils/
  agregarEscolas.ts          agregação e KPIs globais (função pura)
  avaliacoesRelatorio.ts     regiões, cursos e faixas de nota do Relatório (função pura)
  tableSort.ts               comparadores das colunas (cmpTexto, cmpNumero)
  tipoEscola.ts              cor do badge de tipo de escola
data/
  ods4.ts                    números da página do ODS 4, com fontes
  agradecimentos.ts          textos da página de Agradecimentos
pages/
  Dashboard  Escolas  Cursos  Alunos  Professores  Endereços  Produtos  Pedidos
  AvaliacoesCursos  AvaliacoesQualidade  RelatorioDashboard  Ods4  Documentacao
  Agradecimentos  DevLogger (Central de Eventos)
types.ts                     tipos compartilhados
```

> O arquivo `DevLogger.tsx` pode estar em `pages/` ou `components/`; o import no `App.tsx` precisa apontar para onde ele estiver.

**Rotas:** `/` Dashboard · `/ods4` · `/escolas` · `/cursos` · `/alunos` · `/professores` · `/enderecos` · `/av-cursos` · `/av-qualidade` · `/produtos` · `/pedidos` · `/progressos` (Relatório Gerencial) · `/eventos` (Central de Eventos; `/DevLogger` redireciona para cá) · `/docs` · `/agradecimentos`.

**Menu lateral:** Navegação (Dashboard, ODS 4) · Cadastros (Escolas, Cursos, Alunos, Professores, Endereços) · Avaliações (Aval. Cursos, Aval. Qualidade) · Suprimentos (Produtos, Pedidos) · Acompanhamento (Relatório Gerencial, Central de Eventos) · Projeto (Documentação, Agradecimentos).

## 4. Convenções (siga ao criar ou alterar telas)

1. **Cabeçalho:** use `PageHeader` com `icon` (ícone do Fluent, sem emoji), `title`, `subtitle` e `actions`. Não monte `<div><Title2/><Text/></div>`: os dois são `<span>` e ficam na mesma linha.
2. **Indicadores:** use `KpiCard`. O tom (`brand`, `success`, `warning`, `danger`, `neutral`) só fica colorido quando faz sentido (contador de erros em 0 é neutro).
3. **Tabelas:** `DataGrid` com `sortable` e `compare` em cada coluna (`cmpTexto`, `cmpNumero`), `columnSizingOptions` quando houver conteúdo largo (ex.: nota com estrelas) e `EmptyState` para lista vazia. Colunas de ação e de texto livre não ordenam.
4. **Exclusão:** `const { confirmar, dialog } = useConfirm()`, `if (!(await confirmar('...'))) return;` e `{dialog}` no fim da página. Nunca `window.confirm`.
5. **Chamadas à API:** sempre por `services/api.ts`. Assim passam pelo interceptor e aparecem na Central de Eventos. Não use `axios` direto nas páginas (a única exceção é o ViaCEP em `buscarCep`).
6. **Dados agregados:** use `useEscolasAgregadas()` e as funções de `utils/`. Não recalcule médias dentro da página.
7. **Cores:** só tokens do Fluent (`tokens.*`), para o modo escuro funcionar. Hexadecimais só onde há motivo (vermelho do ODS 4, texto branco sobre o gradiente da marca, cores de verbo HTTP na Central).
8. **Verde, amarelo e vermelho = status/nota.** Tipos de escola usam `corTipoEscola()` (marca, informativo, importante, discreto), nunca essas três cores.
9. **Faixas de nota** (centralizadas em `utils/avaliacoesRelatorio.ts`): escala 1 a 5: ≥ 4 boa, ≥ 2,5 atenção, abaixo crítica. Escala 0 a 10 (cursos): ≥ 7 boa, ≥ 5 atenção, abaixo crítica.
10. **Estrelas de nota:** componente `Stars`. Texto `★☆` dentro de Badge parecia tudo preenchido.
11. **Gráficos:** reutilize `HBarChart`, `ColumnChart`, `RingChart` e passe `ariaLabel` com o resumo em texto. Sem biblioteca de gráficos nova.
12. **Textos em português** com acentuação correta. Números de conteúdo editorial ficam em `src/data/`, não espalhados no JSX.
13. **Antes de criar um componente novo,** confira `components/` e `utils/`.

## 5. Decisões e o porquê

- **Hook + função pura para agregação:** o cruzamento de escolas, alunos, endereços e avaliações estava duplicado no Dashboard e no Relatório. Agora vive em `utils/agregarEscolas.ts` (uma passada com `Map`) e é testável sem React.
- **Região por UF:** `obterRegiao` aceita sigla ou nome, com ou sem acento. O que não for reconhecido vira "Não informado" (nunca uma "região" inventada).
- **Média da região:** é a média das notas médias das escolas avaliadas (cada escola pesa igual, independente do número de avaliações). A tela avisa isso e marca "amostra pequena" abaixo de 3 escolas avaliadas.
- **Cursos com nome repetido** (ex.: "Avaliação Geral de Desempenho" em várias escolas): o gráfico usa a escola como rótulo e o nome do curso como detalhe. A chave do React é o id, nunca o nome.
- **Avaliação sem nota é ignorada**, não conta como zero.
- **Dashboard:** altura é `100vh - NAVBAR_HEIGHT` (56 px, constante no arquivo). O mapa usa `AdvancedMarker` com `mapId` e `colorScheme` ligado ao tema. O conteúdo do balão do mapa (`InfoWindow`) usa um `FluentProvider` com tema claro, porque o balão do Google é sempre branco.
- **Central de Eventos:** exporta JSON em vez de "Atualizar" (o reload da página apagava os logs, que ficam em memória). "Limpar Logs" é vermelho por estilo próprio, porque o `Button` do Fluent não tem `color="danger"`.
- **Menu:** `Tooltip` em volta do `NavItem` não funcionava (sem `forwardRef`); virou o atributo `title`. Professores e Endereços ficam em Cadastros.
- **Perfil na Navbar:** um único botão com avatar, papel e menu (`MenuItemRadio`) no lugar de ícone, texto, switch e avatar soltos.

## 6. Histórico consolidado de correções e melhorias

### 6.1 Segurança
- Chave do Google Maps estava escrita no `Dashboard.tsx`. Passou para `VITE_GOOGLE_MAPS_API_KEY` no `.env.local` (no `.gitignore`), a chave foi trocada e a antiga deve ser desativada.
- Restringir a chave nova por referenciador HTTP e só às APIs usadas. Conferir o histórico do Git: `git log -S "AIza" --oneline`.

### 6.2 Layout e consistência (todas as telas)
- Título e subtítulo colados (Escolas, Cursos, Professores, ODS 4): resolvido com `PageHeader`.
- Emojis nos títulos trocados por ícones do Fluent; ícone repetido entre Relatório e Central de Eventos corrigido.
- `KpiCard` em Dashboard, Relatório, Central de Eventos e ODS 4.
- Badges de tipo de escola fora da família verde/amarelo/vermelho (`corTipoEscola`).
- Avaliações de Qualidade: `Stars` no lugar do badge, coluna Nota com largura definida e `nowrap` (as estrelas e o "5/5" invadiam a coluna Data).
- Avaliações de Cursos: escola junto do curso; badges de nota de largura igual.
- Banners da ODS 4 e Documentação: título e subtítulo em coluna; etiqueta não quebra mais.
- Produtos ganhou subtítulo "Catálogo de materiais escolares".

### 6.3 Tabelas (11 DataGrids)
- Ordenação por coluna em todas (`sortable` + `compare`).
- 9 `confirm()` do navegador trocados por `useConfirm` (diálogo do Fluent, botão "Excluir" vermelho).
- 9 estados vazios copiados à mão trocados por `EmptyState`; a Central de Eventos ganhou um.
- Filtro de tipo do Relatório não achava nada (comparava `publica` com `Pública`); agora as opções vêm dos dados.
- Painel lateral do Relatório guarda só o id da escola, então reflete os dados novos depois de "Atualizar".

### 6.4 Dados e API
- `useEscolasAgregadas` + `utils/agregarEscolas.ts`: Dashboard e Relatório pararam de chamar `axios` com `http://localhost:8090`. Os requests passam por `api.ts` e aparecem na Central de Eventos.
- `types.ts`: `Aluno` ganhou `area`, `distanciaEscola`, `tipoTransporte`, `tempoDeslocamentoMinutos`; `EnderecoEscola` ganhou `latitude`, `longitude`, `formattedAddress`.
- `api.ts`: as rotas de avaliações de cursos estavam sem a barra inicial (o log mostrava `/apiavaliacoes-cursos`).
- Endereço ausente mostra "Endereço não cadastrado" em vez de `, - /`. Coordenada `0` é válida; texto inválido vira `null` e a escola fica fora do mapa.

### 6.5 Dashboard
- Faixa de KPIs (escolas, alunos, nota média, % rural).
- Painel lateral sem seleção virou panorama: busca e lista de escolas (clicar equivale a clicar no marcador), aviso de escolas sem localização. Botão "Voltar ao panorama" no topo.
- Altura corrigida (era 64 px, a Navbar tem 56). Removido `fontFamily: 'sans-serif'`.
- `Marker` (deprecado) → `AdvancedMarker`; `mapId` com `VITE_GOOGLE_MAP_ID` ou `DEMO_MAP_ID`; tema escuro do mapa.
- **Bug do modo escuro:** o nome da escola sumia no balão (texto branco do tema escuro sobre o balão branco do Google). Conteúdo do `InfoWindow` agora dentro de `FluentProvider theme={webLightTheme}`.

### 6.6 Relatório Gerencial
- Abas: Avaliação por Região, Avaliação dos Cursos e Escolas (antes "Analítico").
- Gráfico comparativo único (`HBarChart`) no lugar de um cartão por barra; cor por faixa de nota; linha de média geral; número de escolas avaliadas visível; sempre as cinco regiões, com "Sem avaliações" quando não houver dado.
- Cursos: todos (limite inicial de 10 + "Mostrar todos"), ordem "maiores" ou "menores" notas primeiro; antes só os 8 melhores, escondendo os críticos.
- Correções: chave duplicada nos cursos, nota nula contando como zero, região desconhecida virando barra, "avaliaçãoões", KPI "0.0" quando não há avaliações.
- Lógica em `utils/avaliacoesRelatorio.ts`; `HBarChart` ganhou `detail` (linha sob o rótulo) e `id` (chave estável).

### 6.7 Central de Eventos e Auditoria
- "Atualizar" (reload que apagava os logs) → "Exportar" JSON dos eventos filtrados.
- "Limpar Logs" vermelho, desabilitado sem eventos, e fecha o painel de detalhes.
- Colunas com largura que cabe (horário, método, status, latência); cabeçalhos "Método" e "Status".
- Rota `/eventos` (a antiga `/DevLogger` redireciona); item de menu "Central de Eventos" com ícone próprio.
- **Captura do console:** `services/consoleCapture.ts` espelha `console.log/info/warn/error`, erros não tratados e promises rejeitadas. Liga no `LogContext` com `useLayoutEffect`. O console continua funcionando; erros do Axios não são duplicados; mensagens iguais em sequência (0,5 s) são ignoradas; teto de 30 por segundo; ruído do Vite e da dica do React DevTools é ignorado. Os KPIs agora se chamam "Volume Total de Eventos", "Exceções e Erros" e "Alertas e Avisos".

### 6.8 Sidebar, Navbar e rotas
- Ícone de escudo para a Central de Eventos, rótulo "Central de Eventos", acento em "Relatório Gerencial".
- Menu com `aria-label`, contorno de foco e espaçamento mais enxuto.
- Navbar: menu de perfil único; marca clicável (leva ao Dashboard); removida a bolinha verde de "online" do avatar.
- Professores e Endereços movidos para Cadastros (a seção "Endereços" de um item só deixou de existir).

### 6.9 Página do ODS 4
Reescrita com hero, cinco indicadores-chave, e abas Visão geral, Cenário global, Brasil, Metas e Desafios e caminhos, com gráficos próprios (barras, colunas, anéis) e fontes citadas.
- **Fontes:** ONU (Relatório dos ODS 2026, Relatório Estendido do Objetivo 4), UNESCO (Relatório GEM 2026), IBGE (PNAD Contínua Educação 2025, divulgada em 19/06/2026).
- Valores de 2000 e 2015 da população fora da escola (≈ 391 mi e ≈ 264 mi) são **calculados** a partir das variações publicadas (queda de 127 mi até 2015 e alta de 9 mi desde então, chegando a 273 mi em 2024).
- Todos os números estão em `src/data/ods4.ts`. Para atualizar no próximo ciclo de relatórios, edite só esse arquivo.

### 6.10 Página de Agradecimentos
Resumo do sistema, fluxo da arquitetura, tecnologias por grupo, a jornada dos três módulos do curso com "onde aparece no projeto" e uma carta de agradecimento à Recode. Textos em `src/data/agradecimentos.ts`.

### 6.11 Diagrama de Classes UML
- O diagrama ASCII antigo na documentação foi substituído por `frontendWeb/public/diagramas/diagrama-classes.drawio`, editável com Draw.io Integration ou diagrams.net.
- As classes, atributos e associações foram alinhados às 11 entidades JPA presentes no backend; para mudanças futuras, confira os modelos Java antes de atualizar o diagrama.

## 7. Casos de referência para testes

As funções abaixo são puras e foram validadas em Node com os casos listados. Ao criar testes de verdade (sugestão: Vitest), comece por eles.

- **`agregarEscolas`:** escola de Teresina com 1 aluno urbano a 2,3 km e 11 min → `distanciaMedia '2.30'`, `tempoMedio 11`, `raioMaximoMetros 2300`, nota média `4.5` com as notas 4 e 5; aluno ligado por `escola.id` ou por `escolaId`; escola sem alunos, endereço ou avaliação não produz `NaN`; latitude em texto vira número, texto inválido vira `null`.
- **`calcularKpis`:** 3 escolas, 4 alunos (2 rurais) → `percentualRural '50.0'`; média das médias; lista vazia → `null` e `'0.0'`.
- **`mediaPorRegiao`:** sempre 5 regiões; ordenadas por média, sem dado no fim; "Não informado" só aparece se houver escola nele. **`obterRegiao`:** `PI`, `piauí`, `Piaui` → Nordeste; `XX` → Não informado.
- **`mediaPorCurso`:** nota `null` não vira zero; escola fora do filtro é ignorada; cursos de mesmo nome usam a escola como rótulo; plural "1 avaliação" / "2 avaliações".
- **`cmpTexto` / `cmpNumero`:** ignora acento e caixa, "Escola 2" antes de "Escola 10", vazios no fim.
- **`iniciarCapturaConsole`:** o console original continua sendo chamado; níveis mapeados; `Error`, objeto circular e `%s` formatados; erro do Axios e `[vite]` ignorados; repetidos viram um; teto por segundo com um aviso; erros da janela e promises rejeitadas; `parar()` restaura tudo.

## 8. Pendências e ideias

- [ ] **Rodar `npm run build`** e passar pelas telas nos temas claro e escuro (nada foi testado no navegador pelo Claude).
- [ ] Clicar numa barra do Relatório (região ou curso) para filtrar a aba "Escolas".
- [ ] Incluir a página de Agradecimentos na `Documentacao`.
- [ ] Preencher `AUTOR` em `src/data/agradecimentos.ts` e personalizar a carta (pessoas e momentos específicos do curso).
- [ ] Criar testes automatizados (Vitest) a partir da seção 7.
- [ ] Tipar os `any` que sobraram (ex.: lista de alunos em `Alunos.tsx`) com os tipos de `types.ts`.
- [ ] Deploy (ex.: Render): proxy `/api` para o backend, variáveis `VITE_GOOGLE_MAPS_API_KEY` e `VITE_GOOGLE_MAP_ID`, `render.yaml`.
- [ ] Criar um **Map ID de produção** no Google Cloud (o `DEMO_MAP_ID` é só para desenvolvimento).
- [ ] Ideia: componente `DataTable` genérico para eliminar o boilerplate repetido do `DataGrid`.

## 9. Armadilhas conhecidas

- **`colorScheme` / `AdvancedMarker`** exigem versão recente de `@vis.gl/react-google-maps`. Se o TypeScript reclamar, `npm i @vis.gl/react-google-maps@latest`. Trocar o tema recria o mapa (pode piscar), e o modo escuro não vale na visão Satélite.
- **Central de Eventos usa memória:** os eventos somem ao recarregar a página (limite de 200). Para guardar, use "Exportar".
- **HMR do Vite:** se `services/api.ts` for recarregado a quente, o registro do logger zera. Se a Central parar de receber chamadas, recarregue a página (F5).
- **Captura do console** cobre o que acontece depois que o app monta; avisos do React na primeira renderização não entram.
- **Dados do Relatório** dependem de `cidade` e `estado` do endereço da escola e de `curso.escola` na resposta de `/cursos`. Sem isso, as regiões caem em "Não informado" e os cursos ficam sem escola no rótulo.
- **A média de uma região** pondera cada escola igualmente; com poucas escolas ela é frágil (por isso o aviso de amostra pequena).
- **Dev:** `.env.local` precisa de reinício do `npm run dev` para ser relido.

## 10. Contexto do curso (para a página de Agradecimentos)

- Curso da Recode iniciado em **junho de 2026**, com aulas noturnas de segunda a quinta.
- Módulo 1: Lógica de Programação, JavaScript, Git, HTML e CSS, Python e OO. Módulo 2: Pandas, Machine Learning, SQL, NoSQL (MongoDB), Linux, Nuvem, Docker. Módulo 3 (Desenvolvimento de Sistemas III): JS ES6+, React + API REST, Java e OO, JDBC, Spring, Angular.
- Ferramentas das aulas: **MySQL Workbench** (SQL), **Eclipse** (Java), **VS Code** (Python). O projeto começou em MySQL e foi migrado para PostgreSQL com pgloader.

## 11. GitHub, Copilot e Render: guia executivo e acesso ao projeto

### GitHub — visão executiva

GitHub é uma plataforma online para hospedar repositórios Git. Git registra o histórico das alterações; o GitHub acrescenta colaboração, revisão de código, issues e automações. Neste projeto, o repositório público é o local de referência para consultar e baixar o código-fonte. A branch principal é `main`.

- Repositório: [Projeto Final Recode — recode-projeto-final](https://github.com/leandrocrisci/recode-projeto-final).
- Para consultar sem instalar ferramentas: abra o link, navegue pelos arquivos e pastas ou use **Code → Download ZIP**.
- Para clonar no PowerShell, com Git instalado:

  ```powershell
  git clone https://github.com/leandrocrisci/recode-projeto-final.git
  cd recode-projeto-final
  ```

- O código-fonte não inclui credenciais do banco nem chaves privadas. Para executar localmente, siga o `README.md` e configure as variáveis de ambiente necessárias.

### GitHub Copilot — visão executiva

GitHub Copilot é um assistente de desenvolvimento baseado em inteligência artificial, integrado a ferramentas como o VS Code e o GitHub. Conforme a configuração e o plano habilitado, pode sugerir código, explicar trechos, ajudar a localizar problemas e apoiar tarefas de implementação e documentação.

Copilot é uma ferramenta de apoio, não um substituto da revisão técnica: sugestões podem estar incompletas, desatualizadas ou incorretas. O código gerado deve ser conferido quanto a comportamento, segurança, licenças e compatibilidade; builds e testes continuam necessários. Não envie segredos ou dados pessoais em prompts.

Neste projeto, ferramentas de IA foram usadas como apoio para analisar o código, propor e implementar correções e atualizar documentação. A responsabilidade pela revisão e validação final permanece com quem mantém o projeto.

### Como acessar o projeto público

1. Abra [github.com/leandrocrisci/recode-projeto-final](https://github.com/leandrocrisci/recode-projeto-final) para consultar o código-fonte.
2. Para executar localmente, clone o repositório e siga as instruções do `README.md`; são necessários Java 21+, Node.js/npm e acesso a um PostgreSQL configurado.
3. A aplicação publicada usa serviços no Render. Os endereços registrados no `README.md` são `https://frontendweb-rcs5.onrender.com` (interface) e `https://webservice-xirs.onrender.com` (API). Disponibilidade e endereços podem mudar; consulte o README e a página do serviço antes de compartilhar esses links.
4. A API usa o prefixo `/api`; o frontend publicado precisa apontar para a URL da API com esse sufixo.

### Render — visão executiva

Render é uma plataforma de hospedagem em nuvem que pode construir e executar serviços a partir de um repositório Git. Neste projeto, a arquitetura publicada separa a interface web, a API Spring Boot e o banco PostgreSQL. O Render automatiza o deploy conforme a configuração do serviço e o código conectado; cada componente ainda precisa de variáveis de ambiente e permissões corretas.

Configuração técnica essencial:

- **Backend:** disponibilize o serviço Spring Boot e configure `SPRING_DATASOURCE_URL` no formato `jdbc:postgresql://...`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD`. Configure `CORS_ALLOWED_ORIGINS` com a origem HTTPS exata do frontend.
- **Frontend:** configure `VITE_API_URL` com a URL pública da API terminada em `/api`. Como a variável `VITE_` é incorporada durante o build do Vite, faça um novo deploy após alterá-la.
- **Banco:** use o PostgreSQL provisionado e o schema PostgreSQL do projeto. Não use o dump original MySQL no banco PostgreSQL.
- **Segredos:** cadastre credenciais na seção de variáveis de ambiente do serviço, nunca em arquivos versionados, capturas de tela ou commits.
- **Diagnóstico:** confira os logs de build e runtime dos serviços e valide frontend → API → PostgreSQL. Um deploy concluído não garante, sozinho, que a integração esteja saudável.

### Principais correções realizadas com apoio de IA

- **Conexão e deploy:** corrigidos pontos de configuração entre frontend, API e PostgreSQL, incluindo o prefixo JDBC `jdbc:`, o caminho `/api`, CORS e variáveis de ambiente do Render.
- **Dados:** adaptados scripts de importação e carga para PostgreSQL e ampliados os fluxos de importação de registros na interface.
- **Relatórios:** consolidadas informações escolares e avaliações; adicionadas visões analíticas por região e curso, filtros e detalhes da instituição selecionada.
- **Observabilidade:** aprimorado o registro de tráfego, exceções do navegador e eventos de auditoria na Central de Eventos.
- **Documentação e manutenção:** atualizados guias de solução de problemas, instruções de execução/deploy e diagramas do sistema.
- **Qualidade da interface:** revisados componentes Fluent UI, tabelas, estados vazios, ordenação, acessibilidade e consistência visual em páginas relacionadas.
