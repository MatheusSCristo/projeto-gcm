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

## Equipe

- Matheus Cristo
- Humberto
