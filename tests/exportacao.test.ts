/** RF12 — Exportação do orçamento anual em CSV com 12 parcelas. */
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";
import { Cliente } from "../src/models/Cliente.js";
import { Contrato } from "../src/models/Contrato.js";
import { Orcamento } from "../src/models/Orcamento.js";

function criarOrcamento(): Orcamento {
  const cliente = new Cliente({ nome: "Ana", possuiCriancas: false });
  const imovel = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
  const contrato = new Contrato({ qtdParcelas: 5 });
  return new Orcamento(cliente, imovel, contrato);
}

function parseCsv(conteudo: string): string[][] {
  return conteudo
    .split("\r\n")
    .filter((linha) => linha.length > 0)
    .map((linha) => linha.split(","));
}

describe("Exportação CSV", () => {
  let dir: string;
  let arquivo: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "orcamento-"));
    arquivo = join(dir, "orcamento.csv");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("exportarCsv cria o arquivo", () => {
    const orcamento = criarOrcamento();
    orcamento.calcularOrcamento();
    orcamento.exportarCsv(arquivo);
    expect(existsSync(arquivo)).toBe(true);
  });

  it("o arquivo deve ter cabeçalho + 12 linhas (uma por mês)", () => {
    const orcamento = criarOrcamento();
    orcamento.calcularOrcamento();
    orcamento.exportarCsv(arquivo);

    const linhas = parseCsv(readFileSync(arquivo, "utf-8"));
    expect(linhas).toHaveLength(13); // 1 cabeçalho + 12 parcelas
  });

  it("cada parcela anual traz o valor final mensal (cenário 1: 1065.00)", () => {
    const orcamento = criarOrcamento();
    orcamento.calcularOrcamento();
    orcamento.exportarCsv(arquivo);

    const linhas = parseCsv(readFileSync(arquivo, "utf-8"));
    const [, ...dados] = linhas;
    const valores = dados.map((linha) => Number(linha.at(-1)));
    expect(valores).toEqual(Array(12).fill(1065.0));
  });
});
