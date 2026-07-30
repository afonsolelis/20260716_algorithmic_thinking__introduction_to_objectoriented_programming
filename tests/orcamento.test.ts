/**
 * RF11 — Valor final mensal (aluguel + parcela do contrato).
 *
 * Cobre os 5 cenários de teste da seção 6 de documents/modelagem_problema.md.
 */
import { describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";
import { Casa } from "../src/models/Casa.js";
import { Cliente } from "../src/models/Cliente.js";
import { Contrato } from "../src/models/Contrato.js";
import { Estudio } from "../src/models/Estudio.js";
import { Orcamento } from "../src/models/Orcamento.js";

describe("Orcamento — cenários da modelagem", () => {
  it("Cenário 1 — Apto 1q sem garagem sem crianças, contrato 5x: 665 + 400 = 1065", () => {
    const cliente = new Cliente({ nome: "Ana", possuiCriancas: false });
    const imovel = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
    const contrato = new Contrato({ qtdParcelas: 5 });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    expect(orcamento.calcularOrcamento()).toBe(1065.0);
  });

  it("Cenário 2 — Apto 2q com garagem sem crianças, contrato 4x: 1140 + 500 = 1640", () => {
    const cliente = new Cliente({ nome: "Bruno", possuiCriancas: false });
    const imovel = new Apartamento({ qtdQuartos: 2, temGaragem: true, possuiCriancas: false });
    const contrato = new Contrato({ qtdParcelas: 4 });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    expect(orcamento.calcularOrcamento()).toBe(1640.0);
  });

  it("Cenário 3 — Casa 1q com garagem, contrato 2x: 1200 + 1000 = 2200", () => {
    const cliente = new Cliente({ nome: "Carla", possuiCriancas: true });
    const imovel = new Casa({ qtdQuartos: 1, temGaragem: true });
    const contrato = new Contrato({ qtdParcelas: 2 });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    expect(orcamento.calcularOrcamento()).toBe(2200.0);
  });

  it("Cenário 4 — Casa 2q sem garagem, contrato 1x: 1150 + 2000 = 3150", () => {
    const cliente = new Cliente({ nome: "Diego", possuiCriancas: true });
    const imovel = new Casa({ qtdQuartos: 2, temGaragem: false });
    const contrato = new Contrato({ qtdParcelas: 1 });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    expect(orcamento.calcularOrcamento()).toBe(3150.0);
  });

  it("Cenário 5 — Estúdio 3 vagas, contrato 5x: 1510 + 400 = 1910", () => {
    const cliente = new Cliente({ nome: "Elisa", possuiCriancas: false });
    const imovel = new Estudio({ qtdVagas: 3 });
    const contrato = new Contrato({ qtdParcelas: 5 });
    const orcamento = new Orcamento(cliente, imovel, contrato);
    expect(orcamento.calcularOrcamento()).toBe(1910.0);
  });
});

describe("Orcamento — valor mensal e resumo", () => {
  function orcamentoPadrao(): Orcamento {
    const cliente = new Cliente({ nome: "Ana", possuiCriancas: false });
    const imovel = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
    const contrato = new Contrato({ qtdParcelas: 5 });
    return new Orcamento(cliente, imovel, contrato);
  }

  it("getValorMensal retorna o valor calculado (RF11)", () => {
    const orcamento = orcamentoPadrao();
    orcamento.calcularOrcamento();
    expect(orcamento.getValorMensal()).toBe(1065.0);
  });

  it("exibirResumo contém o valor final mensal (RF11)", () => {
    const orcamento = orcamentoPadrao();
    orcamento.calcularOrcamento();
    const resumo = orcamento.exibirResumo();
    expect(typeof resumo).toBe("string");
    expect(resumo.replaceAll(".", "").replaceAll(",", "")).toContain("1065");
  });
});
