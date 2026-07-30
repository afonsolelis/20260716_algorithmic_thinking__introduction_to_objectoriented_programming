/** Serviço de exportação — gera o CSV com as 12 parcelas anuais (RF12). */
import type { Orcamento } from "../models/Orcamento.js";

export class ExportService {
  static gerarCsv(orcamento: Orcamento, arquivo: string): void {
    orcamento.exportarCsv(arquivo);
  }
}
