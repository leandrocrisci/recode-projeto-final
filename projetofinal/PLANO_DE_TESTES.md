# Plano de Testes — Recode Projeto Final
## API REST de Escolas, Cursos, Alunos e Avaliações

---

## 1. Pré-requisitos

| Item | Valor |
|---|---|
| Servidor | `http://localhost:8090` |
| Banco | MySQL `recodedb` |
| Ferramenta sugerida | Postman / Insomnia / curl |
| Seed | [`DataLoader.java`](src/main/java/recode/leandrocrisci/projetofinal/DataLoader.java) — executa automaticamente na 1ª inicialização |

---

## 2. Tabela de Endpoints

| # | Método | Endpoint | Descrição |
|---|---|---|---|
| 1 | GET | `/api/escolas` | Lista todas as escolas |
| 2 | GET | `/api/escolas/{id}` | Busca escola por ID |
| 3 | GET | `/api/escolas/buscar?nome=` | Busca escola por nome |
| 4 | GET | `/api/escolas/tipo?tipo=` | Filtra escolas por tipo |
| 5 | POST | `/api/escolas` | Cria nova escola |
| 6 | PUT | `/api/escolas/{id}` | Atualiza escola |
| 7 | DELETE | `/api/escolas/{id}` | Remove escola |
| 8 | GET | `/api/enderecos-escolas` | Lista todos os endereços |
| 9 | GET | `/api/enderecos-escolas/{id}` | Busca endereço por ID |
| 10 | GET | `/api/enderecos-escolas/escola/{escolaId}` | Endereços de uma escola |
| 11 | POST | `/api/enderecos-escolas/escola/{escolaId}` | Cria endereço para escola |
| 12 | PUT | `/api/enderecos-escolas/{id}` | Atualiza endereço |
| 13 | DELETE | `/api/enderecos-escolas/{id}` | Remove endereço |
| 14 | GET | `/api/cursos` | Lista todos os cursos |
| 15 | GET | `/api/cursos/{id}` | Busca curso por ID |
| 16 | GET | `/api/cursos/buscar?nome=` | Busca curso por nome |
| 17 | GET | `/api/cursos/escola/{escolaId}` | Cursos de uma escola |
| 18 | POST | `/api/cursos/escola/{escolaId}` | Cria curso para escola |
| 19 | PUT | `/api/cursos/{id}` | Atualiza curso |
| 20 | DELETE | `/api/cursos/{id}` | Remove curso |
| 21 | GET | `/api/alunos` | Lista todos os alunos |
| 22 | GET | `/api/alunos/{id}` | Busca aluno por ID |
| 23 | GET | `/api/alunos/buscar?nome=` | Busca aluno por nome |
| 24 | GET | `/api/alunos/curso/{cursoId}` | Alunos de um curso |
| 25 | GET | `/api/alunos/escola/{escolaId}` | Alunos de uma escola |
| 26 | POST | `/api/alunos` | Cria novo aluno |
| 27 | PUT | `/api/alunos/{id}` | Atualiza aluno |
| 28 | DELETE | `/api/alunos/{id}` | Remove aluno |
| 29 | GET | `/api/avaliacoes-alunos` | Lista todas as avaliações |
| 30 | GET | `/api/avaliacoes-alunos/{id}` | Busca avaliação por ID |
| 31 | GET | `/api/avaliacoes-alunos/aluno/{alunoId}` | Avaliações de um aluno |
| 32 | GET | `/api/avaliacoes-alunos/curso/{cursoId}` | Avaliações por curso |
| 33 | POST | `/api/avaliacoes-alunos` | Cria avaliação de aluno |
| 34 | PUT | `/api/avaliacoes-alunos/{id}` | Atualiza avaliação |
| 35 | DELETE | `/api/avaliacoes-alunos/{id}` | Remove avaliação |
| 36 | GET | `/api/avaliacoes-qualidade` | Lista avaliações de qualidade |
| 37 | GET | `/api/avaliacoes-qualidade/{id}` | Busca avaliação por ID |
| 38 | GET | `/api/avaliacoes-qualidade/escola/{escolaId}` | Avaliações de qualidade por escola |
| 39 | POST | `/api/avaliacoes-qualidade/escola/{escolaId}` | Cria avaliação de qualidade |
| 40 | PUT | `/api/avaliacoes-qualidade/{id}` | Atualiza avaliação |
| 41 | DELETE | `/api/avaliacoes-qualidade/{id}` | Remove avaliação |

---

## 3. Casos de Teste

### 3.1 — Escolas

#### CT-001 — Listar todas as escolas
- **Método:** GET  
- **URL:** `http://localhost:8080/api/escolas`  
- **Resultado esperado:** 200 OK, array com 50 escolas

#### CT-002 — Buscar escola existente por ID
- **Método:** GET  
- **URL:** `http://localhost:8080/api/escolas/1`  
- **Resultado esperado:** 200 OK, objeto com `nome: "EMEF Monteiro Lobato"`

#### CT-003 — Buscar escola por ID inexistente
- **Método:** GET  
- **URL:** `http://localhost:8080/api/escolas/9999`  
- **Resultado esperado:** 500 (RuntimeException "Escola não encontrada com id: 9999")

#### CT-004 — Buscar escola por nome parcial
- **Método:** GET  
- **URL:** `http://localhost:8080/api/escolas/buscar?nome=federal`  
- **Resultado esperado:** 200 OK, lista com 5 institutos federais

#### CT-005 — Filtrar escolas por tipo
- **Método:** GET  
- **URL:** `http://localhost:8080/api/escolas/tipo?tipo=privada`  
- **Resultado esperado:** 200 OK, apenas escolas privadas

#### CT-006 — Criar escola válida
- **Método:** POST  
- **URL:** `http://localhost:8080/api/escolas`  
- **Body:**
```json
{
  "nome": "Colégio Teste",
  "tipo": "privada",
  "telefone": "(11)99999-0000",
  "email": "teste@escola.edu.br"
}
```
- **Resultado esperado:** 201 CREATED, objeto com ID gerado

#### CT-007 — Criar escola com nome vazio (validação)
- **Método:** POST  
- **URL:** `http://localhost:8080/api/escolas`  
- **Body:**
```json
{ "nome": "", "tipo": "pública" }
```
- **Resultado esperado:** 400 BAD REQUEST

#### CT-008 — Atualizar escola
- **Método:** PUT  
- **URL:** `http://localhost:8080/api/escolas/1`  
- **Body:**
```json
{
  "nome": "EMEF Monteiro Lobato (Atualizado)",
  "tipo": "pública",
  "telefone": "(11)3200-9999",
  "email": "novo@email.gov.br"
}
```
- **Resultado esperado:** 200 OK, objeto com dados atualizados

#### CT-009 — Deletar escola
- **Método:** DELETE  
- **URL:** `http://localhost:8080/api/escolas/51`  
- **Resultado esperado:** 204 NO CONTENT

---

### 3.2 — Endereços de Escolas

#### CT-010 — Listar endereços de uma escola
- **Método:** GET  
- **URL:** `http://localhost:8080/api/enderecos-escolas/escola/1`  
- **Resultado esperado:** 200 OK, lista com 1 endereço da escola 1

#### CT-011 — Criar endereço para escola existente
- **Método:** POST  
- **URL:** `http://localhost:8080/api/enderecos-escolas/escola/1`  
- **Body:**
```json
{
  "logradouro": "Rua Nova",
  "numero": "10",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01001-001"
}
```
- **Resultado esperado:** 201 CREATED

#### CT-012 — Criar endereço com logradouro vazio
- **Body:** `{ "numero": "10", "cidade": "SP", "estado": "SP" }`  
- **Resultado esperado:** 400 BAD REQUEST

---

### 3.3 — Cursos

#### CT-013 — Listar cursos de uma escola
- **Método:** GET  
- **URL:** `http://localhost:8080/api/cursos/escola/11`  
- **Resultado esperado:** 200 OK, cursos da ETEC Getúlio Vargas

#### CT-014 — Buscar curso por nome
- **Método:** GET  
- **URL:** `http://localhost:8080/api/cursos/buscar?nome=técnico`  
- **Resultado esperado:** 200 OK, todos os cursos técnicos

#### CT-015 — Criar curso para escola existente
- **Método:** POST  
- **URL:** `http://localhost:8080/api/cursos/escola/1`  
- **Body:**
```json
{
  "nome": "Curso Extra",
  "descricao": "Atividade extracurricular",
  "cargaHoraria": 120
}
```
- **Resultado esperado:** 201 CREATED

#### CT-016 — Criar curso para escola inexistente
- **Método:** POST  
- **URL:** `http://localhost:8080/api/cursos/escola/9999`  
- **Resultado esperado:** 500 (RuntimeException "Escola não encontrada")

---

### 3.4 — Alunos

#### CT-017 — Listar alunos de um curso
- **Método:** GET  
- **URL:** `http://localhost:8080/api/alunos/curso/1`  
- **Resultado esperado:** 200 OK, alunos matriculados no curso 1

#### CT-018 — Listar alunos de uma escola
- **Método:** GET  
- **URL:** `http://localhost:8080/api/alunos/escola/11`  
- **Resultado esperado:** 200 OK, alunos da escola 11

#### CT-019 — Buscar aluno por nome parcial
- **Método:** GET  
- **URL:** `http://localhost:8080/api/alunos/buscar?nome=ana`  
- **Resultado esperado:** 200 OK, lista contendo "Ana Clara Souza" e "Nathalia Siqueira"

#### CT-020 — Criar aluno com curso e escola válidos
- **Método:** POST  
- **URL:** `http://localhost:8080/api/alunos`  
- **Body:**
```json
{
  "nome": "Novo Aluno Teste",
  "email": "novo@aluno.com",
  "telefone": "(11)90000-0000",
  "dataNascimento": "2005-01-01",
  "curso": { "id": 1 },
  "escola": { "id": 1 }
}
```
- **Resultado esperado:** 201 CREATED

#### CT-021 — Criar aluno sem nome (validação)
- **Body:** `{ "email": "sem@nome.com" }`  
- **Resultado esperado:** 400 BAD REQUEST

#### CT-022 — Atualizar aluno trocando curso
- **Método:** PUT  
- **URL:** `http://localhost:8080/api/alunos/1`  
- **Body:**
```json
{
  "nome": "Ana Clara Souza",
  "email": "ana.atualizada@email.com",
  "telefone": "(11)91111-0001",
  "dataNascimento": "2005-03-12",
  "curso": { "id": 2 },
  "escola": { "id": 1 }
}
```
- **Resultado esperado:** 200 OK, curso atualizado

---

### 3.5 — Avaliações de Alunos

#### CT-023 — Listar avaliações de um aluno
- **Método:** GET  
- **URL:** `http://localhost:8080/api/avaliacoes-alunos/aluno/1`  
- **Resultado esperado:** 200 OK, avaliação da aluna Ana Clara

#### CT-024 — Criar avaliação com nota válida
- **Método:** POST  
- **URL:** `http://localhost:8080/api/avaliacoes-alunos`  
- **Body:**
```json
{
  "nota": 7.5,
  "observacao": "Bom desempenho",
  "dataAvaliacao": "2024-09-01",
  "aluno": { "id": 1 },
  "curso": { "id": 1 }
}
```
- **Resultado esperado:** 201 CREATED

#### CT-025 — Criar avaliação com nota acima de 10 (validação)
- **Body:** `{ "nota": 11, "aluno": { "id": 1 }, "curso": { "id": 1 } }`  
- **Resultado esperado:** 400 BAD REQUEST

#### CT-026 — Criar avaliação com nota negativa (validação)
- **Body:** `{ "nota": -1, "aluno": { "id": 1 }, "curso": { "id": 1 } }`  
- **Resultado esperado:** 400 BAD REQUEST

---

### 3.6 — Avaliações de Qualidade

#### CT-027 — Listar avaliações de qualidade de uma escola
- **Método:** GET  
- **URL:** `http://localhost:8080/api/avaliacoes-qualidade/escola/6`  
- **Resultado esperado:** 200 OK, avaliação do Colégio Dom Pedro II (nota 5)

#### CT-028 — Criar avaliação de qualidade com nota válida
- **Método:** POST  
- **URL:** `http://localhost:8080/api/avaliacoes-qualidade/escola/1`  
- **Body:**
```json
{
  "nota": 4,
  "comentario": "Muito boa escola pública",
  "dataAvaliacao": "2024-09-15"
}
```
- **Resultado esperado:** 201 CREATED

#### CT-029 — Criar avaliação com nota 6 (acima do máximo de 5)
- **Body:** `{ "nota": 6, "comentario": "Ótima" }`  
- **Resultado esperado:** 400 BAD REQUEST

#### CT-030 — Criar avaliação com nota 0 (abaixo do mínimo de 1)
- **Body:** `{ "nota": 0, "comentario": "Péssima" }`  
- **Resultado esperado:** 400 BAD REQUEST

---

## 4. Verificações de Integridade

| # | Verificação | Comando SQL |
|---|---|---|
| V-01 | Toda escola tem exatamente 1 endereço | `SELECT escolaid, COUNT(*) FROM enderecosescolas GROUP BY escolaid;` |
| V-02 | Todo aluno tem curso e escola associados | `SELECT COUNT(*) FROM alunos WHERE cursoid IS NULL OR escolaid IS NULL;` |
| V-03 | Toda avaliação de aluno tem aluno e curso | `SELECT COUNT(*) FROM avaliacoesalunos WHERE alunoid IS NULL OR cursoid IS NULL;` |
| V-04 | Toda avaliação de qualidade tem escola | `SELECT COUNT(*) FROM avaliacoesqualidade WHERE escolaid IS NULL;` |
| V-05 | Notas de alunos entre 0 e 10 | `SELECT * FROM avaliacoesalunos WHERE nota < 0 OR nota > 10;` |
| V-06 | Notas de qualidade entre 1 e 5 | `SELECT * FROM avaliacoesqualidade WHERE nota < 1 OR nota > 5;` |
| V-07 | Nenhuma escola com nome vazio | `SELECT * FROM escolas WHERE nome IS NULL OR nome = '';` |
| V-08 | Nenhum aluno com nome vazio | `SELECT * FROM alunos WHERE nome IS NULL OR nome = '';` |

---

## 5. Resumo dos Dados de Seed

| Tabela | Registros |
|---|---|
| `escolas` | 50 |
| `enderecosescolas` | 50 (1 por escola) |
| `cursos` | 50 |
| `alunos` | 50 |
| `avaliacoesalunos` | 50 (1 por aluno) |
| `avaliacoesqualidade` | 50 (1 por escola) |
| **Total** | **300** |

---

## 6. Como Executar

### Opção A — DataLoader automático (recomendado)
1. Suba a aplicação: `mvn spring-boot:run`  
2. O [`DataLoader.java`](src/main/java/recode/leandrocrisci/projetofinal/DataLoader.java) detecta banco vazio e popula automaticamente.  
3. Acesse os endpoints via Postman.

### Opção B — Script SQL direto
1. Abra o MySQL Workbench ou CLI.  
2. Execute o arquivo [`src/main/resources/data.sql`](src/main/resources/data.sql).  
3. Certifique-se de respeitar a ordem: escolas → endereços → cursos → alunos → avaliações.

> **Atenção:** Não use as duas opções ao mesmo tempo para evitar duplicação de dados.
