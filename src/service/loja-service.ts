import type { Produto } from "./produto.js";
import { ProdutoRepositoryMemoria, type ProdutoRepository } from "./produto-repository.js";
import { DadosInvalidosError, ProdutoJaExisteError, ProdutoNaoEncontradoError } from "./erros.js";
import { exigirInteiroPositivo, exigirNumeroPositivo } from "./validacao.js";

export interface EstoqueProduto {
  codigo: number;
  estoque: number;
}

export interface ItemVendido {
  codigo: number;
  quantidade: number;
  subtotal: number;
  estoque: number;
}

export interface ResultadoVenda {
  total: number;
  itens: ItemVendido[];
}

/**
 * Camada de serviço: concentra todas as regras de negócio da loja.
 * Não depende da API REST nem do front-end e pode ser usada diretamente (ex.: testes unitários).
 * Os parâmetros são `unknown` porque toda validação de presença e de tipo acontece aqui.
 */
export class LojaService {
  constructor(private readonly repositorio: ProdutoRepository = new ProdutoRepositoryMemoria()) {}

  /** Cria um produto com o código e o preço informados e estoque zero. */
  cadastrarProduto(codigo: unknown, preco: unknown): Produto {
    const cod = exigirInteiroPositivo(codigo, "codigo");
    const valor = exigirNumeroPositivo(preco, "preco");
    if (this.repositorio.buscar(cod)) {
      throw new ProdutoJaExisteError(cod);
    }

    const produto: Produto = { codigo: cod, preco: valor, estoque: 0 };
    this.repositorio.salvar(produto);
    return { ...produto };
  }

  /** Retorna a quantidade em estoque do produto. */
  consultarEstoque(codigo: unknown): EstoqueProduto {
    const cod = exigirInteiroPositivo(codigo, "codigo");
    const produto = this.repositorio.buscar(cod);
    if (!produto) {
      throw new ProdutoNaoEncontradoError(cod);
    }

    return { codigo: produto.codigo, estoque: produto.estoque };
  }

  /** Acrescenta a quantidade informada ao estoque do produto (reposição). */
  entradaEstoque(codigo: unknown, quantidade: unknown): EstoqueProduto {
    const cod = exigirInteiroPositivo(codigo, "codigo");
    const qtd = exigirInteiroPositivo(quantidade, "quantidade");
    const produto = this.repositorio.buscar(cod);
    if (!produto) {
      throw new ProdutoNaoEncontradoError(cod);
    }

    produto.estoque += qtd;
    this.repositorio.salvar(produto);
    return { codigo: produto.codigo, estoque: produto.estoque };
  }

  /**
   * Subtrai a quantidade informada do estoque do produto (perda, avaria ou ajuste).
   * A saída maior que o estoque é permitida e deixa o estoque negativo.
   */
  saidaEstoque(codigo: unknown, quantidade: unknown): EstoqueProduto {
    const cod = exigirInteiroPositivo(codigo, "codigo");
    const qtd = exigirInteiroPositivo(quantidade, "quantidade");
    const produto = this.repositorio.buscar(cod);
    if (!produto) {
      throw new ProdutoNaoEncontradoError(cod);
    }

    produto.estoque -= qtd;
    this.repositorio.salvar(produto);
    return { codigo: produto.codigo, estoque: produto.estoque };
  }

  /**
   * Dá baixa no estoque de cada item e calcula o total. Atômica: se um item for inválido
   * (campo inválido ou produto inexistente), nada muda. Assim como na saída, o estoque pode ficar negativo.
   */
  realizarVenda(itens: unknown): ResultadoVenda {
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new DadosInvalidosError("O campo 'itens' deve ser uma lista não vazia");
    }

    // Toda a validação acontece antes de alterar qualquer estoque, para a venda ser atômica.
    // 1. Formato de cada item (400)
    const pedidos = itens.map((item, i) => {
      if (typeof item !== "object" || item === null) {
        throw new DadosInvalidosError(`O item ${i + 1} da venda é inválido`);
      }
      const { codigo, quantidade } = item as Record<string, unknown>;
      return {
        codigo: exigirInteiroPositivo(codigo, `itens[${i}].codigo`),
        quantidade: exigirInteiroPositivo(quantidade, `itens[${i}].quantidade`),
      };
    });

    // 2. Existência de todos os produtos (404)
    const produtos = pedidos.map(({ codigo }) => {
      const produto = this.repositorio.buscar(codigo);
      if (!produto) {
        throw new ProdutoNaoEncontradoError(codigo);
      }
      return produto;
    });

    // 3. Baixa no estoque e cálculo dos valores (em centavos, para evitar erro de ponto flutuante)
    let totalCentavos = 0;
    const vendidos = pedidos.map(({ codigo, quantidade }, i) => {
      const produto = produtos[i];
      produto.estoque -= quantidade;
      this.repositorio.salvar(produto);

      const subtotalCentavos = emCentavos(produto.preco) * quantidade;
      totalCentavos += subtotalCentavos;
      return { codigo, quantidade, subtotal: subtotalCentavos / 100, estoque: produto.estoque };
    });

    return { total: totalCentavos / 100, itens: vendidos };
  }
}

function emCentavos(valor: number): number {
  return Math.round(valor * 100);
}
