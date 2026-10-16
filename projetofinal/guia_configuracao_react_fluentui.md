# Guia de Configuração: React, Fluent UI v9 e Office Online

Este guia prático documenta o passo a passo para configurar um ambiente de desenvolvimento moderno utilizando **React**, o sistema de design da Microsoft **Fluent UI v9** e a integração nativa com o **Microsoft Office Online** por meio da API do `Office.js`.

---

## 1. Instalação do Node.js e NPM

O **Node.js** é o ambiente de execução JavaScript necessário para rodar as ferramentas de build do React.

1. Acesse o site oficial do [Node.js](https://nodejs.org) e faça o download da versão **LTS (Long Term Support)**.
2. Siga o instalador padrão para o seu sistema operacional (avançando com *Next/Avançar*).
3. Após a instalação, abra o seu terminal (PowerShell ou Prompt de Comando) e valide se o ambiente está ativo com os comandos:

```bash
node -v
npm -v
```
*Ambos os comandos devem retornar as versões numéricas instaladas (ex: `v20.x.x` ou superior).*

---

## 2. Criação do Projeto React com Vite

O **Vite** é o inicializador de projetos React mais rápido e recomendado pelo mercado atual.

1. No terminal, navegue até a pasta onde deseja criar o seu projeto (ex: `cd C:\Projetos`).
2. Execute o comando de criação e siga as instruções na tela:
   ```bash
   npm create vite@latest meu-suplemento-office -- --template react
   ```
3. Acesse a pasta criada e instale as dependências básicas do ecossistema React:
   ```bash
   cd meu-suplemento-office
   npm install
   ```

---

## 3. Instalação do Fluent UI v9

O **Fluent UI v9** é a biblioteca de componentes e design oficial da Microsoft, utilizada no ecossistema do Microsoft 365 e Windows.

No terminal do seu projeto, execute o comando abaixo para instalar a biblioteca de componentes estruturais e o pacote completo de ícones:

```bash
npm install @fluentui/react-components @fluentui/react-icons
```

---

## 4. Integração com o Microsoft Office Online (Office.js)

Para que a sua aplicação React consiga interagir diretamente com documentos do Word, Excel ou PowerPoint executados no navegador, é necessário injetar o script oficial da Microsoft.

1. Abra o arquivo principal de HTML do seu projeto Vite (`index.html`).
2. Adicione a seguinte tag `<script>` dentro da tag `<head>`, antes de qualquer outro script:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Suplemento Fluent UI</title>
  <!-- Injeção da API oficial do Microsoft Office -->
  <script src="https://microsoft.com" type="text/javascript"></script>
</head>
```

---

## 5. Código Estruturado Base (`App.jsx`)

Substitua o conteúdo do seu arquivo `src/App.jsx` pela estrutura abaixo. Este código configura o provedor de temas do Fluent UI, aplica os tokens visuais oficiais e aguarda a inicialização segura do Office Online através da função assíncrona `Office.onReady`.

```jsx
import React, { useState, useEffect } from 'react';
import { 
  FluentProvider, 
  webLightTheme, 
  makeStyles, 
  tokens, 
  Button, 
  Spinner 
} from '@fluentui/react-components';
import { DocumentFilled, ArrowCircleRightRegular } from '@fluentui/react-icons';

// Definição de estilos utilizando a tecnologia integrada Griffel (Tokens Fluent UI v9)
const useStyles = makeStyles({
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontFamily: tokens.fontFamilyBase,
    backgroundColor: tokens.colorNeutralBackground1,
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tokens.colorBrandForeground1,
    borderBottom: `2px solid ${tokens.colorBrandStroke1}`,
    paddingBottom: '8px',
  },
  card: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: '16px',
  }
});

function App() {
  const classes = useStyles();
  const [officePronto, setOfficePronto] = useState(false);

  // Ciclo de vida para validar a conexão segura com o Microsoft Office Online
  useEffect(() => {
    Office.onReady((info) => {
      // Verifica se a aplicação está rodando de dentro de um host válido (ex: Word, Excel)
      if (info.host) {
        setOfficePronto(true);
      } else {
        // Fallback caso você abra a aplicação direto no navegador normal para testar o visual
        setOfficePronto(true); 
        console.log("Executando fora do Office Online - Modo Web clássico.");
      }
    });
  }, []);

  // Função de exemplo para interagir com o documento ativo (Exemplo focado em Word)
  const inserirTextoNoDocumento = async () => {
    if (!officePronto) return;

    try {
      await Word.run(async (context) => {
        const body = context.document.body;
        body.insertText("Texto enviado diretamente da minha aplicação React com Fluent UI!\n", Word.InsertLocation.end);
        await context.sync();
      });
    } catch (error) {
      console.error("Erro ao interagir com o documento: ", error);
    }
  };

  if (!officePronto) {
    return (
      <FluentProvider theme={webLightTheme}>
        <div className={classes.container}>
          <Spinner label="Carregando integração com o Office 365..." />
        </div>
      </FluentProvider>
    );
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <div className={classes.container}>
        <header className={classes.header}>
          <DocumentFilled fontSize={28} />
          <h2>Meu Suplemento Office</h2>
        </header>

        <main className={classes.card}>
          <p>Seu ambiente de desenvolvimento está pronto e integrado ao ecossistema Microsoft.</p>
          <Button 
            appearance="primary" 
            icon={<ArrowCircleRightRegular />}
            onClick={inserirTextoNoDocumento}
          >
            Injetar Dados no Documento
          </Button>
        </main>
      </div>
    </FluentProvider>
  );
}

export default App;
```

---

## 6. Como Executar o Projeto

Para testar a aplicação rodando no seu ambiente de desenvolvimento local, execute no terminal:

```bash
npm run dev
```
O Vite fornecerá uma URL local (geralmente `http://localhost:5173`) que você usará no manifesto de desenvolvimento do Office para carregar o seu painel lateral.
