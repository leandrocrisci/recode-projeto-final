# Projeto Final Recode — Portal de Gestão Educacional

Aplicação web para gestão e acompanhamento de informações educacionais, com interface React e Fluent UI e uma API REST em Java com Spring Boot. O sistema reúne funcionalidades relacionadas a escolas, cursos, alunos, professores, avaliações, produtos, pedidos e indicadores alinhados ao ODS 4 — Educação de Qualidade.

## Tecnologias

- **Frontend:** React, TypeScript, Fluent UI e Vite
- **Backend:** Java, Spring Boot, Spring Web e Spring Data JPA
- **Banco de dados:** MySQL
- **Build do backend:** Maven Wrapper

## Pré-requisitos

Instale e configure os seguintes itens antes de iniciar:

- **Java JDK 21 ou superior.** O projeto solicita Java 21 no `pom.xml`; portanto, embora JDK 17+ seja um requisito geral, use JDK 21 para executar este projeto sem incompatibilidade.
- **Node.js e npm.** O npm é incluído na instalação do Node.js.
- **MySQL Server**, em execução e acessível localmente.
- Um terminal, como PowerShell, e um navegador atualizado.

Confira as instalações:

```powershell
java -version
node --version
npm --version
```

## Configuração do banco de dados

1. Inicie o MySQL.
2. Crie o banco utilizado pela aplicação:

   ```sql
   CREATE DATABASE recodedatabase;
   ```

3. Confira a URL, o usuário e a senha em `projetofinal/src/main/resources/application.properties`. A configuração atual aponta para `localhost:3306/recodedatabase`.
4. Prepare as tabelas antes de iniciar a API. O Hibernate está configurado com `spring.jpa.hibernate.ddl-auto=none`, portanto não cria o esquema automaticamente. O projeto inclui o arquivo `script_tabelas_recodedb.txt` na raiz com o script de tabelas. Se importar esse script, confirme que o nome do banco selecionado corresponde a `recodedatabase` ou ajuste a URL da aplicação para corresponder ao banco importado.
5. Para proteger credenciais, mantenha senhas locais fora dos arquivos versionados. O Spring Boot permite sobrescrever as propriedades com variáveis de ambiente, por exemplo:

   ```powershell
   $env:SPRING_DATASOURCE_URL = "jdbc:mysql://localhost:3306/recodedatabase?useSSL=false&serverTimezone=UTC"
   $env:SPRING_DATASOURCE_USERNAME = "root"
   $env:SPRING_DATASOURCE_PASSWORD = "sua-senha-local"
   ```

   Defina essas variáveis na mesma janela do PowerShell em que iniciar o backend.

## Como executar

Abra **dois terminais PowerShell** na pasta raiz do projeto.

### 1. Backend — Spring Boot

No primeiro terminal:

```powershell
cd .\projetofinal
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
cd .\fluentui
npm ci
npm run dev
```

Abra no navegador o endereço mostrado pelo Vite, normalmente `http://localhost:5174`.

Para gerar a versão de produção do frontend:

```powershell
npm run build
```

> **Observação:** este frontend utiliza **Vite** (configurado em `fluentui/vite.config.ts`), não Create React App (CRA). Por isso, os comandos corretos são `npm run dev` e `npm run build`, não `npm start`.

## Portas e comunicação

| Serviço | Porta | Endereço local | Configuração |
|---|---:|---|---|
| Frontend Vite | `5174` | `http://localhost:5174` | `fluentui/vite.config.ts` |
| API Spring Boot | `8090` | `http://localhost:8090` | `projetofinal/src/main/resources/application.properties` |
| MySQL | `3306` | `localhost:3306` | URL JDBC do backend |

O Vite encaminha as requisições iniciadas por `/api` para `http://localhost:8090`. Assim, mantenha backend e frontend executando ao mesmo tempo. Se a porta `5174` já estiver ocupada, o Vite poderá escolher outra porta e informá-la no terminal.

## Estrutura do projeto

```text
.
├── fluentui/       # Aplicação React, Fluent UI e configuração Vite
└── projetofinal/   # API Java Spring Boot, Maven e acesso a dados
```

## Solução de problemas

- **Erro ao conectar ao MySQL:** confirme que o serviço está ativo, que o banco existe e que URL, usuário e senha em `application.properties` (ou nas variáveis de ambiente) estão corretos.
- **Erro de conexão do frontend com a API:** verifique se o backend está ativo na porta `8090` e se o frontend está usando a configuração de proxy do Vite.
- **Porta em uso:** encerre o processo que está usando a porta configurada ou ajuste a configuração correspondente. Se a porta `5174` estiver ocupada, confira no terminal qual endereço o Vite selecionou.
- **Java incompatível:** confirme que o terminal está usando JDK 21 ou superior com `java -version`.
