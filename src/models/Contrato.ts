/** Contrato — valor fixo R$ 2.000,00, parcelável em até 5 vezes (RF10). */
import { arredondar } from "../utils/arredondamento.js";
import { MAX_PARCELAS_CONTRATO, VALOR_CONTRATO } from "../utils/constants.js";

export class Contrato {
  static readonly VALOR_CONTRATO = VALOR_CONTRATO;

  private qtdParcelas: number;

  constructor(params: { qtdParcelas: number }) {
    const { qtdParcelas } = params;
    if (qtdParcelas < 1 || qtdParcelas > MAX_PARCELAS_CONTRATO) {
      throw new Error(
        `Quantidade de parcelas deve ser entre 1 e ${MAX_PARCELAS_CONTRATO}.`,
      );
    }
    this.qtdParcelas = qtdParcelas;
  }

  calcularValorParcela(): number {
    return arredondar(Contrato.VALOR_CONTRATO / this.qtdParcelas);
  }

  getQtdParcelas(): number {
    return this.qtdParcelas;
  }
}
