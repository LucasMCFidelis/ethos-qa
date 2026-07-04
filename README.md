# Ethos QA — Automação de Testes

Repositório de automação de testes da **Plataforma Ethos**, responsável por garantir a qualidade da API e da interface (E2E) através de testes automatizados com **Cypress**. Também centraliza **GitHub Actions reutilizáveis** que servem de base para as esteiras de CI/CD dos repositórios `ethos-api` (backend) e `ethos-frontend` (frontend).

> Este repositório é independente dos repositórios de aplicação, mas atua como peça central da estratégia de qualidade do projeto: valida contratos de API, fluxos críticos de usuário e provê os blocos de CI compartilhados entre os times.

---

## 📋 Índice

- [Objetivo](#-objetivo)
- [Minha atuação no projeto](#-minha-atuação-no-projeto)
- [Stack e ferramentas](#-stack-e-ferramentas)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Testes de API](#-testes-de-api)
- [Testes de interface (E2E)](#-testes-de-interface-e2e)
- [Tags e estratégia de execução](#-tags-e-estratégia-de-execução)
- [GitHub Actions reutilizáveis](#-github-actions-reutilizáveis)
- [Como rodar localmente](#-como-rodar-localmente)
- [Padrões de qualidade](#-padrões-de-qualidade)

---

## 🎯 Objetivo

A Plataforma Ethos é uma ferramenta de consulta ética para times de tecnologia sem estrutura de compliance. Como o produto guia decisões através de uma trilha de perguntas com impacto direto no resultado apresentado ao usuário, a confiabilidade da API e a integridade dos fluxos de interface são críticas.

Este repositório existe para:

- Validar os **contratos de API** (status code, payload, schema) dos endpoints de trilhas, sessões, respostas e feedback;
- Validar os **fluxos de usuário** na interface (início de simulação, navegação no questionário, resultado, feedback) de ponta a ponta;
- Fornecer **actions de CI reutilizáveis** (`wait-for-api`, `run-cypress`) consumidas pelas esteiras dos repositórios de backend e frontend, evitando duplicação de lógica de pipeline entre os projetos.

---

## 👩‍💻 Minha atuação no projeto

Como responsável pela qualidade e **Testes e Automação** da Plataforma Ethos, atuei em:

- **Estruturação do repositório de automação do zero**, definindo arquitetura, padrões de nomenclatura e organização de pastas (`api`, `e2e`, `pages`, `components`, `support`);
- **Modelagem de casos de teste manuais** com base nos critérios de aceite das histórias (ex: `ETHOS-5`, `ETHOS-13`, `ETHOS-33`), posteriormente convertidos em testes automatizados;
- **Automação de testes de API** com Cypress, incluindo clients dedicados por recurso (`HealthClient`, `TracksClient`, `SessionsClient`) e validação de contrato via **JSON Schema (Ajv)**;
- **Automação de testes E2E** seguindo o padrão **Page Object Model**, com componentes reutilizáveis (`QuestionnaireSection`, `ResultSection`, `FeedbackDialog`) para representar partes da interface da trilha;
- **Definição da estratégia de tags** (`@smoke`, `@regression`, `@schema`, `@critical`) para permitir execuções seletivas via `cypress-grep`, otimizando tempo de pipeline;
- **Criação das GitHub Actions compostas** (`wait-for-api`, `run-cypress`), desenhadas para serem consumidas pelos workflows de CI/CD do backend e do frontend, centralizando a lógica de execução de testes e evitando retrabalho entre repositórios;
- **Configuração de qualidade de código** do próprio repositório de testes (ESLint + Prettier + TypeScript), garantindo que a suíte de automação siga o mesmo rigor do código de produto;
- **Reporte e rastreabilidade de bugs**, vinculando cada teste ao identificador do caso de teste correspondente (padrão `ETHOS-XX` nos títulos dos testes), facilitando a rastreabilidade entre requisito, teste e eventual defeito.

---

## 🔧 Stack e ferramentas

| Categoria                      | Ferramenta                                                          |
| ------------------------------ | ------------------------------------------------------------------- |
| Framework de testes            | [Cypress](https://www.cypress.io/) 15                               |
| Linguagem                      | TypeScript 5                                                        |
| Validação de contrato (schema) | Ajv + ajv-formats                                                   |
| Seleção seletiva de testes     | `@cypress/grep`                                                     |
| Variáveis de ambiente          | `dotenv`                                                            |
| Lint / Formatação              | ESLint 9 + `typescript-eslint` + `eslint-plugin-cypress` + Prettier |
| Execução combinada de scripts  | `npm-run-all`                                                       |
| CI/CD                          | GitHub Actions (actions compostas reutilizáveis)                    |

---

## 📁 Estrutura do repositório

```
ethos-qa/
├── .github/
│   └── actions/
│       ├── run-cypress/        # Action composta: instala deps, roda smoke + regression, sobe artefatos em falha
│       └── wait-for-api/       # Action composta: aguarda o health-check da API antes de iniciar os testes
├── cypress/
│   ├── api/                    # Testes de API
│   │   ├── health/
│   │   ├── sessions/
│   │   └── tracks/
│   ├── e2e/                    # Testes de interface (E2E)
│   │   └── sessions/
│   ├── pages/                  # Page Objects (ex: home.page.ts)
│   ├── components/             # Componentes de página reutilizáveis (questionnaire, result, feedback)
│   ├── support/
│   │   ├── api-clients/        # Clients HTTP por recurso da API (BaseClient, TracksClient, SessionsClient...)
│   │   ├── constants/
│   │   │   ├── selectors/      # data-testid / seletores usados no E2E
│   │   │   └── tags.ts         # Tags para cypress-grep
│   │   ├── schemas/            # JSON Schemas para validação de contrato
│   │   ├── test-data/          # Massa de dados fixa usada nos testes
│   │   ├── types/               # Tipagens dos payloads de API
│   │   └── utils/               # Helpers (validate-schema, get-api-url)
│   └── fixtures/
├── cypress.config.ts           # Config para os testes E2E
├── cypress.config.api.ts       # Config para os testes de API (specPattern isolado)
└── package.json
```

---

## 🔌 Testes de API

Os testes de API validam os endpoints da `ethos-api` de forma isolada da interface, cobrindo:

- **Health** (`/api/v1/health`) — disponibilidade da API e do banco de dados;
- **Tracks** — listagem de trilhas e busca de perguntas por trilha;
- **Sessions** — fluxo completo de uma sessão de dilema ético: início de sessão, envio de respostas, avanço de perguntas, finalização com resultado, consulta de resposta salva e envio de feedback.

Cada suíte segue o padrão:

1. **Client dedicado** (`support/api-clients`) encapsula as chamadas HTTP do recurso;
2. **Teste funcional** valida status code e regras de negócio do payload;
3. **Teste de schema** (tag `@schema`) valida a estrutura do response contra um JSON Schema com Ajv, garantindo que o contrato entre API e frontend não seja quebrado silenciosamente.

Os testes referenciam o identificador do caso de teste de origem no título (ex: `ETHOS-13`, `ETHOS-31`), mantendo rastreabilidade entre requisito e teste automatizado.

Execução:

```bash
npm run cy:api
```

---

## 💻 Testes de interface (E2E)

Os testes E2E validam o fluxo real do usuário na interface da `ethos-frontend`, usando o padrão **Page Object Model**:

- `HomePage` centraliza a navegação inicial e a chamada ao CTA de início da simulação;
- Cada seção relevante da trilha é representada por um **componente de página** próprio: `QuestionnaireSection` (questionário), `ResultSection` (resultado) e `FeedbackDialog` (feedback), evitando duplicação de seletores e tornando os testes mais legíveis;
- Os seletores ficam centralizados em `support/constants/selectors`, isolando a automação de mudanças de estilo/DOM da aplicação.

Fluxos cobertos incluem o início da simulação, o envio de respostas ao longo da trilha, a chegada ao resultado final e o registro de feedback.

Execução:

```bash
npm run cy:e2e
```

---

## 🔖 Tags e estratégia de execução

O projeto usa `@cypress/grep` para permitir execuções seletivas, essencial para manter o pipeline rápido sem abrir mão de cobertura:

| Tag                                                                                  | Uso                                                                         |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| `@smoke`                                                                             | Casos críticos, executados a cada pipeline (rápido feedback)                |
| `@regression`                                                                        | Suíte completa, executada em pontos-chave (ex: antes de deploy em produção) |
| `@schema`                                                                            | Validação de contrato dos responses da API                                  |
| `@critical`                                                                          | Fluxos considerados bloqueadores para release                               |
| `@health`, `@tracks`, `@sessions-answers`, `@sessions-results`, `@sessions-feedback` | Tags por domínio/recurso, para execução direcionada durante desenvolvimento |

Essa separação permite que as esteiras de backend/frontend rodem primeiro a suíte `@smoke` (feedback rápido em todo PR) e reservem a `@regression` completa para momentos estratégicos.

---

## 🧩 GitHub Actions reutilizáveis

Este repositório concentra **actions compostas** que servem de base para os workflows de CI dos repositórios `ethos-api` e `ethos-frontend`, evitando duplicar lógica de pipeline em cada projeto.

### `wait-for-api`

Aguarda a API responder no endpoint de health-check antes de iniciar a execução dos testes, evitando falsos negativos por API ainda subindo (útil em ambientes de deploy/preview do Render).

**Inputs:** `url` (padrão `.../api/v1/health`), `retries` (padrão 30), `interval` em segundos (padrão 3).

### `run-cypress`

Prepara o ambiente, instala as dependências deste repositório de QA, executa a suíte de smoke e, em seguida, a de regression, publicando screenshots/vídeos como artefato em caso de falha.

**Inputs:** `base_url`, `api_url`, `smoke_command`, `regression_command`, `qa_path` (caminho onde este repositório é clonado dentro do workflow consumidor).

Como são **composite actions**, os workflows do backend e do frontend apenas fazem checkout deste repositório (como submódulo ou clone auxiliar) e referenciam essas actions, mantendo a lógica de teste centralizada e versionada em um único lugar.

---

## 🚀 Como rodar localmente

Pré-requisitos: Node.js 24.

```bash
# instalar dependências
npm ci

# copiar variáveis de ambiente
cp .env.example .env   # definir BASE_URL e API_URL conforme o ambiente desejado

# rodar testes de API
npm run cy:api

# rodar testes E2E
npm run cy:e2e

# rodar toda a suíte (E2E + API)
npm run cy:all
```

Variáveis de ambiente utilizadas:

| Variável   | Descrição                                    | Padrão                         |
| ---------- | -------------------------------------------- | ------------------------------ |
| `BASE_URL` | URL da aplicação frontend para os testes E2E | `http://localhost:8080`        |
| `API_URL`  | URL da API para os testes de API/clients     | `http://localhost:3000/api/v1` |

---

## ✅ Padrões de qualidade

- **Lint:** `npm run lint` (projeto completo) ou `npm run lint:cypress` (apenas suíte Cypress);
- **Formatação:** `npm run format` (aplica) / `npm run format:check` (verifica);
- Regras de import ordenado, remoção de imports não utilizados e tipagem estrita via `typescript-eslint`;
- Regras específicas do plugin `eslint-plugin-cypress` para evitar anti-padrões comuns (ex: uso de `cy.wait` com tempo fixo).
