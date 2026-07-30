/** Camada de serviço — ExportService gera o CSV anual (RF12). */
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Apartamento } from "../src/models/Apartamento.js";
import { Cliente } from "../src/models/Cliente.js";
import { Contrato } from "../src/models/Contrato.js";
import { Orcamento } from "../src/models/Orcamento.js";
import { ExportService } from "../src/services/ExportService.js";

function orcamentoCalculado(): Orcamento {
  const cliente = new Cliente({ nome: "Ana", possuiCriancas: false });
  const imovel = new Apartamento({ qtdQuartos: 1, temGaragem: false, possuiCriancas: false });
  const contrato = new Contrato({ qtdParcelas: 5 });
  const orcamento = new Orcamento(cliente, imovel, contrato);
  orcamento.calcularOrcamento();
  return orcamento;
}

function parseCsv(conteudo: string): string[][] {
  return conteudo
    .split("\r\n")
    .filter((linha) => linha.length > 0)
    .map((linha) => linha.split(","));
}

describe("ExportService", () => {
  let dir: string;
  let arquivo: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "orcamento-"));
    arquivo = join(dir, "orcamento.csv");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("gerarCsv cria o arquivo", () => {
    ExportService.gerarCsv(orcamentoCalculado(), arquivo);
    expect(existsSync(arquivo)).toBe(true);
  });

  it("cabeçalho + 12 parcelas, todas com o valor final mensal (1065.00)", () => {
    ExportService.gerarCsv(orcamentoCalculado(), arquivo);

    const linhas = parseCsv(readFileSync(arquivo, "utf-8"));
    expect(linhas).toHaveLength(13);
    expect(linhas[0]?.[0]).toBe("mes");
    const valores = linhas.slice(1).map((linha) => Number(linha.at(-1)));
    expect(valores).toEqual(Array(12).fill(1065.0));
  });
});
