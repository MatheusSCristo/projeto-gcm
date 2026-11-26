import { describe, expect, it } from "vitest";
import { LojaService } from "../src/service/loja-service.js";
import { ProdutoJaExisteError, ProdutoNaoEncontradoError } from "../src/service/erros.js";

function lojaComProduto(codigo: number, preco: number, estoque: number): LojaService {
  const loja = new LojaService();
  loja.cadastrarProduto(codigo, preco);
  if (estoque > 0) {
    loja.entradaEstoque(codigo, estoque);
  }
  return loja;
}

describe("Cadastrar Produto", () => {
  it("cria o produto com o código e o preço informados e estoque zero", () => {
    const loja = new LojaService();

    expect(loja.cadastrarProduto(123, 59.9)).toEqual({ codigo: 123, preco: 59.9, estoque: 0 });
    expect(loja.consultarEstoque(123)).toEqual({ codigo: 123, estoque: 0 });
  });

  it("rejeita código já cadastrado", () => {
    const loja = lojaComProduto(123, 59.9, 0);

    expect(() => loja.cadastrarProduto(123, 10)).toThrow(ProdutoJaExisteError);
  });
});

describe("Consultar Estoque", () => {
  it("retorna o estoque do produto", () => {
    const loja = lojaComProduto(123, 59.9, 15);

    expect(loja.consultarEstoque(123)).toEqual({ codigo: 123, estoque: 15 });
  });

  it("lança erro para produto inexistente", () => {
    const loja = new LojaService();

    expect(() => loja.consultarEstoque(999)).toThrow(ProdutoNaoEncontradoError);
  });
});

describe("Entrada de Estoque", () => {
  it("acrescenta a quantidade ao estoque", () => {
    const loja = lojaComProduto(123, 59.9, 15);

    expect(loja.entradaEstoque(123, 10)).toEqual({ codigo: 123, estoque: 25 });
    expect(loja.consultarEstoque(123).estoque).toBe(25);
  });

  it("lança erro para produto inexistente", () => {
    const loja = new LojaService();

    expect(() => loja.entradaEstoque(999, 10)).toThrow(ProdutoNaoEncontradoError);
  });
});

describe("Saída de Estoque", () => {
  it("subtrai a quantidade do estoque", () => {
    const loja = lojaComProduto(123, 59.9, 15);

    expect(loja.saidaEstoque(123, 10)).toEqual({ codigo: 123, estoque: 5 });
    expect(loja.consultarEstoque(123).estoque).toBe(5);
  });

  it("lança erro para produto inexistente", () => {
    const loja = new LojaService();

    expect(() => loja.saidaEstoque(999, 10)).toThrow(ProdutoNaoEncontradoError);
  });

  it("permite saída maior que o estoque, deixando o estoque negativo", () => {
    const loja = lojaComProduto(123, 59.9, 3);

    expect(loja.saidaEstoque(123, 10)).toEqual({ codigo: 123, estoque: -7 });
    expect(loja.consultarEstoque(123).estoque).toBe(-7);
  });
});

describe("Venda", () => {
  it("dá baixa no estoque de todos os itens e calcula o total", () => {
    const loja = lojaComProduto(123, 59.9, 15);
    loja.cadastrarProduto(456, 69.9);
    loja.entradaEstoque(456, 8);

    const venda = loja.realizarVenda([
      { codigo: 123, quantidade: 2 },
      { codigo: 456, quantidade: 1 },
    ]);

    expect(venda).toEqual({
      total: 189.7,
      itens: [
        { codigo: 123, quantidade: 2, subtotal: 119.8, estoque: 13 },
        { codigo: 456, quantidade: 1, subtotal: 69.9, estoque: 7 },
      ],
    });
    expect(loja.consultarEstoque(123).estoque).toBe(13);
    expect(loja.consultarEstoque(456).estoque).toBe(7);
  });

  it("não altera nenhum estoque quando um produto da venda não existe", () => {
    const loja = lojaComProduto(123, 59.9, 15);
    loja.cadastrarProduto(456, 69.9);
    loja.entradaEstoque(456, 8);

    expect(() =>
      loja.realizarVenda([
        { codigo: 123, quantidade: 2 },
        { codigo: 456, quantidade: 1 },
        { codigo: 999, quantidade: 1 },
      ]),
    ).toThrow(ProdutoNaoEncontradoError);
    expect(loja.consultarEstoque(123).estoque).toBe(15);
    expect(loja.consultarEstoque(456).estoque).toBe(8);
  });
});
