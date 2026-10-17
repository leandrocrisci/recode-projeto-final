# Projeto Final Recode — Portal de Gestão Educacional

Aplicação web para gestão e acompanhamento de informações educacionais, com interface React e Fluent UI e uma API REST em Java com Spring Boot. O sistema reúne funcionalidades relacionadas a escolas, cursos, alunos, professores, avaliações, produtos, pedidos e indicadores alinhados ao ODS 4 — Educação de Qualidade.

## Tecnologias

- **Frontend:** React, TypeScript, Fluent UI e Vite
- **Backend:** Java, Spring Boot, Spring Web e Spring Data JPA
- **Banco de dados:** PostgreSQL (Render)
- **Build do backend:** Maven Wrapper

## Pré-requisitos

Instale e configure os seguintes itens antes de iniciar:

- **Java JDK 21 ou superior.** O projeto solicita Java 21 no `pom.xml`; portanto, embora JDK 17+ seja um requisito geral, use JDK 21 para executar este projeto sem incompatibilidade.
- **Node.js e npm.** O npm é incluído na instalação do Node.js.
- Uma instância PostgreSQL, local ou hospedada no Render.
- Um terminal, como PowerShell, e um navegador atualizado.

Confira as instalações:

```powershell
java -version
node --version
npm --version
```

## Configuração do banco de dados

1. Crie ou selecione o banco PostgreSQL `recodedatabase` (no Render, use o banco já provisionado).
2. Conecte-se ao banco e execute `script_tabelas_recodedb_postgresql.sql` para criar o esquema.

   O Hibernate está configurado com `spring.jpa.hibernate.ddl-auto=none`, portanto não cria o esquema automaticamente. O script PostgreSQL recria tabelas com os mesmos nomes; faça backup antes de executá-lo em um banco com dados que queira preservar. `script_tabelas_recodedb.sql` é o dump original MySQL e não deve ser executado no PostgreSQL.
3. Configure as variáveis de ambiente do backend. Para Render, use a URL JDBC PostgreSQL e as credenciais correspondentes ao banco:

   ```powershell
   $env:SPRING_DATASOURCE_URL = "jdbc:postgresql://host:5432/recodedatabase"
   $env:SPRING_DATASOURCE_USERNAME = "usuario-do-banco"
   $env:SPRING_DATASOURCE_PASSWORD = "sua-senha-local"
   ```

   Substitua host, usuário e senha pelos valores do Render. Não grave credenciais no repositório. Defina as variáveis na mesma janela do PowerShell em que iniciar o backend; no Render, configure-as nas variáveis de ambiente do serviço.

## Como executar

Abra **dois terminais PowerShell** na pasta raiz do projeto.

### 1. Backend — Spring Boot

No primeiro terminal:

```powershell
cd .\backendJava
.\mvnw.cmd spring-boot:run
```

O Maven Wrapper baixa as dependências necessárias na primeira execução. Mantenha esse terminal aberto enquanto usar a aplicação.

Para gerar o pacote sem iniciar a aplicação:

```powershell
.\mvnw.cmd clean package
```

### 2. Frontend — React, Vite e Fluent UI

No segundo terminal:

```powershell
cd .\frontendWeb
npm ci
npm run dev
```

Abra no navegador o endereço mostrado pelo Vite, normalmente `http://localhost:5174`.

Para gerar a versão de produção do frontend:

```powershell
npm run build
```

> **Observação:** este frontend utiliza **Vite** (configurado em `frontendWeb/vite.config.ts`), não Create React App (CRA). Por isso, os comandos corretos são `npm run dev` e `npm run build`, não `npm start`.

## Portas e comunicação

| Serviço | Porta | Endereço local | Configuração |
|---|---:|---|---|
| Frontend Vite | `5174` | `http://localhost:5174` | `frontendWeb/vite.config.ts` |
| API Spring Boot | `8090` | `http://localhost:8090` | `backendJava/src/main/resources/application.properties` |
| PostgreSQL | `5432` | Host do Render ou `localhost:5432` | `SPRING_DATASOURCE_URL` |

O Vite encaminha as requisições iniciadas por `/api` para `http://localhost:8090`. Assim, mantenha backend e frontend executando ao mesmo tempo. Se a porta `5174` já estiver ocupada, o Vite poderá escolher outra porta e informá-la no terminal.

## Estrutura do projeto

```text
.
├── frontendWeb/    # Aplicação React, Fluent UI e configuração Vite
└── backendJava/    # API Java Spring Boot, Maven e acesso a dados
```

## Solução de problemas

- **Erro ao conectar ao PostgreSQL:** confirme que o banco está ativo, que a URL JDBC começa com `jdbc:postgresql://` e que `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD` estão configuradas.
- **Erro de conexão do frontend com a API:** verifique se o backend está ativo na porta `8090` e se o frontend está usando a configuração de proxy do Vite.
- **Porta em uso:** encerre o processo que está usando a porta configurada ou ajuste a configuração correspondente. Se a porta `5174` estiver ocupada, confira no terminal qual endereço o Vite selecionou.
- **Java incompatível:** confirme que o terminal está usando JDK 21 ou superior com `java -version`.
