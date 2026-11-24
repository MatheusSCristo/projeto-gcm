import { createInterface } from "node:readline";
import { stdin as input, stdout as output } from "node:process";

const API_URL = process.env.API_URL ?? "http://localhost:3000";

const rl = createInterface({ input, output });
rl.on("SIGINT", () => rl.close());
const linhas = rl[Symbol.asyncIterator]();

async function perguntar(texto: string): Promise<string> {
  output.write(texto);
  const { value, done } = await linhas.next();
  if (done) {
    console.log();
    process.exit(0);
  }
  return value.trim();
}

function converter(texto: string): unknown {
  if (texto === "") {
    return undefined;
  }
  const numero = Number(texto.replace(",", "."));
  return Number.isNaN(numero) ? texto : numero;
}

async function requisitar(metodo: string, caminho: string, corpo?: unknown): Promise<void> {
  try {
    const resposta = await fetch(API_URL + caminho, {
      method: metodo,
      headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    });
    const texto = await resposta.text();

    console.log(`\nHTTP ${resposta.status} ${resposta.statusText}`);
    try {
      console.log(JSON.stringify(JSON.parse(texto), null, 2));
    } catch {
      console.log(texto);
    }
  } catch (erro) {
    console.log(`\nNão foi possível acessar a API em ${API_URL}: ${(erro as Error).message}`);
  }
}

function caminhoProduto(codigo: string): string {
  return `/loja/produto/${encodeURIComponent(codigo)}`;
}

async function cadastrarProduto(): Promise<void> {
  const codigo = await perguntar("Código: ");
  const preco = await perguntar("Preço: ");
  await requisitar("POST", "/loja/produto", { codigo: converter(codigo), preco: converter(preco) });
}

async function consultarEstoque(): Promise<void> {
  const codigo = await perguntar("Código: ");
  await requisitar("GET", `${caminhoProduto(codigo)}/estoque`);
}

async function entradaEstoque(): Promise<void> {
  const codigo = await perguntar("Código: ");
  const quantidade = await perguntar("Quantidade: ");
  await requisitar("PUT", `${caminhoProduto(codigo)}/entrada`, { quantidade: converter(quantidade) });
}

async function saidaEstoque(): Promise<void> {
  const codigo = await perguntar("Código: ");
  const quantidade = await perguntar("Quantidade: ");
  await requisitar("PUT", `${caminhoProduto(codigo)}/saida`, { quantidade: converter(quantidade) });
}

async function realizarVenda(): Promise<void> {
  const itens: { codigo: unknown; quantidade: unknown }[] = [];
  console.log("Informe os itens da venda (deixe o código vazio para finalizar).");

  while (true) {
    const codigo = await perguntar("Código: ");
    if (codigo === "") {
      break;
    }
    const quantidade = await perguntar("Quantidade: ");
    itens.push({ codigo: converter(codigo), quantidade: converter(quantidade) });
  }

  await requisitar("POST", "/loja/venda", { itens });
}

const operacoes: Record<string, () => Promise<void>> = {
  "1": cadastrarProduto,
  "2": consultarEstoque,
  "3": entradaEstoque,
  "4": saidaEstoque,
  "5": realizarVenda,
};

async function main(): Promise<void> {
  console.log("=== Loja Virtual ===");
  console.log(`API: ${API_URL}`);

  while (true) {
    console.log();
    console.log("1 - Cadastrar Produto");
    console.log("2 - Consultar Estoque");
    console.log("3 - Entrada de Estoque");
    console.log("4 - Saída de Estoque");
    console.log("5 - Venda");
    console.log("0 - Sair");

    const opcao = await perguntar("Opção: ");
    if (opcao === "0") {
      break;
    }

    const operacao = operacoes[opcao];
    if (operacao) {
      await operacao();
    } else {
      console.log("Opção inválida.");
    }
  }

  rl.close();
}

main();
