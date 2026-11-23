import { DadosInvalidosError } from "./erros.js";

/** Garante que o valor é um inteiro maior que zero (ex.: código, quantidade). */
export function exigirInteiroPositivo(valor: unknown, campo: string): number {
  if (typeof valor !== "number" || !Number.isInteger(valor)) {
    throw new DadosInvalidosError(`O campo '${campo}' deve ser um número inteiro`);
  }
  if (valor <= 0) {
    throw new DadosInvalidosError(`O campo '${campo}' deve ser maior que zero`);
  }
  return valor;
}

/** Garante que o valor é um número finito maior que zero (ex.: preço). */
export function exigirNumeroPositivo(valor: unknown, campo: string): number {
  if (typeof valor !== "number" || !Number.isFinite(valor)) {
    throw new DadosInvalidosError(`O campo '${campo}' deve ser um número`);
  }
  if (valor <= 0) {
    throw new DadosInvalidosError(`O campo '${campo}' deve ser maior que zero`);
  }
  return valor;
}
