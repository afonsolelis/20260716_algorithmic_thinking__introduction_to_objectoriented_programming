/** RF10 — Contrato de R$ 2.000,00 parcelado em até 5 vezes. */
import { describe, expect, it } from "vitest";
import { Contrato } from "../src/models/Contrato.js";

describe("Contrato", () => {
  it("valor fixo do contrato é R$2.000,00", () => {
    expect(Contrato.VALOR_CONTRATO).toBe(2000.0);
  });

  it("parcela única: 2000 / 1 = 2000", () => {
    const contrato = new Contrato({ qtdParcelas: 1 });
    expect(contrato.calcularValorParcela()).toBe(2000.0);
  });

  it("5 parcelas: 2000 / 5 = 400", () => {
    const contrato = new Contrato({ qtdParcelas: 5 });
    expect(contrato.calcularValorParcela()).toBe(400.0);
  });

  it("4 parcelas: 2000 / 4 = 500", () => {
    const contrato = new Contrato({ qtdParcelas: 4 });
    expect(contrato.calcularValorParcela()).toBe(500.0);
  });

  it("getQtdParcelas retorna a quantidade informada", () => {
    const contrato = new Contrato({ qtdParcelas: 3 });
    expect(contrato.getQtdParcelas()).toBe(3);
  });

  it("2 parcelas: 2000 / 2 = 1000", () => {
    const contrato = new Contrato({ qtdParcelas: 2 });
    expect(contrato.calcularValorParcela()).toBe(1000.0);
  });

  it("3 parcelas arredonda para 2 casas: 2000/3 = 666,666... → 666.67", () => {
    const contrato = new Contrato({ qtdParcelas: 3 });
    expect(contrato.calcularValorParcela()).toBe(666.67);
  });

  it("mais de 5 parcelas é inválido: deve lançar erro", () => {
    expect(() => new Contrato({ qtdParcelas: 6 })).toThrow();
  });

  it("zero parcelas é inválido: deve lançar erro", () => {
    expect(() => new Contrato({ qtdParcelas: 0 })).toThrow();
  });

  it("parcelas negativas é inválido: deve lançar erro", () => {
    expect(() => new Contrato({ qtdParcelas: -1 })).toThrow();
  });
});
