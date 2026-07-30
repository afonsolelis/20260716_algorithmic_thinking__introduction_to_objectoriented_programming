/**
 * Camada de serviço — CalculoService delega às entidades (RF06-RF10).
 *
 * Garante que TODAS as regras de negócio da seção 3 da modelagem estão
 * acessíveis pela camada de serviço usada pela interface (servidor/API).
 */
import { describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";
import { Casa } from "../src/models/Casa.js";
import { Cliente } from "../src/models/Cliente.js";
import { Contrato } from "../src/models/Contrato.js";
import { Estudio } from "../src/models/Estudio.js";
import { CalculoService } from "../src/services/CalculoService.js";

describe("CalculoService.calcularAluguel", () => {
  it("delega para Apartamento", () => {
    const apto = new Apartamento({ qtdQuartos: 2, temGaragem: true, possuiCriancas: false });
    expect(CalculoService.calcularAluguel(apto)).toBe(1140.0);
  });

  it("delega para Casa", () => {
    const casa = new Casa({ qtdQuartos: 2, temGaragem: true });
    expect(CalculoService.calcularAluguel(casa)).toBe(1450.0);
  });

  it("delega para Estúdio", () => {
    const estudio = new Estudio({ qtdVagas: 3 });
    expect(CalculoService.calcularAluguel(estudio)).toBe(1510.0);
  });
});

describe("CalculoService.calcularParcela", () => {
  it("delega para Contrato", () => {
    const contrato = new Contrato({ qtdParcelas: 5 });
    expect(CalculoService.calcularParcela(contrato)).toBe(400.0);
  });
});

describe("CalculoService.aplicarDesconto — Regra 3.3 (só apartamento + sem crianças)", () => {
  it("apartamento + cliente sem crianças tem desconto", () => {
    const cliente = new Cliente({ nome: "Ana", possuiCriancas: false });
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
    expect(CalculoService.aplicarDesconto(700.0, cliente, apto)).toBe(665.0);
  });

  it("apartamento + cliente com crianças não tem desconto", () => {
    const cliente = new Cliente({ nome: "Bia", possuiCriancas: true });
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: true });
    expect(CalculoService.aplicarDesconto(700.0, cliente, apto)).toBe(700.0);
  });

  it("casa nunca tem desconto, mesmo sem crianças", () => {
    const cliente = new Cliente({ nome: "Caio", possuiCriancas: false });
    const casa = new Casa({ qtdQuartos: 1, temGaragem: false });
    expect(CalculoService.aplicarDesconto(900.0, cliente, casa)).toBe(900.0);
  });

  it("estúdio nunca tem desconto, mesmo sem crianças", () => {
    const cliente = new Cliente({ nome: "Duda", possuiCriancas: false });
    const estudio = new Estudio({ qtdVagas: 1 });
    expect(CalculoService.aplicarDesconto(1200.0, cliente, estudio)).toBe(1200.0);
  });
});
