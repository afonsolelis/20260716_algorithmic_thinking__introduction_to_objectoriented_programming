/** RF02, RF03, RF06-RF09 — Regras de cálculo do Apartamento. */
import { describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";

describe("Apartamento — cálculo", () => {
  it("1 quarto, com crianças, sem garagem: base R$700, sem acréscimos e sem desconto", () => {
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: true });
    expect(apto.calcularAluguel()).toBe(700.0);
  });

  it("2 quartos soma R$200 (RF07): 700 + 200 = 900", () => {
    const apto = new Apartamento({ qtdQuartos: 2, temGaragem: false, possuiCriancas: true });
    expect(apto.calcularAluguel()).toBe(900.0);
  });

  it("garagem soma R$300 (RF08): 700 + 300 = 1000", () => {
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: true, possuiCriancas: true });
    expect(apto.calcularAluguel()).toBe(1000.0);
  });

  it("desconto de 5% sem crianças (RF09 / Cenário 1): 700 * 0,95 = 665", () => {
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
    expect(apto.calcularAluguel()).toBe(665.0);
  });

  it("Cenário 2 completo: (700 + 200 + 300) * 0,95 = 1140", () => {
    const apto = new Apartamento({ qtdQuartos: 2, temGaragem: true, possuiCriancas: false });
    expect(apto.calcularAluguel()).toBe(1140.0);
  });

  it("desconto incide sobre acréscimos: (700 + 200) * 0,95 = 855", () => {
    const apto = new Apartamento({ qtdQuartos: 2, temGaragem: false, possuiCriancas: false });
    expect(apto.calcularAluguel()).toBe(855.0);
  });

  it("com crianças não tem desconto: 700 + 300 = 1000", () => {
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: true, possuiCriancas: true });
    expect(apto.calcularAluguel()).toBe(1000.0);
  });
});
