/** Campo obrigatório ausente, com tipo inválido ou que viola uma regra de negócio. */
export class DadosInvalidosError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "DadosInvalidosError";
  }
}

/** O produto informado não está cadastrado. */
export class ProdutoNaoEncontradoError extends Error {
  constructor(codigo: number) {
    super(`Produto ${codigo} não encontrado`);
    this.name = "ProdutoNaoEncontradoError";
  }
}

/** Já existe um produto cadastrado com o código informado. */
export class ProdutoJaExisteError extends Error {
  constructor(codigo: number) {
    super(`Já existe produto com o código ${codigo}`);
    this.name = "ProdutoJaExisteError";
  }
}
