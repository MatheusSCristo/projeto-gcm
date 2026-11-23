import { Router } from "express";
import type { LojaService } from "../service/loja-service.js";

/**
 * Converte o {codigo} da URL em número. Texto que não representa um inteiro vira NaN,
 * e a camada de serviço é quem o rejeita.
 */
function codigoDaUrl(texto: string): number {
  return /^-?\d+$/.test(texto) ? Number(texto) : Number.NaN;
}

/**
 * Rotas da API REST. Cada rota apenas extrai os dados da requisição, repassa para a
 * camada de serviço e devolve o resultado; nenhuma regra de negócio fica aqui.
 */
export function criarRotas(service: LojaService): Router {
  const rotas = Router();

  rotas.post("/produto", (req, res) => {
    const produto = service.cadastrarProduto(req.body?.codigo, req.body?.preco);
    res.status(201).json(produto);
  });

  rotas.get("/produto/:codigo/estoque", (req, res) => {
    const estoque = service.consultarEstoque(codigoDaUrl(req.params.codigo));
    res.status(200).json(estoque);
  });

  rotas.put("/produto/:codigo/entrada", (req, res) => {
    const estoque = service.entradaEstoque(codigoDaUrl(req.params.codigo), req.body?.quantidade);
    res.status(200).json(estoque);
  });

  rotas.put("/produto/:codigo/saida", (req, res) => {
    const estoque = service.saidaEstoque(codigoDaUrl(req.params.codigo), req.body?.quantidade);
    res.status(200).json(estoque);
  });

  rotas.post("/venda", (req, res) => {
    const venda = service.realizarVenda(req.body?.itens);
    res.status(201).json(venda);
  });

  return rotas;
}
