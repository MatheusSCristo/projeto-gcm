import type { Produto } from "./produto.js";

export interface ProdutoRepository {
  buscar(codigo: number): Produto | undefined;
  salvar(produto: Produto): void;
}

/** Armazena os produtos em memória; os dados se perdem quando a aplicação para. */
export class ProdutoRepositoryMemoria implements ProdutoRepository {
  private readonly produtos = new Map<number, Produto>();

  buscar(codigo: number): Produto | undefined {
    return this.produtos.get(codigo);
  }

  salvar(produto: Produto): void {
    this.produtos.set(produto.codigo, produto);
  }
}
