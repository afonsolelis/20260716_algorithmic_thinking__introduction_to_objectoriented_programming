/**
 * Orçamento — composição de Cliente, Imovel e Contrato; orquestra o
 * cálculo do valor mensal total (RF11) e a exportação em CSV (RF12).
 */
import { writeFileSync } from "node:fs";
import type { Cliente } from "./Cliente.js";
import type { Contrato } from "./Contrato.js";
import type { Imovel } from "./Imovel.js";
import { arredondar } from "../utils/arredondamento.js";
import { linhaCsv } from "../utils/csv.js";
import { QTD_PARCELAS_ANUAIS } from "../utils/constants.js";

export class Orcamento {
  private cliente: Cliente;
  private imovel: Imovel;
  private contrato: Contrato;
  private valorAluguel = 0.0;
  private valorMensalTotal = 0.0;

  constructor(cliente: Cliente, imovel: Imovel, contrato: Contrato) {
    this.cliente = cliente;
    this.imovel = imovel;
    this.contrato = contrato;
  }

  calcularOrcamento(): number {
    this.valorAluguel = this.imovel.calcularAluguel();
    const parcela = this.contrato.calcularValorParcela();
    this.valorMensalTotal = arredondar(this.valorAluguel + parcela);
    return this.valorMensalTotal;
  }

  getValorMensal(): number {
    return this.valorMensalTotal;
  }

  exibirResumo(): string {
    const parcela = this.contrato.calcularValorParcela();
    return (
      `Orçamento - Cliente: ${this.cliente.getNome()}\n` +
      `Aluguel mensal: R$ ${this.valorAluguel.toFixed(2)}\n` +
      `Parcela do contrato (${this.contrato.getQtdParcelas()}x): ` +
      `R$ ${parcela.toFixed(2)}\n` +
      `Valor final mensal: R$ ${this.valorMensalTotal.toFixed(2)}`
    );
  }

  exportarCsv(arquivo: string): void {
    const parcela = this.contrato.calcularValorParcela();
    let conteudo = linhaCsv([
      "mes",
      "cliente",
      "valor_aluguel",
      "valor_parcela_contrato",
      "valor_final_mensal",
    ]);
    for (let mes = 1; mes <= QTD_PARCELAS_ANUAIS; mes++) {
      conteudo += linhaCsv([
        mes,
        this.cliente.getNome(),
        this.valorAluguel.toFixed(2),
        parcela.toFixed(2),
        this.valorMensalTotal.toFixed(2),
      ]);
    }
    writeFileSync(arquivo, conteudo, "utf-8");
  }
}
