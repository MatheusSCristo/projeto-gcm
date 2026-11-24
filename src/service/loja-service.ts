import type { Produto } from "./produto.js";
import { ProdutoRepositoryMemoria, type ProdutoRepository } from "./produto-repository.js";
import { DadosInvalidosError, ProdutoNaoEncontradoError } from "./erros.js";
import { exigirInteiroPositivo } from "./validacao.js";

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
    throw new Error("Operação não implementada: cadastrarProduto");
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

  /** Subtrai a quantidade informada do estoque do produto (perda, avaria ou ajuste). */
  saidaEstoque(codigo: unknown, quantidade: unknown): EstoqueProduto {
    const cod = exigirInteiroPositivo(codigo, "codigo");
    const qtd = exigirInteiroPositivo(quantidade, "quantidade");
    const produto = this.repositorio.buscar(cod);
    if (!produto) {
      throw new ProdutoNaoEncontradoError(cod);
    }
    if (qtd > produto.estoque) {
      throw new DadosInvalidosError(
        `Estoque insuficiente para o produto ${cod}: disponível ${produto.estoque}, solicitado ${qtd}`,
      );
    }

    produto.estoque -= qtd;
    this.repositorio.salvar(produto);
    return { codigo: produto.codigo, estoque: produto.estoque };
  }

  /** Dá baixa no estoque de cada item e calcula o total. Atômica: se um item falhar, nada muda. */
  realizarVenda(itens: unknown): ResultadoVenda {
    throw new Error("Operação não implementada: realizarVenda");
  }
}
