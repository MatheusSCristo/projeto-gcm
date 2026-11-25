# Projeto GCM — Loja Virtual

Sistema de controle de produtos e estoque de uma loja virtual, desenvolvido para a disciplina
DIM0517 — Gerência de Configuração e Mudanças (UFRN).

## Operações

- Cadastrar Produto
- Consultar Estoque
- Entrada de Estoque
- Saída de Estoque
- Venda

## Como executar

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev   # sobe a API em http://localhost:3000 (porta configurável por PORT)
npm run cli   # em outro terminal: front-end console (URL da API configurável por API_URL)
```

## Estrutura

```
src/
  service/   camada de serviço: regras de negócio, independente da API e do front-end
  api/       API REST: repassa as requisições para a camada de serviço
  cli/       front-end console: consome a API REST
```

## Fluxo de branches (GitFlow)

| Branch | Papel |
|---|---|
| `main` | Versões em produção |
| `develop` | Integração das funcionalidades da próxima versão |
| `feature/<issue>-<descricao>` | Uma funcionalidade ou mudança; sai de `develop` e volta para `develop` |
| `release/v1` | Estabilização da versão 1; sai de `develop`, recebe apenas correções, número de versão e notas, e volta para `main` e `develop` |
| `hotfix/<issue>-<descricao>` | Correção urgente em produção; sai de `main` e volta para `main` e `develop` |

Toda branch auxiliar está associada a uma issue, cujo número aparece no nome da branch, nos commits e
no pull request. Nenhuma branch é removida.

## Versões e baselines

| Tag | Branch | Descrição |
|---|---|---|
| `rc-1.2` | `release/v1` | Saída e venda permitem estoque negativo (#19) |
| `rc-1.1` | `release/v1` | Versão 1 com as 5 operações, pronta para testes (não para produção) |

### Estabilização da versão 1

1. Cada defeito encontrado nos testes é registrado como issue com a label `bug`.
2. A correção é feita diretamente na `release/v1`, em commits que citam o número da issue.
3. Ao fim de cada rodada de correções, uma nova baseline é criada em `release/v1`: `rc-1.2`, `rc-1.3`, …
4. As correções da `release/v1` são integradas de volta em `develop`.
5. Quando a versão estiver estável, `release/v1` é integrada em `main` com a tag `v1.0` e de volta em `develop`.

## Equipe

- Matheus Cristo
- Humberto
