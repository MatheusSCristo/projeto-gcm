import type { ErrorRequestHandler } from "express";
import {
  DadosInvalidosError,
  ProdutoJaExisteError,
  ProdutoNaoEncontradoError,
} from "../service/erros.js";

/** Converte as exceções da camada de serviço nos códigos de status da API. */
export const tratadorErros: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof DadosInvalidosError) {
    res.status(400).json({ erro: erro.message });
    return;
  }
  if (erro instanceof ProdutoNaoEncontradoError) {
    res.status(404).json({ erro: erro.message });
    return;
  }
  if (erro instanceof ProdutoJaExisteError) {
    res.status(409).json({ erro: erro.message });
    return;
  }
  // Corpo que não é um JSON válido (erro gerado pelo express.json()).
  if (erro?.type === "entity.parse.failed") {
    res.status(400).json({ erro: "Corpo da requisição não é um JSON válido" });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
};
