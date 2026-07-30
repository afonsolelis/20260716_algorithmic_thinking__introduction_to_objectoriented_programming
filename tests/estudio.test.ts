/** RF04, RF06 — Regras de cálculo do Estúdio. */
import { describe, expect, it } from "vitest";
import { Estudio } from "../src/models/Estudio.js";

describe("Estúdio — cálculo", () => {
  it("1 vaga: apenas o valor fixo R$1.200,00", () => {
    const estudio = new Estudio({ qtdVagas: 1 });
    expect(estudio.calcularAluguel()).toBe(1200.0);
  });

  it("2 vagas somam R$250: 1200 + 250 = 1450", () => {
    const estudio = new Estudio({ qtdVagas: 2 });
    expect(estudio.calcularAluguel()).toBe(1450.0);
  });

  it("Cenário 5 — 3 vagas: 1200 + 250 + 60 = 1510", () => {
    const estudio = new Estudio({ qtdVagas: 3 });
    expect(estudio.calcularAluguel()).toBe(1510.0);
  });

  it("4 vagas, duas extras: 1200 + 250 + 60 + 60 = 1570", () => {
    const estudio = new Estudio({ qtdVagas: 4 });
    expect(estudio.calcularAluguel()).toBe(1570.0);
  });

  it("sem vagas: apenas o valor fixo R$1.200,00 (acréscimo só a partir de 2)", () => {
    const estudio = new Estudio({ qtdVagas: 0 });
    expect(estudio.calcularAluguel()).toBe(1200.0);
  });
});
