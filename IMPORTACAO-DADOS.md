# Importação de cadastros por Google Sheets

As telas de Escolas, Endereços, Cursos, Alunos, Professores, Produtos, Pedidos,
Avaliações de Cursos e Avaliações de Qualidade permitem importar linhas de uma
aba do Google Sheets para a API.

## Preparar a planilha

1. Abra `dados-ficticios-cadastros.xlsx` e copie os dados da aba desejada para
   uma planilha Google Sheets, ou use-o como modelo para preparar seus próprios
   dados.
2. Mantenha a primeira linha como cabeçalho e não renomeie os campos esperados.
   Cabeçalhos não diferenciam maiúsculas, minúsculas ou acentos.
3. Compartilhe a planilha com **qualquer pessoa com o link** como **Leitor**.
4. Na tela correspondente, escolha **Importar da Planilha**, cole o link da
   planilha (ou da aba) e selecione **Ler planilha**. O `gid` do link identifica
   a aba. Confira a prévia e então confirme a importação.

Cada confirmação cria novos registros; ela não atualiza registros existentes
nem impede duplicatas. As linhas são enviadas em sequência. Se uma requisição
falhar, a interface informa a linha e o número de registros já enviados; esses
registros não são revertidos.

## Ordem recomendada

Importe primeiro os cadastros usados como relacionamento por outros:

1. Escolas
2. Endereços (opcional para escolas que ainda não têm endereço)
3. Cursos e Professores
4. Alunos
5. Produtos
6. Avaliações de Cursos e Avaliações de Qualidade
7. Pedidos

O nome informado nas colunas de relacionamento deve corresponder a um registro
já cadastrado. Endereços, Cursos, Professores e Avaliações de Qualidade usam
Escolas; Alunos usam Escola e Curso; Avaliações de Cursos usam Curso; Pedidos
usam Escola, Produto e Professor.

## Colunas esperadas

| Tela | Colunas obrigatórias | Colunas adicionais aceitas |
|---|---|---|
| Escolas | `nome`, `tipo` | `telefone`, `email`, `logradouro`, `numero`, `bairro`, `cidade`, `estado`, `cep` |
| Endereços | `escola`, `logradouro`, `cidade`, `estado` | `cep`, `numero`, `bairro` |
| Cursos | `nome`, `escola` | `descricao`, `cargaHoraria` |
| Alunos | `escola`, `curso`, `area`, `tipoTransporte`, `distanciaEscola`, `tempoDeslocamentoMinutos` | — |
| Professores | `nome`, `escola` | `email`, `telefone`, `especialidade`, `biografia` |
| Produtos | `nome`, `preco` | `descricao`, `quantidade`, `icone` |
| Pedidos | `escola`, `produto`, `professor`, `quantidade`, `valorUnitario` | `statusPedido` |
| Avaliações de Cursos | `curso`, `nota` | `observacao`, `dataAvaliacao` |
| Avaliações de Qualidade | `escola`, `nota` | `comentario`, `dataAvaliacao` |

Para Escolas, os campos de endereço são opcionais, mas, se algum for preenchido,
`logradouro`, `cidade` e uma sigla de `estado` com duas letras são necessários.
Assim, é possível importar a escola e seu endereço na mesma linha. Cada escola
pode ter apenas um endereço; não importe o mesmo vínculo também pela aba
Endereços.

Para Alunos, `area` aceita `urbana` ou `rural` e `tipoTransporte` aceita `a_pe`,
`transporte_escolar`, `transporte_publico` ou `proprio`. O modelo de Aluno não
possui campo de nome. Para Pedidos, `statusPedido` aceita `processando`,
`enviado`, `entregue` ou `cancelado`. Datas de avaliação devem usar
`AAAA-MM-DD`. Os valores numéricos podem usar vírgula decimal.

## Dados de exemplo

O arquivo `dados-ficticios-cadastros.xlsx` contém uma aba por tela. A aba Escolas
tem 135 registros, cinco para cada UF brasileira; Endereços tem 20 vínculos
complementares. Cada uma das outras sete abas contém 20 registros. Importe os
dados na ordem acima para que os relacionamentos estejam cadastrados antes de
serem referenciados.
