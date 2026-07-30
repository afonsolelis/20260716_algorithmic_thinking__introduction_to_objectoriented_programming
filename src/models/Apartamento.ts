/**
 * Apartamento — valor base R$ 700, +R$ 200 (2º quarto), +R$ 300 (garagem),
 * desconto de 5% quando o cliente não possui crianças (RF06-RF09).
 */
import { Imovel } from "./Imovel.js";
import { arredondar } from "../utils/arredondamento.js";
import {
  ACRESCIMO_GARAGEM,
  ACRESCIMO_QUARTO_APARTAMENTO,
  DESCONTO_APARTAMENTO_SEM_CRIANCAS,
  VALOR_BASE_APARTAMENTO,
} from "../utils/constants.js";

export class Apartamento extends Imovel {
  private descontoAplicavel: boolean;

  constructor(params: {
    qtdQuartos: number;
    temGaragem: boolean;
    possuiCriancas: boolean;
  }) {
    super(params.qtdQuartos, params.temGaragem);
    this.valorBase = VALOR_BASE_APARTAMENTO;
    this.descontoAplicavel = !params.possuiCriancas;
  }

  calcularAluguel(): number {
    let valor = this.valorBase;
    valor += (this.qtdQuartos - 1) * ACRESCIMO_QUARTO_APARTAMENTO;
    if (this.temGaragem) {
      valor += ACRESCIMO_GARAGEM;
    }
    if (this.descontoAplicavel) {
      valor = this.aplicarDesconto(valor);
    }
    return arredondar(valor);
  }

  private aplicarDesconto(valor: number): number {
    return valor * (1 - DESCONTO_APARTAMENTO_SEM_CRIANCAS);
  }
}
