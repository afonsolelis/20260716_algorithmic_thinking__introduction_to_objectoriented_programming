/** RF02, RF03, RF06-RF08 — Regras de cálculo da Casa. */
import { describe, expect, it } from "vitest";
import { Casa } from "../src/models/Casa.js";

describe("Casa — cálculo", () => {
  it("1 quarto sem garagem: base R$900, sem acréscimos", () => {
    const casa = new Casa({ qtdQuartos: 1, temGaragem: false });
    expect(casa.calcularAluguel()).toBe(900.0);
  });

  it("2 quartos soma R$250 (RF07 / Cenário 4): 900 + 250 = 1150", () => {
    const casa = new Casa({ qtdQuartos: 2, temGaragem: false });
    expect(casa.calcularAluguel()).toBe(1150.0);
  });

  it("garagem soma R$300 (RF08 / Cenário 3): 900 + 300 = 1200", () => {
    const casa = new Casa({ qtdQuartos: 1, temGaragem: true });
    expect(casa.calcularAluguel()).toBe(1200.0);
  });

  it("2 quartos com garagem: 900 + 250 + 300 = 1450", () => {
    const casa = new Casa({ qtdQuartos: 2, temGaragem: true });
    expect(casa.calcularAluguel()).toBe(1450.0);
  });
});
