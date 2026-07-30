/** RF01 — Tipos de imóvel e contrato da classe abstrata Imovel. */
import { describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";
import { Casa } from "../src/models/Casa.js";
import { Estudio } from "../src/models/Estudio.js";
import { Imovel } from "../src/models/Imovel.js";

describe("Imovel — classe abstrata", () => {
  it("não pode ser instanciada diretamente", () => {
    expect(() => {
      // @ts-expect-error — Imovel é abstrata; a validação também ocorre em runtime (new.target)
      new Imovel(1, false);
    }).toThrow(TypeError);
  });
});

describe("Imovel — valor base", () => {
  it("Apartamento tem valor base R$700,00 (RF06)", () => {
    const apto = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: true });
    expect(apto.getValorBase()).toBe(700.0);
  });

  it("Casa tem valor base R$900,00 (RF06)", () => {
    const casa = new Casa({ qtdQuartos: 1, temGaragem: false });
    expect(casa.getValorBase()).toBe(900.0);
  });

  it("Estúdio tem valor base fixo R$1.200,00 (RF06)", () => {
    const estudio = new Estudio({ qtdVagas: 1 });
    expect(estudio.getValorBase()).toBe(1200.0);
  });
});

describe("Imovel — polimorfismo", () => {
  it("todo Imovel responde a calcularAluguel() com número > 0 (RF01/RF06)", () => {
    const imoveis: Imovel[] = [
      new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: true }),
      new Casa({ qtdQuartos: 1, temGaragem: false }),
      new Estudio({ qtdVagas: 1 }),
    ];
    for (const imovel of imoveis) {
      const valor = imovel.calcularAluguel();
      expect(typeof valor).toBe("number");
      expect(valor).toBeGreaterThan(0);
    }
  });
});
